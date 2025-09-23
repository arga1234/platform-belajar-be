import { pool, query } from '../db';
import { LoginDto, RegisterDto } from '../types/auth';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const JWT_SECRET = 'supersecretkey123'; // di production simpan di env

export const registerUser = async (data: RegisterDto) => {
  const { role, no_identitas, sekolah, kelas, nama_lengkap, password } = data;

  const existing = await query('SELECT * FROM users WHERE no_identitas = $1', [no_identitas]);
  if (existing.rows.length > 0) {
    throw new Error('User sudah terdaftar');
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const result = await query(
    `INSERT INTO users (role, no_identitas, sekolah, kelas, nama_lengkap, password_hash)
     VALUES ($1,$2,$3,$4,$5,$6)
     RETURNING id, role, no_identitas, sekolah, kelas, nama_lengkap`,
    [role, no_identitas, sekolah, kelas, nama_lengkap, hashedPassword]
  );

  return result.rows[0];
};

export const loginUser = async (data: LoginDto) => {
  const { role, no_identitas, password } = data;

  const userResult = await query('SELECT * FROM users WHERE no_identitas = $1 AND role = $2', [
    no_identitas,
    role,
  ]);

  if (userResult.rows.length === 0) {
    throw new Error('User tidak ditemukan');
  }

  const user = userResult.rows[0];
  const match = await bcrypt.compare(password, user.password_hash);
  if (!match) {
    throw new Error('Password salah');
  }

  // generate JWT
  const token = jwt.sign(
    {
      id: user.id,
      role: user.role,
      no_identitas: user.no_identitas,
    },
    JWT_SECRET,
    { expiresIn: '5d' }
  );

  return {
    token,
    user: {
      id: user.id,
      role: user.role,
      no_identitas: user.no_identitas,
      sekolah: user.sekolah,
      kelas: user.kelas,
      nama_lengkap: user.nama_lengkap,
    },
  };
};

export const getProfile = async (userId: string) => {
  const queryString = `
    select u.nama_lengkap, u.no_identitas, s."name" as nama_sekolah, k.tingkat as tingkat, r."name" as nama_role
    from users u
    left join sekolah s on u.sekolah = s.id
    left join kelas k on u.kelas = k.id
    left join "role" r  on u."role" = r.id
    where u.id = $1`;
  const result = await pool.query(queryString, [userId]);
  return result.rows[0];
};

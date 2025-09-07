export interface LoginDto {
  role: 'administrator' | 'pendidik' | 'peserta_didik';
  no_identitas: string;
  password: string;
}

export interface RegisterDto {
  role: 'administrator' | 'pendidik' | 'peserta_didik';
  no_identitas: string;
  sekolah?: string;
  kelas?: number;
  nama_lengkap: string;
  password: string;
}

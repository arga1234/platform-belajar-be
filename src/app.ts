import express from 'express';
import path from 'path';
import authRoutes from './routes/auth';
import learningRoutes from './routes/learning';
import referenceRoute from './routes/reference';
import materiRoutes from './routes/materi';
import testRoutes from './routes/test';
import questionRoutes from './routes/question';
import contentRoutes from './routes/content';
import storageRouter from './routes/storageRouter';
import imagesRouter from './routes/imagesRouter';
import pointRouter from './routes/point';
import rewardRoute from './routes/reward';

const app = express();
const baseApi = '/api';
app.use(express.json());

// serve uploaded files as static assets
// maps GET /api/storage/testImages/<filename> -> ./testImages/<filename>
const staticPath = path.join(process.cwd(), 'testImages');
app.use(`${baseApi}/storage/testImages`, express.static(staticPath));

// routes (pakai baseApi untuk konsistensi)
app.use(`${baseApi}/auth`, authRoutes);
app.use(`${baseApi}/learning`, learningRoutes);
app.use(`${baseApi}/learning`, materiRoutes); // tetap seperti konfigurasi Anda
app.use(`${baseApi}/reference`, referenceRoute);
app.use(`${baseApi}/test`, testRoutes);
app.use(`${baseApi}/question`, questionRoutes);
app.use(`${baseApi}/content`, contentRoutes);
app.use(`${baseApi}/point`, pointRouter);
app.use(`${baseApi}/rewards`, rewardRoute);

// image upload & image records
app.use(`${baseApi}/upload`, storageRouter); // POST /api/upload
app.use(`${baseApi}/images`, imagesRouter); // POST/GET /api/images

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

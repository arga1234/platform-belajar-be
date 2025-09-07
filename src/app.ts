import express from 'express';
import authRoutes from './routes/auth';
import learningRoutes from './routes/learning';
import referenceRoute from './routes/reference';
import materiRoutes from './routes/materi';
import testRoutes from './routes/test';
import questionRoutes from './routes/question';
import contentRoutes from './routes/content';

const app = express();

app.use(express.json());

// routes
app.use('/api/auth', authRoutes);
app.use('/api/learning', learningRoutes);
app.use('/api/learning', materiRoutes);
app.use('/api/reference', referenceRoute);
app.use('/api/test', testRoutes);
app.use('/api/question', questionRoutes);
app.use('/api/content', contentRoutes);
const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

import dotenv from 'dotenv';
import express from 'express';

import userRoutes from './routes/userRoutes';
import authRoutes from './routes/authRoutes';
import { authenticateToken } from './middleware';

dotenv.config();

const PORT = process.env.PORT || 5000;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/api/', authRoutes);
app.use('/api/users', authenticateToken, userRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

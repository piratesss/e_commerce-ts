import dotenv from 'dotenv';
import express from 'express';

import userRoutes from './routes/userRoutes';
import authRoutes from './routes/authRoutes';
import { authenticateToken } from './middleware';

dotenv.config();

const PORT = process.env.PORT || 5000;

const app = express();
const router = express.Router();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/api/login', authRoutes);

router.use('/api/users', authenticateToken, userRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

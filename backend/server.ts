import dotenv from 'dotenv';
import express from 'express';

import userRoutes from './routes/userRoutes';
import authRoutes from './routes/authRoutes';
import agentRoutes from './routes/agentRoutes';
import registerRoutes from './routes/registerRoutes';
import { authenticateUserToken, authenticateAgentToken } from './middleware';

dotenv.config();

const PORT = process.env.PORT || 5000;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/api', authRoutes);
app.use('/api/register', registerRoutes);
app.use('/api/user', authenticateUserToken, userRoutes);
app.use('/api/agent', authenticateAgentToken, agentRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

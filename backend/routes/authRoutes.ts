import express from 'express';

import { authUser } from '../controller/authControler/authController';

const router = express.Router();

router.post('/user', authUser);

export default router;

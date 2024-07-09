import express from 'express';

import { authUser, userLogout } from '../controller/authControler/authController';

const router = express.Router();

router.post('/user/login', authUser);
router.post('/user/logout', userLogout);

export default router;

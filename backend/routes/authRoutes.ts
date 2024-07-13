import express from 'express';

import { userAuth, userLogout } from '../controller/authController';

const router = express.Router();

router.post('/user/login', userAuth);
router.post('/user/logout', userLogout);

export default router;

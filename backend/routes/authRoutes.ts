import express from 'express';

import { userAuth, agentAuth, logout } from '../controller/authController';

const router = express.Router();

router.post('/user/login', userAuth);
router.post('/user/logout', logout);
router.post('/agent/login', agentAuth);
router.post('/agent/logout', logout);

export default router;

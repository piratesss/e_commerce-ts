import express from 'express';

import { checkSingleFile } from '../utils';
import { upload } from '../middleware/multer';
import { userAuth, userLogout } from '../controller/authControler/authController';

const router = express.Router();

router.post('/user/login', userAuth);
router.post('/user/logout', userLogout);

export default router;

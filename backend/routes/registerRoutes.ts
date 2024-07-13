import express from 'express';

import { upload } from '../middleware';
import { checkSingleFile } from '../utils';
import { userRegister } from '../controller/registerController';

const router = express.Router();

router.post('/user', upload.any(), checkSingleFile, userRegister);

export default router;

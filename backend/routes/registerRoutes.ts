import express from 'express';

import { checkSingleFile } from '../utils';
import { upload } from '../middleware/multer';
import { userRegister } from '../controller/registerController/registerController';

const router = express.Router();

router.post('/user', upload.any(), checkSingleFile, userRegister);

export default router;

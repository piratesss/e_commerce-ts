import express from 'express';

import { upload } from '../middleware';
import { checkSingleFile } from '../utils';
import { userRegister, agentRegister } from '../controller/registerController';

const router = express.Router();

router.post('/user', upload.any(), checkSingleFile, userRegister);
router.post('/agent', upload.any(), checkSingleFile, agentRegister);

export default router;

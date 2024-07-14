import express from 'express';

import { upload } from '../middleware';
import { checkSingleFile } from '../utils';
import { getAllAgents } from '../controller/agentController';
import { getUserById, deleteUserById, updateUserById } from '../controller/userController';

const router = express.Router();

// TODO -> getAllAgents access only via system portal
router.get('/', getAllAgents);
router.get('/:id', getUserById);
router.delete('/:id', deleteUserById);
router.put('/:id', upload.any(), checkSingleFile, updateUserById);

export default router;

import express from 'express';

import {
    getAllUsers,
    getUserById,
    deleteUserById,
    updateUserById,
} from '../controller/userController';
import { upload } from '../middleware';
import { checkSingleFile } from '../utils';

const router = express.Router();

router.get('/', getAllUsers);
router.get('/:id', getUserById);
router.delete('/:id', deleteUserById);
router.put('/:id', upload.any(), checkSingleFile, updateUserById);

export default router;

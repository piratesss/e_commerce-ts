import express from 'express';

import {
    getAllAgents,
    getAgentById,
    deleteAgentById,
    updateAgentById,
} from '../controller/agentController';
import { upload } from '../middleware';
import { checkSingleFile } from '../utils';

const router = express.Router();

// TODO -> getAllAgents access only via system portal
router.get('/', getAllAgents);
router.get('/:id', getAgentById);
router.delete('/:id', deleteAgentById);
router.put('/:id', upload.any(), checkSingleFile, updateAgentById);

export default router;

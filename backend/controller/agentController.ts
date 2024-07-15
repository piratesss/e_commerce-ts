import { Request, Response } from 'express';

import {
    deleteAgentByIdService,
    getAgentByIdService,
    getAllAgentsService,
    updateAgentByIdService,
} from '../services/agentService';
import { APP_USER_TYPE } from '../config';
import { SingleAgent } from '../interface';
import { checkIfIdExists } from '../services/registerService';

const getAllAgents = async (_req: Request, res: Response) => {
    const [allAgents, allAgentsError] = await getAllAgentsService();

    if (allAgentsError) {
        console.error('Error fetching agents:', allAgentsError);
        return res.status(500).send('Error fetching agents');
    }

    if (allAgents && Array.isArray(allAgents.rows)) {
        const agentsWithoutPassword = allAgents.rows.map(agent => {
            const { password, ...agentWithoutPassword } = agent;
            return agentWithoutPassword;
        });

        return res.status(200).json(agentsWithoutPassword);
    } else {
        console.error('Unexpected result: allAgents is not an array');
        return res.status(500).send('Unexpected result');
    }
};

const getAgentById = async (req: Request, res: Response) => {
    const id = req?.params?.id;

    const [agentById, agentByIdError] = await getAgentByIdService(id);

    if (agentByIdError) {
        return res.status(500).json({ error: 'Internal server error' });
    }

    if (agentById) {
        const agentIdWithoutPassword = agentById.rows.map((agent: SingleAgent) => {
            const { password, ...agentWithoutPassword } = agent;
            return agentWithoutPassword;
        });

        res.status(200).json(agentIdWithoutPassword);
    }
};

const deleteAgentById = async (req: Request, res: Response) => {
    const id = req?.params?.id;

    const [success, error] = await deleteAgentByIdService(id);

    if (error) {
        return res.status(500).json({ error: 'Internal server error' });
    }

    if (success) {
        res.status(200).json({ message: 'Agent deletion successful' });
    }
};

const updateAgentById = async (req: Request, res: Response) => {
    const id = req?.params?.id;

    try {
        const [checkIfUserExits, checkUserError] = await checkIfIdExists(id, APP_USER_TYPE.AGENT);
        if (checkUserError) {
            return res.status(500).json({ error: 'Internal server error' });
        }
        if (checkIfUserExits?.rows?.length === 0) {
            return res.status(400).send({ message: 'User does not exist' });
        }

        //@ts-expect-error req-error
        const [_, updateError] = await updateAgentByIdService(id, req);

        if (updateError) {
            return res.status(500).json({ error: 'Internal server error' });
        }

        return res.status(200).send({ message: 'User updated successfully' });
    } catch (error) {
        res.status(500).send('Internal Server Error');
    }
};

export { getAllAgents, getAgentById, deleteAgentById, updateAgentById };

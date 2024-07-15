import { Request, Response } from 'express';

import { SingleAgent } from '../interface/agent.interface';
import { getAgentByIdService, getAllAgentsService } from '../services/agentService';

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

export { getAllAgents, getAgentById };

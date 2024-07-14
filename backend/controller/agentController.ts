import { Request, Response } from 'express';

import { getAllAgentsService } from '../services/agentService';

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

export { getAllAgents };

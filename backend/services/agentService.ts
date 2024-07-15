import pool from '../config/db';
import { Agent } from '../interface/agent.interface';
import { GET_AGENT_BY_ID, GET_ALL_AGENTS } from '../queries';

interface GetAllAgentsResponse {
    rows: Agent[];
}

type TgetAllAgentsServiceResult = [GetAllAgentsResponse, null] | [null, string];

const getAllAgentsService = async (): Promise<TgetAllAgentsServiceResult> => {
    try {
        const getAllAgents = await pool.query(GET_ALL_AGENTS);
        return [{ rows: getAllAgents.rows }, null];
    } catch (error) {
        console.error('Error getting agent details:', error);
        return [null, error.message];
    }
};

const getAgentByIdService = async (id: string): Promise<any> => {
    try {
        const getAgentById = await pool.query(GET_AGENT_BY_ID, [id]);
        return [getAgentById, null];
    } catch (error) {
        console.error('Error checking if agent exists:', error);
        return [null, error.message];
    }
};

export { getAllAgentsService, getAgentByIdService };

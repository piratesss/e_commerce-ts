import pool from '../config/db';
import { GET_ALL_AGENTS } from '../queries';

interface Agent {
    id: string;
    company_name: string;
    company_email: string;
    company_registration_id: number;
    business_number: number;
    owner_name: string;
    company_address: string;
    company_geography: number;
    company_description: number;
    company_sector: string[];
    company_website: string;
    password: string;
    image_id: string | null;
}

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

export { getAllAgentsService };

import { APP_USER_TYPE } from '../config';
import pool from '../config/db';
import { MulterRequest, SingleAgent } from '../interface';
import { DELETE_AGENT_BY_ID, GET_AGENT_BY_ID, GET_ALL_AGENTS } from '../queries';
import { uploadPhotoToCloudinaryByType } from './registerService';

interface GetAllAgentsResponse {
    rows: SingleAgent[];
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

const deleteAgentByIdService = async (id: string) => {
    try {
        await new Promise((resolve, reject) => {
            pool.query(DELETE_AGENT_BY_ID, [id], (err, results) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(results);
                }
            });
        });
        return [true, null];
    } catch (error) {
        console.error('Error deleting agent:', error);
        return [null, error];
    }
};

const updateAgentByIdService = async (id: string, req: MulterRequest) => {
    const fieldsToUpdate: Record<string, any> = req.body ?? {};
    const filePath = req?.files?.[0]?.path ?? '';

    try {
        const hasImage = filePath !== '';

        if (hasImage) {
            const [_, uploadError] = await uploadPhotoToCloudinaryByType(
                filePath,
                id,
                APP_USER_TYPE.AGENT
            );
            if (uploadError) {
                throw uploadError;
            }
        }

        const updateFields: string[] = [];
        const updateValues: any[] = [];

        Object.entries(fieldsToUpdate).forEach(([key, value]) => {
            if (value !== undefined && key !== 'id' && key !== 'image_path') {
                updateFields.push(key);
                updateValues.push(value);
            }
        });

        if (updateFields.length === 0 && !hasImage) {
            throw new Error('No fields to update');
        }

        if (updateFields.length > 0) {
            updateValues.push(id);

            const updateQuery = `
                UPDATE "agent" 
                SET ${updateFields.map((field, index) => `"${field}" = $${index + 1}`).join(', ')} 
                WHERE id = $${updateValues.length}
            `;

            await pool.query(updateQuery, updateValues);
        }

        return [true, null];
    } catch (error) {
        console.error('Error updating agent:', error);
        return [null, error];
    }
};

export { getAllAgentsService, getAgentByIdService, deleteAgentByIdService, updateAgentByIdService };

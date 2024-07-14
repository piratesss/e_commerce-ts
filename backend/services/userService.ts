import pool from '../config/db';
import { APP_USER_TYPE } from '../config';
import { MulterRequest, User } from '../interface';
import { uploadPhotoToCloudinaryByType } from './registerService';
import { DELETE_USER_BY_ID, GET_ALL_USERS, GET_USER_BY_ID } from '../queries';

interface GetAllUsersResponse {
    rows: User[];
}

type GetAllUsersServiceResult = [GetAllUsersResponse, null] | [null, string];

const getAllUsersService = async (): Promise<GetAllUsersServiceResult> => {
    try {
        const getAllUsers = await pool.query(GET_ALL_USERS);
        return [{ rows: getAllUsers.rows }, null];
    } catch (error) {
        console.error('Error getting user details:', error);
        return [null, error.message];
    }
};

const getUserByIdService = async (id: string): Promise<any> => {
    try {
        const getUserById = await pool.query(GET_USER_BY_ID, [id]);
        return [getUserById, null];
    } catch (error) {
        console.error('Error checking if user exists:', error);
        return [null, error.message];
    }
};

const deleteUserByIdService = async (id: string) => {
    try {
        await new Promise((resolve, reject) => {
            pool.query(DELETE_USER_BY_ID, [id], (err, results) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(results);
                }
            });
        });
        return [true, null];
    } catch (error) {
        console.error('Error deleting user:', error);
        return [null, error];
    }
};

const updateUserByIdService = async (id: string, req: MulterRequest) => {
    const fieldsToUpdate: Record<string, any> = req.body ?? {};
    const filePath = req?.files?.[0]?.path ?? '';

    try {
        const hasImage = filePath !== '';

        if (hasImage) {
            const [_, uploadError] = await uploadPhotoToCloudinaryByType(
                filePath,
                id,
                APP_USER_TYPE.USER
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
                UPDATE "user" 
                SET ${updateFields.map((field, index) => `"${field}" = $${index + 1}`).join(', ')} 
                WHERE id = $${updateValues.length}
            `;

            await pool.query(updateQuery, updateValues);
        }

        return [true, null];
    } catch (error) {
        console.error('Error updating user:', error);
        return [null, error];
    }
};

export { getAllUsersService, getUserByIdService, deleteUserByIdService, updateUserByIdService };

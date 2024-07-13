import pool from '../config/db';
import { APP_USER_TYPE } from '../config';
import { MulterRequest } from '../interface';
import { DELETE_USER_BY_ID, GET_USER_BY_ID } from '../queries';
import { uploadPhotoToCloudinaryByType } from './registerService';

interface User {
    id: string;
    first_name: string;
    email: string;
    address: string;
    phone_number: string;
    payment_mode: string | null;
    middle_name: string;
    last_name: string;
    password: string;
    image_id: string | null;
}

interface GetAllUsersResponse {
    rows: User[];
}

type GetAllUsersServiceResult = [GetAllUsersResponse, null] | [null, string];

const getAllUsersService = async (): Promise<GetAllUsersServiceResult> => {
    try {
        const getAllUsers = await pool.query(`SELECT * FROM "user"`);
        return [{ rows: getAllUsers.rows }, null];
    } catch (error) {
        console.error('Error getting user details:', error);
        return [null, error.message];
    }
};

interface GetUserByIdResponse {
    rows: User;
}

type TGetUserByIdResponse = [GetUserByIdResponse, null] | [null, string];

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

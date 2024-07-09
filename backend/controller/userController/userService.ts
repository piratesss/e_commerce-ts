import pool from '../../config/db';

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

export { getAllUsersService };

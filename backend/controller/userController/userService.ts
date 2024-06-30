import pool from '../../config/db';

const getAllUsersService = async () => {
    const getAllUsers = await pool.query(`SELECT * FROM "user"`);
    if (getAllUsers?.rows?.length) {
        return [getAllUsers, null];
    }
    try {
    } catch (error) {
        console.error('Error getting user details:', error);
        return [null, error];
    }
};

export { getAllUsersService };

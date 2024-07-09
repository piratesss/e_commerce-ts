import pool from '../config/db';
import { CHECK_USER_EMAIL_EXISTS } from '../queries/index';

const checkIfEmailExists = async (email: string) => {
    try {
        const emailCheckResults = await pool.query(CHECK_USER_EMAIL_EXISTS, [email]);
        if (emailCheckResults?.rows?.length) {
            return [emailCheckResults, true, null];
        }
        return [false, null];
    } catch (error) {
        console.error('Error checking email:', error);
        return [null, error];
    }
};

export { checkIfEmailExists };

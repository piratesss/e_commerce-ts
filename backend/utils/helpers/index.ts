import { APP_USER_TYPE, pool } from '../../config';
import { CHECK_USER_EMAIL_EXISTS, CHECK_AGENT_EMAIL_EXISTS } from '../../queries';

const checkIfEmailExists = async (email: string, type: string) => {
    const query = type === APP_USER_TYPE.USER ? CHECK_USER_EMAIL_EXISTS : CHECK_AGENT_EMAIL_EXISTS;

    try {
        const emailCheckResults = await pool.query(query, [email]);

        if (emailCheckResults.rows.length > 0) {
            return [true, emailCheckResults.rows, null];
        } else {
            return [false, null];
        }
    } catch (error) {
        console.error('Error checking email:', error);
        return [null, error];
    }
};

export { checkIfEmailExists };

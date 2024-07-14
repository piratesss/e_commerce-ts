import { APP_USER_TYPE } from '../config';
import { generateAccessToken } from '../utils';

interface User {
    id: string;
    email: string;
    role: string;
}

const getUserDetails = (
    userEmail: User[],
    password: boolean
): [User | null, string | Error | null, boolean] => {
    try {
        if (userEmail?.length > 0 && password) {
            const user: User = {
                id: userEmail[0].id,
                email: userEmail[0].email,
                role: APP_USER_TYPE.USER,
            };
            const accessToken = generateAccessToken(user);
            return [user, accessToken, false];
        } else {
            return [null, null, true];
        }
    } catch (error) {
        console.error('Error checking email:', error);
        return [null, error, false];
    }
};

interface Agent {
    id: string;
    email?: string;
    company_email?: string;
    role: string;
}

const getAgenDetails = (
    agentEmail: Agent[],
    password: boolean
): [Agent | null, string | Error | null, boolean] => {
    try {
        if (agentEmail?.length > 0 && password) {
            const agent: Agent = {
                id: agentEmail[0].id,
                email: agentEmail[0].company_email,
                role: APP_USER_TYPE.AGENT,
            };
            const accessToken = generateAccessToken(agent);
            return [agent, accessToken, false];
        } else {
            return [null, null, true];
        }
    } catch (error) {
        console.error('Error checking email:', error);
        return [null, error, false];
    }
};

export { getUserDetails, getAgenDetails };

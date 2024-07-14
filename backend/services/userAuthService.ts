import { APP_USER_TYPE } from '../config';
import { generateAccessToken } from '../utils';

interface UserAuth {
    id: string;
    email: string;
    role: string;
}

type TgetUserDetails = [UserAuth | null, string | Error | null, boolean];

const getUserDetails = (userEmail: UserAuth[], password: boolean): TgetUserDetails => {
    try {
        if (userEmail?.length > 0 && password) {
            const user: UserAuth = {
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

interface AgentAuth {
    id: string;
    email?: string;
    company_email?: string;
    role: string;
}

type TgetAgenDetails = [AgentAuth | null, string | Error | null, boolean];

const getAgenDetails = (agentEmail: AgentAuth[], password: boolean): TgetAgenDetails => {
    try {
        if (agentEmail?.length > 0 && password) {
            const agent: AgentAuth = {
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

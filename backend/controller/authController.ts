import { Request, Response } from 'express';

import { APP_USER_TYPE } from '../config';
import { getAgenDetails, getUserDetails } from '../services/userAuthService';
import { matchPassword, checkIfEmailExists, isEmptyEmailAndPassword } from '../utils';

const userAuth = async (req: Request, res: Response) => {
    const { email, password } = req?.body;

    if (isEmptyEmailAndPassword(email, password)) {
        res.status(400);
        throw new Error('Email or password is possibly empty');
    }

    try {
        const [_, userEmail, userError] = await checkIfEmailExists(
            req.body.email,
            APP_USER_TYPE.USER
        );
        if (userError) {
            return res.status(500).json({ error: 'Internal server error' });
        }

        if (userEmail?.rows?.length === 0) {
            return res.status(400).send({ message: 'User does not exist' });
        }

        const verifyPassword = await matchPassword(password, userEmail[0]?.password);

        const [userDetails, accessToken, errorOccurred] = getUserDetails(userEmail, verifyPassword);

        if (errorOccurred) {
            return res.status(400).send({ message: 'Invalid user or password' });
        }

        if (userDetails && accessToken) {
            res.setHeader('Authorization', `Bearer ${accessToken}`);
            return res.status(201).json({ userDetails });
        }

        throw new Error('Unexpected case: userDetails or accessToken not available');
    } catch (error) {
        console.error('Error:', error);
        return res.status(500).send('Internal Server Error');
    }
};

const agentAuth = async (req: Request, res: Response) => {
    const { email, password } = req?.body;

    if (isEmptyEmailAndPassword(email, password)) {
        res.status(400);
        throw new Error('Email or password is possibly empty');
    }

    try {
        const [_, agentEmail, agentError] = await checkIfEmailExists(
            req.body.email,
            APP_USER_TYPE.AGENT
        );

        if (agentError) {
            return res.status(500).json({ error: 'Internal server error' });
        }

        if (agentEmail?.rows?.length === 0) {
            return res.status(400).send({ message: 'Agent does not exist' });
        }

        const verifyPassword = await matchPassword(password, agentEmail[0]?.password);

        const [agentDetails, accessToken, errorOccurred] = getAgenDetails(
            agentEmail,
            verifyPassword
        );

        if (errorOccurred) {
            return res.status(400).send({ message: 'Invalid agent or password' });
        }

        if (agentDetails && accessToken) {
            res.setHeader('Authorization', `Bearer ${accessToken}`);
            return res.status(201).json({ agentDetails });
        }

        throw new Error('Unexpected case: agentDetails or accessToken not available');
    } catch (error) {
        console.error('Error:', error);
        return res.status(500).send('Internal Server Error');
    }
};

const logout = async (_req: Request, res: Response) => {
    res.removeHeader('Authorization');

    res.status(200).json({ message: 'Logged out successfully' });
};

export { userAuth, agentAuth, logout };

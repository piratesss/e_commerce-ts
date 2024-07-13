import { Request, Response } from 'express';

import { getUserDetails } from '../services/userAuthService';
import { matchPassword, checkIfEmailExists, isEmpty } from '../utils';

const userAuth = async (req: Request, res: Response) => {
    const { email, password } = req?.body;

    if (isEmpty(email) || isEmpty(password) || email.trim() === '' || password.trim() === '') {
        res.status(400);
        throw new Error('Email or password is possibly empty');
    }

    try {
        const [userEmail, _, emailError] = await checkIfEmailExists(req.body.email);
        if (emailError) {
            return res.status(500).json({ error: 'Internal server error' });
        }

        if (userEmail?.rows?.length === 0) {
            return res.status(400).send({ message: 'User does not exist' });
        }

        const verifyPassword = await matchPassword(password, userEmail?.rows?.[0]?.password);

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

const userLogout = async (req: Request, res: Response) => {
    res.removeHeader('Authorization');

    res.status(200).json({ message: 'Logged out successfully' });
};

export { userAuth, userLogout };

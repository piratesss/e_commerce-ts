import expressAsyncHandler from 'express-async-handler';

import { generateAccessToken } from '../../utils';
import { checkIfEmailExists } from '../../helpers';
import { matchPassword } from '../../utils/passwords';

const authUser = expressAsyncHandler(async (req: any, res: any) => {
    const { email, password } = req?.body;

    if (email?.trim === '' || password?.trim === '') {
        res.status(400);
        throw new Error('Email or password is possbly empty');
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

        if (userEmail?.rows?.length > 0 && verifyPassword) {
            const user = {
                id: userEmail?.rows?.[0]?.id,
                email: userEmail?.rows?.[0]?.email,
            };

            const accessToken = generateAccessToken(user);

            res.setHeader('Authorization', `Bearer ${accessToken}`);

            res.status(201).json({ user });
        }
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Internal Server Error');
    }
});

const userLogout = expressAsyncHandler(async (req, res) => {
    res.removeHeader('Authorization');

    res.status(200).json({ message: 'Logged out successfully' });
});

export { authUser, userLogout };

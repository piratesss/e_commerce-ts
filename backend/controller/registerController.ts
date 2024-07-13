import { Request, Response } from 'express';

import {
    addUserToDB,
    checkIfUserIdExists,
    uploadUserPhotoToCloudinary,
} from '../services/registerService';
import { generateUniqueUUID, checkIfEmailExists } from '../utils';

const userRegister = async (req: Request, res: Response) => {
    try {
        const id = generateUniqueUUID();

        const [_, emailExists, emailError] = await checkIfEmailExists(req.body.email);

        if (emailError) {
            return res.status(500).json({ error: 'Internal server error' });
        }
        if (emailExists) {
            return res.status(400).send({ message: 'Email already exists' });
        }

        const [addUserSuccess, addUserError] = await addUserToDB(req.body, id);
        if (addUserError) {
            return res.status(500).json({ error: 'Internal server error' });
        }

        const [getUserResult, getUserError] = await checkIfUserIdExists(id);
        if (getUserError) {
            return res.status(500).json({ error: 'Internal server error' });
        }
        if (getUserResult?.rows?.length === 0) {
            return res.status(400).send({ message: 'User does not exist' });
        }

        if (getUserResult?.rows?.length >= 1 && req?.files?.[0]?.path) {
            const [uploadSuccess, uploadError] = await uploadUserPhotoToCloudinary(
                req.files[0].path,
                id
            );
            if (uploadError) {
                return res.status(500).json({ error: 'Internal server error' });
            }
            if (uploadSuccess) {
                return res.status(201).send('User created successfully');
            }
        } else {
            return res.status(201).send('User created successfully');
        }
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Internal Server Error');
    }
};

export { userRegister };

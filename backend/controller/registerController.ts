import { Request, Response } from 'express';

import {
    addAgentToDB,
    addUserToDB,
    checkIfIdExists,
    uploadPhotoToCloudinaryByType,
} from '../services/registerService';
import { APP_USER_TYPE } from '../config';
import { generateUniqueUUID, checkIfEmailExists } from '../utils';

const userRegister = async (req: Request, res: Response) => {
    try {
        const id = generateUniqueUUID();

        const [_, emailExists, emailError] = await checkIfEmailExists(
            req.body.email,
            APP_USER_TYPE.USER
        );

        if (emailError) {
            return res.status(500).json({ error: 'Internal server error' });
        }
        if (emailExists) {
            return res.status(400).send({ message: 'Email already exists' });
        }

        const [_addUserSuccess, addUserError] = await addUserToDB(req.body, id);
        if (addUserError) {
            return res.status(500).json({ error: 'Internal server error' });
        }

        const [getUserResult, getUserError] = await checkIfIdExists(id, APP_USER_TYPE.USER);
        if (getUserError) {
            return res.status(500).json({ error: 'Internal server error' });
        }
        if (getUserResult?.rows?.length === 0) {
            return res.status(400).send({ message: 'User does not exist' });
        }

        if (getUserResult?.rows?.length >= 1 && req?.files?.[0]?.path) {
            const [uploadSuccess, uploadError] = await uploadPhotoToCloudinaryByType(
                req.files[0].path,
                id,
                APP_USER_TYPE.USER
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

const agentRegister = async (req: Request, res: Response) => {
    try {
        const id = generateUniqueUUID();

        const [_, emailExists, emailError] = await checkIfEmailExists(
            req.body.company_email,
            APP_USER_TYPE.AGENT
        );

        if (emailError) {
            return res.status(500).json({ error: 'Internal server error' });
        }
        if (emailExists) {
            return res.status(400).send({ message: 'Agent already exists' });
        }

        const [_addAgentSuccess, addAgentError] = await addAgentToDB(req.body, id);
        if (addAgentError) {
            return res.status(500).json({ error: 'Internal server error' });
        }

        const [getAgengResult, getAgentError] = await checkIfIdExists(id, APP_USER_TYPE.AGENT);
        if (getAgentError) {
            return res.status(500).json({ error: 'Internal server error' });
        }
        if (getAgengResult?.rows?.length === 0) {
            return res.status(400).send({ message: 'Agent does not exist' });
        }

        if (getAgengResult?.rows?.length >= 1 && req?.files?.[0]?.path) {
            const [uploadSuccess, uploadError] = await uploadPhotoToCloudinaryByType(
                req.files[0].path,
                id,
                APP_USER_TYPE.AGENT
            );
            if (uploadError) {
                return res.status(500).json({ error: 'Internal server error' });
            }
            if (uploadSuccess) {
                return res.status(201).send('Agent created successfully');
            }
        } else {
            return res.status(201).send('Agent created successfully');
        }
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Internal Server Error');
    }
};

export { userRegister, agentRegister };

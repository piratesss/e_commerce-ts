import expressAsyncHandler from 'express-async-handler';

import { generateUniqueUUID } from '../../utils';
import { checkIfEmailExists } from '../../helpers';
import { addUserToDB, checkIfUserIdExists, uploadUserPhotoToCloudinary } from './registerService';

const userRegister = expressAsyncHandler(async (req: any, res: any) => {
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
});

export { userRegister };

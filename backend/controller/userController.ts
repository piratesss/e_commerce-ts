import { Request, Response } from 'express';

import {
    deleteUserByIdService,
    getAllUsersService,
    getUserByIdService,
    updateUserByIdService,
} from '../services/userService';
import { UserData } from '../interface';
import { APP_USER_TYPE } from '../config';
import { checkIfIdExists } from '../services/registerService';

const getAllUsers = async (_req: Request, res: Response) => {
    const [allUsers, allUsersError] = await getAllUsersService();

    if (allUsersError) {
        console.error('Error fetching users:', allUsersError);
        return res.status(500).send('Error fetching users');
    }

    if (allUsers && Array.isArray(allUsers.rows)) {
        const usersWithoutPassword = allUsers.rows.map(user => {
            const { password, ...userWithoutPassword } = user;
            return userWithoutPassword;
        });

        return res.status(200).json(usersWithoutPassword);
    } else {
        console.error('Unexpected result: allUsers is not an array');
        return res.status(500).send('Unexpected result');
    }
};

const getUserById = async (req: Request, res: Response) => {
    const id = req?.params?.id;

    const [userById, userByIdError] = await getUserByIdService(id);

    if (userByIdError) {
        return res.status(500).json({ error: 'Internal server error' });
    }

    if (userById) {
        const userIdWithoutPassword = userById.rows.map((user: UserData) => {
            const { password, ...userWithoutPassword } = user;
            return userWithoutPassword;
        });

        res.status(200).json(userIdWithoutPassword);
    }
};

const deleteUserById = async (req: Request, res: Response) => {
    const id = req?.params?.id;

    const [success, error] = await deleteUserByIdService(id);

    if (error) {
        return res.status(500).json({ error: 'Internal server error' });
    }

    if (success) {
        res.status(200).json({ message: 'User deletion successful' });
    }
};

const updateUserById = async (req: Request, res: Response) => {
    const id = req?.params?.id;

    try {
        const [checkIfUserExits, checkUserError] = await checkIfIdExists(id, APP_USER_TYPE.USER);
        if (checkUserError) {
            return res.status(500).json({ error: 'Internal server error' });
        }
        if (checkIfUserExits?.rows?.length === 0) {
            return res.status(400).send({ message: 'User does not exist' });
        }

        //@ts-expect-error req-error
        const [_, updateError] = await updateUserByIdService(id, req);

        if (updateError) {
            return res.status(500).json({ error: 'Internal server error' });
        }

        return res.status(200).send({ message: 'User updated successfully' });
    } catch (error) {
        res.status(500).send('Internal Server Error');
    }
};

export { getAllUsers, getUserById, deleteUserById, updateUserById };

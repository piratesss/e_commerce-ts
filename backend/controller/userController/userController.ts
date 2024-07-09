import expressAsyncHandler from 'express-async-handler';

import { getAllUsersService, getUserByIdService } from './userService';

const getAllUsers = expressAsyncHandler(async (req: any, res: any) => {
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
});

const getUserById = expressAsyncHandler(async (req: any, res: any) => {
    const id = req?.params?.id;

    const [userById, userByIdError] = await getUserByIdService(id);

    if (userByIdError) {
        return res.status(500).json({ error: 'Internal server error' });
    }

    if (userById) {
        const userIdWithoutPassword = userById.rows.map(user => {
            const { password, ...userWithoutPassword } = user;
            return userWithoutPassword;
        });

        res.status(200).json(userIdWithoutPassword);
    }
});

export { getAllUsers, getUserById };

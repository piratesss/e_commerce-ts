import expressAsyncHandler from 'express-async-handler';

import { getAllUsersService } from './userService';

const getAllUsers = expressAsyncHandler(async (req: any, res: any) => {
    try {
        const [allUsers, allUsersError]: any = await getAllUsersService();

        if (allUsersError) {
            console.error('Error fetching users:', allUsersError);
            return res.status(500).send('Error fetching users');
        }

        if (Array.isArray(allUsers?.rows)) {
            return res.status(200).json(allUsers?.rows);
        } else {
            console.error('Unexpected result: allUsers is not an array');
            return res.status(500).send('Unexpected result');
        }
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Internal Server Error');
    }
});

export { getAllUsers };

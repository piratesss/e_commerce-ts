import { generateAccessToken } from '../utils';

interface User {
    id: string;
    email: string;
}

interface UserEmailInterface {
    rows: { id: string; email: string; password: string }[];
}

const getUserDetails = (
    userEmail: UserEmailInterface,
    password: boolean
): [User | null, string | Error | null, boolean] => {
    try {
        if (userEmail?.rows?.length > 0 && password) {
            const user: User = {
                id: userEmail.rows[0].id,
                email: userEmail.rows[0].email,
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

export { getUserDetails };

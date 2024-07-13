import pool from '../config/db';
import { hashPassword } from '../utils';
import { cloudinary } from '../config/cloudinary';
import { ADD_NEW_USER, GET_USER_BY_ID, INSERT_IMAGE_PUBLIC_ID_TO_USER_TABLE } from '../queries';

interface UserData {
    first_name: string;
    middle_name: string;
    last_name: string;
    email: string;
    password: string;
    address: string;
    phone_number: number;
    payment_mode: string;
}

const addUserToDB = async (userData: UserData, id: string) => {
    try {
        const {
            first_name,
            middle_name,
            last_name,
            email,
            password,
            address,
            phone_number,
            payment_mode,
        } = userData;

        const hashedPassword = password ? await hashPassword(password) : '';

        await pool.query(ADD_NEW_USER, [
            id,
            first_name,
            middle_name,
            last_name,
            email,
            hashedPassword,
            address,
            phone_number,
            payment_mode,
        ]);

        return [true, null];
    } catch (error) {
        console.error('Error adding user:', error);
        return [null, error];
    }
};

const checkIfUserIdExists = async id => {
    try {
        const getUserById = await pool.query(GET_USER_BY_ID, [id]);
        return [getUserById, null];
    } catch (error) {
        console.error('Error checking if user exists:', error);
        return [null, error];
    }
};

const uploadUserPhotoToCloudinary = async (filePath, id) => {
    try {
        const result = await cloudinary.uploader.upload(filePath);

        if (!result || !result.public_id) {
            console.error('Invalid result from Cloudinary upload');
            return [null, new Error('Invalid result from Cloudinary upload')];
        }

        await pool.query(INSERT_IMAGE_PUBLIC_ID_TO_USER_TABLE, [result.public_id, id]);

        return [true, null];
    } catch (error) {
        console.error('Error in uploadUserPhotoToCloudinary:', error);
        return [null, error];
    }
};

export { addUserToDB, checkIfUserIdExists, uploadUserPhotoToCloudinary };

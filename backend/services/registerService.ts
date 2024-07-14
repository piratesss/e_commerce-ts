import {
    ADD_NEW_AGENT,
    ADD_NEW_USER,
    GET_AGENT_BY_ID,
    GET_USER_BY_ID,
    INSERT_IMAGE_PUBLIC_ID_TO_AGENT_TABLE,
    INSERT_IMAGE_PUBLIC_ID_TO_USER_TABLE,
} from '../queries';
import pool from '../config/db';
import { UserData } from '../interface';
import { hashPassword } from '../utils';
import { APP_USER_TYPE } from '../config';
import { cloudinary } from '../config/cloudinary';

interface AgentData {
    company_name: string;
    company_email: string;
    company_registration_id: number;
    business_number: number;
    owner_name: string;
    company_address: string;
    company_geography: number;
    company_description: number;
    company_sector: string[];
    company_website: string;
    password: string;
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

const checkIfIdExists = async (id: string, type: string) => {
    const query = type === APP_USER_TYPE.USER ? GET_USER_BY_ID : GET_AGENT_BY_ID;

    try {
        const getUserById = await pool.query(query, [id]);
        return [getUserById, null];
    } catch (error) {
        console.error('Error checking if user exists:', error);
        return [null, error];
    }
};

const uploadPhotoToCloudinaryByType = async (filePath: string, id: string, type: string) => {
    const query =
        type === APP_USER_TYPE.USER
            ? INSERT_IMAGE_PUBLIC_ID_TO_USER_TABLE
            : INSERT_IMAGE_PUBLIC_ID_TO_AGENT_TABLE;

    try {
        const result = await cloudinary.uploader.upload(filePath);

        if (!result || !result.public_id) {
            console.error('Invalid result from Cloudinary upload');
            return [null, new Error('Invalid result from Cloudinary upload')];
        }

        await pool.query(query, [result.public_id, id]);
        return [true, null];
    } catch (error) {
        console.error('Error in uploadPhotoToCloudinaryByType:', error);
        return [null, error];
    }
};

const addAgentToDB = async (agentData: AgentData, id: string) => {
    try {
        const {
            company_name,
            company_email,
            company_registration_id,
            business_number,
            password,
            owner_name,
            company_address,
            company_geography,
            company_description,
            company_sector,
            company_website,
        } = agentData;

        const hashedPassword = password ? await hashPassword(password) : '';

        await pool.query(ADD_NEW_AGENT, [
            id,
            company_name,
            company_email,
            company_registration_id,
            business_number,
            hashedPassword,
            owner_name,
            company_address,
            company_geography,
            company_description,
            company_sector,
            company_website,
        ]);

        return [true, null];
    } catch (error) {
        console.error('Error adding agent:', error);
        return [null, error];
    }
};

export { addUserToDB, checkIfIdExists, uploadPhotoToCloudinaryByType, addAgentToDB };

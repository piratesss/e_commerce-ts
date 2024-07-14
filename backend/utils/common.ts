import { v4 as uuidv4 } from 'uuid';

export const generateUniqueUUID = () => {
    return uuidv4().replace(/-/gi, '');
};

export const checkSingleFile = (req, res, next) => {
    if (req.files && req.files.length > 1) {
        return res.status(400).json({ error: 'Only one file can be uploaded at a time' });
    }
    next();
};

type TisEmpty = null | undefined | object | string | [];

export const isEmpty = (value: TisEmpty): boolean => {
    if (value === null || value === undefined) {
        return true;
    }

    if (typeof value === 'object' && Object.keys(value).length === 0) {
        return true;
    }

    if (typeof value === 'string' && value.trim().length === 0) {
        return true;
    }

    if (Array.isArray(value) && value.length === 0) {
        return true;
    }

    return false;
};

export const isEmptyEmailAndPassword = (email: string, password: string) => {
    return isEmpty(email) || isEmpty(password) || email.trim() === '' || password.trim() === '';
};

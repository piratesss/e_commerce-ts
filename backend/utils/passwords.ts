import bcrypt from 'bcryptjs';

export const hashPassword = async (password: string) => {
    const salt = await bcrypt?.genSalt(10);
    return bcrypt?.hash(password, salt);
};

export const matchPassword = async (reqPassword: string, dbPassword: string) => {
    return await bcrypt?.compare(reqPassword, dbPassword);
};

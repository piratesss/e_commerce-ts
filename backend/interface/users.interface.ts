export interface UserData {
    first_name: string;
    middle_name: string;
    last_name: string;
    email: string;
    password: string;
    address: string;
    phone_number: number;
    payment_mode: string;
}

export interface User extends UserData {
    id: string;
    image_id: string | null;
}

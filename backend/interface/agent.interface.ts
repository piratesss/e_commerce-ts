export interface SingleAgent {
    id: string;
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
    image_id: string | null;
}

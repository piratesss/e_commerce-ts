const CHECK_USER_EMAIL_EXISTS = `SELECT * FROM "user" WHERE email = $1`;
const CHECK_AGENT_EMAIL_EXISTS = `SELECT * FROM "agent" WHERE company_email = $1`;

const ADD_NEW_USER = `INSERT INTO "user" (id, first_name, middle_name, last_name, email, password, address, phone_number, payment_mode) 
VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`;
const ADD_NEW_AGENT = `INSERT INTO "agent" (id, company_name, company_email, company_registration_id, business_number, password, owner_name, company_address,
company_geography, company_description, company_sector, company_website)
VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)`;

const GET_USER_BY_ID = `SELECT * FROM "user" WHERE id = $1`;
const GET_AGENT_BY_ID = `SELECT * FROM "agent" WHERE id = $1`;

const DELETE_USER_BY_ID = `DELETE FROM "user" where id = $1`;
const DELETE_AGENT_BY_ID = `DELETE FROM "agent" where id = $1`;

const INSERT_IMAGE_PUBLIC_ID_TO_USER_TABLE = `UPDATE "user" SET image_id = $1 where id = $2`;
const INSERT_IMAGE_PUBLIC_ID_TO_AGENT_TABLE = `UPDATE "agent" SET agent_image_id = $1 where id = $2`;

const GET_ALL_USERS = `SELECT * FROM "user"`;
const GET_ALL_AGENTS = `SELECT * FROM "agent"`;

export {
    ADD_NEW_USER,
    ADD_NEW_AGENT,
    GET_USER_BY_ID,
    GET_AGENT_BY_ID,
    DELETE_USER_BY_ID,
    DELETE_AGENT_BY_ID,
    CHECK_USER_EMAIL_EXISTS,
    CHECK_AGENT_EMAIL_EXISTS,
    INSERT_IMAGE_PUBLIC_ID_TO_USER_TABLE,
    INSERT_IMAGE_PUBLIC_ID_TO_AGENT_TABLE,
    GET_ALL_USERS,
    GET_ALL_AGENTS,
};

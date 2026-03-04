import dotenv from 'dotenv';

// load environment variables from .env file
dotenv.config();

export const ENV = {
    PORT: process.env.PORT || 3000,
    DB_URL: process.env.DB_URL,
    NODE_ENV: process.env.NODE_ENV
};
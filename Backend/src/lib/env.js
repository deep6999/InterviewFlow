import dotevn from 'dotenv';

dotevn.config();

export const ENV ={
    PORT: process.env.PORT,
    DB_URI: process.env.DB_URI
}
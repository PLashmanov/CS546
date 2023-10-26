import dotenv from 'dotenv';

dotenv.config();

export const mongoConfig = {
  serverUrl: process.env.MONGO_URL,
  database: process.env.MONGO_DB
};
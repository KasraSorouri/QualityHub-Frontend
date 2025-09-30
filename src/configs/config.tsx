import dotenv from 'dotenv';
dotenv.config();
export const api_url = process.env.URL || 'http://localhost:3006/api';

import 'dotenv/config';

export const PORT: number = parseInt(process.env.PORT ?? '3001');
export const JWT_SECRET: string = process.env.JWT_SECRET || '';
export const ORIGIN_URL: string = process.env.ORIGIN_URL || '';
export const ORIGIN_URL1: string = process.env.ORIGIN_URL1 || '';
export const SALT: number = parseInt(process.env.SALT ?? '10');

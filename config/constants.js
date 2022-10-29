import { timeConvertor } from '../utils/timeConvertor.js';

export const MONGO_DB_URI = process.env.MONGO_DB_URI || (await import('./secret/constants.js')).LOCAL_MONGO_DB_URI;
export const JWT_SECRET = process.env.JWT_SECRET || (await import('./secret/constants.js')).JWT_SECRET;
const AUTH_LIFETIME = '25d';
export const JWT_TOKEN_LIFETIME = process.env.JWT_TOKEN_LIFETIME || AUTH_LIFETIME;
export const COOKIE_LIFETIME = timeConvertor(JWT_TOKEN_LIFETIME);
export const PORT = process.env.PORT || 4444;
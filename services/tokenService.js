import jwt from 'jsonwebtoken';
import { JWT_SECRET, JWT_TOKEN_LIFETIME } from '../config/constants.js';

export const create = (payload) => 
    jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_TOKEN_LIFETIME });

export const decode = (token) => {
    try {
        const userData = jwt.verify(token, JWT_SECRET);
        return userData;
    } catch (e) {
        return null;
    }
}
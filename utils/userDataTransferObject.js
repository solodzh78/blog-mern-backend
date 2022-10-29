import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config/constants.js';

export const userDTO = ({ _id, email, fullName, avatarUrl }) => 
    ({ 
        _id,
        email, 
        fullName, 
        avatarUrl
    });
export const userDTOwithToken = ({ _id, fullName, avatarUrl }) => 
    ({ 
        _id, 
        fullName, 
        avatarUrl, 
        ...{ token: jwt.sign({_id}, JWT_SECRET, {expiresIn: '30d'})} 
    });
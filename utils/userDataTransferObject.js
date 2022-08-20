import jwt from 'jsonwebtoken';
export const userDTO = ({ _id, fullName, avatarUrl }) => 
    ({ 
        _id, 
        fullName, 
        avatarUrl
    });
export const userDTOwithToken = ({ _id, fullName, avatarUrl }) => 
    ({ 
        _id, 
        fullName, 
        avatarUrl, 
        ...{ token: jwt.sign({_id}, 'secret123', {expiresIn: '30d'})} 
    });
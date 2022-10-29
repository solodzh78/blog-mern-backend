import bcrypt from 'bcrypt';

import UserModel from '../models/User.js';
import { userDTO } from '../utils/userDataTransferObject.js';

export const registration = async(email, password, fullName, avatarUrl) => {

    const candidate = await UserModel.findOne({ email });
    if (candidate) {
        throw new Error(`Пользователь с адрессом ${email} уже существует`);
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);
    const user = await UserModel.create({ email, passwordHash, fullName, avatarUrl});
    const res = userDTO(user);
    return res;
}

export const login = async (email, password) => {

    const user = await UserModel.findOne({ email });

    if (!user) {
        return res.status(404).json({
            message: 'Пользователь с таким email не зарегистрирован'
        })
    }

    const isValidPass = await bcrypt.compare(password, user.passwordHash);

    if (!isValidPass) {
        return res.status(404).json({
            message: 'Неверный пароль'
        })
    }

    const res = userDTO(user);
    return res;
}

export const getMe = async(userId) => {

    const user = await UserModel.findById(userId);

    if (!user) {
        return res.status(404).json({
            message: 'Пользователь не найден',
        })
    }

    const res = userDTO(user);
    return res;
}


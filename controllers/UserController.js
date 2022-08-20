import bcrypt from 'bcrypt'
import UserModel from '../models/User.js';
import { userDTO, userDTOwithToken } from '../utils/userDataTransferObject.js';

export const register = async (req, res) => {
    console.log('body: ', req.body);
    console.log('file: ', req.file);
    try {

        const password = req.body.password;
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);

        const doc = new UserModel({
            email: req.body.email,
            fullName: req.body.fullName,
            avatarUrl: req.file ? `uploads/${req.file.filename}` : '',
            passwordHash: hash,
        });

        const user = await doc.save();

        res.json(userDTOwithToken(user._doc));

    } catch (error) {
        console.log('error: ', error);
        res.status(500).json({
            message: 'Не удалось зарегистрироваться'
        });
    }
}

export const login = async (req, res) => {
    try {
        const user = await UserModel.findOne({
            email: req.body.email,
        });

        if (!user) {
            return res.status(404).json({
                message: 'Пользователь с таким email не зарегистрирован'
            })
        }

        const isValidPass = await bcrypt.compare(req.body.password, user._doc.passwordHash);

        if (!isValidPass) {
            return res.status(404).json({
                message: 'Неверный пароль'
            })
        }

        res.json(userDTOwithToken(user._doc));

    } catch (error) {
        console.log('error: ', error);
        res.status(500).json({
            message: 'Не удалось авторизоваться'
        });
    }
}

export const getMe = async (req, res) => {
    try {
        const user = await UserModel.findById(req.userId);

        if (!user) {
            return res.status(404).json({
                message: 'Пользователь не найден',
            })
        }
        
        res.json(userDTO(user._doc));

    } catch (error) {
        console.log('error: ', error);
        res.status(500).json({
            message: 'Нет доступа',
        });
    }
}
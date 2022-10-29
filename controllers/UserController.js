import { TokenService, UserService } from '../services/index.js';
import { setCookie } from '../utils/setCookie.js';

export const register = async (req, res) => {
    try {
        const {body: { email, password, fullName }, file} = req;
        const avatarUrl = file ? `uploads/${file.filename}` : '';

        const user = await UserService.registration(email, password, fullName, avatarUrl);

        const token = TokenService.create(user)
        setCookie(res, token);
        res.json(user);

    } catch (error) {
        console.log('error: ', error);
        res.status(500).json({
            message: 'Не удалось зарегистрироваться',
            error
        });
    }
}

export const login = async (req, res) => {
    try {
        const { email, password } = req.body
        const user = await UserService.login(email, password);
        const token = TokenService.create(user);
        setCookie(res, token);
        res.json(user);
    } catch (error) {
        console.log('error: ', error);
        res.status(500).json({
            message: 'Не удалось авторизоваться'
        });
    }
}

export const logout = async (req, res) => {

    try {
        res.clearCookie('token');
        res.json({
            message: 'Logout successfull'
        });
    } catch (e) {
        console.log(e);
    }
}

export const getMe = async (req, res) => {
    try {
        const user = await UserService.getMe(req.userId);
        res.json(user);

    } catch (error) {
        console.log('error: ', error);
        res.status(500).json({
            message: 'Нет доступа',
        });
    }
}
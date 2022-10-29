import { TokenService } from '../services/index.js';

export default (req, res, next) => {
    const token = req.cookies.token;

    if (token) {
        try {
            const decoded = TokenService.decode(token);
            req.userId = decoded._id;
            console.log('Проверка пользователя выполнена успешно');
            next();
        } catch (error) {
            return res.status(403).json({
                message: 'Не удалось расшифровать токен',
            });
        }
    } else {
        return res.status(403).json({
            message: 'Нет доступа'
        })
    }
};
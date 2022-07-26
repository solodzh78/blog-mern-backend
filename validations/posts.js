import { body } from 'express-validator';

export const postCreateValidation = [
    body('title', 'Введите заголовок статьи').isLength({ min: 3 }).isString(),
    body('text', 'Введите текст статьи').isLength({ min: 10 }).isString(),
    body('tags', 'Неверный формат тегов (укажите массив)').optional().isArray(),
    body('imageUrl', 'Неверная ссылка на изображение').optional().isString(),
];

export const commentCreateValidation = [
    body('commentText', 'Введите текст комментария').isLength({ min: 1 }).isString(),
];
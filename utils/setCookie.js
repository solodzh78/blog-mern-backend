import { COOKIE_LIFETIME } from '../config/constants.js';

export const setCookie = (res, token) => {
    res.cookie('token', token, {
        maxAge: COOKIE_LIFETIME,
        httpOnly: true,
    });
}
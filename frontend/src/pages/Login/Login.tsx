import React from "react";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import { useForm } from "react-hook-form";
import { Navigate } from "react-router-dom";

import styles from "./Login.module.scss";

import { AuthUserDataType, AuthValuesType, fetchAuth, selectIsAuth } from "../../store/slices/auth";
import { useAppDispatch, useAppSelector } from "../../store/store";

export const Login = () => {

    const isAuth = useAppSelector(selectIsAuth);
    const dispatch = useAppDispatch();
    const { 
        register, 
        handleSubmit, 
        setError, 
        formState: {errors, isValid}
    } = useForm({
        defaultValues: {
            email: '',
            password: ''
        },
        mode: 'onChange'
    });

    if (isAuth) return <Navigate to='/'/>;

    const onSubmit = async (values: AuthValuesType) => {
        const data = await dispatch(fetchAuth(values));
        const payload = data.payload as AuthUserDataType;
        if (payload && 'token' in payload) {
            localStorage.setItem('token', payload.token);
        }
    };

    return (
        <Paper classes={{ root: styles.root }}>
            <Typography classes={{ root: styles.title }} variant="h5">
                Вход в аккаунт
            </Typography>
            <form onSubmit={handleSubmit(onSubmit)}>
                <TextField
                    className={styles.field}
                    label="E-Mail"
                    error={Boolean(errors.email?.message)}
                    helperText={errors.email?.message}
                    {...register('email', {required: 'Укажите почту'})}
                    fullWidth
                />
                <TextField 
                    className={styles.field} 
                    label="Пароль" 
                    error={Boolean(errors.password?.message)}
                    helperText={errors.password?.message}
                    {...register('password', {required: 'Укажите пароль'})}
                    fullWidth
                />
                <Button type="submit" size="large" variant="contained" fullWidth>
                    Войти
                </Button>
            </form>
        </Paper>
    );
};

import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import { MONGO_DB_URI } from './config/constants.js';
import { PORT } from './config/constants.js';
import { router } from './router/index.js';

mongoose
    .connect(MONGO_DB_URI)
    .then(() => console.log('DB ok'))
    .catch((err) => console.log('Db error', err));

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    credentials: true,
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
}));
app.use('/uploads', express.static('uploads'));
app.use(router)

app.listen(PORT, (err) => {
    if (err) {
        return console.log(err);
    }
    console.log(`Server started on port: ${PORT}`);
})
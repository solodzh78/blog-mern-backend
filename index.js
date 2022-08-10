import express from 'express';
import mongoose from 'mongoose';
import multer from 'multer';
import cors from 'cors';
import fs from 'fs';

import { loginValidation, registerValidation, postCreateValidation, commentCreateValidation } from './validations/index.js';
import { UserController, PostController} from './controllers/index.js';
import { checkAuth, handleValidationErrors } from './utils/index.js';
import { MONGO_DB_URI } from './constants.js';
import { PORT } from './constants.js';

mongoose
    .connect(MONGO_DB_URI)
    .then(() => console.log('DB ok'))
    .catch((err) => console.log('Db error', err));

const app = express();

const storage = multer.diskStorage({
    destination: (_, __, cb) => {
        if(!fs.existsSync('uploads')) fs.mkdirSync('uploads')
        cb(null, 'uploads')
    },
    filename: (_, file, cb) => {
        cb(null, new Date().getMilliseconds() + '-' + file.originalname)
    },
})

const upload  = multer({storage});

app.use(express.json());

app.use(cors());
app.use('/uploads', express.static('uploads'));

app.post('/auth/register', upload.single('image'), registerValidation, handleValidationErrors, UserController.register);
app.post('/auth/login', loginValidation, handleValidationErrors, UserController.login);
app.get('/auth/me', checkAuth, UserController.getMe);

app.post('/upload', checkAuth, upload.single('image'), (req, res) => {
    res.json({
        url: `uploads/${req.file.originalname}`,
    })
})

app.get('/posts', PostController.getAll);
app.get('/posts/:id', PostController.getOne);
app.get('/tags', PostController.getLastTags);
app.get('/comments', PostController.getLastComments);
app.post('/posts', checkAuth, postCreateValidation, handleValidationErrors, PostController.create);
app.patch('/posts/:id', checkAuth, postCreateValidation, handleValidationErrors, PostController.update);

app.patch('/posts/:id/comment', checkAuth, commentCreateValidation, handleValidationErrors, PostController.createComment);
app.delete('/posts/:id', checkAuth, PostController.remove);

app.listen(PORT, (err) => {
    if (err) {
        return console.log(err);
    }
    console.log('Server Ok');
})
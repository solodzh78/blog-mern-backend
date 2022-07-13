import express from 'express';
import mongoose from 'mongoose';
import multer from 'multer';
import cors from 'cors';

import { loginValidation, registerValidation, postCreateValidation } from './validations/index.js';
import { UserController, PostController} from './controllers/index.js';
import { checkAuth, handleValidationErrors } from './utils/index.js';

mongoose
    .connect('mongodb+srv://admin:wwwwww@cluster0.g2etn.mongodb.net/blog?retryWrites=true&w=majority')
    .then(() => console.log('DB ok'))
    .catch((err) => console.log('Db error', err));

const app = express();

const storage = multer.diskStorage({
    destination: (_, __, cb) => {
        cb(null, 'uploads')
    },
    filename: (_, file, cb) => {
        cb(null, file.originalname)
    },
})

const upload  = multer({storage});

app.use(express.json());
app.use(cors());
app.use('/uploads', express.static('uploads'));

app.get('/', (req, res) => {
    res.send('Hello world')
});

app.post('/auth/register', registerValidation, handleValidationErrors, UserController.register);
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
app.post('/posts', checkAuth, postCreateValidation, handleValidationErrors, PostController.create);
app.patch('/posts/:id', checkAuth, postCreateValidation, handleValidationErrors, PostController.update);
app.delete('/posts/:id', checkAuth, PostController.remove);

app.listen(4444, (err) => {
    if (err) {
        return console.log(err);
    }
    console.log('Server Ok');
})
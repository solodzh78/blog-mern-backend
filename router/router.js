import { Router } from 'express';
import { UserController, PostController} from '../controllers/index.js';
import { loginValidation, registerValidation, postCreateValidation, commentCreateValidation } from '../validations/index.js';
import { checkAuth, handleValidationErrors } from '../utils/index.js';
import { upload } from '../fileStorage/index.js';

const router = Router();

router.post('/auth/register', upload.single('image'), 
    registerValidation, handleValidationErrors, UserController.register);
router.post('/auth/login', loginValidation, handleValidationErrors, UserController.login);
router.get('/auth/me', checkAuth, UserController.getMe);
router.get('/auth/logout', UserController.logout);

router.post('/upload', checkAuth, upload.single('image'), PostController.fileUpload);
router.get('/posts', PostController.getAll);
router.get('/posts/:id', PostController.getOne);
router.get('/tags', PostController.getLastTags);
router.get('/comments', PostController.getLastComments);
router.post('/posts', checkAuth, postCreateValidation, handleValidationErrors, PostController.create);
router.patch('/posts/:id', checkAuth, postCreateValidation, handleValidationErrors, PostController.update);

router.patch('/posts/:id/comment', checkAuth, commentCreateValidation, handleValidationErrors, PostController.createComment);
router.delete('/posts/:id', checkAuth, PostController.remove);

export { router };
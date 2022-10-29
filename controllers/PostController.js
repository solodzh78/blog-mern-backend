import { PostService } from '../services/index.js'

export const getAll = async (req, res) => {
    try {
        const sort = req.query?.sort;
        const tags = req.query?.tags;

        const post = await PostService.getAll(sort, tags);
        res.json(post);

    } catch (error) {
        console.log('error: ', error);
        res.status(500).json({
            message: 'Не удалось получить статьи',
        });
    }
};

export const getLastTags = async (req, res) => {
    try {
        const sort = req.query?.sort;
        const tagsReq = req.query?.tags;

        const tags = await PostService.getLastTags(sort, tagsReq);
        res.json(tags);

    } catch (error) {
        console.log('error: ', error);
        res.status(500).json({
            message: 'Не удалось получить теги',
        });
    }
};

export const getLastComments = async (req, res) => {
    try {
        const sort = req.query?.sort;
        const tagsReq = req.query?.tags;

        const comments = await PostService.getLastComments(sort, tagsReq);
        res.json(comments);

    } catch (error) {
        console.log('error: ', error);
        res.status(500).json({
            message: 'Не удалось получить комментарии',
        });
    }
};

export const getOne = async (req, res) => {
    try {
        const postId = req.params.id;
        const post = await PostService.getOne(postId);
        res.json(post);
        
    } catch (error) {
        console.log('error: ', error);
        res.status(500).json({
            message: 'Не удалось получить статью',
        });
    }
};

export const create = async (req, res) => {
    try {
        const doc = {
            title: req.body.title,
            text: req.body.text,
            tags: req.body.tags,
            imageUrl: req.body.imageUrl,
            user: req.userId,
        }
        
        const post = await PostService.create(doc);

        res.json(post);

    } catch (error) {
        console.log('error: ', error);
        res.status(500).json({
            message: 'Не удалось создать запись',
        });
    }
};

export const update = async (req, res) => {
    try {
        const postId = req.params.id;
        const doc = {
            title: req.body.title,
            text: req.body.text,
            tags: req.body.tags,
            imageUrl: req.body.imageUrl,
            user: req.userId,
        };
        await PostService.update(postId, doc);
        
        res.json({
            message: 'Статья успешно обновлена'
        });

    } catch (error) {
        console.log('error: ', error);
        res.status(500).json({
            message: 'Не удалось обновить статью',
        });
    }
};

export const createComment = async (req, res) => {
    try {
        const postId = req.params.id;
        const comment = {
            commentText: req.body.commentText,
            user: req.userId,
            post: postId,
        };
        const updatedPost = await PostService.createComment(postId, comment);

        res.json(updatedPost);

    } catch (error) {
        console.log('error: ', error);
        res.status(500).json({
            message: 'Не удалось добавить комментарий',
        });
    }
};

export const fileUpload = (req, res) => {
    res.json({
        url: `uploads/${req.file.filename}`,
    })
};

export const remove = async (req, res) => {
    try {
        const postId = req.params.id;
        await PostService.remove(postId);
        res.json({
            message: 'Статья успешно удалена'
        })

    } catch (error) {
        console.log('error: ', error);
        res.status(500).json({
            message: 'Не удалось удалить статью',
        });
    }
};

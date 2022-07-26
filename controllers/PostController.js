import PostModel from '../models/Post.js';
import CommentModel from '../models/Comment.js';
import UserModel from '../models/User.js';

export const getAll = async (req, res) => {
    try {
        const sort = req.query?.sort;
        const tags = req.query?.tags;

        const post = await PostModel
            .find(tags ? {tags: tags} : {})
            .sort(sort ? sort : '-createdAt')
            .populate('user')
            .exec();
        
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

        const posts = await PostModel
            .find(tagsReq ? {tags: tagsReq} : {})
            .sort(sort ? sort : '-createdAt')
            .limit(5)
            .exec();

        const tags = [...new Set(posts
            .map(post => post.tags)
            .flat()
            .slice(0, 5))];

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

        const posts = await PostModel
            .find(tagsReq ? {tags: tagsReq} : {})
            .sort(sort ? sort : '-createdAt')
            .limit(5)
            .populate({
                path: 'comments',
                populate: {path: 'user'}
            })
            .exec();

        const comments = posts
            .map(post => post.comments)
            .flat()
            .sort((a, b) => new Date(b.createdAt).valueOf() - new Date(a.createdAt).valueOf())
            .slice(0, 5);

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
        PostModel.findByIdAndUpdate(
            { _id: postId },
            { $inc: { viewsCount: 1 } },
            { returnDocument: 'after' },
            (err, doc) => {
                if (err) {
                    console.log(err);
                    return res.status(500).json({
                        message: 'Не удалось вернуть статью',
                    });
                }

                if (!doc) {
                    return res.status(404).json({
                        message: 'Статья не найдена',
                    });
                }

                res.json(doc);
            }
        ).populate('user')
        .populate({
            path: 'comments',
            populate: {path: 'user'}
        });
        
    } catch (error) {
        console.log('error: ', error);
        res.status(500).json({
            message: 'Не удалось получить статью',
        });
    }
};

export const create = async (req, res) => {
    try {
        const doc = new PostModel({
            title: req.body.title,
            text: req.body.text,
            tags: req.body.tags,
            imageUrl: req.body.imageUrl,
            user: req.userId,
        })

        const post = await doc.save();

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
        await PostModel.findByIdAndUpdate(
            { _id: postId },
            {
                title: req.body.title,
                text: req.body.text,
                tags: req.body.tags,
                imageUrl: req.body.imageUrl,
                user: req.userId,
            }
        );
        
        res.json({
            message: 'Статья успешно обновлена'
        })

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

        const doc = new CommentModel({
            commentText: req.body.commentText,
            user: req.userId,
            post: postId,
        });

        const newComment = await doc.save();

        const { comments } = await PostModel.findById(postId);

        await PostModel.findByIdAndUpdate(
            { _id: postId },
            {
                comments: [...comments, newComment._id]
            }
        );

        const updatedPost = await PostModel.findById(postId).populate('comments');

        res.json(updatedPost);

    } catch (error) {
        console.log('error: ', error);
        res.status(500).json({
            message: 'Не удалось добавить комментарий',
        });
    }
};

export const remove = async (req, res) => {
    try {
        const postId = req.params.id;
        PostModel.findByIdAndRemove(
            { _id: postId },
            (err, doc) => {
                if (err) {
                    return res.status(500).json({
                        massage: 'Не удалось удалить статью'
                    })
                }

                if (!doc) {
                    return res.status(404).json({
                        message: 'Статья не найдена'
                    })
                }

                res.json({
                    message: 'Статья успешно удалена'
                })
            }
        );
        
    } catch (error) {
        console.log('error: ', error);
        res.status(500).json({
            message: 'Не удалось удалить статью',
        });
    }
};

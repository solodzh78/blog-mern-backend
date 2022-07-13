import PostModel from '../models/Post.js';

export const getAll = async (req, res) => {
    try {
        const post = await PostModel.find().populate('user').exec();
        
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
        const posts = await PostModel.find().limit(5).exec();
        const tags = [...new Set(posts
            .map(post => post.tags)
            .flat()
            .slice(0, 5))];
        res.json(tags);

    } catch (error) {
        console.log('error: ', error);
        res.status(500).json({
            message: 'Не удалось получить статьи',
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
                    console.log('error: ', error);
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
        );
        
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

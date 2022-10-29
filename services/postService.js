import PostModel from '../models/Post.js';
import CommentModel from '../models/Comment.js';


const userRespObj = {
    path: 'user',
    select: ['fullName', 'avatarUrl']
};


export const getAll = async(sort, tags) => {
    const post = await PostModel
    .find(tags ? {tags: tags} : {})
    .sort(sort ? sort : '-createdAt')
    .populate(userRespObj)
    .exec();
    return post;
}

export const getLastTags = async(sort, tagsReq) => {
    const posts = await PostModel
        .find(tagsReq ? { tags: tagsReq } : {})
        .sort(sort ? sort : '-createdAt')
        .limit(5)
        .exec();

    const tags = [...new Set(posts
        .map(post => post.tags)
        .flat()
        .slice(0, 5))];

    return tags;
}

export const getLastComments = async(sort, tagsReq) => {
    const posts = await PostModel
        .find(tagsReq ? { tags: tagsReq } : {})
        .sort(sort ? sort : '-createdAt')
        .limit(5)
        .populate({
            path: 'comments',
            populate: userRespObj
        })
        .exec();

    const comments = posts
        .map(post => post.comments)
        .flat()
        .sort((a, b) => new Date(b.createdAt).valueOf() - new Date(a.createdAt).valueOf())
        .slice(0, 5);

    return comments;
}
export const getOne = async(postId) => {

    const post = await PostModel.findByIdAndUpdate(
        {_id: postId},
        { $inc: { viewsCount: 1 } },
        { returnDocument: 'after' })
        .populate(userRespObj)
        .populate({
            path: 'comments',
            populate: userRespObj
        });
    return post;
}

export const create = async(doc) => {
    const newdoc = new PostModel(doc)
    const post = await newdoc.save();
    return post;
}

export const update = async(postId, doc) => {
    await PostModel.findByIdAndUpdate(
        { _id: postId },
        doc
    );
}

export const createComment = async(postId, comment) => {
    const doc = new CommentModel(comment);
    const newComment = await doc.save();

    const { comments } = await PostModel.findById(postId);

    const updatedPost = await PostModel.findByIdAndUpdate(
        { _id: postId },
        { comments: [...comments, newComment._id] },
        { returnDocument: 'after' },
    )
    .populate(userRespObj)
    .populate({
        path: 'comments',
        populate: userRespObj
    });
    return updatedPost;
}

export const remove = async(postId) => {
    await PostModel.findByIdAndRemove(
        { _id: postId },
        (err, doc) => {
            if (err) {
                throw new Error('Не удалось удалить статью')
                }

            if (!doc) {
                throw new Error('Статья не найдена')
                }
        }
    );

}
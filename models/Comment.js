import mongoose from 'mongoose';
import Post from './Post.js';
import User from './User.js';

const CommentSchema = new mongoose.Schema({
    commentText: {
        type: String,
        required: true,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: User,
        required: true,
    },
    post: {
        type: String,
        required: true,
    }
},
{
    timestamps: true,    
});

export default mongoose.model('Comment', CommentSchema);
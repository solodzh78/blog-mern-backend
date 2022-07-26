import mongoose from 'mongoose';
import User from './User.js';
import Comment from './Comment.js';

const PostSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    text: {
        type: String,
        required: true,
    },
    tags: {
        type: Array,
        default: [],
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: User,
        required: true,
    },
    viewsCount: {
        type: Number,
        default: 0,
    },
    comments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: Comment,
    }],
    imageUrl: String,
},
{
    timestamps: true,    
});

export default mongoose.model('Post', PostSchema);
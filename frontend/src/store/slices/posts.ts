import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import axios from '../../axios';

export type UserType = {
    _id: string;
    avatarUrl: string;
    fullName: string;
};

export type CommentType = {
    _id: string;
    post: string;
    user: UserType;
    commentText: string;
}

export  type PostType = {
    _id: string;
    title: string;
    text?: string;
    createdAt: string;
    imageUrl: string;
    user: UserType;
    viewsCount: number;
    commentsCount: number;
    tags: string[];
    comments: CommentType[];
};

export enum StatusEnum {
	LOADING = 'loading',
	SUCCESS = 'success',
	ERROR = 'error',
};

export const fetchPosts = createAsyncThunk(
    "posts/fetchPosts",
    async (searchParams: string) => {
		const { data } = await axios.get<PostType[]>(`/posts${searchParams}`);
		return data;
	}
);

export const fetchTags = createAsyncThunk(
    "posts/fetchTags",
    async (searchParams: string) => {
		const { data } = await axios.get<string[]>(`/tags${searchParams}`);
		return data;
	}
);

export const fetchComments = createAsyncThunk(
    "posts/fetchComments",
    async (searchParams: string) => {
		const { data } = await axios.get<CommentType[]>(`/comments${searchParams}`);
		return data;
	}
);



export const fetchRemovePost = createAsyncThunk(
    "posts/fetchRemovePost", async (id: string) => {
        await axios.delete(`/posts/${id}`);
        return id;
    }
);

const initialState = {
    posts: {
		items:[] as PostType[],
		status: StatusEnum.LOADING
	},
	tags: {
		items: [] as string[],
		status: StatusEnum.LOADING
	},
	comments: {
		items: [] as CommentType[],
		status: StatusEnum.LOADING
	},
};

export const postsSlice = createSlice({
    name: 'posts',
    initialState,
    reducers: {},
	extraReducers: (builder) => {
        builder
        // Получение статей
            .addCase(fetchPosts.pending, (state) => {
				state.posts.items = [];
                state.posts.status = StatusEnum.LOADING;
            })
            .addCase(fetchPosts.fulfilled, (state, { payload }) => {
				state.posts.items = payload;
                state.posts.status = StatusEnum.SUCCESS;
            })
            .addCase(fetchPosts.rejected, (state) => {
                state.posts.items = [];
                state.posts.status = StatusEnum.ERROR;
            })
        // Получение тэгов
            .addCase(fetchTags.pending, (state) => {
				state.tags.items = [];
                state.tags.status = StatusEnum.LOADING;
            })
            .addCase(fetchTags.fulfilled, (state, { payload }) => {
				state.tags.items = payload;
                state.tags.status = StatusEnum.SUCCESS;
            })
            .addCase(fetchTags.rejected, (state) => {
                state.tags.items = [];
                state.tags.status = StatusEnum.ERROR;
            })
        // Получение комментариев
            .addCase(fetchComments.pending, (state) => {
				state.comments.items = [];
                state.comments.status = StatusEnum.LOADING;
            })
            .addCase(fetchComments.fulfilled, (state, { payload }) => {
				state.comments.items = payload;
                state.comments.status = StatusEnum.SUCCESS;
            })
            .addCase(fetchComments.rejected, (state) => {
                state.comments.items = [];
                state.comments.status = StatusEnum.ERROR;
            })
        // Удаление статьи
            .addCase(fetchRemovePost.fulfilled, (state, action: PayloadAction<string>) => {
				state.posts.items = state.posts.items.filter((item) => item._id!==action.payload);
                state.tags.status = StatusEnum.LOADING;
            })
            .addCase(fetchRemovePost.rejected, (state) => {
                state.tags.status = StatusEnum.ERROR;
            })
    },
});

// Action creators are generated for each case reducer function
export default postsSlice.reducer;
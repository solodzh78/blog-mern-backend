import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from '../../axios';

type UserType = {
    avatarUrl: string;
    fullName: string;
};

export  type PostType = {
    _id: number;
    title: string;
    createdAt: string;
    imageUrl: string;
    user: UserType;
    viewsCount: number;
    commentsCount: number;
    tags: string[];
};

export enum StatusEnum {
	LOADING = 'loading',
	SUCCESS = 'success',
	ERROR = 'error',
};

export const fetchPosts = createAsyncThunk(
    "posts/fetchPosts",
    async () => {
		const { data } = await axios.get<PostType[]>('/posts');
		return data;
	}
);

export const fetchTags = createAsyncThunk(
    "posts/fetchTags",
    async () => {
		const { data } = await axios.get<string[]>('/tags');
		return data;
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
};

export const postsSlice = createSlice({
    name: 'posts',
    initialState,
    reducers: {},
	extraReducers: (builder) => {
        builder
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
    },
});

// Action creators are generated for each case reducer function

export default postsSlice.reducer;
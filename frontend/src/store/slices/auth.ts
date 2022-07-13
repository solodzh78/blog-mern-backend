import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../axios';
import { StatusEnum } from './posts';

export const fetchUserData = createAsyncThunk(
    "auth/fetchUserData",
    async (params: any) => {
		const { data } = await axios.get('/auth/login', params);
		return data;
	}
);

const initialState = {
    data: null as any,
    status: StatusEnum.LOADING
};

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {},
	extraReducers: (builder) => {
        builder
            .addCase(fetchUserData.pending, (state) => {
				state.data = null;
                state.status = StatusEnum.LOADING;
            })
            .addCase(fetchUserData.fulfilled, (state, { payload }) => {
				state.data = payload;
                state.status = StatusEnum.SUCCESS;
            })
            .addCase(fetchUserData.rejected, (state) => {
                state.data = null;
                state.status = StatusEnum.ERROR;
            })
    },
});

export default authSlice.reducer;
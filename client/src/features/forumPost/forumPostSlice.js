import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import forumPostService from "./forumPostService";


export const getAllForumPosts = createAsyncThunk(
    'forumPosts/getAllForumPosts',
    async (_, thunkAPI) => {
        try {
            return await forumPostService.getAllForumPosts();
        } catch (error) {
            const message =
                (error.response &&
                    error.response.data &&
                    error.response.data.message) ||
                error.message ||
                error.toString();

            return thunkAPI.rejectWithValue(message);
        }
    }
)

export const deleteForumPost = createAsyncThunk(
    'forumPosts/deleteForumPost',
    async (forumPostId, thunkAPI) => {
        try {
            const storedAccount = JSON.parse(localStorage.getItem('account'));
			const token = storedAccount.data.token;
			return await forumPostService.deleteForumPost(token, forumPostId);
        } catch (error) {
            const message =
				(error.response &&
					error.response.data &&
					error.response.data.message) ||
				error.message ||
				error.toString();

			return thunkAPI.rejectWithValue(message);
        }
    }
)

const initialState = {
    forumPosts: [],
    isLoading: false,
    isError: false,
    isSuccess: false,
    message: '',
}

export const forumPostSlice = createSlice({
    name: 'forumPosts',
    initialState,
    reducers: {
        reset: (state) => {
            state.isError = false;
            state.isLoading = false;
            state.isSuccess = false;
            state.message = '';
        },
    },

    extraReducers: (builder) => {
        builder
            .addCase(getAllForumPosts.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getAllForumPosts.fulfilled, (state, account) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.forumPosts = account.payload;
            })
            .addCase(getAllForumPosts.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
                state.forumPosts = null;
            })
            .addCase(deleteForumPost.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(deleteForumPost.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.forumPosts = state.forumPosts.filter(
                    (post) => String(post._id) !== String(action.payload));
            })
            .addCase(deleteForumPost.rejected, (state, action) => {
				state.isLoading = false;
				state.isError = true;
				state.message = action.payload;
			})
    }
});

export const { reset } = forumPostSlice.actions;
export default forumPostSlice.reducer;
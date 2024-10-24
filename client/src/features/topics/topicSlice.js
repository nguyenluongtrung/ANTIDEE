import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import topicService from './topicService';

export const getAllTopics = createAsyncThunk(
	'topics/getAllTopics',
	async (_, thunkAPI) => {
		try {
			return await topicService.getAllTopics();
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
);

export const createTopic = createAsyncThunk(
    'topics/createTopic',
    async (topicData, thunkAPI) => {
        try {
            const storedAccount = JSON.parse(localStorage.getItem('account'));
            const token = storedAccount?.data?.token; 
            if (!token) {
                throw new Error('No token found');
            }
            return await topicService.createTopic(topicData);
        } catch (error) {
            const message =
                (error.response && error.response.data && error.response.data.message) ||
                error.message ||
                error.toString();

            return thunkAPI.rejectWithValue(message);
        }
    }
);

const initialState = {
    topics: [],
    isLoading: false,
    isError: false,
    isSuccess: false,
    message: '',
};

const topicSlice = createSlice({
    name: 'topics',
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
            .addCase(getAllTopics.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getAllTopics.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.topics = action.payload; // Cập nhật danh sách topic
            })
            .addCase(getAllTopics.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            .addCase(createTopic.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(createTopic.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.topics.push(action.payload); // Thêm topic mới vào danh sách
            })
            .addCase(createTopic.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            });
    },
});

export const { reset } = topicSlice.actions;
export default topicSlice.reducer;

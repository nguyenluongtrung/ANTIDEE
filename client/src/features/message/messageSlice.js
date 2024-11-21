import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import messageService from "./messageService";

export const createMessage = createAsyncThunk(
    "messages/createMessage",
    async (messageData, thunkAPI) => {
        try {
            const storedAccount = JSON.parse(localStorage.getItem("account"));
            const token = storedAccount.data.token;
            return await messageService.createMessage(
                token,
                messageData
            );
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

//get message by chat id
export const getMessage = createAsyncThunk(
    "messages/getMessage",
    async (chatId, thunkAPI) => {
        try {
            const storedAccount = JSON.parse(localStorage.getItem('account'));
            const token = storedAccount?.data?.token;
            return await messageService.getMessage(token, chatId);

        } catch (error) {
            const message =
                (error.response && error.response.data && error.response.data.message) ||
                error.message ||
                error.toString();

            return thunkAPI.rejectWithValue(message);

        }
    }
);
export const getAllMessage = createAsyncThunk(
    "messages/getAllMessage",
    async (_, thunkAPI) => {
        try {
            return await messageService.getAllMessage();
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

const initialState = {
    messages: [],
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: "",
};

export const messageSlice = createSlice({
    name: 'messages',
    initialState,
    reducers: {
        reset: (state) => {
            state.isError = false;
            state.isLoading = false;
            state.isSuccess = false;
            state.message = "";
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getAllMessage.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getAllMessage.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.messages = action.payload;
            })
            .addCase(getAllMessage.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            .addCase(createMessage.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(createMessage.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.messages.push(action.payload);
            })
            .addCase(createMessage.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            .addCase(getMessage.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getMessage.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.messages = action.payload;
            })
            .addCase(getMessage.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
                state.messages = []
            });
    },
});
export const { reset } = messageSlice.actions;
export default messageSlice.reducer;

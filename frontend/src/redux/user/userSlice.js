import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    currentUser: null,
    error: null,
    loading: false,
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        signInStart: (state) => {
            state.loading = true;
        },
        signInSuccess: (state, action) => {
            // Access the user object from the response data
            console.log("Action Payload:", action.payload);
            state.currentUser = action.payload.data.user; // Adjusted to access user correctly
            state.loading = false;
            state.error = null;
        },
        signInFailure: (state, action) => {
            state.error = action.payload;
            state.loading = false;
        },
        logout: (state) => {
            state.currentUser = null; // Reset the user state on logout
        },
    }
});

// Export actions
export const { signInFailure, signInStart, signInSuccess,logout } = userSlice.actions;

// Export reducer
export default userSlice.reducer;

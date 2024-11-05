import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    currentUser: null,
    contacts: [], // Initialize contacts array
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
            state.currentUser = action.payload.data.user; // Access user correctly
            state.loading = false;
            state.error = null;
        },
        signInFailure: (state, action) => {
            state.error = action.payload;
            state.loading = false;
        },
        logout: (state) => {
            state.currentUser = null; // Reset the user state on logout
            state.contacts = []; // Optionally clear contacts on logout
        },
        addContact: (state, action) => {
            state.contacts = [...state.contacts, action.payload]; // This is fine as long as state.contacts is an array
        },
        
    }
});

// Export actions
export const { signInFailure, signInStart, signInSuccess, logout, addContact } = userSlice.actions;

// Export reducer
export default userSlice.reducer;

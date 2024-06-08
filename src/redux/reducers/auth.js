/* eslint-disable no-unused-vars */
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    user: null,
    loader: true
}
const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setUser: (state, action) => {
            state.user = action.payload;
            state.loader = false;
        },
        nullUser: (state) => {
            state.user = null;
            state.loader = false;
        },
    }
});

export default authSlice;
export const {setUser, nullUser} = authSlice.actions;
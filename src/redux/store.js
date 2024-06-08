/* eslint-disable no-unused-vars */
import {configureStore} from "@reduxjs/toolkit"
import authSlice from "./reducers/auth"
import api from "./api/api";
import miscSlice from "./reducers/misc"
import chatSlice from "./reducers/chat"

const store = configureStore({
    reducer: {
        [authSlice.name]: authSlice.reducer,
        [chatSlice.name]: chatSlice.reducer,
        [miscSlice.reducerPath]: miscSlice.reducer,
        [api.reducerPath]: api.reducer,
    },
    middleware: (mid) => [...mid(),api.middleware]
});

export default store;
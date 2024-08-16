// store.js
import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice"; // Đảm bảo đường dẫn đúng

const store = configureStore({
  reducer: {
    user: userReducer,
  },
});

export default store;

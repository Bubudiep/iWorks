// userSlice.js
import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: {
    info: null,
    loading: false,
  },
  reducers: {
    setUserInfo: (state, action) => {
      state.info = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
  },
});
console.log(userSlice);
export const { setUserInfo, setLoading } = userSlice.actions;
export default userSlice.reducer;

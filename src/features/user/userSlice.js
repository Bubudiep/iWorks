import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
};
const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    getUser: (state, action) => {
      state.loaded = true;
      state.loading = false;
      state.user = action.payload;
    },
  },
});
export default userSlice;

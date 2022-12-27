import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  timeValue: 10,
};

const userSlice = createSlice({
  name: "todos",
  initialState,
  reducers: {
    addTimeValue: (state, action) => {
      state.timeValue = action.payload;
    },
  },
});

export const { addTimeValue } = userSlice.actions;

export default userSlice.reducer;

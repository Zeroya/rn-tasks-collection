import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  timeValue: 10,
  callChecker: false,
  callName: "",
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    addTimeValue: (state, action) => {
      state.timeValue = action.payload;
    },
    changeCallChecker: (state) => {
      state.callChecker = !state.callChecker;
    },
    saveCallName: (state, action) => {
      state.callName = action.payload;
    },
  },
});

export const { addTimeValue, changeCallChecker, saveCallName } = userSlice.actions;

export default userSlice.reducer;

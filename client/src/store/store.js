import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./reducers/UserSlice";

export const store = configureStore({
  reducer: {
    user: userSlice,
  },
});

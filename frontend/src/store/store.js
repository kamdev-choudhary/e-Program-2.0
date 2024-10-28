import { configureStore } from "@reduxjs/toolkit";
import rootReducer from "./reducers"; // You'll create this next

const store = configureStore({
  reducer: rootReducer,
});

export default store;

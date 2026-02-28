import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import { authApi } from "../services/authApi";
import { hodApi } from "../services/hodapi"; 
import { teacherApi } from "../services/teacherApi"; 
import { studentApi } from "../services/studentApi"; 

export const store = configureStore({
  reducer: {
    auth: authReducer, 
    [authApi.reducerPath]: authApi.reducer, 
    [hodApi.reducerPath]: hodApi.reducer,
    [teacherApi.reducerPath]: teacherApi.reducer,
    [studentApi.reducerPath]: studentApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      authApi.middleware, 
      hodApi.middleware ,
      teacherApi.middleware,
      studentApi.middleware
    ),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
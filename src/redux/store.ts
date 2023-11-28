import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./reducers/auth.reducer";
import socketReducer from "./reducers/socket.reducer";
import chatReducer from "./reducers/chat.reducer";

export const store = configureStore({
  reducer: {
    chats: chatReducer,
    ws: socketReducer,
    auth: authReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;

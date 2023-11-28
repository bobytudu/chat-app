import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

// Define a type for the slice state
interface ChatSliceType {
  chats: any;
}

// Define the initial state using that type
const initialState: ChatSliceType = {
  chats: [],
};

export const chatSlice = createSlice({
  name: "socket",
  initialState,
  reducers: {
    setChat: (state, payload: PayloadAction<any>) => {
      state.chats = payload.payload;
    },
  },
});

export const { setChat } = chatSlice.actions;

export default chatSlice.reducer;

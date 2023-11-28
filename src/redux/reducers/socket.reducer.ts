import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { Socket, SocketOptions, ManagerOptions } from "socket.io-client";

interface SocketSliceType {
  ws: null | Socket<SocketOptions, ManagerOptions>;
}

const initialState: SocketSliceType = {
  ws: null,
};

export const socketSlice = createSlice({
  name: "socket",
  initialState,
  reducers: {
    setSocket: (state, payload: PayloadAction<any>) => {
      state.ws = payload.payload;
    },
  },
});

export const { setSocket } = socketSlice.actions;

export default socketSlice.reducer;

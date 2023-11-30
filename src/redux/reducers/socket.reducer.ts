import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { Socket } from "socket.io-client";

interface SocketSliceType {
  ws: null | Socket<any>;
  id: null | string;
  connected: boolean;
}

const initialState: SocketSliceType = {
  ws: null,
  id: null,
  connected: false,
};

export const socketSlice = createSlice({
  name: "socket",
  initialState,
  reducers: {
    setSocket: (state, payload: PayloadAction<any>) => {
      state.ws = payload.payload.ws;
      state.id = payload.payload.id;
      state.connected = payload.payload.connected;
    },
  },
});

export const { setSocket } = socketSlice.actions;

export default socketSlice.reducer;

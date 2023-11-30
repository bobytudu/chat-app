import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { User } from "utils/types/auth";

// Define a type for the slice state
interface AuthState {
  value: number;
  user: User | null;
  users: User[];
  loading: boolean;
}

// Define the initial state using that type
const initialState: AuthState = {
  value: 0,
  user: null,
  loading: true,
  users: [],
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    stopLoading: (state) => {
      state.loading = false;
    },
    setUser: (state, payload: PayloadAction<any>) => {
      state.user = payload.payload;
    },
    setUsers: (state, payload: PayloadAction<any>) => {
      state.users = payload.payload;
    },
    logout: (state) => {
      state.user = null;
    },
  },
});

export const { stopLoading, setUser, logout, setUsers } = authSlice.actions;

// Other code such as selectors can use the imported `RootState` type
// export const selectCount = ( state: RootState ) => state.counter.value

export default authSlice.reducer;

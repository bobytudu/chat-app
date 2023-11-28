import React from "react";
import { useAppDispatch } from "redux/hooks";
import { setSocket } from "redux/reducers/socket.reducer";
import { io } from "socket.io-client";

export default function WebsocketProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const dispatch = useAppDispatch();
  React.useEffect(() => {
    const socket = io("http://localhost:8000");
    socket.on("connect", () => {
      dispatch(setSocket(socket));
    });
    socket.on("disconnect", () => {
      console.log("disconnected");
      dispatch(setSocket(null));
    });
    socket.on("error", (err) => {
      console.log("error", err);
    });
    socket.on("message", (data) => {
      console.log("message", data);
    });
    socket.connect();
    return () => {
      socket.disconnect();
    };
  }, [dispatch]);

  return <div>{children}</div>;
}

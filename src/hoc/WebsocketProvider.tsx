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
    const socket = io("http://localhost:8000", {
      reconnection: true, // whether to reconnect automatically
      reconnectionAttempts: 5, // number of reconnection attempts before giving up
      reconnectionDelay: 1000, // initial delay (ms) before the first reconnection attempt
      reconnectionDelayMax: 5000, // maximum delay (ms) between reconnection attempts
      // randomizationFactor: 0.5, // randomization factor for the reconnection delays
    });
    socket.on("connect", () => {
      console.log("connected");
      dispatch(
        setSocket({
          ws: socket,
          id: socket.id,
          connected: true,
        })
      );
    });
    socket.on("disconnect", () => {
      console.log("disconnected");
      dispatch(
        setSocket({
          ws: null,
          id: "",
          connected: false,
        })
      );
    });
    socket.on("error", (err) => {
      console.log("error", err);
    });
    socket.on("reconnect_attempt", () => {
      console.log("reconnect_attempt");
    });
    socket.on("reconnect", () => {
      console.log("reconnect");
      dispatch(
        setSocket({
          ws: socket,
          id: socket.id,
          connected: true,
        })
      );
    });
    socket.connect();
    return () => {
      socket.disconnect();
    };
  }, [dispatch]);

  return <div>{children}</div>;
}

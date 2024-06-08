/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import {io} from "socket.io-client"
import {server} from "./constants/config"
import { createContext, useMemo, useContext } from "react";

const SocketContext = createContext();
const getSocket = () => useContext(SocketContext);

const SocketProvider = ({ children }) => {
    const socket = useMemo(() => io(server, { withCredentials: true }), []);
  
    return (
      <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
    );
};

export { SocketProvider, getSocket };
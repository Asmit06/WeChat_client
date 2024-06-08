/* eslint-disable no-unused-vars */
import React from 'react'
import AppLayout from "../components/layout/AppLayout";
import { Box, Typography } from "@mui/material";
import { useSelector } from 'react-redux';
import { useAvailableFriendsQuery } from '../redux/api/api';
import { getSocket } from '../socket';
import { CHAT_JOINED } from '../constants/events';
//import { grayColor } from "../constants/color";

const Home = () => {
  const { user } = useSelector((state) => state.auth);
  const {data} = useAvailableFriendsQuery("");
  const members = data?.friends.map((friend)=>friend._id);
  //console.log(friendsId);
  const socket = getSocket();
  socket.emit(CHAT_JOINED, { userId: user._id, members });
  return (
    <Box bgcolor='#f1fafb' height={"100%"}>
      <Typography p={"2rem"} variant="h5" textAlign={"center"}>
        Select a chat to start messaging
      </Typography>
    </Box>
  )
}

export default AppLayout()(Home);

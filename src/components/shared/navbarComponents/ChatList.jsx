/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React from 'react'
import { Stack , Grid, Typography} from "@mui/material";
import ChatItem from '../ChatItem';

const ChatList = ({w = "100%", chats = [], chatId, onlineUsers = [], newMessagesAlert = [{ chatId: "", count: 0 }], handleDeleteChat, searchTerm}) => {
  chats = chats.filter(chat =>chat?.name.toLowerCase().includes(searchTerm.toLowerCase()));
  return (
    // 
    //<Grid container direction="column" overflow={"auto"}>
    <Stack width={w} direction={"column"} overflow={"auto"} height={"100%"} bgcolor={"#f1fafb"}>
      {chats.map((data, index) => {
        const { avatar, _id, name, groupChat, members } = data;

        const newMessageAlert = newMessagesAlert.find(
          ({ chatId }) => chatId === _id
        );

        const isOnline = members?.some((member) =>
          onlineUsers.includes(member)
        );

        return (
          <ChatItem 
            index={index}
            newMessageAlert={newMessageAlert}
            isOnline={isOnline}
            avatar={avatar}
            name={name}
            _id={_id}
            key={_id}
            groupChat={groupChat}
            sameSender={chatId === _id}
            handleDeleteChat={handleDeleteChat}
          />
        );
      })}
      
      </Stack>
    //</Grid>
  );
}

export default ChatList
/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { Fragment, useCallback,useEffect, useRef, useState, } from "react";
import AppLayout from "../components/layout/AppLayout";
import {Box, IconButton, Skeleton, Stack } from "@mui/material";
import {
  AttachFile as AttachFileIcon,
  Send as SendIcon,
} from "@mui/icons-material";
import { useInfiniteScrollTop } from "6pp";
import { useNavigate } from "react-router-dom";
import { TypingLoader } from "../components/layout/Loaders"
import { InputBox } from "../components/shared/StyledComponents";
import {sampleMessage} from "../constants/seedData"
import MessageComponent from "../components/shared/MessageComponent";
import FileMenu from "../components/dialogs/FileMenu";
import { getSocket } from "../socket";
import { setIsFileMenu } from "../redux/reducers/misc";
import { useDispatch } from "react-redux";
import { ALERT, CHAT_JOINED, CHAT_LEAVED, NEW_MESSAGE } from "../constants/events";
import { useAvailableFriendsQuery, useChatDetailsQuery, useGetMessagesQuery } from "../redux/api/api";
import { useErrors, useSocketEventsHandler } from "../hooks/hooks";
import { removeNewMessagesAlert } from "../redux/reducers/chat";

const Chat = ({chatId,user}) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const containerRef = useRef(null);
  const bottomRef = useRef(null);
  const socket = getSocket();

  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [page, setPage] = useState(1);
  const [fileMenuAnchor, setFileMenuAnchor] = useState(null);

  
//---------------------------------attachments handler-------------------------------//
  
//--------------------------------end attachments handler------------------------------//

  //-------------------------------get chat details + message scroll--------------------//
  
  const chatDetails = useChatDetailsQuery({chatId, skip: !chatId});
  //console.log(chatDetails?.data);
  const members = chatDetails?.data?.chat?.members;
  const oldMessagesAll = useGetMessagesQuery({chatId, page});

  const {data: oldMessages, setData: setOldMessages } = useInfiniteScrollTop(
    containerRef, 
    oldMessagesAll.data?.totalPages,
    page,
    setPage,
    oldMessagesAll.data?.messages
  );

  const errors = [
    { isError: chatDetails.isError, error: chatDetails.error },
    { isError: oldMessagesAll.isError, error: oldMessagesAll.error },
  ];
  //-------------------------------end chat details + message scroll--------------------//

  //---------------------------------send message-------------------------//
  const messageOnChange = (e) => {
    setMessage(e.target.value);
  }

  const handleFileOpen = (e) => {
    dispatch(setIsFileMenu(true));
    setFileMenuAnchor(e.currentTarget);
  };
  
  const submitHandler = (e) => {
    e.preventDefault();
    if (!message.trim()) return;
    //emits message to server
    socket.emit(NEW_MESSAGE, {chatId, members, message});
    setMessage("");
  };
  //----------------------------------end send message..................//
  
  //----------------------------------Listeners-----------------------------------//
  const {data} = useAvailableFriendsQuery("");
  useEffect(() => {
    const members = data?.friends.map((friend)=>friend._id);
    socket.emit(CHAT_JOINED, { userId: user._id, members });
    dispatch(removeNewMessagesAlert(chatId));

    return () => {
      setMessages([]);
      setMessage("");
      setOldMessages([]);
      setPage(1);
      socket.emit(CHAT_LEAVED, { userId: user._id, members });
    };
  }, [chatId]);

  useEffect(() => {
    if (bottomRef.current)
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (chatDetails.isError) return navigate("/");
  }, [chatDetails.isError]);

  const newMessageListner = useCallback((data)=>{
    if(data.chatId !== chatId) return;
    setMessages((prev)=>[...prev, data.message]);
    console.log(data);
    }, [chatId]);
  
  const alertListner = useCallback((data)=> {
    if(data.chatId !== chatId) return;
    const messageForAlert = {
      content: data.message,
      sender: {
        _id: "asssddaaaaaa",
        name: "Admin",
      },
      chat: chatId,
      createdAt: new Date().toISOString(),
    };
    setMessages((prev)=> [...prev, messageForAlert]);
  }, [chatId]);

  const eventArr = {
    [ALERT]: alertListner,
    [NEW_MESSAGE]: newMessageListner
  };

  useSocketEventsHandler(socket, eventArr);

  useErrors(errors);

  //----------------------------------Listeners-----------------------------------//
  //console.log()
  const allMessages = [...oldMessages, ...messages];
  //console.log(allMessages);
  return chatDetails.isLoading? <Skeleton/> : (
    <Fragment>
      <Stack boxSizing={"border-box"} padding={"1rem"} spacing={"1rem"} bgcolor={"#9cd3d3"} height={"90%"}
             ref={containerRef} sx={{overflowX: "hidden", overflowY: "auto",}}>   
        {allMessages?.map((i) => (
          <MessageComponent key={i._id} message={i} user={user} />
        ))}
        <div ref={bottomRef} /> 
      </Stack>

      <form style={{height: "10%"}} onSubmit={submitHandler}>
        <Stack direction={'row'} height={'100%'} padding={'1rem'} alignItems={'center'} position={'relative'} bgcolor={"#9cd3d3"}>
          <IconButton sx={{position: 'absolute', left: '1.5rem', rotate: '30deg'}} onClick={handleFileOpen}>
            <AttachFileIcon />
          </IconButton>
          <InputBox placeholder="Type Message Here..." value={message} onChange={messageOnChange} multiline />
          <IconButton type="submit" sx={{rotate: "-30deg", bgcolor: "#005792", 
            color: "white",marginLeft: "1rem",padding: "0.5rem","&:hover": { bgcolor: "error.dark",},}}>
              <SendIcon />
          </IconButton>
        </Stack>
      </form>
      <FileMenu anchorEl={fileMenuAnchor} chatId={chatId} />
    </Fragment>
  )
}

export default AppLayout()(Chat);
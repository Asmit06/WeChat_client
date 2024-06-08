/* eslint-disable react/display-name */
/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable no-unused-vars */
import React, { useCallback, useEffect, useRef, useState } from 'react'
import NavBar from "./NavBar"
import { useNavigate, useParams } from "react-router-dom";
import Title from "../shared/Title"
import {Skeleton , Grid, Drawer, Stack, TextField, InputAdornment, Typography} from "@mui/material"
import ChatList from '../shared/navbarComponents/ChatList';
import Profile from '../shared/navbarComponents/Profile';
import {samepleChats, sampleUsers} from "../../constants/seedData"
import { Search as SearchIcon } from "@mui/icons-material";
import { useChatDetailsQuery, useDeleteChatMutation, useLeaveGroupMutation, useMyChatsQuery } from '../../redux/api/api';
import { useDispatch, useSelector } from 'react-redux';
import { setIsDeleteMenu, setIsMobile, setSelectedDeleteChat } from "../../redux/reducers/misc"; 
import {useAsyncMutate, useErrors, useSocketEventsHandler} from "../../hooks/hooks"
import { getSocket } from '../../socket';
import { NEW_MESSAGE, NEW_MESSAGE_ALERT, NEW_REQUEST, ONLINE_USERS, REFETCH_CHATS } from '../../constants/events';
import {setNewMessagesAlert , incrementNotification} from "../../redux/reducers/chat"
const AppLayout = () => (WrappedComponent) => {
  const data = samepleChats;
  const getOtherMember = (members, userId) =>
    members.find((member) => member._id.toString() !== userId.toString());
  
  return (props) => {
    const params = useParams();
    const navigate = useNavigate();
    const chatId = params.chatId;

    const dispatch = useDispatch();

    const socket = getSocket();

    const [searchTerm, setSearchTerm] = useState("");
    const { isMobile } = useSelector((state)=>state.misc)
    const { user } = useSelector((state) => state.auth);
    
    const { newMessagesAlert } = useSelector((state) => state.chat);
    
    const {isLoading, data, isError, error, refetch} = useMyChatsQuery("");
    const [leaveGroup] = useAsyncMutate(useLeaveGroupMutation);
    const [deleteChat] = useAsyncMutate(useDeleteChatMutation);

    const [onlineUsers, setOnlineUsers] = useState([]);
    
    // const [friend, setFriend] = useState();
    // const [isGrp, setIsGrp] = useState(false);
    // const chatDetails = useChatDetailsQuery({
    //   chatId, populate: true
    // }, {skip: !chatId});

    // useEffect(()=>{
    //   const chatData = chatDetails.data;
    //   if (chatData) {
    //     setFriend(chatData?.chat?.members.find((member)=>member._id.toString() !== user._id.toString()));
    //     console.log(friend);
    //     setIsGrp(chatData?.chat?.groupChat);
    //   }
    //   //console.log(chatData);
    //   return () => {
    //     setFriend();
    //     setIsGrp(false);
    //   };
    // },[chatDetails.data]);


    useErrors([{ isError, error }]);

    const handleDeleteChat = (e, _id, groupChat) => {
      e.preventDefault();
      let confirmation;
      if(groupChat) {
        confirmation = window.confirm("Are you sure you want to leave this group?");
        if(confirmation){
          console.log("Leave grp", _id, groupChat);
          leaveGroup("Leaving Group", _id);
          navigate("/");
        }
      }else{
        confirmation = window.confirm("Are you sure you want to delete this chat? This change is permanent and irreversible!");
        if (confirmation) {
          console.log("Delete chat", _id, groupChat);
          
          deleteChat("Deleting chat", _id);
          navigate("/");
        }  
      }
    }

    const handleMobileClose = () => dispatch(setIsMobile(false));

    useEffect(()=>{
      localStorage.setItem(NEW_MESSAGE_ALERT, JSON.stringify(newMessagesAlert));
    }, [newMessagesAlert]);

    const newMessageAlertListener = useCallback(
      (data) => {
        if (data.chatId === chatId) return;
        dispatch(setNewMessagesAlert(data));
      },
      [chatId]
    );

    const newRequestListener = useCallback(() => {
      dispatch(incrementNotification());
    }, [dispatch]);

    const newRefetchListener = useCallback(() => {
      refetch();
      navigate("/");
    }, [refetch]);

    const onlineUsersListener = useCallback((data) => {
      setOnlineUsers(data);
    }, []);

    const eventArr = { 
      [NEW_MESSAGE_ALERT]: newMessageAlertListener,
      [NEW_REQUEST]: newRequestListener,
      [REFETCH_CHATS]: newRefetchListener,
      [ONLINE_USERS]: onlineUsersListener
    };
  
    useSocketEventsHandler(socket, eventArr);
    

    return (
        <>
            <Title />
            <NavBar />
            {isLoading ? <Skeleton/> : (
              <Drawer open={isMobile} onClose={handleMobileClose}>
                <TextField
                label=""
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                variant="outlined"
                size="small"
                fullWidth
                placeholder='Search a chat'
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
              />
                <ChatList
                  w="70vw"
                  chats={data?.chats}
                  chatId={chatId}
                  handleDeleteChat={handleDeleteChat}
                  searchTerm={searchTerm}
                  newMessagesAlert={newMessagesAlert}
                  onlineUsers={onlineUsers}
                />
              </Drawer>
            )}
            <Grid container height={"calc(100vh - 4rem)"} style={{ border: '1px solid #000' }} bgcolor={"#f1fafb"}>
              <Grid item sm={3} md={3} sx={{ display: { xs: "none", sm: "block" }, height: "100%", bgcolor: "#f1fafb"}}>
              {/* <Stack direction={"col"}> */}
              <TextField
                label=""
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                variant="outlined"
                size="small"
                fullWidth
                placeholder='Search a chat'
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
              />
              {/* </Stack> */}
              {isLoading ? (<Skeleton />) :
              (
                <ChatList chats={data?.chats} chatId={chatId} handleDeleteChat={handleDeleteChat}
                 searchTerm={searchTerm} newMessagesAlert={newMessagesAlert} onlineUsers={onlineUsers}/>
              )}
                
              </Grid>
              <Grid item xs={12} sm={9} md={5} lg={6} height={"107%"}>
                <WrappedComponent {...props} chatId={chatId} user={user} xs={{bgcolor: "white"}}/>
              </Grid>
              <Grid item md={4} lg={3} height={"107%"} sx={{ display: { xs: "none", md: "block" }, padding: "2rem", bgcolor: "rgba(0,0,0,0.85)" }}>
              <Profile user={user}/>

                {/* {
                  chatId && isGrp? (
                    <Typography bgcolor={'white'}> This is a group </Typography>
                  ) :chatId && !isGrp? (
                    <Profile user={friend}/>
                  ) : <Profile user={user}/>
                } */}
              </Grid>
              
            </Grid>
        </>
    );
  };
};


export default AppLayout
/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { Suspense, lazy, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { AppBar, Backdrop,
  Badge,
  Box,
  IconButton,
  Toolbar,
  Tooltip,
  Typography,
} from "@mui/material";
import {
  setIsMobile,
  setIsNewGroup,
  setIsNotification,
  setIsSearch,
} from "../../redux/reducers/misc";
import {
  Add as AddIcon,
  Menu as MenuIcon,
  Search as SearchIcon,
  Group as GroupIcon,
  Logout as LogoutIcon,
  Notifications as NotificationsIcon,
} from "@mui/icons-material";
import Cookies from 'js-cookie';
import { useDispatch, useSelector } from "react-redux";
import { nullUser } from "../../redux/reducers/auth";
import axios from "axios";
import { server } from "../../constants/config";
import { resetNotificationCount } from "../../redux/reducers/chat";

const SearchDialog = lazy(() => import("../shared/navbarComponents/Search"));
const NotifcationDialog = lazy(() => import("../shared/navbarComponents/Notifications"));
const NewGroupDialog = lazy(() => import("../shared/navbarComponents/NewGroup"));

const NavBar = () => {
  // const [isSearch, setIsSearch] = useState(false);
  // const [isNotification, setIsNotification] = useState(false);
  // const [isNewGroup, setIsNewGroup] = useState(false);
  const { isSearch, isNotification, isNewGroup } = useSelector((state) => state.misc);
  const { notificationCount } = useSelector((state) => state.chat);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleMobile = () => dispatch(setIsMobile(true));
  // const openSearch = () => setIsSearch(!isSearch);
  // const openNewGroup = () => setIsNewGroup(!isNewGroup);
  // const openNotification = () => setIsNotification(!isNotification);
  const openSearch = () => dispatch(setIsSearch(true));
  const openNewGroup = () => {
    dispatch(setIsNewGroup(true));
  };
  const openNotification = () => {
    dispatch(setIsNotification(true));
    dispatch(resetNotificationCount());
  };
  const navigateToGroup = () => navigate("/groups");
  
  const config = {
    withCredentials: true,
    headers: {
      "Content-Type": "application/json",
    },
  };

  const logoutHandler = async () => {
    try{
      const { data } = await axios.post(`${server}/api/user/logout`,{}, config);
      //Cookies.remove('user');
      dispatch(nullUser());
      toast.success(data.message);
    }catch(err){
      console.log(err);
      toast.error(err?.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <>
      <Box>
        <AppBar position="static" sx={{bgcolor: "#005792"}}>
          <Toolbar>
            <Typography variant="h6" sx={{ display: { xs: "none", sm: "block" } }}>WeChat</Typography>
            <Box sx={{ display: { xs: "block", sm: "none" }}}>
              <IconButton color="inherit" onClick={handleMobile}> <MenuIcon /> </IconButton>
            </Box>
            <Box sx={{ flexGrow: 1 }}/>
            <Box>
              <IconBtn title={"Search"} icon={<SearchIcon />} onClick={openSearch}/>
              <IconBtn title={"New Group"} icon={<AddIcon />} onClick={openNewGroup}/>
              <IconBtn title={"Manage Groups"} icon={<GroupIcon />} onClick={navigateToGroup}/>
              <IconBtn title={"Friend Requests"} icon={<NotificationsIcon />} onClick={openNotification} value={notificationCount}/>
              <IconBtn title={"Logout"} icon={<LogoutIcon />} onClick={logoutHandler}/>
            </Box>
          </Toolbar>
        </AppBar>
      </Box>
      {isSearch && (<Suspense fallback={<Backdrop open />}><SearchDialog /></Suspense>)}
      {isNotification && (<Suspense fallback={<Backdrop open />}><NotifcationDialog /></Suspense>)}
      {isNewGroup && (<Suspense fallback={<Backdrop open />}><NewGroupDialog /></Suspense>)}

    </>
  )
}
const IconBtn = ({ title, icon, onClick, value }) => {
  return (
    <Tooltip title={title}>
      <IconButton color="inherit" size="large" onClick={onClick}>
        {value ? (
          <Badge badgeContent={value} color="error">
            {icon}
          </Badge>
        ) : (
          icon
        )}
      </IconButton>
    </Tooltip>
  );
};
export default NavBar
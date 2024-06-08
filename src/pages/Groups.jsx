/* eslint-disable no-unused-vars */
import React, { Suspense, lazy, memo, useEffect, useState } from "react";
import {
  Add as AddIcon,
  CameraAlt,
  CloudUploadOutlined,
  Delete as DeleteIcon,
  Done as DoneIcon,
  Edit as EditIcon,
  KeyboardBackspace as KeyboardBackspaceIcon,
  Menu as MenuIcon,
} from "@mui/icons-material";
import {
  Avatar,
  Backdrop,
  Box,
  Button,
  CircularProgress,
  Drawer,
  Grid,
  IconButton,
  Skeleton,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { useNavigate, useSearchParams } from "react-router-dom";
import {LoaderComponent} from "../components/layout/Loaders"
import AvatarCard from "../components/shared/AvatarCard"
import { HiddenInput, Link } from "../components/shared/StyledComponents";
import UserItem from "../components/shared/UserItem"
import GroupList from "../components/shared/GroupList"
import { samepleChats } from "../constants/seedData";
import {useAsyncMutate, useErrors} from "../hooks/hooks"
import { useChatDetailsQuery, useDeleteChatMutation, useMyGroupsQuery, useRemoveGroupMemberMutation, useRenameGroupMutation } from "../redux/api/api";
import { useDispatch, useSelector } from "react-redux";
import { setIsAddMember } from "../redux/reducers/misc";
import { useFileHandler } from "6pp";
import toast from "react-hot-toast";
import axios from "axios";
import { server } from "../constants/config";

const ConfirmDeleteDialog = lazy(() =>
  import("../components/dialogs/ConfirmDeleteDialog")
);

const AddMemberDialog = lazy(() =>
  import("../components/dialogs/AddMemberDialog")
);

const Groups = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const chatId = useSearchParams()[0].get("group");
  const { user } = useSelector((state) => state.auth);

  const [isEdit, setIsEdit] = useState(false);
  const [confirmDeleteDialog, setConfirmDeleteDialog] = useState(false);

  const [groupName, setGroupName] = useState("");
  const [groupNameUpdatedValue, setGroupNameUpdatedValue] = useState("");
  // const updateGroup = useRenameGroupMutation();
  const [grpImg, setGrpImg] = useState("");

  const [members, setMembers] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);

  const { isAddMember } = useSelector((state) => state.misc);

  const [smallScreenOpen, setsmallScreenOpen] = useState(false);
  const handleSmall = () => {
    setsmallScreenOpen((prev) => !prev);
  };
  const handleSmallClose = () => setsmallScreenOpen(false);

  const navigateBack = () => {
    navigate("/");
  };

  const avatar = useFileHandler("single");

  //-------------------------my group chats ----------------------//
    const myGroups = useMyGroupsQuery("");
    const groupDetails = useChatDetailsQuery({
      chatId, populate: true
    }, {skip: !chatId});
  
    const errors = [
      {
        isError: myGroups.isError,
        error: myGroups.error,
      },
      {
        isError: groupDetails.isError,
        error: groupDetails.error,
      },
    ];

    useErrors(errors);

    useEffect(() => {
      const groupData = groupDetails.data;
      //console.log(groupData?.chat?.groupUrl);
      if (groupData) {
        setGroupName(groupData.chat.name);
        setGrpImg(groupData.chat.groupUrl);
        setGroupNameUpdatedValue(groupData.chat.name);
        setMembers(groupData.chat.members);
        setIsAdmin(groupData.chat.createdBy.toString() == user._id.toString());
      }

      return () => {
        setGroupName("");
        setGroupNameUpdatedValue("");
        setMembers([]);
        setIsEdit(false);
        setIsAdmin(false);
        setGrpImg("");
      };
    }, [groupDetails.data]);
  //-------------------------my group chats ----------------------//

  //-----------------------rename grp-----------------------------//
    const [updateGroup, isLoadingGroupName] = useAsyncMutate(useRenameGroupMutation);
    const updateGroupName = () => {
      //setGroupName(groupNameUpdatedValue);
      setIsEdit(false);
      updateGroup("Updating Group Name", {chatId, name: groupNameUpdatedValue});
    }
  //-----------------------end rename-----------------------------//

//-----------------------add/remove member grp-----------------------------//
  const [removeMember, isLoadingRemoveMember] = useAsyncMutate(useRemoveGroupMemberMutation);
  const removeMemberHandler = (userId) => {
    removeMember("Removing Member...", { chatId, userId });
  };

  const openAddMemberHandler = () => {
    dispatch(setIsAddMember(true));
  };
//-----------------------add member rename-----------------------------//
//------------------------delte---------------------------------------//
  const [deleteGroup, isLoadingDeleteGroup] = useAsyncMutate(
    useDeleteChatMutation
  );
  const openConfirmDeleteHandler = () => {
    setConfirmDeleteDialog(true);
  };

  const closeConfirmDeleteHandler = () => {
    setConfirmDeleteDialog(false);
  };

  const deleteHandler = () => {
    deleteGroup("Deleting Group...", chatId);
    closeConfirmDeleteHandler();
    navigate("/groups");
  };
  //-------------------delete chat-------------------------------------//

  const [isLoading, setIsLoading] = useState(false); 
  const handleImageUpload = async (e) => {
    //console.log("Image upload");
    e.preventDefault();
    const toastId = toast.loading("Uploading image...");
    setIsLoading(true);
    
    const formData = new FormData();
    formData.append("avatar", avatar.file);
    formData.append("chatId", chatId);
    
    const config = {
      withCredentials: true,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    };

    try{
      const {data} = await axios.put(
        `${server}/api/chat/groupDp`,
        formData,
        config
      );
      
      toast.success(data.message, {
        id: toastId,
      });
    }catch(err){
      toast.error(err?.response?.data?.message || "Something Went Wrong", {
        id: toastId,
      });
    }finally{
      setIsLoading(false);
    }
  };
  

  useEffect(()=>{
    if (chatId) {
      setGroupName(`${groupDetails?.data?.chat?.name}`);
      setGroupNameUpdatedValue(`${groupDetails?.data?.chat?.name}`);
    }

    return () => {
      setGroupName("");
      setGroupNameUpdatedValue("");
      setIsEdit(false);
      }
  }, [chatId]);

  const Icons = (
    <>
      <Box sx={{display: {xs: 'block', sm: 'none', position: 'fixed',
        right: '1rem', top: '1rem'
      }}}>
        <IconButton onClick={handleSmall}> <MenuIcon /> </IconButton>
      </Box>
      <Tooltip title="back">
        <IconButton onClick={navigateBack} sx={{position: 'absolute', top: '2rem', left: '2rem',
          bgcolor: 'black', color: 'white', ":hover": { bgcolor: "rgba(0,0,0,0.7)",},
        }}>
          <KeyboardBackspaceIcon />
        </IconButton>
      </Tooltip>
    </>
  );

  const ButtonGroup = (
    <Stack
      direction={{
        xs: "column-reverse",
        sm: "row",
      }}
      spacing={"1rem"}
      p={{
        xs: "0",
        sm: "1rem",
        md: "1rem 4rem",
      }}
    >
      <Button
        size="large"
        color="error"
        //variant=""
        startIcon={<DeleteIcon />}
        onClick={openConfirmDeleteHandler}
      >
        Delete Group
      </Button>
      <Button
        size="large"
        variant="contained"
        startIcon={<AddIcon />}
        onClick={openAddMemberHandler}
      >
        Add Member
      </Button>
    </Stack>
  );



  return myGroups.isLoading ? ( <Skeleton/> ) : (
    <Grid container height={'100vh'}> 
      <Grid item sx={{display: {xs: 'none', sm: 'block'}}} sm={4} bgcolor={"#79c2d0"}>
        <GroupList myGroups={myGroups?.data?.groups} chatId={chatId}/>
      </Grid>
      
      <Grid item xs={12} sm={8} sx={{display: 'flex', flexDirection: 'column',
        alignItems: 'center', position: 'relative', padding: '1rem 3rem', bgcolor: '#bbe4e9'
      }}>
        {Icons}
        {groupName && (
          <>
            <Stack direction={"row"} alignItems={"center"} justifyContent={"center"} spacing={"1rem"} padding={"3rem"}>
              {isEdit ? (
                <>
                      <form style={{ width: "100%", marginTop: "1rem" }} onSubmit={handleImageUpload}>
                        <Stack position="relative" width="10rem" margin="auto">
                          <Avatar sx={{ width: "10rem", height: "10rem", objectFit: "contain" }} src={avatar.preview}/>
                          <IconButton sx={{ position: "absolute", bottom: "0", right: "0", color: "white", bgcolor: "rgba(0,0,0,0.5)", ":hover": { bgcolor: "rgba(0,0,0,0.7)" }}} component="label">
                            <CameraAlt />
                            <HiddenInput type="file" onChange={avatar.changeHandler}/>
                          </IconButton>
                        </Stack>
                        {avatar.error && <Typography m="1rem auto" width="fit-content" display="block" color="error" variant="caption">{avatar.error}</Typography>}
                        <Button sx={{ marginTop: "1rem" }} variant="contained" color="primary" type="submit" fullWidth>Change Dp</Button>
                      </form>
                  <TextField value={groupDetails?.groupName} onChange={(e) => setGroupNameUpdatedValue(e.target.value)}/>
                  <IconButton onClick={updateGroupName} disabled={isLoadingGroupName}> <DoneIcon /> </IconButton>
                </>
              ) : (
                <>
                  <AvatarCard avatar={[grpImg]} />
                  <Typography variant="h4" >{groupName}</Typography>
                  <IconButton onClick={() => setIsEdit(true)}  disabled={isLoadingGroupName}>
                    <EditIcon />
                  </IconButton>
                </>
              )}
            </Stack>
            {isAdmin && ButtonGroup}
            <Typography margin={"2rem"} alignSelf={"flex-start"} variant="body1">
              Members
            </Typography>
            <Stack
              maxWidth={"45rem"}
              width={"100%"}
              boxSizing={"border-box"}
              padding={{
                sm: "1rem",
                xs: "0",
                md: "1rem 4rem",
              }}
              spacing={"2rem"}
              height={"50vh"}
              overflow={"auto"}
            >
              {/* Members */}

              {
              isLoadingRemoveMember ? (
                <CircularProgress />
              ) : 
              (
                members.map((i) => (
                  <UserItem
                    user={i}
                    key={i._id}
                    isAdded
                    styling={{
                      boxShadow: "0 0 0.5rem  rgba(0,0,0,0.2)",
                      padding: "1rem 2rem",
                      borderRadius: "1rem",
                    }}
                    handler={removeMemberHandler}
                    isAdmin={isAdmin}
                  />
                ))
              )}
            </Stack>
            
          </>
        )}

      </Grid>

      {isAddMember && (
        <Suspense fallback={<Backdrop open />}>
          <AddMemberDialog chatId={chatId} />
        </Suspense>
      )}

      {confirmDeleteDialog && (
        <Suspense fallback={<Backdrop open />}>
          <ConfirmDeleteDialog
            open={confirmDeleteDialog}
            handleClose={closeConfirmDeleteHandler}
            deleteHandler={deleteHandler}
          />
        </Suspense>
      )}

      <Drawer
        sx={{
          display: {
            xs: "block",
            sm: "none",
          },
        }}
        open={smallScreenOpen}
        onClose={handleSmallClose}
      >
        <GroupList w={'50vw'} myGroups={samepleChats} chatId={chatId}/>
      </Drawer>
    </Grid>
  )
}

export default Groups;
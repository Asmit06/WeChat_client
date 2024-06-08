/* eslint-disable no-unused-vars */
import {
  Button,
  Dialog,
  DialogTitle,
  Skeleton,
  Stack,
  TextField,
  Typography,
  Avatar,
  IconButton
} from "@mui/material";
import React, { useState } from "react";
import {sampleUsers} from "../../../constants/seedData";
import toast from "react-hot-toast";
import UserItem from "../UserItem"
import { useInputValidation } from "6pp";
import { useDispatch, useSelector } from "react-redux";
import { useAvailableFriendsQuery, useNewGroupMutation } from "../../../redux/api/api";
import { useErrors } from "../../../hooks/hooks";
import { setIsNewGroup } from "../../../redux/reducers/misc";
import { useFileHandler } from "6pp";
import { HiddenInput } from "../StyledComponents";
import { CameraAlt as CameraAltIcon } from "@mui/icons-material";
import axios from "axios";
import { server } from "../../../constants/config";

const NewGroup = () => {
  //-----------------search functionality----------------------------------//
  const {isNewGroup} = useSelector((state)=>state.misc);
  const dispatch = useDispatch();

  const {isError, isLoading, error, data} = useAvailableFriendsQuery();
  //-----------------end search functionality----------------------------------//

  //-----------------manage handlers functionality----------------------------------//
  const groupName = useInputValidation("");
  const avatar = useFileHandler("single");
  const [selectedMembers, setSelectedMembers] = useState([]);
  useErrors([{isError, error,}]);

  const selectMemberHandler = (id) => {
    setSelectedMembers((prev) =>
      prev.includes(id)
        ? prev.filter((currElement) => currElement !== id)
        : [...prev, id]
    );
    //console.log(selectedMembers);
  };

  const [loading, setLoading] = useState(false);
  const [newGroup] = useNewGroupMutation();
  
  const submitHandler = async () => {
    if(!groupName.value) return toast.error("Group name is required");
    if(selectedMembers.length < 2) return toast.error("Please select atleast 3 members");

    setLoading(true);
    const toastId = toast.loading("Creating new group...");
    try{
      let res;
      console.log("avatar", avatar);
      if(avatar.preview){
        console.log("has entered");
        const file = avatar.file;
        const reader = new FileReader();
        const readFileAsDataURL = (file) => {
          return new Promise((resolve, reject) => {
            reader.onload = () => resolve(reader.result.split(',')[1]);
            reader.onerror = reject;
            reader.readAsDataURL(file);
          });
        };
        const base64File = await readFileAsDataURL(file);
        const payload = {
          name: groupName.value,
          members: selectedMembers,
          base: base64File,
        };
        //res = await newGroup({name: groupName.value, members: selectedMembers, base: base64File});
        res = await axios.post(`${server}/api/chat/new`, payload, {
          headers: {
            'Content-Type': 'application/json',
          },
          withCredentials: true,
        });
        
      }else{
        res = await newGroup({name: groupName.value, members: selectedMembers});
      }
      if(res.error){
        console.log("error", res);
        toast.error(res.error.data.message, {id: toastId});
      }else{
        toast.success(`Group ${groupName.value} successfully created!`, {id: toastId});
        closeHandler();
      }
    }catch(err){
      console.log(err);
      toast.error("Something went wrong!", {id: toastId});
    }finally{
      setLoading(false);
    }
  };

  const closeHandler = () => {
    dispatch(setIsNewGroup(false))
  };

  //-----------------manage handlers functionality----------------------------------//
  return (
    <Dialog open={isNewGroup} onClose={closeHandler}>
      <Stack p={{ xs: "1rem", sm: "3rem" }} width={"25rem"} spacing={"2rem"}>
        <DialogTitle textAlign={"center"} variant="h4"> New Group</DialogTitle>
        <Stack direction={"row"}>
          <Stack position="relative" width="10rem" margin="auto">
            <Avatar sx={{ width: "5rem", height: "5rem", objectFit: "contain" }} src={avatar.preview}/>
            <IconButton sx={{ position: "absolute", bottom: "0", right: "0", color: "white", bgcolor: "rgba(0,0,0,0.5)", ":hover": { bgcolor: "rgba(0,0,0,0.7)" }}} component="label">
                <CameraAltIcon />
                <HiddenInput type="file" onChange={avatar.changeHandler}/>
            </IconButton>
          </Stack>
          <TextField label="Group Name" value={groupName.value} onChange={groupName.changeHandler} />
        </Stack>
        <Typography variant="body1">Members</Typography>
        <Stack>
          {isLoading ? (
            <Skeleton />
          ) : (
            data?.friends.map((i) => (
              <UserItem user={i} key={i._id} handler={selectMemberHandler} isAdded={selectedMembers.includes(i._id)}/>
            ))
          )}
        </Stack>
        <Stack direction={"row"} justifyContent={"space-evenly"}>
          <Button variant="text" color="error" size="large" onClick={closeHandler}> Cancel </Button>
          <Button variant="contained" size="large" onClick={submitHandler} disabled={loading}>Create</Button>
        </Stack>
      </Stack>
    </Dialog>
  )
}

export default NewGroup
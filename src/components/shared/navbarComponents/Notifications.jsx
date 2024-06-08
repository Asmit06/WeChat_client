/* eslint-disable react/prop-types */
/* eslint-disable react/display-name */
/* eslint-disable no-unused-vars */
import React, { useState, memo } from "react";
import {
  Avatar,
  Button,
  Dialog,
  DialogTitle,
  ListItem,
  Skeleton,
  Stack,
  Typography,
} from "@mui/material";
import { sampleNotifications } from "../../../constants/seedData";
import { useDispatch, useSelector } from "react-redux";
import { setIsNotification } from "../../../redux/reducers/misc";
import { useAcceptFriendRequestMutation, useGetNotificationsQuery } from "../../../redux/api/api";
import { transformImage } from "../../../lib/CustomFeatures";
import { useErrors } from "../../../hooks/hooks";
import toast from "react-hot-toast";

const Notifications = () => {
  //-----------------get notifs functionality----------------------------------//
  const { isNotification } = useSelector((state)=> state.misc);
  const dispatch = useDispatch();
  const closeHandler = () => dispatch(setIsNotification(false));
  const { isLoading, data, error, isError } = useGetNotificationsQuery();
  useErrors([{error, isError}]);
  //----------------------end get notifs functionality-----------------------------//

  //-----------------accept/reject friend request functionality----------------------------------//
  const [acceptRequest] = useAcceptFriendRequestMutation();
  const [loading, setLoading] = useState(false);
  const friendRequestHandler = async ({ _id, accept }) => {
    setLoading(true);
    const toastId = toast.loading("Processing request...");
    try{
      const res = await acceptRequest({requestId: _id, accept});
      console.log(res);
      if(res.error){
        toast.error(res.error.data.message, {id: toastId});
      }else{
        if(accept) toast.success("Friend added", {id: toastId});
        else toast.success("Friend request rejected", {id: toastId});
      }
    }catch(err){
      console.log(err);
      toast.error("Something went wrong!", {id: toastId});
    }finally{
      setLoading(false);
    }
  };
  //----------------------end accept/reject notifs functionality-----------------------------//

  //const isLoading = false;

  
  return (
    <Dialog open={isNotification} onClose={closeHandler}>
      <Stack p={{ xs: "1rem", sm: "2rem" }} maxWidth={"25rem"}>
        <DialogTitle>Friend Requests</DialogTitle>
        {isLoading ? (
          <Skeleton />
        ) : (
          <>
            {data?.allRequests.length > 0 ? (
              data?.allRequests.map(({ sender, _id }) => (
                <SingleNotification
                  sender={sender}
                  _id={_id}
                  handler={friendRequestHandler}
                  key={_id}
                />
              ))
            ) : (
              <Typography textAlign={"center"}>0 notifications</Typography>
            )}
          </>
        )}
      </Stack>
    </Dialog>
  )
}

const SingleNotification = memo(({ sender, _id, handler }) => {
  console.log("sender", sender);
  const { name, avatar } = sender;
  return (
    <ListItem>
      <Stack direction={'row'} alignContent={'center'} spacing={'1rem'} width={'100%'}>
        <Avatar src={transformImage(avatar)}/>
        <Typography
          variant="body1"
          sx={{
            flexGlow: 1,
            display: "-webkit-box",
            WebkitLineClamp: 1,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            textOverflow: "ellipsis",
            width: "100%",
          }}
        >
          {`${name}`}
        </Typography>

        <Stack direction={{xs: "column", sm: "row"}}>
          <Button onClick={() => handler({ _id, accept: true })}>Accept</Button>
            <Button color="error" onClick={() => handler({ _id, accept: false })}>
              Reject
            </Button>
        </Stack>
      </Stack>
    </ListItem>
  )
});

export default Notifications
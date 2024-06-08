/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React from 'react'
import { Avatar, Stack, Typography, Grid } from "@mui/material";
import { transformImage } from "../../../lib/CustomFeatures";
import moment from "moment";

const Profile = ({user}) => {
  return (
    <Stack direction={"column"} alignItems={"center"}>
      <Avatar 
        src={transformImage(user?.avatar?.url)}
        sx={{width: 200, height:200, objectFit:"contain", 
        marginBottom:"1rem", border: "rpx solid white"}}
      />
      <Card heading={"Name"} text={user?.name} />
      <Card heading={"Username"} text={user?.username} />
      {/* <Card heading={"Bio"} text={user?.bio} /> */}
      <Card heading={"Joined"} text={moment(user?.createdAt).fromNow()} />
      <Stack
        direction={"row"}
        alignItems={"center"}
        spacing={"1rem"}
        color={"white"}
        textAlign={"center"}
      >
      <Stack>
          <Typography color={"gray"} variant="body1">
            Bio:
          </Typography>
          <Typography variant="body1" color={"white"}>{user?.bio}</Typography>
      </Stack>
    </Stack>
    </Stack>
  )
}

const Card = ({ text, Icon, heading }) => (
  <Grid container direction="row" alignItems="center" justifyContent="center" spacing={1} color="white" textAlign="center">
      <Grid item xs={6}>
        <Typography color="gray" variant="body1" style={{ marginLeft: '10px' }}>
          {heading}:
        </Typography>
      </Grid>
      <Grid item xs={6}>
        <Typography variant="body1" style={{ marginLeft: '10px' }}>{text}</Typography>
      </Grid>
  </Grid>
);

export default Profile
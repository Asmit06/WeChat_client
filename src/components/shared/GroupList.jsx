/* eslint-disable react/display-name */
/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, {memo} from 'react'
import { Stack , Typography} from '@mui/material'
import { Link } from "../shared/StyledComponents";
import AvatarCard from "../shared/AvatarCard";

const GroupList = ({ w = "100%", myGroups = [], chatId }) => {
  return (
    <Stack width={w} sx={{ height: "100vh", overflow: "auto",}}>
      <Typography textAlign={"center"} padding="1rem" bgcolor={'#5585b5'}>
          My Groups
      </Typography>
      {myGroups.length > 0 ? (
        myGroups.map((group) => (
          <GroupItem group={group} chatId={chatId} key={group._id} />
        ))
      ) : (
        <Typography textAlign={"center"} padding="1rem">
          No groups
        </Typography>
      )}
  </Stack>
  )
}

const GroupItem = memo(({ group, chatId }) => {
    const { name, avatar, _id, } = group;
  
    return (
      <Link
        to={`?group=${_id}`}
        onClick={(e) => {
          if (chatId === _id) e.preventDefault();
        }}
      >
        <Stack direction={"row"} spacing={"1rem"} alignItems={"center"}>
          <AvatarCard avatar={avatar} />
          <Typography>{name}</Typography>
        </Stack>
      </Link>
    );
  });


export default GroupList
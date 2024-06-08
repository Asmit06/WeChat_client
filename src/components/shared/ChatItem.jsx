/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { memo } from "react";
import { Box, Stack, Typography } from "@mui/material";
import { Link } from "./StyledComponents";
import AvatarCard from "./AvatarCard"

const ChatItem = ({avatar=[], name, _id, groupChat=false, sameSender, 
    isOnline, newMessageAlert, index=0, handleDeleteChat
}) => {
  return (
    <Link sx={{padding: "0", display: "block"}} to={`/chat/${_id}`} onContextMenu={(e) => handleDeleteChat(e, _id, groupChat)}>
        <Stack direction="column" bgcolor={sameSender == true ? "#53a8b6" : "#bbe4e9"}
            sx={{
                '&:hover': {
                  backgroundColor: '#79c2d0',
                },
              }}
        >
            <Stack direction="row" alignItems="center" paddingBottom={"10px"}>
                <AvatarCard avatar={avatar} isOnline={isOnline}/>
                <Typography>{name}</Typography>
                {newMessageAlert && (
                <Typography sx={{ textAlign: 'end', marginLeft: 'auto' }}>{newMessageAlert.count} New Message</Typography>
                )} 
            </Stack>

            
        </Stack>

        
    </Link>
  )
}

export default memo(ChatItem)
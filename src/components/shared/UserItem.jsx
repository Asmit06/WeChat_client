/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { memo } from 'react'
import { Add as AddIcon, Remove as RemoveIcon } from "@mui/icons-material";
import { Avatar, IconButton, ListItem, Stack, Typography } from "@mui/material";
import { transformImage } from "../../lib/CustomFeatures";

const UserItem = ({user, handler, handlerIsLoading, isAdded=false, styling={}, isAdmin=true}) => {
    const { name, _id, avatar } = user; 
    return (
        <ListItem>
            <Stack direction={"row"} alignItems={"center"}
             spacing={"1rem"} width={"100%"} {...styling} bgcolor={'white'}>
                <Avatar src={transformImage(avatar)} />
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
                    {name}
                </Typography>
                {isAdmin && 
                    <IconButton
                    size="small"
                    sx={{
                        bgcolor: isAdded ? "error.main" : "primary.main",
                        color: "white",
                        "&:hover": {
                        bgcolor: isAdded ? "error.dark" : "primary.dark",
                        },
                    }}
                    onClick={() => handler(_id)}
                    disabled={handlerIsLoading}
                    >
                    {isAdded ? <RemoveIcon /> : <AddIcon />}
                </IconButton>
                }
                
            </Stack>
        </ListItem>
    )
}

export default memo(UserItem);

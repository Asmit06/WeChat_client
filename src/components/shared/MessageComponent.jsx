/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import { Box, Typography } from "@mui/material";
import React, { memo } from "react";
import moment from "moment";
import { fileFormat } from "../../lib/CustomFeatures"
import { motion } from "framer-motion";
//import AttachmentRender from "./AttachmentRender";
import { FileOpen as FileOpenIcon } from "@mui/icons-material";
import {transformImage} from "../../lib/CustomFeatures"

const MessageComponent = ({message, user}) => {
  const { sender, content, attachments = [], createdAt } = message;
  const sameSender = sender?._id === user?._id;
  const timeAgo = moment(createdAt).fromNow();

  return (
    <motion.div
      initial={{ opacity: 0, x: "-100%" }}
      whileInView={{ opacity: 1, x: 0 }}
      style={{
        alignSelf: sameSender ? "flex-end" : "flex-start",
        backgroundColor: "white",
        color: "black",
        borderRadius: "5px",
        padding: "0.5rem",
        width: "fit-content",
      }}
    >
        {!sameSender && (
            <Typography color={"#24527a"} fontWeight={"600"} variant="caption">{sender.name}</Typography>
        )}
        {content && <Typography>{content}</Typography>}
        {attachments.length > 0 &&
        attachments.map((attachment, index) => {
          const url = attachment.url;
          const file = fileFormat(url);
          //console.log(file);

          return (
            <Box key={index}>
              <a
                href={url}
                target="_blank"
                download
                style={{
                  color: "black",
                }}
              >
                {AttachmentRender(file, url)}
              </a>
            </Box>
          );
        })}
        <Typography variant="caption" color={"text.secondary"}>
            {timeAgo}
        </Typography>
    </motion.div>
  )
}

const AttachmentRender = (file, url) => {
    //console.log(url);
    switch (file) {
        case "video":
          return <video src={url} preload="none" width={"200px"} controls />;
    
        case "image":
          return (
            <img
              src={transformImage(url, 200)}
              //src={url}
              alt="Attachement"
              width={"200px"}
              height={"150px"}
              style={{
                objectFit: "contain",
              }}
            />
          );
    
        case "audio":
          return <audio src={url} preload="none" controls />;
    
        default:
          return <FileOpenIcon />;
      }
}

export default memo(MessageComponent);
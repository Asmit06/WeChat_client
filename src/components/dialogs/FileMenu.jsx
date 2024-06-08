/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React , { useRef } from 'react'
import { ListItemText, Menu, MenuItem, MenuList, Tooltip } from "@mui/material";
import { useDispatch, useSelector } from 'react-redux';
import { setIsFileMenu, setUploadingLoader } from '../../redux/reducers/misc';
import {
  AudioFile as AudioFileIcon,
  Image as ImageIcon,
  UploadFile as UploadFileIcon,
  VideoFile as VideoFileIcon,
} from "@mui/icons-material";
import toast from "react-hot-toast";
import { useSendAttachmentsMutation } from '../../redux/api/api';

const FileMenu = ({anchorEl, chatId}) => {
  const { isFileMenu } = useSelector((state) => state.misc);
  const dispatch = useDispatch();
  const closeFileMenu = () => dispatch(setIsFileMenu(false));

  const imageRef = useRef(null);
  const audioRef = useRef(null);
  const videoRef = useRef(null);
  const fileRef = useRef(null);
  const selectImage = () => imageRef.current?.click();
  const selectAudio = () => audioRef.current?.click();
  const selectVideo = () => videoRef.current?.click();
  const selectFile = () => fileRef.current?.click();

  const [sendAttachments] = useSendAttachmentsMutation();

  const fileChangeHandler = async (e, key) => {
    const files = Array.from(e.target.files);
    if(files.length <= 0) return;
    if(files.length > 5) return toast.error(`Only 5 ${key}'s allowed at once`);
    dispatch(setUploadingLoader(true));

    const toastId = toast.loading(`Sending ${files.length} ${key}'s...`);
    closeFileMenu();

    try{
      const form = new FormData();
      form.append("chatId", chatId);
      files.forEach((file)=>form.append("files", file));
      //console.log("form ", form);
      const response = await sendAttachments(form);
      console.log("resp ", response);
      if(response.data) toast.success(`${key} sent successfully`, {id: toastId});
      else toast.error(`Failed to send ${key}`, { id: toastId });
    }catch(error){
      toast.error(error, { id: toastId });
    }finally{
      dispatch(setUploadingLoader(false));
    }
  };

  return (
    <Menu anchorEl={anchorEl} open={isFileMenu} onClose={closeFileMenu}>
         <MenuList>
          <MenuItem onClick={selectImage}>
            <ImageIcon />
            <ListItemText style={{ marginLeft: "0.5rem" }}>Image</ListItemText>
            <input type="file"
              multiple
              accept="image/png, image/jpeg, image/gif"
              style={{ display: "none" }}
              onChange={(e) => fileChangeHandler(e, "Images")}
              ref={imageRef}
            />
          </MenuItem>

          <MenuItem onClick={selectAudio}>
            
              <AudioFileIcon />
            
            <ListItemText style={{ marginLeft: "0.5rem" }}>Audio</ListItemText>
            <input
              type="file"
              multiple
              accept="audio/mpeg, audio/wav"
              style={{ display: "none" }}
              onChange={(e) => fileChangeHandler(e, "Audios")}
              ref={audioRef}
            />
          </MenuItem>

          <MenuItem onClick={selectVideo}>
            
              <VideoFileIcon />
            
            <ListItemText style={{ marginLeft: "0.5rem" }}>Video</ListItemText>
            <input
              type="file"
              multiple
              accept="video/mp4, video/webm, video/ogg, video/mov"
              style={{ display: "none" }}
              onChange={(e) => fileChangeHandler(e, "Videos")}
              ref={videoRef}
            />
          </MenuItem>

          <MenuItem onClick={selectFile}>
            
              <UploadFileIcon />
            
            <ListItemText style={{ marginLeft: "0.5rem" }}>File</ListItemText>
            <input
              type="file"
              multiple
              accept="*"
              style={{ display: "none" }}
              onChange={(e) => fileChangeHandler(e, "Files")}
              ref={fileRef}
            />
          </MenuItem>
        </MenuList>
    </Menu>
  )
}

export default FileMenu
/* eslint-disable no-unused-vars */
import React, { useState } from 'react'
import {
  Avatar,
  Button,
  Container,
  IconButton,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { CameraAlt as CameraAltIcon } from "@mui/icons-material";
import {HiddenInput} from "../components/shared/StyledComponents"
import { useFileHandler, useInputValidation } from "6pp";
import axios from 'axios';
import { server } from '../constants/config';
import { useDispatch } from 'react-redux';
import { setUser } from '../redux/reducers/auth';
import toast from 'react-hot-toast';
import Cookies from 'js-cookie';

const usernameValidator = (username) => {
  const regex = /^[a-zA-Z0-9]+$/;
  if (username.length < 5 || username.length > 20) {
    return { isValid: false, errorMessage: "Username must be between 5 and 20 characters." };
  } else if (!regex.test(username)) {
    return { isValid: false, errorMessage: "Username can only contain alphanumeric characters." };
  } else {
    return { isValid: true, errorMessage: "" };
  }
};

const Login = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const dispatch = useDispatch();
  
  const name = useInputValidation("");
  const bio = useInputValidation("");
  const [username, setUsername] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const password = useInputValidation("");
  const avatar = useFileHandler("single");

  const toggleLogin = () => setIsLogin((prev) => !prev);

  const handleUsernameChange = (event) => {
    const newUsername = event.target.value;
    setUsername(newUsername);
    //console.log(newUsername);
    const validationResponse = usernameValidator(newUsername);
    if (!validationResponse.isValid) {
      setUsernameError(validationResponse.errorMessage);
    } else {
      setUsernameError(""); // clear the error message when the username is valid
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const toastId = toast.loading("Logging In...");
    setIsLoading(true);

    const config = {
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
      },
    };

    try {
      const {data} = await axios.post(
        `${server}/api/user/login`, 
          {
            username: username,
            password: password.value
          },config);
      //console.log(data);
      Cookies.set('user', JSON.stringify(data), { expires: 7 });
      dispatch(setUser(data.user));
      toast.success(data.message, {
        id: toastId,
      });
      //
    }
    catch(err){
      //console.log(err);
      toast.error(err?.response?.data?.message || "Something Went Wrong", {
        id: toastId,
      });
    }
    finally{
      setIsLoading(false);
    }  
  };

  const handleSignUp = async(e) => {
    e.preventDefault();
    const toastId = toast.loading("Signing Up...");
    setIsLoading(true);
    const formData = new FormData();
    formData.append("avatar", avatar.file);
    formData.append("name", name.value);
    formData.append("bio", bio.value);
    formData.append("username", username);
    formData.append("password", password.value);

    const config = {
      withCredentials: true,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    };

    try{
      const {data} = await axios.post(
        `${server}/api/user/register`,
        formData,
        config
      );
      //console.log("data", data);
      dispatch(setUser(data.user));
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

  return (
    <div style={{ backgroundImage: `url(../../public/wallpaper.jpg)`, backgroundSize: 'cover', 
      backgroundPosition: 'center', backgroundRepeat: 'no-repeat', }}>
      <Container component={"main"} maxWidth="xs"  sx={{ height: "100vh", 
      display: "flex",  justifyContent: "center",  alignItems: "center", }}>
        <Paper elevation={3} sx={{ padding: 4, display: "flex", flexDirection: "column", alignItems: "center", backdropFilter: "blur(70px)", backgroundColor: "rgba(255, 255, 255, 0.4)",}}>
            {isLogin ? (
              <>
                <Typography variant="h5" color='#007FFF'>Login WeChat</Typography>
                <form style={{ width: "100%", marginTop: "1rem" }} onSubmit={handleLogin}>
                  <TextField required fullWidth label="Username" margin="normal" variant="outlined" value={username} onChange={handleUsernameChange}/>
                  <TextField required fullWidth label="Password" type="password" margin="normal" variant="outlined" value={password.value} onChange={password.changeHandler}/>
                  <Button sx={{ marginTop: "1rem" }} variant="contained" color="primary" type="submit" fullWidth disabled={isLoading}>Login</Button>
                  <Button fullWidth variant="text" onClick={toggleLogin}>{"Don't"} have an account? Sign Up</Button>
                </form>
              </>
            ) : (
            <>
              <Typography variant="h5" color='#007FFF'>Sign Up WeChat</Typography>
              <form style={{ width: "100%", marginTop: "1rem" }} onSubmit={handleSignUp}>
                <Stack position="relative" width="10rem" margin="auto">
                  <Avatar sx={{ width: "10rem", height: "10rem", objectFit: "contain" }} src={avatar.preview}/>
                  <IconButton sx={{ position: "absolute", bottom: "0", right: "0", color: "white", bgcolor: "rgba(0,0,0,0.5)", ":hover": { bgcolor: "rgba(0,0,0,0.7)" }}} component="label">
                    <CameraAltIcon />
                    <HiddenInput type="file" onChange={avatar.changeHandler}/>
                  </IconButton>
                </Stack>

                {avatar.error && <Typography m="1rem auto" width="fit-content" display="block" color="error" variant="caption">{avatar.error}</Typography>}
                <TextField required fullWidth label="Full Name" margin="normal" variant="outlined" value={name.value} onChange={name.changeHandler} />
                <TextField required fullWidth label="Bio" margin="normal" variant="outlined" value={bio.value} onChange={bio.changeHandler}/>
                <TextField required fullWidth label="Username" margin="normal" variant="outlined" value={username} onChange={handleUsernameChange}/>
                {usernameError && <Typography color="error" variant="caption">{usernameError }</Typography>}
                <TextField required fullWidth label="Password" type="password" margin="normal" variant="outlined" value={password.value} onChange={password.changeHandler}/>
                <Button sx={{ marginTop: "1rem" }} variant="contained" color="primary" type="submit" fullWidth>Sign Up</Button>
                <Button fullWidth variant="text" onClick={toggleLogin}>Already have an account? Sign in</Button>
              </form>
            </>
          )}
        </Paper>
      </Container>
    </div>
  )
}

export default Login
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { Search as SearchIcon } from "@mui/icons-material";
import {
    Dialog,
    DialogTitle,
    InputAdornment,
    List,
    Stack,
    TextField,
  } from "@mui/material";
import UserItem from "../UserItem"
import {sampleUsers} from "../../../constants/seedData"
import { useDispatch, useSelector } from "react-redux";
import { setIsSearch } from "../../../redux/reducers/misc";
import { useLazySearchUserQuery, useSendFriendRequestMutation } from "../../../redux/api/api";
import toast from "react-hot-toast";

const Search = () => {
  //-----------------search functionality----------------------------------//
  const [search, setSearch] = useState("");
  const [users, setUsers] = useState([]);

  const [searchUser] = useLazySearchUserQuery();
  const { isSearch } = useSelector((state) => state.misc);

  useEffect(() => {
    const timeOutId = setTimeout(()=>{
      searchUser(search)
        .then(({data}) => 
          setUsers(data.onlyReqDetails)
        )
        .catch((e)=>console.log(e));
    }, 1000);

    return ()=>{
      clearTimeout(timeOutId);
    }
  }, [search, searchUser]);
  //----------------------end earch functionality-----------------------------//


  
  //----------------------process requests function-----------------------------// 
  const dispatch = useDispatch();
  const searchCloseHandler = () => dispatch(setIsSearch(false));
  const [sendFriendRequest] = useSendFriendRequestMutation();
  const [loading, setLoading] = useState(false);
  const addFriendHandler = async (id) => {
    setLoading(true);
    const toastId = toast.loading("Sending friend request...");
    //console.log(id);
    try{
      const res = await sendFriendRequest({userId: id});
      console.log(res);
      if(res.error){
        toast.error(res.error.data.message, {id: toastId});
      }else{
        toast.success("Freind request sent", {id: toastId});
      }
    }catch(err){
      console.log(err);
      toast.error("Something went wrong!", {id: toastId});
    }finally{
      setLoading(false);
    }
    
    //await sendFriendRequest("Sending friend request...", { userId: id });
  };

  return (
    <Dialog open={isSearch} onClose={searchCloseHandler}>
      <Stack p={"2rem"} direction={"column"} width={"25rem"}>
        <DialogTitle textAlign={"center"}>Find People</DialogTitle>
        <TextField
          label=""
          value={search}
          onChange={e => setSearch(e.target.value)}
          variant="outlined"
          size="small"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
        <List>
          {users?.map((i) => (
            <UserItem
              user={i}
              key={i._id}
              handler={addFriendHandler}
              handlerIsLoading={loading}
            />
          ))}
        </List>
      </Stack>
    </Dialog>
  )
}

export default Search
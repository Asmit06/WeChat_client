/* eslint-disable no-unused-vars */
import React, { Suspense, lazy, useEffect }  from 'react'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import {ProtectRoute} from "./components/auth/RouteProtect"
import {LoaderComponent} from "./components/layout/Loaders"
import axios from 'axios';
import {server} from "./constants/config"
import { useDispatch, useSelector } from "react-redux";
import { nullUser, setUser } from './redux/reducers/auth';
import {Toaster} from "react-hot-toast"
import Cookies from 'js-cookie';
import {SocketProvider} from "./socket"

const Home = lazy(() => import("./pages/Home"));
const Login = lazy(() => import("./pages/Login"));
const Chat = lazy(() => import("./pages/Chat"));
const Groups = lazy(() => import("./pages/Groups"));
const NotFound = lazy(() => import("./pages/NotFound"));

//let user = true;

const App = () => {
  let {user , loader} = useSelector((state) => state.auth);
  const dispath = useDispatch();
  const userCookie = Cookies.get('user');
  if(!user && userCookie){
    dispath(setUser(JSON.parse(userCookie)));
  }
  useEffect(()=>{
    //console.log(server);
    axios.get(`${server}/api/user/myprofile`, {withCredentials: true})
         .then(({data})=> dispath(setUser(data.user)))
         .catch((err)=>dispath(nullUser()));  
  }, [dispath]);

  return loader ? 
  (<LoaderComponent />
  ) : (
    <BrowserRouter>
      <Suspense fallback={<LoaderComponent />}>
        <Routes>
          <Route element={<SocketProvider> <ProtectRoute user={user} /> </SocketProvider>}>
                <Route path="/" element={ <Home/> } />
                <Route path="/chat/:chatId" element={<Chat />} />
                <Route path="/groups" element={<Groups />} />      
          </Route>
          <Route path="/login" element={
            <ProtectRoute user={!user} redirect="/">
              <Login /> 
            </ProtectRoute>
          }/>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
      <Toaster position='bottom-right'/>
    </BrowserRouter>
  )
}

export default App
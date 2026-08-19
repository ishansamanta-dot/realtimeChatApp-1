import React, { useEffect } from 'react'
import Login from './pages/login'
import Signup from './pages/signup'
import Home from './pages/home'
import Profile from './pages/profile'
import { Navigate, Route, Routes } from 'react-router-dom'
import getCurrentUser from './customHooks/getCurrentUser'
import { useDispatch, useSelector } from 'react-redux'
import getSuggestedUsers from './customHooks/getSuggestedUsers'
import {io} from "socket.io-client"
import { serverurl } from './main'
import { setOnlineUsers, setSocket } from './redux/userSlice'
import Notification from './components/notification'
import Friends from './components/friends'
import VideoCall from './components/videoCall'


function App() {
  getCurrentUser()
  getSuggestedUsers()
  let {userData,socket,onlineUsers}=useSelector(state=>state.user)
  let dispatch=useDispatch()

  useEffect(()=>{
    if(userData){

          const socketio=io(`${serverurl}`,{
      query:{
        userId:userData?._id
      }
    })
    dispatch(setSocket(socketio))

    socketio.on("getOnlineUsers",(users)=>{
      dispatch(setOnlineUsers(users))
    })
    return()=>{
      socketio.close()
    }
    }else{
      if(socket){
        socket.close()
        dispatch(setSocket(null))
      }
    }

  },[userData])

  return (
    <Routes>
      <Route path='/login' element={!userData?<Login/>:<Navigate to="/"/>}/>
      <Route path='/signup' element={!userData?<Signup/>:<Navigate to="/profile"/>}/>
      <Route path='/' element={userData?<Home/>:<Navigate to="/login"/>}/>
      <Route path='/profile' element={userData?<Profile/>:<Navigate to="/signup"/>}/>
      <Route path='/notification' element={userData?<Notification/>:<Navigate to="/login"/>} />
      <Route path='/friends' element={userData?<Friends/>:<Navigate to="/login"/>} />
      <Route path="/call"element={userData ? <VideoCall /> : <Navigate to="/login" />}/>
    </Routes>
  )
}

export default App

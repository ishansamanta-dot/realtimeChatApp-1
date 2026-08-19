import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import dp from "../assets/blank-dp.png"
import { IoIosSearch  } from "react-icons/io"
import { RxCross2 } from "react-icons/rx"
import { useState } from 'react'
import { BiLogOutCircle } from "react-icons/bi"
import { serverurl } from '../main'
import axios from 'axios'
import {setsuggestedUsers, setUserData,setSelectedUser, setSearchData, setSocket } from '../redux/userSlice'
import { useNavigate } from 'react-router-dom'
import { FaUserFriends } from "react-icons/fa"
import { IoIosNotifications } from "react-icons/io"


function sidebar() {
    let {userData,selectedUser,onlineUsers,searchData,socket}=useSelector(state=>state.user)
    let [search,setsearch]=useState(false)
    let [input,setinput]=useState("")
    let dispatch=useDispatch()
    let navigate=useNavigate()
    let [friends, setFriends] = useState([])
    let [unreadMessages,setUnreadMessages]=useState([])

    const handlelogout=async()=>{
        try{
            let result=await axios.get(`${serverurl}/api/auth/logout`,{withCredentials:true})
            dispatch(setUserData(null))
            dispatch(setsuggestedUsers(null))
            navigate("/login")
        }catch(err){
            console.log(err);
        }
    }


    useEffect(() => {

        const getFriends = async () => {

            try {

                const result = await axios.get(
                    `${serverurl}/api/user/friends`,
                    {
                        withCredentials: true
                    }
                )

                setFriends(result.data)

            } catch (err) {

                console.log(
                    "Get friends error:",
                    err.response?.data || err.message
                )

            }

        }

        if (userData) {
            getFriends()
        }

    }, [userData])

    const getUnreadMessages = async () => {
  try {
    let result = await axios.get(
      `${serverurl}/api/message/unread`,
      { withCredentials: true }
    );

    let data = result.data
    if (selectedUser) {
      data = data.filter(
        item => item.sender?.toString() !== selectedUser._id?.toString()
      )
    }

    setUnreadMessages(data);

  } catch(err) {
     console.log(err);
  }
}

useEffect(() => {
  getUnreadMessages()
}, [])

// Keep socket listener separate, still reacting to selectedUser/socket
useEffect(() => {
  if (!socket) return
  const handleNewMessage = (message) => {
    if (selectedUser?._id?.toString() === message.sender?.toString()) {
      return
    }
    setUnreadMessages(prev => [...prev, message])
  }
  socket.on("newMessage", handleNewMessage)
  return () => {
    socket.off("newMessage", handleNewMessage)
  }
}, [socket, selectedUser])


    const handlesearch=async()=>{
      try{
        let result=await axios.get(`${serverurl}/api/user/search?query=${input}`,{withCredentials:true})
        dispatch(setSearchData(result.data))
      }catch(err){
        console.log(err)
      }
    }

    useEffect(()=>{
      if(input){
        handlesearch()
      }
    },[input])

  return (
    <div className={`lg:w-[30%] w-full h-full lg:block ${!selectedUser?"block":"hidden"} bg-[#0b1224] overflow-hidden relative`}>
      <div className='w-full h-[220px] bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 rounded-b-[30%] shadow-blue-500/20 shadow-xl px-[20px] py-[10px] flex flex-col '>

           <div className='w-full flex justify-between items-center' >
               <h1 className='text-black font-bold text-[35px]'>ChatVerse</h1>
                  <div className='w-[30%] px-[8px] justify-around flex'>
                    <FaUserFriends className='bg-transparent size-[24px] cursor-pointer' onClick={()=>navigate("/friends")} />
                    <IoIosNotifications className='bg-transparent size-[25px] cursor-pointer' onClick={()=>navigate("/notification")} />
                  </div>
            </div>      
        <div className='w-full flex mb-[10px] py-[7px] justify-between items-center'>
            <h1 className='text-gray-900 font-bold text-[24px]'>Hii - {userData.fullname}</h1>
              <div className='w-[55px] h-[55px] rounded-full overflow-hidden flex justify-center items-center bg-slate-400  shadow-blue-500/20 shadow-xl cursor-pointer border-2 border-black'onClick={()=>navigate("/profile")}> 
                 <img src={userData.profilepic || dp} alt='' className='h-[100%]'/>
              </div> 
        </div>
             {!search && <div className='w-[45px] h-[45px] rounded-full overflow-hidden flex justify-center items-center bg-[#1a2440] shadow-black/20 shadow-md'onClick={()=>setsearch(true)}>
                <IoIosSearch className='w-[30px] h-[30px] text-white cursor-pointer'/>
              </div>}
              {search && 
                  <form className='relative w-[90%] h-[45px] rounded-full overflow-hidden flex gap-[0px] px-[10px] items-center bg-[#1a2440] shadow-black/20 shadow-md'>
                    <IoIosSearch className='w-[30px] h-[30px] text-white'/>
                    <input type="text" placeholder='search users...'className='w-full h-full p-[10px] text-[15px] bg-[#1a2440] placeholder:text-slate-200 text-white outline-none' onChange={(e)=>setinput(e.target.value)} value={input}/>
                     <RxCross2 className='w-[30px] h-[30px] text-white cursor-pointer'onClick={()=>{
                      setsearch(false)
                      setinput("")}}/>
                  </form>}
      </div>
      <div className='w-[35px] h-[35px] z-[100] rounded-full overflow-hidden flex justify-center items-center bg-blue-600 hover:bg-blue-700 shadow-violet-500/30 shadow-xl fixed bottom-[20px] left-[20px]'onClick={handlelogout}>
                <BiLogOutCircle className='w-[25px] h-[25px] cursor-pointer'/>
      </div>


      
      {input.length>0 && <div className='absolute top-[245px] left-0 w-full h-[60vh] lg:h-[65vh] bg-[#0b1224] overflow-y-auto overflow-x-hidden z-[100] pb-[20px]'>
        
        <div className=' flex flex-col gap-[10px] items-center pt-[10px]'>
          {searchData?.map((user)=>(
            <div className=' w-[95%] h-[70px] flex items-center gap-[20px] bg-[#0b1224] rounded-xl border-b-2 overflow-auto border-gray-700 shadow-black/40 shadow-md px-[10px] hover:bg-[#18233e] cursor-pointer'onClick={()=> {
              dispatch(setSelectedUser(user))
              setUnreadMessages(prev =>
                prev.filter(message =>message.sender?.toString() !== user._id?.toString())
              )
              setinput("")
              setsearch(false)
              }}>

            <div className='relative rounded-full bg-slate-400 justify-center items-center'>
            <div className='w-[60px] h-[60px] rounded-full overflow-hidden flex justify-center items-center'>
              <img src ={user.profilepic || dp} alt="" className='h-[100%] '/>
            </div>

            {onlineUsers?.includes(user._id) &&
            <span className='absolute w-[10px] h-[10px] rounded-full bottom-[6px] right-[2px] bg-[#3aff20]'>
              </span>}
            </div>
            <h1 className='text-gray-500 font-semibold text-[18px]'>{user.fullname}</h1>
          </div>
            ))}
      </div>
            </div>}

      

      <div className='W-full h-[60vh] lg:h-[65vh] overflow-auto flex flex-col gap-[20px] items-center mt-[30px]'>
        {friends?.map((user)=>(
          <div className='w-[90%] h-[60px] flex justify-start items-center gap-[20px] shadow-black/40 bg-[#121b32] shadow-xl rounded-full hover:bg-[#18233e] cursor-pointer'onClick={()=>{
            dispatch(setSelectedUser(user))
            setUnreadMessages(prev =>
              prev.filter(message =>message.sender?.toString() !== user._id?.toString())
            )
            }}>

            <div className='relative rounded-full bg-slate-400 justify-center items-center shadow-black/40 shadow-xl'>
            <div className='w-[60px] h-[60px] rounded-full overflow-hidden flex justify-center items-center'>
              <img src ={user.profilepic || dp} alt="" className='h-[100%] '/>
            </div>

            {onlineUsers?.includes(user._id) &&
            <span className='w-[10px] h-[10px] rounded-full absolute bottom-[6px] right-[2px] bg-[#3aff20] shadow-black/40 shadow-md'>
              </span>}
            </div>
            <h1 className='text-gray-500 font-semibold text-[18px]'>{user.fullname}</h1>

            {unreadMessages.filter(
    item => item.sender?.toString() === user._id?.toString()
).length > 0 && (
  <div className='ml-auto mr-[20px] min-w-[22px] h-[22px] flex justify-center items-center rounded-full bg-red-600 text-gray-200 text-[16px] font-bold'>
        {unreadMessages.filter(
            item => item.sender?.toString() === user._id?.toString()
        ).length}
    </div>
)}

          </div>
        ))}
      </div>
    </div>  
  )
}

export default sidebar

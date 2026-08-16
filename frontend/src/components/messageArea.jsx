import React, { useEffect, useRef, useState } from 'react'
import { IoIosArrowRoundBack } from "react-icons/io";
import dp from "../assets/blank-dp.png"
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { setSelectedUser,setSocket} from '../redux/userSlice';
import { RiEmojiStickerLine,RiSendPlane2Fill} from "react-icons/ri"
import { FaImages } from "react-icons/fa6"
import EmojiPicker from "emoji-picker-react"
import SenderMessage from './senderMessage';
import ReceiverMessage from './receiverMessage';
import { serverurl } from '../main';
import { setMessages } from '../redux/messageSlice';


function messageArea() {
  let {selectedUser,userData,socket,onlineUsers}=useSelector(state=>state.user)
  let [showPicker,SetShowPicker]=useState(false)
  let dispatch=useDispatch()
  let [input,setInput]=useState("")
  let [frontendImage,setFrontendImage]=useState("")
  let [backendImage,setBackendImage]=useState("")
  
  const onEmojiClick=(emojiData)=>{
  setInput(prevInput=>prevInput+emojiData.emoji)}

  let image=useRef()
  let {messages}=useSelector(state=>state.message)


  useEffect(() => {
    if (!selectedUser) return
    const markAsRead = async () => {
        try {
            await axios.put(
                `${serverurl}/api/message/read/${selectedUser._id}`,
                {},
                { withCredentials: true }
            )
        } catch (err) {
            console.log(err)
        }
    }
    markAsRead()
}, [selectedUser])

    const handleImage=async(e)=>{
    try{
      let file=e.target.files[0]
      setBackendImage(file)
      setFrontendImage(URL.createObjectURL(file))
    }catch(err){

    }
  }

  const handleSendMessage=async(e)=>{
    e.preventDefault()
    if(input.trim() ==="" && !backendImage){
      return
    }
    try{
      let formData=new FormData()
      formData.append("message",input)
      if(backendImage){
        formData.append("image",backendImage)
      }
      let result=await axios.post(`${serverurl}/api/message/send/${selectedUser._id}`,formData,{withCredentials:true})
      dispatch(setMessages([...messages,result.data]))
      console.log(result.data)
      setInput("")
      setFrontendImage(null)
      setBackendImage(null)
    }catch(err){
      console.log(err)
    }
  }

  useEffect(() => {
  if (!socket) return

  const handleNewMessage = (message) => {
    dispatch(setMessages(prev => [...prev, message]))
  }

  socket.on("newMessage", handleNewMessage)

  return () => {
    socket.off("newMessage", handleNewMessage)
  }
}, [socket, dispatch])


  return (
    <div className={`lg:w-[70%] ${selectedUser?"flex":"hidden"} lg:flex w-full h-full bg-[#070b1a] border-l-2 border-slate-950 relative`}>
      {selectedUser && 
      <div className='w-full h-[100vh] flex flex-col'>
        <div className='w-full h-[75px] bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 rounded-b-[30px]  shadow-blue-500/20 shadow-xl px-[10px] gap-[13px] flex items-center'>
                  <div className='cursor-pointer'>
                      <IoIosArrowRoundBack className='w-[40px] h-[40px] 'onClick={()=>dispatch(setSelectedUser(null))}/>
                  </div>
                  <div className='relative w-[50px] h-[50px] rounded-full flex justify-center items-center bg-slate-400 shadow-blue-500/20 shadow-xl '> 
                      <img src={selectedUser?.profilepic || dp} alt='' className='h-[100%] rounded-full overflow-hidden'/>

                      {onlineUsers?.includes(selectedUser._id) &&
                          <span className='w-[10px] h-[10px] rounded-full absolute bottom-[6px] right-[0px] bg-[#3aff20]'>
                          </span>}
                  </div>
                  <h1 className='text-gray-900 font-bold text-[22px] truncate'>{selectedUser?.fullname}</h1>    
        </div>

        <div className='w-full h-[80%]  flex flex-col gap-[20px] py-[30px] px-[20px] overflow-auto'>
          {showPicker && <div className='bottom-[120px] left-[20px] absolute'>
            <EmojiPicker width={250} height={350} theme="dark" className='shadow-lg z-[100] text-slate-300 hover:text-blue-300' onEmojiClick={onEmojiClick}/> </div>}
            {messages && messages.map((mess)=>(
              mess.sender==userData._id?<SenderMessage image={mess.image} message={mess.message}/>:<ReceiverMessage image={mess.image} message={mess.message}/>
            ))}
        </div>
      </div>
      }

      {!selectedUser && <div className='w-full h-full flex flex-col justify-center items-center'>
      <h1 className='text-gray-200 font-bold text-[50px]'>Welcome to ChatVerse</h1>  
      <span className='text-gray-400 font-semibold text-[30px]'>Where Conversations Connect</span>
      {/*<span className='text-gray-400 font-semibold text-[30px]'>Connect. Chat. Belong.</span>*/}
      </div>} 


          {selectedUser &&  <div className='w-full lg:w-[70%] h-[100px] fixed bottom-[5px] flex items-center justify-center'>
            <img src={frontendImage || undefined} alt="" className='w-[80px] bottom-[100px] right-[20%] absolute shadow-lg shadow-gray-400' />
        <form className='w-[95%] lg:w-[70%] h-[60px] bg-[#121b32] border-slate-700 flex items-center px-[20px] gap-[20px] rounded-full shadow-black/20 shadow-md'onSubmit={handleSendMessage}>
          <div onClick={()=>SetShowPicker(prev=>!prev)}>
            <RiEmojiStickerLine className='w-[25px] h-[25px] text-white cursor-pointer'/>
          </div>
          <input type='file' accept='image/*' ref={image} hidden onChange={handleImage}/>
        <input type='text' className='w-full h-full bg-transparent text-white text-[20px] outline-none border-slate-700 ring-blue-500/30 placeholder:text-slate-100'placeholder='Message'onChange={(e)=>setInput(e.target.value)} value={input}/>
          
          <div className='flex justify-center gap-[30px] px-[10px]'>
          <div onClick={()=>image.current.click()}><FaImages className='w-[25px] h-[25px] text-slate-300 hover:text-blue-300 cursor-pointer'/></div>
          <button className={`${(input.trim() !=="" || backendImage) ? "visible" : "invisible"}`}><RiSendPlane2Fill className='w-[25px] h-[25px] text-blue-600 hover:scale-105 cursor-pointer'/></button>
          </div>

          </form> 
      </div>}

      
    </div>
  )
}

export default messageArea;

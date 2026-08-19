import axios from 'axios'
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { serverurl } from '../main'
import { useDispatch, useSelector } from 'react-redux'
import { setSelectedUser,setUserData } from '../redux/userSlice.js'
import {FaEye,FaEyeSlash,FaLock} from "react-icons/fa"
import { IoMdMail } from "react-icons/io"

function login() {
    let navigate=useNavigate()
    let [show,setshow]=useState(false)

    let[email,setemail]=useState("")
    let[password,setpassword]=useState("")
    let[loading,setloading]=useState(false)
    let[err,seterr]=useState("")
    let dispatch=useDispatch()


    const handlelogin =async(e)=>{
        e.preventDefault()
        setloading(true)
        try{
            let result= await axios.post(`${serverurl}/api/auth/login`,{
                email,password
            },{withCredentials:true})
            dispatch(setUserData(result.data.user))
            dispatch(setSelectedUser(null))
            navigate("/")
            setemail("")
            setpassword("")

            setloading(false)
        }catch(err){
            setloading(false)
            seterr(err.response.data.message)
        }
    }

  return (
    <div className='w-full h-[100vh] bg-[#070b1a] flex items-center justify-center'>
        <div className='w-full max-w-[500px] h-[600px] bg-[#121b32] rounded-lg shadow-black/40 shadow-xl flex flex-col gap-[40px]'>
        <div className='w-full h-[170px] gap-[2px] bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 rounded-b-[30%]  shadow-indigo-500/20 shadow-xl flex flex-col items-center justify-center'>

            <h1 className='text-black font-bold text-[35px] mt-5'>Chat<span className='text-black'>Verse</span></h1>
            <p className='text-slate-300  font-bold text-[22px] mt-1'>Login to your account</p>
            <p className='text-slate-400 font-bold text-[15px]'>Welcome back! Please login to continue</p>
            {/*<h1 className='text-white font-bold text-[30px]'>Login to <span className='text-black'>ChatVerse</span></h1>
            <p className='text-slate-300 font-bold text-[15px]'>Welcome back! Please login to continue</p>*/}
        </div>

        <form className='w-full flex flex-col gap-[20px] items-center'onSubmit={handlelogin}>
            <div className='flex w-[80%] h-[50px] bg-[#1a2440] border-2 border-[#26355a] overflow-hidden rounded-lg shadow-black/20 shadow-md px-[15px] items-center'>
                <IoMdMail className='size-[25px]'/>
                <input type="email" placeholder='Enter Email'  className='w-full h-full outline-none px-[15px] py[10px] bg-[#1a2440] text-white  text-[19px]'onChange={(e)=>setemail(e.target.value)} value={email}/>
            </div>
                        
            <div className='flex w-[80%] h-[50px] bg-[#1a2440] border-2 border-[#26355a] overflow-hidden rounded-lg shadow-black/20 shadow-md relative px-[15px] items-center'>
                <FaLock className='size-[22px]'/>
                <input type={`${show?"text":"password"}`} placeholder='Enter Password'  className='w-[80%] h-full outline-none px-[15px] py[10px] bg-[#1a2440] text-white  text-[19px]'onChange={(e)=>setpassword(e.target.value)} value={password}/>
                <span className='absolute top-[13px] right-[25px] text-[22px] text-gray-400 font-semibold cursor-pointer' onClick={()=>setshow(prev=>!prev)}>{show?<FaEye/>:<FaEyeSlash/>}</span>
            </div>

<div className='h-[10px] px-[15%] flex'>{err && <p className='text-white'>{err}</p>}</div>

            <button className='px-[20px] py-[10px] bg-gradient-to-r from-blue-600 to-violet-600 rounded-2xl shadow-blue-500/20 shadow-xl text-[20px] w-[200px] mt-[20px] font-semibold hover:shadow-inner'>{loading?"loading..":"Login"}</button>
            <p className='cursor-pointer text-slate-300' onClick={()=>navigate("/signup")}> Want to create a new account ? <span className='text-blue-400 hover:text-blue-300 text-[bold] px-[20px]'>Sign up</span></p>
        </form>
        </div>
    </div>
  )
}

export default login

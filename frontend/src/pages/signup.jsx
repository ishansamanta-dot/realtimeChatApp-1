import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { serverurl } from '../main'
import axios from "axios"
import { useDispatch, useSelector } from 'react-redux'
import { setUserData } from '../redux/userSlice'
import {FaEye} from "react-icons/fa"
import {FaEyeSlash} from "react-icons/fa"

function Signup() {
    let navigate=useNavigate()
    let [show,setshow]=useState(false)

    let[fullname,setfullname]=useState("")
    let[email,setemail]=useState("")
    let[password,setpassword]=useState("")
    let[loading,setloading]=useState(false)
    let[err,seterr]=useState("")
    let dispatch=useDispatch()


    const handlesignup =async(e)=>{
        e.preventDefault()
        setloading(true)
        try{
            let result= await axios.post(`${serverurl}/api/auth/signup`,{
                fullname,email,password
            },{withCredentials:true})
            dispatch(setUserData(result.data.user))
            navigate("/profile")
            setfullname("")
            setemail("")
            setpassword("")
            

            setloading(false)
        }catch(err){
            //console.log(err.response?.data);
            setloading(false)
            seterr(err.response.data.message)
        }
    }

  return (
    <div className='w-full h-[100vh] bg-[#070b1a] flex items-center justify-center'>
        <div className='w-full max-w-[500px] h-[600px] bg-[#121b32] rounded-lg shadow-black/40 shadow-xl flex flex-col gap-[40px]'>
        <div className='w-full h-[170px] bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 rounded-b-[30%]  shadow-indigo-500/20 shadow-xl flex items-center justify-center'>
            <h1 className='text-white  font-bold text-[30px]'>Welcome to <span className='text-white'>ChatVerse</span></h1>
        </div>
        <form className='w-full flex flex-col gap-[20px] items-center'onSubmit={handlesignup}>

            <input type="text" placeholder='Enter Fullname' className='w-[80%] h-[50px] outline-none text-white text-[19px] border-2 border-[#26355a] px-[20px] py[10px] bg-[#1a2440] rounded-lg shadow-black/20 shadow-md'onChange={(e)=>setfullname(e.target.value)} value={fullname}/>

            <input type="email" placeholder='Enter Email'  className='w-[80%] h-[50px] outline-none text-white text-[19px] border-2 border-[#26355a] px-[20px] py[10px] bg-[#1a2440] rounded-lg shadow-black/20 shadow-md'onChange={(e)=>setemail(e.target.value)} value={email}/>
            
            <div className='w-[80%] h-[50px] border-2 border-[#26355a] overflow-hidden rounded-lg shadow-black/20 shadow-md relative'>
                <input type={`${show?"text":"password"}`} placeholder='Enter Password'  className='w-full h-full outline-none px-[20px] py[10px] bg-[#1a2440] text-white  text-[19px]'onChange={(e)=>setpassword(e.target.value)} value={password}/>
                <span className='absolute top-[13px] right-[20px] text-[22px] text-gray-400 font-semibold cursor-pointer' onClick={()=>setshow(prev=>!prev)}>{show?<FaEye/>:<FaEyeSlash/>}</span>
            </div>

    <div className='h-[10px] px-[15%]'>{err && <p className='text-white'>{err}</p>}</div>

            <button type="submit" className='px-[20px] py-[10px] bg-gradient-to-r from-blue-600 to-violet-600 rounded-2xl shadow-blue-500/20 shadow-xl text-[20px] w-[200px] mt-[20px] font-semibold hover:shadow-inner'>{loading?"Loading..":"Sign Up"}</button>
            <p className='cursor-pointer text-white ' onClick={()=>navigate("/login")}> Already Have an Account ? <span className='text-blue-400 hover:text-blue-300 text-[bold] px-[20px]'>Login</span></p>
        </form>
        </div>
    </div>
  )
}

export default Signup
import React, { useRef, useState } from 'react'
import dp from "../assets/blank-dp.png"
import axios from 'axios';
import { IoCameraOutline } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { IoIosArrowRoundBack,IoMdMail } from "react-icons/io";
import { useNavigate } from 'react-router-dom';
import { FaShuffle} from "react-icons/fa6";
import {FaUserTie} from "react-icons/fa"
import { serverurl } from '../main';
import { setUserData } from '../redux/userSlice';


function profile() {
  let {userData}=useSelector(state=>state.user)
  let Navigate=useNavigate()
  let [bio,setbio]=useState(userData.bio || "")
  let [frontendImage,setfrontendImage]=useState(userData.profilepic || dp )
  let [backendImage,setbackendImage]=useState(null)
  let dispatch=useDispatch()
  let [saving,setsaving]=useState(false)
  let[err,seterr]=useState("")
  let hobbyList = [
    "Coding",
    "Gaming",
    "Music",
    "Movies",
    "Reading",
    "Travel",
    "Photography",
    "Sports",
    "Football",
    "Cricket",
    "Anime",
    "Drawing",
    "Cooking",
    "Fitness",
    "Technology",
    "Art",
    "Dance",
    "Writing",
    "Photography",
    "Programming"
  ]
  let [hobbies, setHobbies] = useState(userData.hobbies || [])
  let profilepic=useRef()

  
  const handleRnadomAvatar=()=>{
    try{
      const idx=Math.floor(Math.random()*100)+1;  //genarate a num between 1-100
        const randomAvatar= `https://avatarapi.runflare.run/public/${idx}.png`
        console.log(`Avatar Genarated ${randomAvatar}`);
        setfrontendImage(randomAvatar);
    }catch(err){
      console.log(err);
    }
  }

  const handleHobby = (hobby) => {

  if (hobbies.includes(hobby)) {

    setHobbies(hobbies.filter(item => item !== hobby))

  } else {

    setHobbies([...hobbies, hobby])

  }

}

  const handleImage=(e)=>{
    let file=e.target.files[0]
    setbackendImage(file)
    setfrontendImage(URL.createObjectURL(file))
  }

  const handleProfile= async (e)=>{
    setsaving(true)
    e.preventDefault()
    try{
      let formData=new FormData()
      formData.append("bio",bio);
      hobbies.forEach(hobby => {formData.append("hobbies", hobby)})

      if (backendImage) {
          formData.append("image", backendImage);
          } else{
            formData.append("profilepic", frontendImage)}
            
      let result= await axios.put(`${serverurl}/api/user/profile`,formData,{withCredentials:true});
      setsaving(false)
      dispatch(setUserData(result.data))
      Navigate("/")
    }catch(err){
      setsaving(false)
      seterr(err.response.data.message)
      }
  }

  return (
      <div className="w-full h-screen bg-[#070b1a] flex justify-center items-center">

        <div className='fixed top-[20px] text-white left-[20px] cursor-pointer'onClick={()=>Navigate("/")}>
          <IoIosArrowRoundBack className='w-[50px] h-[50px] '/>
        </div>

 <div className="relative w-full max-w-[500px] h-[600px] bg-[#121b32] shadow-black/40 shadow-xl rounded-lg pt-24 pb-10 flex flex-col items-center">

        <div className='absolute -top-[40px] bg-slate-400 rounded-full ring-4 ring-blue-500 shadow-indigo-500/20 shadow-xl cursor-pointer' onClick={()=>profilepic.current.click()}>

  <div className='w-[125px] h-[125px] rounded-full  overflow-hidden'> 
     <img src={frontendImage || dp} alt='' className='h-[100%]'/>
  </div>

  <div className='absolute bottom-2 right-[10px] w-[20px] h-[20px] bg-blue-500 rounded-full flex justify-center items-center'>
    <IoCameraOutline className=' text-gray-800 right-5 w-[20px] h-[20px]'/>
  </div>
    </div>
         
  
      <button className='flex items-center justify-center gap-[5px] mt-[8px] py-[10px] bg-gradient-to-r from-blue-600 to-violet-600 rounded-2xl shadow-blue-500/20 shadow-lg text-[13px] w-[130px] h-[35px] font-bold hover:shadow-inner' onClick={handleRnadomAvatar}>
        <FaShuffle />Random Avatar
      </button>
    

         <form className='w-[95%] max-w-[500px] h-[500px] flex flex-col gap-[18.5px] items-center justify-center mt-[18px]' onSubmit={handleProfile}>
          <input type='file' accept='image/*' ref={profilepic} hidden  onChange={handleImage}/>

          <div className='flex w-[80%] h-[50px] bg-[#1a2440] border-2 border-[#26355a] overflow-hidden rounded-lg shadow-black/20 shadow-md px-[15px] items-center'>
              <FaUserTie className='size-[25px]'/>
              <input type='text' readOnly className='w-full h-full outline-none text-[19px] text-slate-400 px-[15px] py[10px] bg-[#1a2440] cursor-not-allowed'value={userData.fullname}/>
          </div>
          
          <div className='flex w-[80%] h-[50px] bg-[#1a2440] border-2 border-[#26355a] overflow-hidden rounded-lg shadow-black/20 shadow-md px-[15px] items-center'>
              <IoMdMail className='size-[27px]'/>
              <input type='text' readOnly className='w-full h-full outline-none text-[19px] text-slate-400 px-[15px] py[10px] bg-[#1a2440] cursor-not-allowed'value={userData.email}/>
          </div>
         
          <div className='relative w-[80%]'>
          <textarea
                 placeholder="Bio: Tell us about yourself..."
                 rows={3}
                 maxLength={70}
                 className="w-full h-[80px] resize-none outline-none text-[17px] text-white placeholder:text-slate-300 border-2 border-[#26355a] px-[20px] py-[10px] bg-[#1a2440] rounded-lg shadow-black/20 shadow-md"onChange={(e)=>setbio(e.target.value)} value={bio}>
                  
          </textarea>
          <span className=' absolute bottom-2 right-4 text-gray-400 pb-1 text-sm'>{70-bio.length}</span>
          </div>

          {/* Hobbies */}

      <div className=' relative w-[80%] gap-0'>

        <div className=' w-full h-[80px] overflow-y-auto bg-[#1a2440] border-2 border-[#26355a] rounded-lg p-2'>
            <span className='absolute bottom-2 right-2 text-gray-400 pb-1 text-sm'>
               {hobbies.length}
            </span>
        <div className='flex flex-wrap gap-2'>
             {hobbyList.map((hobby) => (<button
                 type="button"
                 key={hobby}
                 onClick={() => handleHobby(hobby)}
                 className={`px-3 py-1 rounded-full text-sm ${hobbies.includes(hobby)? "bg-blue-600 text-white": "bg-[#26355a] text-gray-300"}`}>
             {hobby}
             </button>
             ))}
        </div>
      </div>
    </div>

      <div className='h-[1px] mt-0'>{err && <p className='text-white'>{err}</p>}</div>

          <button className='px-[20px] py-[10px] bg-gradient-to-r from-blue-600 to-violet-600 rounded-2xl shadow-blue-500/20 shadow-lg text-[20px] w-[200px] mt-[8px] font-semibold hover:shadow-inner'disabled={saving}>{saving?"saving...":"Save Profile"}</button>
         </form>

    </div>
    </div>
  )
}

export default profile

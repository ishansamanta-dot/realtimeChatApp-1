import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { IoIosArrowRoundBack } from "react-icons/io";
import dp from "../assets/blank-dp.png"
import axios from "axios"
import { serverurl } from "../main"
import { useNavigate } from 'react-router-dom';

function friends() {
  let {suggestedUsers}=useSelector(state=>state.user)
    let [friends, setFriends] = useState([])
    let navigate=useNavigate()
    let [sentRequests, setSentRequests] = useState([])



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

            console.log(err)

        }

    }

    getFriends()

}, [])


useEffect(() => {

    const getSentRequests = async () => {

        try {

            const result = await axios.get(
                `${serverurl}/api/user/friend-request/sent`,
                {
                    withCredentials: true
                }
            );

            const ids = result.data.map(
                request => request.receiver
            );

            setSentRequests(ids);

        } catch (err) {

            console.log(err);

        }

    };

    getSentRequests();

}, []);



    const handleSendRequest = async (userId) => {
    try {
        await axios.post(`${serverurl}/api/user/friend-request/${userId}`,{},{withCredentials: true})
        console.log("Friend request sent")
        setSentRequests(prev => [...prev, userId])
        
    } catch (err) {
        console.log(err)
    }
}


const handleDeleteFriend = async (friendId) => {
    try {

        await axios.delete(
            `${serverurl}/api/user/friends/${friendId}`,
            {
                withCredentials: true
            }
        );

        // Remove immediately from UI
        setFriends(prev =>
            prev.filter(friend => friend._id !== friendId)
        );

    } catch (err) {

        console.log(err);

    }
};



  return (
      <div className='w-full min-h-[100vh] bg-[#070B1A] flex flex-col overflow-y-auto overflow-x-hidden'>

        <div className='cursor-pointer fixed top-[10px] left-[20px]'>
            <IoIosArrowRoundBack className='w-[45px] h-[45px] text-white 'onClick={()=>navigate("/")}/>
        </div>

        {/*User Friends*/}
        <section>
        <div className='w-full px-[30px] md:px-[50px] pt-[50px]'>
            <h2 className='text-gray-200 mb-[2px] font-bold text-[30px]'>Friends</h2>
            <p className='text-gray-400 mb-[25px] font-bold text-[20px]'>Your conncted friends</p>
            
            {friends.length>0? (
              <div className='flex gap-[30px] flex-wrap justify-start'>
            {friends?.map((user) => (
                
              <div className='w-[90%] sm:w-[220px] h-[160px] flex flex-col gap-[20px] pt-[20px] shadow-black/40 bg-[#121b32] shadow-xl rounded-2xl overflow-hidden'>
                {/*User Card*/}
                      <div className='w-full h-[50px] flex items-center gap-[15px] px-[20px]'>
                          <div className='w-[50px] h-[50px] bg-slate-400 rounded-full overflow-hidden flex justify-center items-center'>
                            <img src ={user.profilepic || dp} alt="" className='h-[100%] '/>
                          </div>
                          <h1 className='text-gray-300 font-semibold text-[18px] truncate'>{user.fullname}</h1>
                      </div>

                      <div className='w-full justify-around flex mt-[5px] '>
                        <button className='py-[3px] bg-red-600 hover:bg-red-500 rounded-xl shadow-blue-500/20 shadow-lg text-[20px] w-[90px] font-semibold hover:shadow-inner' onClick={() => handleDeleteFriend(user._id)}>Delete</button>
                      </div>
              </div>
            ))}
          
            </div>

            ):(<h1 className='text-[40px] text-slate-400 justify-center items-center flex'>Currently you have no friends</h1>)
            }
        </div>
        </section>


        {/*Divider*/}
        <div className='w-full px-[30px] md:px-[50px]'>
            <div className='w-full border-t border-slate-800'></div>
        </div>

        {/*Friend Suggetion*/}
        <section>
          <div className='w-full px-[30px] md:px-[50px] pt-[10px]'>
            <h2 className='text-gray-200 mb-[2px] font-bold text-[30px]'>Suggested Friends</h2>
            <p className='text-gray-400 mb-[25px] font-bold text-[20px]'>People you may know</p>
            
            {suggestedUsers.length>0? (
            <div className='flex gap-[30px] flex-wrap justify-start'>
            {suggestedUsers?.map((user)=>(
                
              <div className='w-[90%] sm:w-[220px] h-[160px] flex flex-col gap-[20px] pt-[20px] shadow-black/40 bg-[#121b32] shadow-xl rounded-2xl overflow-hidden'>
                {/*User Card*/}
                      <div className='w-full h-[50px] flex items-center gap-[15px] px-[20px]'>
                          <div className='w-[50px] h-[50px] bg-slate-400 rounded-full overflow-hidden flex justify-center items-center'>
                            <img src ={user.profilepic || dp} alt="" className='h-[100%] '/>
                          </div>
                          <h1 className='text-gray-300 font-semibold text-[18px] truncate'>{user.fullname}</h1>
                      </div>

                      <div className='w-full justify-around flex mt-[7px] '>
                        <button disabled={sentRequests.includes(user._id)} className={`py-[3px] rounded-xl shadow-blue-500/20 shadow-lg text-[20px] w-[150px] font-semibold hover:shadow-inner ${sentRequests.includes(user._id)? "bg-gray-600 cursor-not-allowed" : "bg-emerald-600 hover:bg-emerald-500"}` }onClick={() => handleSendRequest(user._id)}>{sentRequests.includes(user._id) ? "Pending..." : "Send Request"}</button>
                      </div>
              </div>
            ))}
            </div>
            ):(<h1 className='text-[35px] text-slate-400 justify-center items-center flex'>Currently you have no suggetions</h1>)
            }
        </div>
        </section>
      </div>
  )
}

export default friends

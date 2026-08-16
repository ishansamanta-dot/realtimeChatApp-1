import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { IoIosArrowRoundBack } from "react-icons/io";
import dp from "../assets/blank-dp.png"
import axios from "axios"
import { serverurl } from "../main"
import { useNavigate } from 'react-router-dom';

function notification() {
    let [requests, setRequests] = useState([])
    let navigate=useNavigate()


    useEffect(() => {

    const getRequests = async () => {

        try {

            const result = await axios.get(
                `${serverurl}/api/user/friend-request`,
                {
                    withCredentials: true
                }
            )

            setRequests(result.data)

        } catch (err) {

            console.log(err)

        }

    }
    getRequests()

}, [])



const handleAccept = async (requestId) => {

    try {

        await axios.put(
            `${serverurl}/api/user/friend-request/accept/${requestId}`,
            {},
            {
                withCredentials: true
            }
        )

        setRequests(prev =>
            prev.filter(request => request._id !== requestId)
        )

    } catch (err) {

        console.log(err)

    }
}


const handleReject = async (requestId) => {

    try {

        await axios.put(
            `${serverurl}/api/user/friend-request/reject/${requestId}`,
            {},
            {
                withCredentials: true
            }
        )

        setRequests(prev =>
            prev.filter(request => request._id !== requestId)
        )

    } catch (err) {

        console.log(err)

    }
}



  return (
      <div className='w-full min-h-[100vh] bg-[#070B1A] flex flex-col overflow-y-auto overflow-x-hidden'>

        <div className='cursor-pointer fixed top-[25px] left-[20px]'>
            <IoIosArrowRoundBack className='w-[45px] h-[45px] text-white 'onClick={()=>navigate("/")}/>
        </div>

        <div className='w-full px-[30px] md:px-[50px] pt-[60px]'>
            <h2 className='text-gray-200 mb-[10px] font-bold text-[40px]'>Friend Requests</h2>
            <p className='text-gray-400 mb-[30px] font-bold text-[20px]'>Manage your pending friend requests</p>
            
            {requests.length>0? (
            <div className='flex gap-[30px] flex-wrap justify-start'>
            {requests?.map((request) => (
                
              <div className='w-full sm:w-[220px] h-[170px] flex flex-col gap-[20px] pt-[20px] shadow-black/40 bg-[#121b32] shadow-xl rounded-2xl overflow-hidden'>
                {/*User Card*/}
                      <div className='w-full h-[50px] flex items-center gap-[15px] px-[20px]'>
                          <div className='w-[50px] h-[50px] bg-slate-400 rounded-full overflow-hidden flex justify-center items-center'>
                            <img src ={request.sender.profilepic || dp} alt="" className='h-[100%] '/>
                          </div>
                          <h1 className='text-gray-300 font-semibold text-[18px] truncate'>{request.sender.fullname}</h1>
                      </div>

                      <div className='w-full justify-around flex mt-[18px] '>
                        <button className='py-[5px] bg-red-600 hover:bg-red-500 rounded-2xl shadow-blue-500/20 shadow-lg text-[20px] w-[85px] font-semibold hover:shadow-inner' onClick={() => handleReject(request._id)}>Reject</button>
                        <button className='py-[5px] bg-emerald-600 hover:bg-emerald-500 rounded-2xl shadow-blue-500/20 shadow-lg text-[20px] w-[85px]  font-semibold hover:shadow-inner' onClick={() => handleAccept(request._id)}>Accept</button>
                      </div>
              </div>
            ))}
            </div>
            ):(<h1 className='text-[35px] text-slate-400 justify-center items-center flex'>Currently you have no friend requests</h1>)
            }
        </div>
      </div>
  )
}

export default notification

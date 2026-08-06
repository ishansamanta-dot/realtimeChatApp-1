import axios from "axios";
import { useEffect } from "react";
import { serverurl } from "../main";
import { useDispatch, useSelector } from "react-redux";
import { setsuggestedUsers, setUserData } from "../redux/userSlice";

const getsuggestedUsers=()=>{
    let dispatch=useDispatch()
    let {userData}=useSelector(state=>state.user)
    useEffect(()=>{
        const fetchUser=async()=>{
            try{
                let result=await axios.get(`${serverurl}/api/user/others`,{withCredentials:true,})
                dispatch(setsuggestedUsers(result.data))
            }catch(err){
                console.log(err);
            }
        }
        fetchUser()
    },[userData])
};

export default getsuggestedUsers;
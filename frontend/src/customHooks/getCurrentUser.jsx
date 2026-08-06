import axios from "axios";
import { useEffect } from "react";
import { serverurl } from "../main";
import { useDispatch, useSelector } from "react-redux";
import { setUserData } from "../redux/userSlice";

const getCurrentUser=()=>{
    let dispatch=useDispatch()
    let {userData}=useSelector(state=>state.user)
    useEffect(()=>{
        const fetchUser=async()=>{
            try{
                let result=await axios.get(`${serverurl}/api/user/current`,{withCredentials:true,});
                dispatch(setUserData(result.data));
            }catch(err){
                console.log(err);
            }
        };
        fetchUser();
    },[]);
};

export default getCurrentUser;
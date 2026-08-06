import axios from "axios";
import { useEffect } from "react";
import { serverurl } from "../main";
import { useDispatch, useSelector } from "react-redux";
//import { setUserData} from "../redux/userSlice";
import { setMessages } from "../redux/messageSlice.js";

const getMessage=()=>{
    let dispatch=useDispatch()
    let {selectedUser}=useSelector(state=>state.user)
    useEffect(()=>{
         if (!selectedUser) {
                dispatch(setMessages([]));
                return;
                }

        const fetchMessages=async()=>{
            try{
                let result=await axios.get(`${serverurl}/api/message/get/${selectedUser._id}`,{withCredentials:true});
                dispatch(setMessages(result.data));
            }catch(err){
                console.log(err);
            }
        };
        fetchMessages();
    },[selectedUser]);
};

export default getMessage;
import { createSlice } from "@reduxjs/toolkit";

const userSlice=createSlice({
    name:"user",
    initialState:{
        userData:null,
        suggestedUsers:[],
        selectedUser:null,
        socket:null,
        onlineUsers:null,
        searchData:null
    },
    reducers:{
        setUserData:(state,action)=>{
            state.userData=action.payload
        },
        setsuggestedUsers:(state,action)=>{
            state.suggestedUsers=action.payload
        },

       setSelectedUser:(state,action)=>{
            state.selectedUser=action.payload
       },

       setSocket:(state,action)=>{
            state.socket=action.payload
       },

       setOnlineUsers:(state,action)=>{
            state.onlineUsers=action.payload
       },

       setSearchData:(state,action)=>{
            state.searchData=action.payload
       },
   }
    
})


export const {setUserData,setSelectedUser,setsuggestedUsers,setOnlineUsers,setSocket,setSearchData}=userSlice.actions

export default userSlice.reducer
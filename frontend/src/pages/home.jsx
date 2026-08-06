import React from 'react'
import Sidebar from '../components/sidebar'
import MessageArea from '../components/messageArea' 
import { useSelector } from 'react-redux'
import getMessage from '../customHooks/getMessage'

function home() {
  let {selectedUser}=useSelector(state=>state.user)
  getMessage()
  return (
      <div className='w-full h-[100vh] flex overflow-hidden'>
        <Sidebar/>
        <MessageArea/>
      </div>
  )
}

export default home

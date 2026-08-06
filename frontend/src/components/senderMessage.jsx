import React, { useEffect, useRef } from 'react'


function senderMessage({image,message}) {
  let scroll=useRef()
useEffect(()=>{
  scroll?.current.scrollIntoView({behavior:"smooth"})
},[message,image])

const handleImageScroll=()=>{
  scroll?.current.scrollIntoView({behavior:"smooth"})
}

  return (
    <div className='max-w-[45%] w-fit break-all px-[20px] py-[10px] text-slate-100 text-[20px] rounded-tr-none rounded-2xl
     bg-gradient-to-r from-blue-600 to-indigo-600 relative gap-[10px] flex flex-col right-0 ml-auto shadow-black/30 shadow-md'>
      <div ref={scroll}>
      {image && <img src={image} alt="" className='w-[150px] rounded-lg' onLoad={handleImageScroll}/>}
      {message && <span >{message}</span>}
      </div>
    </div>
  )
}

export default senderMessage

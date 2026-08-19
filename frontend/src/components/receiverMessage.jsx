import React, { useEffect, useRef } from 'react'


function receiverMessage({image,message}) {
  let scroll=useRef()
useEffect(()=>{
  scroll?.current.scrollIntoView({behavior:"smooth"})
},[message,image])

const handleImageScroll=()=>{
  scroll?.current.scrollIntoView({behavior:"smooth"})
}

  return (
    <div className='w-fit max-w-[70%] md:max-w-[60%] lg:max-w-[55%] break-words px-[20px] py-[10px] text-slate-100 text-[20px] rounded-tl-none rounded-2xl
         bg-[#162545] relative gap-[10px] flex flex-col left-0 shadow-black/30 shadow-md'>
          <div ref={scroll}>
          {image && <img src={image} alt="" className='w-[150px] rounded-lg' onLoad={handleImageScroll}/>}
          {/*{message && <span >{message}</span>}*/}
          {message && <span>
   {message.split(/(https?:\/\/\S+)/g).map((part, i) =>
     /^https?:\/\//.test(part)
       ? <a key={i} href={part} className="underline text-blue-300" target="_blank" rel="noopener noreferrer">{part}</a>
       : part
   )}
</span>}
          </div>
    </div>
  )
}

export default receiverMessage

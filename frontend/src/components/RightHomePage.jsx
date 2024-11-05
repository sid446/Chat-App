import React from 'react'
import { useState } from 'react'

function RightHomePage({handleSendMessage,messages,recipient}) {
    const [message,setMessage]=useState('')
  return (
    <div className='h-screen w-[80%] bg-slate-600'>
        <div className='w-full h-[10%] bg-white bg-opacity-45 flex items-center p-4'>
          <h1 className='text-white'>{recipient || 'Select a contact to chat'}</h1>
        </div>
        
        <div className='w-full h-[80%] flex flex-col gap-2 p-4 overflow-y-auto'>
          { messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.type === 'sent' ? 'justify-end' : 'justify-start'}`}>
              <div className={`p-2 rounded ${msg.type === 'sent' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-black'}`}>
                {msg.content}
              </div>
            </div>
          ))}
        </div>
        
        <div className='w-full h-[10%] bg-white bg-opacity-45 flex justify-between p-4 items-center'>
          <input 
            className='w-[80%] h-[3rem]' 
            value={message} 
            onChange={(e) => setMessage(e.target.value)} 
            type="text" 
            placeholder="Type a message..." 
          />
          <button onClick={()=>handleSendMessage(message)} className='h-[3rem] w-[20%] bg-black text-white bg-opacity-45'>Send</button>
        </div>
      </div>
  )
}

export default RightHomePage
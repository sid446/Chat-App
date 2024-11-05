import React, { useState } from 'react';

function LeftHomePart({ userInfo, setContact, contacts, handleRecipient, recipient, handleLogout }) {
    const [localContact, setLocalContact] = useState(''); // Local state for the contact input

    const handleAddContact = () => {
        if (localContact.trim()) {
            setContact(localContact); // Call parent's add contact function
            setLocalContact(''); // Clear input after adding
        }
    };

    return (
        <div className='h-screen w-[20%] flex flex-col items-center bg-slate-950 gap-2'>
            <div className='text-white bg-white bg-opacity-45 flex justify-center items-center w-full h-[5%]'>
              <h1 className='text-2xl font-extralight'>{userInfo.name}</h1>
            </div>
            <div className='flex'>
              <input 
                value={localContact} 
                onChange={(e) => setLocalContact(e.target.value)} 
                type="text" 
                placeholder="Enter contact name"
                className='border-2 border-white bg-transparent text-white'
              />
              <button onClick={handleAddContact} className='text-white bg-white bg-opacity-45 w-[6rem] h-[2rem]'>Add Contact</button>
            </div>
            {contacts.map((item, i) => (
              <button
                onClick={()=>handleRecipient(item)}
                className={`h-[2rem] text-white bg-white bg-opacity-45 px-2 ${item === recipient ? 'bg-opacity-75' : ''}`}
                key={i}
              >
                {item}
              </button>
            ))}
            <div className='w-[6rem] h-[2rem] text-white flex justify-center items-center bg-white bg-opacity-45'>
              <button onClick={handleLogout}>Logout</button>
            </div>
        </div>
    );
}

export default LeftHomePart;

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../redux/user/userSlice';
import io from 'socket.io-client';

function Home() {
  const [socket, setSocket] = useState(null);
  const user = useSelector((state) => state.user.currentUser);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const [contacts, setContacts] = useState([]);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [contact, setContact] = useState('');
  const [recipient, setRecipient] = useState('');

  useEffect(() => {
    const newSocket = io("http://localhost:7000");
    setSocket(newSocket);
    
    if (user && user.email) {
      newSocket.emit('login', user.email);
    }
    
    newSocket.on('receiveMessage', ({ from, content }) => {
      setMessages((prevMessages) => [...prevMessages, { from, content, type: 'received' }]);
      if (!recipient) setRecipient(from);
    });
    
    newSocket.on("connect", () => console.log("Connected to socket"));
    
    return () => {
      newSocket.disconnect();
      setSocket(null);
    };
  }, [user]);

  const handleRecipient = (contact) => {
    setRecipient(contact);
    console.log("Recipient set to:", contact);
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (message.trim() === '' || !recipient) return;
    
    socket.emit("sendMessage", {
      recipient,
      content: message
    });

    setMessages((prevMessages) => [...prevMessages, { content: message, type: 'sent' }]);
    setMessage('');
  };

  const handleLogout = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:7000/api/v1/users/logout", {
        method: 'POST',
        credentials: 'include',
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.message || 'Something went wrong');
        return;
      }

      dispatch(logout());
      navigate('/signin');
    } catch (error) {
      setError(error.message || 'Network error');
    }
  };

  const handleAddContact = () => {
    if (contact.trim()) {
      setContacts((prevContacts) => [...prevContacts, contact]);
      setContact(''); // Clear input after adding
    }
  };

  if (!user) {
    return <div className="text-center mt-20 text-lg font-semibold">Please log in to view your profile.</div>;
  }

  return (
    <div className="w-screen h-screen flex justify-center items-center">
      <div className='h-screen w-[20%] flex flex-col items-center bg-slate-950 gap-2'>
        <div className='text-white bg-white bg-opacity-45 flex justify-center items-center w-full h-[5%]'>
          <h1 className='text-2xl font-extralight'>{user.name}</h1>
        </div>
        <div className='flex'>
          <input value={contact} onChange={(e) => setContact(e.target.value)} type="text" />
          <button onClick={handleAddContact} className='text-white bg-white bg-opacity-45 w-[6rem] h-[2rem]'>Add Contact</button>
        </div>
        {contacts.map((item, i) => (
          <button
            onClick={() => handleRecipient(item)}
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
      
      <div className='h-screen w-[80%] bg-slate-600'>
        <div className='w-full h-[10%] bg-white bg-opacity-45 flex items-center p-4'>
          <h1 className='text-white'>{recipient || 'Select a contact to chat'}</h1>
        </div>
        
        <div className='w-full h-[80%] flex flex-col gap-2 p-4 overflow-y-auto'>
          {messages.map((msg, i) => (
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
          <button onClick={handleSendMessage} className='h-[3rem] w-[20%] bg-black text-white bg-opacity-45'>Send</button>
        </div>
      </div>
    </div>
  );
}

export default Home;

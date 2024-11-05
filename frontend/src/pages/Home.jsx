import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../redux/user/userSlice';
import io from 'socket.io-client';
import LeftHomePart from '../components/LeftHomePart';
import RightHomePage from '../components/RightHomePage';

function Home() {
  const [socket, setSocket] = useState(null);
  const user = useSelector((state) => state.user.currentUser);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const [contacts, setContacts] = useState([]);
  const [error, setError] = useState('');
  const [messages, setMessages] = useState([]);
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

  const handleRecipient = (item) => {
    setRecipient(item);
    console.log("Recipient set to:", item);
  };

  const handleSendMessage = (message) => {
    
    if (message.trim() === '' || !recipient) return;
    
    socket.emit("sendMessage", {
      recipient,
      content: message
    });

    setMessages((prevMessages) => [...prevMessages, { content: message, type: 'sent' }]);
    
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
  

  const handleAddContact = (newContact) => {
    if (newContact.trim()) {
      setContacts((prevContacts) => [...prevContacts, newContact]);
    }
  };

  if (!user) {
    return <div className="text-center mt-20 text-lg font-semibold">Please log in to view your profile.</div>;
  }

  return (
    <div className="w-screen h-screen flex justify-center items-center">
      <LeftHomePart  
        userInfo={user} 
        setContact={handleAddContact} 
        contacts={contacts} 
        handleRecipient={handleRecipient} 
        recipient={recipient} 
        handleLogout={handleLogout} 
      />
      
      <RightHomePage handleSendMessage={handleSendMessage}  messages={messages} recipient={recipient}/>
    </div>
  );
}

export default Home;

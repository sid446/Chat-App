import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../redux/user/userSlice';
import io from 'socket.io-client'; // Import Socket.IO client

const socket = io('http://localhost:7000', { withCredentials: true });

function Home() {
  const user = useSelector((state) => state.user.currentUser);
  const navigate = useNavigate();
  const [recipient, setRecipient] = useState('sarthakchandel76@gmail.com'); // Placeholder recipient
  const [error, setError] = useState('');
  const dispatch = useDispatch();
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (message.trim() === '') return; // Prevent sending empty messages
    socket.emit("sendMessage", {
        recipient, // ensure this is defined correctly
        content: message // explicitly name the message as 'content' for clarity
    });
    setMessage('');
  };
 console.log(message)
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:7000/api/v1/users/logout", {
        method: 'POST',
        credentials: 'include', // Ensure cookies are sent with the request
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

  useEffect(() => {
    socket.on("connect", () => {
        console.log("connected");
    });

    if (user && user.email) {
        socket.emit('login', user.email); // Emit login event with user email
    }

    // Listen for received messages and update the state
    socket.on('receiveMessage', ({ from, content }) => {
        console.log(`Message from ${from}: ${content}`);
        
        // Add the new message to the `messages` state array
        setMessages((prevMessages) => [
            ...prevMessages,
            { from, content }
        ]);
    });

    // Clean up the socket connection on component unmount
    return () => {
        socket.off('receiveMessage');
    };
}, [user]); // Include `user` in dependencies to re-run if `user` changes


  if (!user) {
    return <div className="text-center mt-20 text-lg font-semibold">Please log in to view your profile.</div>;
  }

  return (
    <div className="w-screen h-screen flex flex-col justify-center items-center">
      <div className="h-[60vh] w-[80vw] bg-zinc-500 flex flex-col justify-center items-center p-5 rounded-md text-white">
        <div className='h-[10vh]'>
          <h1 className="text-lg">Welcome !! {user.name}</h1>
        </div>
        <div className='flex flex-row gap-3'>
          <input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            type="text"
            placeholder="Type your message"
            className="p-2 rounded"
          />
          <button onClick={handleSendMessage} className='h-[2rem] w-[4rem] bg-slate-900'>
            Send
          </button>
        </div>
        <div className="mt-4">
          {messages.map((msg, i) => (
            <div key={i} className="bg-gray-700 p-2 my-1 rounded">
              <strong>{msg.from}:</strong> {msg.content}
            </div>
          ))}
        </div>
        <button 
          onClick={handleSubmit} 
          type="button" 
          className="mt-4 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
        >
          Logout
        </button>

        {/* Error message display */}
        {error && <p className="mt-2 text-sm text-red-400">{error}</p>}
      </div>
    </div>
  );
}

export default Home;

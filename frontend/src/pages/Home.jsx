import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch,useSelector } from 'react-redux';
import { logout } from '../redux/user/userSlice';


function Home() {
  const user = useSelector((state) => state.user.currentUser);
  const navigate = useNavigate();
  const [error, setError] = useState(''); // Error state for handling logout issues
  const dispatch=useDispatch()

  console.log(user)
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:7000/api/v1/users/logout", {
        method: 'POST',
        credentials: 'include', // Ensure cookies are sent with the request
      });

      if (!res.ok) {
        const data = await res.json(); // Directly parse JSON response
        setError(data.message || 'Something went wrong');
        return;
      }

      // If logout is successful, navigate to the sign-in page
      dispatch(logout());
      navigate('/signin');
    } catch (error) {
      setError(error.message || 'Network error');
    }
  };

  if (!user) {
    return <div className="text-center mt-20 text-lg font-semibold">Please log in to view your profile.</div>;
  }

  return (
    <div className="w-screen h-screen flex flex-col justify-center items-center">
      <div className="h-[20vh] w-[60vw] bg-zinc-500 flex flex-col justify-center items-center p-5 rounded-md text-white">
        <h1 className="text-xl font-bold">Name: {user.name}</h1>
        <h1 className="text-lg">Email: {user.email}</h1>

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

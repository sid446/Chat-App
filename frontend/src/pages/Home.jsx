import React from 'react'
import { useNavigate } from 'react-router-dom';

function Home() {
    const navigate=useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
          const res = await fetch("http://localhost:7000/api/v1/users/logout", {
            method: 'POST',
            credentials: 'include', // Ensure cookies are sent with the request
          });
      
          // Check if the response is okay
          if (!res.ok) {
            const text = await res.text(); // Read response text
            const data = JSON.parse(text); // Parse response as JSON
            setError(data.message || 'Something went wrong');
            return;
          }
      
          // If logout is successful, navigate to the sign-in page
          navigate('/signin');
        } catch (error) {
          setError(error.message || 'Network error');
        }
      };
      
  return (
    <div>
   Home
        <button onClick={handleSubmit} type="button">Logout</button>
        </div>
    
  )
}

export default Home
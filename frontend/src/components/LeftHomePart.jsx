import React, { useState } from 'react';
import { useDispatch,useSelector } from 'react-redux';
import { addContact } from '../redux/user/userSlice.js';// Adjust the import path as needed

function LeftHomePart({ userInfo, setContact, handleRecipient, recipient, handleLogout }) {
    const [localContact, setLocalContact] = useState(''); // Local state for the contact input
    const [error, setError] = useState(''); // State to manage errors
    const [success, setSuccess] = useState(''); // State to manage success messages
    const dispatch = useDispatch(); // Initialize the dispatch function
    const contact=useSelector((state) => state.user.contacts);
    console.log(contact)

    function getCookie(name) {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
    }

    const cookie = getCookie('accessToken');

    const handleAddContact = async () => {
        if (localContact.trim()) {
            try {
                // Make an API call to add the contact
                const response = await fetch('http://localhost:7000/api/v1/users/addAccount', {
                    method: 'POST',
                    credentials: 'include',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${cookie}` // Include your token if necessary
                    },
                    body: JSON.stringify({ email: localContact }) // Sending the local contact as email
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || 'Failed to add contact');
                }

                const data = await response.json();
                setContact(localContact); // Call parent's add contact function
                dispatch(addContact(localContact)); // Dispatch the action to add the new contact to Redux store
                setLocalContact(''); // Clear input after adding
                setSuccess('Contact added successfully!'); // Set success message
                setError(''); // Clear any previous error messages

            } catch (error) {
                setError(error.message); // Set error message
                setSuccess(''); // Clear success message
            }
        } else {
            setError('Contact name cannot be empty.'); // Error if input is empty
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault(); // Prevent default form submission
        handleAddContact(); // Call the function to add the contact
    };

    return (
        <div className='h-screen w-[20%] flex flex-col items-center bg-slate-950 gap-2'>
            <div className='text-white bg-white bg-opacity-45 flex justify-center items-center w-full h-[5%]'>
                <h1 className='text-2xl font-extralight'>{userInfo.name}</h1>
            </div>
            <form onSubmit={handleSubmit} className='flex'>
                <input 
                    value={localContact} 
                    onChange={(e) => setLocalContact(e.target.value)} 
                    type="text" 
                    placeholder="Enter contact email"
                    className='border-2 border-white bg-transparent text-white'
                />
                <button type="submit" className='text-white bg-white bg-opacity-45 w-[6rem] h-[2rem]'>Add Contact</button>
            </form>
            {error && <p className="text-red-500">{error}</p>} {/* Display error messages */}
            {success && <p className="text-green-500">{success}</p>} {/* Display success messages */}
            {contact.map((item, i) => (
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
    );
}

export default LeftHomePart;

import React, { useState } from 'react';
import { back, line, cup,  flag,google } from '../utils/index.js'; // Ensure you import the help flag logo
import { useNavigate } from 'react-router-dom';

function SignIn() {
  const navigate=useNavigate();
  const [modeActive, setModeActive] = useState(false);
  const [loginMode, setLoginMode] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false); // State to manage modal visibility
  const [email, setEmail] = useState(''); // State for email input
  const [emailError, setEmailError] = useState(''); // State for email error message
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });
  
  const [error, setError] = useState("");
  

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: value || '', // Ensure value is always a string
    }));
  };
  
  console.log('formData', formData)

  const handleOnSubmit = async (e) => {
    e.preventDefault();
    const endPoint = loginMode
      ? "http://localhost:7000/api/v1/users/register"
      : "http://localhost:7000/api/v1/users/login";
  
    try {
      const res = await fetch(endPoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
        credentials: 'include',
      });
      if(!res.ok){
        const data=await res.json();
        setError(data.message)
        return
      }

      
      
      
      navigate('/');
    } catch (error) {
      setError(error.message || 'Network error');
    }
  };
  
  const handleCombinedChange = (e) => {
    handleEmailChange(e);
    handleChange(e);
  };
  
 

  // Toggle between login and register modes
  const SignUpRegisterChange = () => {
    setLoginMode(!loginMode);
  };

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // Handle flag click to open modal
  const handleFlagClick = () => {
    setIsModalOpen(true);
  };

  // Handle close modal
  const closeModal = () => {
    setIsModalOpen(false);
  };

  // Handle email change and validation
  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (value.trim() === '') {
      // Clear error if input is empty
      setEmailError('');
    } else if (!emailRegex.test(value)) {
      // Set error if email format is invalid
      setEmailError('Invalid email format.');
    } else {
      // Clear error if email format is valid
      setEmailError('');
    }
  };

  return (
    <>
      <div
        className="w-screen h-screen  flex flex-col md:flex-row sm:flex-row"
        style={{
          backgroundImage: `url(${back})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundColor: '#250000', // Default background color
        }}
        
      >
        {/* Left panel with mode switcher and form */}
        <div className="w-full  h-[30vh] md:h-full p-5 font-alegreya-sans-sc text-lg relative flex flex-col order-2 md:order-1">
         

          <div className="w-full h-[6vh]"></div>

          {/* Form Section */}
          <div className="flex-grow flex gap-[3rem] flex-col justify-center items-center">
            {/* Sign In / Register switcher */}
            <div
              className="w-[70vw]  md:w-[30vw] relative h-[3rem]  md:h-[3.5rem] bg-[#D9D9D9] bg-opacity-40 rounded-full transition-all duration-300 ease-in-out"
              onClick={SignUpRegisterChange}
            >
              <div
                className={`w-[30vw]   md:w-[15vw] flex justify-center items-center absolute font-bold text-2xl left-0 top-0 h-full rounded-full transition-transform duration-300 ease-in-out ${loginMode ? 'bg-[#D9D9D9] translate-x-[40vw] md:translate-x-[15vw] text-black' : 'bg-[#250000] md:bg-[#BB0101] text-white'}`}
              >
                <h1>{loginMode ? 'register' : 'sign in'}</h1>
              </div>
              <div className=" w-[70vw] md:w-[30vw] flex justify-between p-2 px-4  md:p-3">
                <h1 className="  md:px-[4rem] text-2xl text-white font-bold">sign in</h1>
                <h1 className="  md:px-[4rem] text-2xl text-white font-bold">register</h1>
              </div>
            </div>

            {/* Input fields */}
            <form onSubmit={handleOnSubmit} className={`flex flex-col justify-center items-center transition-all duration-300 ease-in-out ${loginMode ? 'gap-6 opacity-100' : 'gap-3 opacity-100'}`}>
              {/* Render Name field only in register mode */}
              {loginMode && (
                <input
                  className=" w-[70vw]  md:w-[30vw] h-[3rem] md:h-[3.5rem] p-4 rounded-full border-2 border-zinc-500 bg-transparent transition-opacity duration-500 ease-in-out placeholder:text-gray-400 placeholder:italic placeholder:font-alegreya-sans-sc placeholder:text-sm text-base text-white font-alegreya-sans-sc"
                  type="text"
                  id='name'
                  placeholder="Name"
                  value={formData.name}
                  onChange={handleChange}
                />
              )}
              <input
                className="w-[70vw]  md:w-[30vw] h-[3rem] md:h-[3.5rem] p-4 rounded-full border-2 border-zinc-500 bg-transparent transition-opacity duration-500 ease-in-out placeholder:text-gray-400 placeholder:italic placeholder:font-alegreya-sans-sc placeholder:text-sm text-base text-white font-alegreya-sans-sc"
                type="text"
                id="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleCombinedChange}
              
              />
              {/* Display email error message */}
              {emailError && <span className="text-red-500 text-sm">{emailError}</span>}
              
              {/* Password field with "show/hide" toggle */}
              <div className="relative w-[70vw] md:w-[30vw]">
                <input
                  className="w-full h-[3.5rem] p-4 rounded-full border-2 border-zinc-500 bg-transparent transition-opacity duration-500 ease-in-out placeholder:text-gray-400 placeholder:italic placeholder:font-alegreya-sans-sc placeholder:text-sm text-base text-white font-alegreya-sans-sc"
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                />
                <button
                  type="button"
                  className="absolute right-5 top-1/2 transform -translate-y-1/2 text-sm text-white"
                  onClick={togglePasswordVisibility}
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>

              {/* Sign Up Button with animation */}
              <div className='w-[70vw] md:w-[30vw] flex justify-between'>
              <button
              type='button'
             
                  className={`w-[43vw] md:w-[16vw] h-[2.5rem] md:h-[3.5rem] bg-white flex justify-between p-4 items-center   text-xl font-bold rounded-full mt-6 transform transition-transform duration-300 hover:scale-105 hover:bg-opacity-80 focus:outline-none focus:ring-2 focus:ring-offset-2`}
                >
                  <img className='w-[1.3rem] md:w-[2rem]' src={google} alt="" />
                  <h1 className='text-[#250000] text-sm md:text-lg' >sign up with google</h1>
                  
                </button>

                <button
                type='submit'
                  className={` w-[25vw] md:w-[10vw] h-[2.5rem] md:h-[3.5rem] ${loginMode ? "bg-[#250000] md:bg-[#BB0101] text-white" : "bg-[#D9D9D9] text-black"} text-xl font-bold rounded-full mt-6 transform transition-transform duration-300 hover:scale-105 hover:bg-opacity-80 focus:outline-none focus:ring-2 focus:ring-offset-2 ${loginMode ? "focus:ring-[#BB0101]" : "focus:ring-[#D9D9D9]"}`}
                >
                  {loginMode ? 'sign up' : 'sign in'}
                </button>
              </div>
            </form>
            
            {error && <span className="text-red-500 text-sm ">{error}</span>}
          </div>

          {/* Line image in the bottom left corner */}
          <div className="hidden md:flex absolute bottom-5 left-5">
            <img className="w-[6rem]" src={line} alt="Line Decoration" />
          </div>
        </div>

        {/* Right panel with welcome message */}
        <div className="flex w-full  h-[30vh]  md:h-[100vh] p-3  flex-col justify-start  items-center relative order-1 md:order-2 ">
          {/* Line image in the top right */}
          <div className="hidden md:flex  w-[57vw] justify-end items-center">
            <img className="w-[6rem]" src={line} alt="" />
          </div>

          <div className="h-[30vh] flex-grow flex justify-center  items-center"> {/* Centering container */}
            {/* Welcome message */}
            <div className="w-[58vw] flex-col  items-center font-alegreya-sans-sc text-lg  ">
              <div className=" gap-6 flex justify-center mr-10 items-center">
                <img className="w-[2rem]   md:w-[3rem] lg:w-[4rem]  " src={cup} alt="" />
                <h1 className="font-bold text-white text-2xl sm:text-4xl  md:text-5xl lg:text-6xl ">Welcome !!</h1>
              </div>

              {/* Account prompt */}
              <div className="flex   w-full justify-center  items-center mt-5">
                <span className="relative group w-[100%] md:w-[60%] lg:w-[60%]">
                  {/* Enhanced Quote styling */}
                  <h1 className="text-white text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold italic leading-relaxed font-alegreya-sans-sc text-center transition-all duration-300 ease-in-out transform group-hover:scale-105 group-hover:text-opacity-90">
                    <span className="absolute -left-5  md:-left-10 translate-x-6 top-0 md:-top-2 text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-black opacity-70">“</span>
                    why not use your money to make more money
                    <span className="absolute right-0 -translate-x-6 -bottom-2 text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-black opacity-70">”</span>
                  </h1>
                  {/* Animated underline */}
                  <span className="absolute left-1/2 bottom-0 h-[2px] w-[60%] bg-white opacity-70 transform -translate-x-1/2 scale-x-100 group-hover:scale-x-50 transition-transform duration-300 ease-in-out" />
               </span> 
              </div>
            </div>
          </div>

          {/* Help Flag Logo in the Bottom Right Corner */}
          <div className="absolute md:bottom-8 right-10" onClick={handleFlagClick}>
            <img className="w-[1.5rem]" src={flag} alt="Help Flag" />
          </div>
        </div>
      </div>

      {/* Modal for Help Information */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-md shadow-lg max-w-sm w-full">
            <h2 className="text-lg font-bold">Help</h2>
            <p className="mt-2">If you have any questions, please reach out to support at support@example.com.</p>
            <button 
              className="mt-4 px-4 py-2 bg-[#BB0101] text-white rounded-md" 
              onClick={closeModal}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default SignIn;

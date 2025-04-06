import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { forgetpassword, sendOtp } from '../../Services/UserService';
import { toast } from 'react-toastify';
import useButtonLoader from '../../Components/UseButtonLoader';

const ForgetPassword = () => {
  const [data, setData] = useState({
    username: ''
  })
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [VerifyButtonText, setVerifyLoading] = useButtonLoader(
    "Send OTP",
    "Sending OTP..."
  )



  const changeHandler = (event, property) => {
    setData({ ...data, [property]: event.target.value })
  }

  const handleSendOtp = (event) => {
    setVerifyLoading(true);
    setLoading(true);
    event.preventDefault()
    // console.log(data.username)
    if (!data.username) {
      toast.error("Please enter your email ID.");
      setVerifyLoading(false);
      setLoading(false);
      return;
    }
    
    forgetpassword(data.username)
    .then((response) => {
        setLoading(false);
        setVerifyLoading(false)
        localStorage.setItem("username", data.username);
        
        console.log("OTP Sent Successfully:", response);
        toast.success("OTP sent to your email. Please check your inbox.");
        navigate('/verify-otp', { state: { from: "ForgetPassword" } }); // Redirecting to OTP verification page
      })
      .catch((error) => {
        setLoading(false);
        setVerifyLoading(false)
        console.error("Error Sending OTP:")
        toast.error(error.response?.data?.message || "Failed to send OTP.");
      });
  };

  return (
    <div className="login-page">
      <div className='container-login'>
        <div className="header1">
          <div className="text">Forget Password</div>
          <div className="underline"></div>
        </div>
        <form>
          <div className="inputs">
            <div className="input">

              <input type="email" id="emaiid" placeholder='Email Id' onChange={(e) => changeHandler(e, 'username')} value={data.username} />
            </div>

            <div className="submit-container">
              <button className={`submit ${loading ? "submit-clicked" : ""} `} type='submit' onClick={handleSendOtp}>{VerifyButtonText}</button>
            </div>
          </div>
        </form>

      </div>
    </div>
  );
};

export default ForgetPassword;

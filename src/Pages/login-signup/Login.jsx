import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import './LoginSignup.css'
import email_icon from '/email.png'
import password_icon from '/password.png'
import { logIn, sendOtp } from '../../Services/UserService'
import { doLogin } from "../../Components/Auth/Index";
import { toast } from "react-toastify";
import useButtonLoader from "../../Components/UseButtonLoader";

const Login = () => {

  const navigate = useNavigate();

  const [data, setData] = useState({
    username: '',
    password: ''
  })

  const [error, setError] = useState({
    errors: {},
    isError: false
  })

  const [loading, setLoading] = useState(false);
  const [LoginButtonText, setLoginLoading] = useButtonLoader(
    "Login",
    "Logging in..."
  )

  // useEffect(() => {
  //   console.log(data);
  // }, [data])

  // change handler
  const changeHandler = (event, property) => {
    setData({ ...data, [property]: event.target.value })
  }
  //Email Handler
  const verifyEmailHandler = () => {
    if (!data.username) {
      toast.error("Please enter email id to send OTP")
    }
    sendOtp(data.username).then((response) => {
      // console.log(response)
      console.log("success")
      toast.success("Email verification OTP sent successfully..!")
      localStorage.setItem("username", data.username);
      navigate('/verify-otp', { state: { from: "Login" } })

    }).catch((error) => {
      // console.log(error)
      console.log("error log")
    })
  }
  //forget  password handler
  // const forgetpasswordHandler = () => {
  //   navigate('/forget-password');  // Navigate to the Forget Password Page
  // };

  //login handler
  const loginHandler = (event) => {
    event.preventDefault()
    setLoginLoading(true);
    setLoading(true);
    
    //console.log(data)
    // validation
    if (!data.username && !data.password) {
      toast.error("please enter email id and password..!")
      setLoginLoading(false);
      setLoading(false);
      return;
    }
    
    //sending data to backend
    logIn(data).then((response) => {
      console.log("SUccess log")
      setLoginLoading(false);
      setLoading(false);
      
      // save data to local storage
      doLogin(response, () => {
        //redirect
        navigate('/dashboard')
      })
      
      toast.success("User logged in successfully..!")
      
    }).catch((error) => {
      
      setLoginLoading(false);
      setLoading(false);
      // email related errors
      if (error.response?.data?.username)
        toast.error(error.response?.data?.username)

      // password length related errors
      if (error.response?.data?.password)
        toast.error(error.response?.data?.password)

      console.log(error)
      // console.log(error.response?.data?.message)

      // invalid username and password
      toast.error(error.response?.data?.message)
    })
  }

  return (
    <div className="login-page">
      <div className='container-login'>
        <div className="header1">
          <div className="text">Login</div>
          <div className="underline"></div>
        </div>
        <form>
          <div className="inputs">
            <div className="input">
              <img src={email_icon} alt="" />
              <input type="email" id="emaiid" placeholder='Email Id' onChange={(e) => changeHandler(e, 'username')} value={data.username} />
            </div>

            <div className="input">
              <img src={password_icon} alt="" />
              <input type="password" id="password" placeholder='Password' onChange={(e) => changeHandler(e, 'password')} value={data.password} />
            </div>
            <div className="forget-password" onClick={() => navigate('/forget-password')} > Forget Password?</div>

            <div className="submit-container">
              <button className={`submit ${loading ? "submit-clicked" : ""} `} type='submit' onClick={loginHandler}>{LoginButtonText}</button>
              <div className="submit" onClick={() => navigate('/register')}>Register</div>
            </div>
            <div className="verify-email" onClick={verifyEmailHandler}>Verify Email</div>
          </div>
        </form>

      </div>
    </div>
  );
};
export default Login; 
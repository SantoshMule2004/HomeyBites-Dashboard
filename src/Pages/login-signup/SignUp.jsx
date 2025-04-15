import React from 'react'
import { useState, useEffect } from 'react'
import './LoginSignup.css'
import user_icon from '/person.png'
import email_icon from '/email.png'
import password_icon from '/password.png'
import phone_icon from '/phone.svg'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { signIn } from '../../Services/UserService'
import useButtonLoader from '../../Components/UseButtonLoader'

const Signup = () => {

    const navigate = useNavigate();

    const [data, setData] = useState({
        firstName: '',
        lastName: '',
        emailId: '',
        dob:'-',
        gender:'-',
        phoneNo: '',
        password: '',
        cPassword:''
    })

    const [loading, setLoading] = useState(false);
    const [LoginButtonText, setLoginLoading] = useButtonLoader(
        "Register",
        "Registering..."
    )

    useEffect(() => {
        localStorage.setItem("username", data.emailId);
    }, [data])

    // change handler
    const changeHandler = (event, property) => {
        setData({ ...data, [property]: event.target.value })
    }

    //login handler
    const signinHandler = (event) => {
        event.preventDefault()
        setLoginLoading(true);
        setLoading(true);

        if (!data.name && !data.emailId && !data.phoneNo && !data.password) {
            toast.error("Please fill all the details..!")
            setLoginLoading(false);
            setLoading(false);
            return;
        }

        //sending data to backend
        signIn(data).then((response) => {
            console.log(response);
            localStorage.setItem("providerId", response?.classObj?.userId);
            setLoginLoading(false);
            setLoading(false);
            console.log("SUccess log")
            toast.success("Email registeration OTP has sent to your email id..!")
            navigate('/verify-otp', { state: { from: "SignUp" } });

        }).catch((error) => {
            console.log(error)
            setLoginLoading(false);
            setLoading(false);

            // first name
            if (error.response?.data?.firstName) {
                toast.error(error.response?.data?.firstName)
                return;
            }

            // last name
            if (error.response?.data?.lastName) {
                toast.error(error.response?.data?.lastName)
                return;
            }

            // emai id
            if (error.response?.data?.emailId) {
                toast.error(error.response?.data?.emailId)
                return;
            }
            // phone number
            if (error.response?.data?.phoneNo) {
                toast.error(error.response?.data?.phoneNo)
                return;
            }

            // date of birth
            if (error.response?.data?.dob) {
                toast.error(error.response?.data?.dob)
                return;
            }

            // gender
            if (error.response?.data?.gender) {
                toast.error(error.response?.data?.gender)
                return;
            }

            // password
            if (error.response?.data?.password) {
                toast.error(error.response?.data?.password)
                return;
            }

            // first name
            if (error.response?.data?.cPassword) {
                toast.error(error.response?.data?.cpassword)
                return;
            }

            if (error.response?.data?.message) {
                toast.error(error.response?.data?.message)
                return;
            }
        })
    }

    return (
        <div className="login-page">
            <div className='container-signup'>
                <div className="header1">
                    <div className="text">Register</div>
                    <div className="underline"></div>
                </div>
                <form>
                    <div className="inputs">
                        <div className="input">
                            <img src={user_icon} alt="" />
                            <input type="text" placeholder='enter first name' onChange={(e) => changeHandler(e, 'firstName')} value={data.firstName} />
                        </div>

                        <div className="input">
                            <img src={user_icon} alt="" />
                            <input type="text" placeholder='enter last name' onChange={(e) => changeHandler(e, 'lastName')} value={data.lastName} />
                        </div>

                        <div className="input">
                            <img src={email_icon} alt="" />
                            <input type="email" placeholder='enter email id' onChange={(e) => changeHandler(e, 'emailId')} value={data.emailId} />
                        </div>
                        <div className="input">
                            <img src={phone_icon} alt="" />
                            <input type="text" placeholder='Phone number' onChange={(e) => changeHandler(e, 'phoneNo')} value={data.phoneNo} />
                        </div>

                        <div className="input">
                            <img src={password_icon} alt="" />
                            <input type="password" placeholder='enter password' onChange={(e) => changeHandler(e, 'password')} value={data.password} />
                        </div>

                        <div className="input">
                            <img src={password_icon} alt="" />
                            <input type="password" placeholder='confirm password' onChange={(e) => changeHandler(e, 'cPassword')} value={data.cPassword} />
                        </div>

                        <div className="submit-container">
                            <button className={`submit ${loading ? "submit-clicked" : ""} `} type='submit' onClick={signinHandler}>{LoginButtonText}</button>
                            <div className="submit" onClick={() => navigate('/')}>Login</div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Signup;
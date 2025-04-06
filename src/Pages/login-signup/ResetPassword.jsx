import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import password_icon from '/password.png'
import { resetPass } from '../../Services/UserService';
import { toast } from 'react-toastify';
import useButtonLoader from '../../Components/UseButtonLoader';

const ResetPassword = () => {

    const navigate = useNavigate();

    const [data, setData] = useState({
        newPassword: '',
        cPassword: ''
    })

    const [loading, setLoading] = useState(false);
    const [ButtonText, setButtonLoading] = useButtonLoader(
        "Reset Passowrd",
        ""
    )

    // change handler
    const changeHandler = (event, property) => {
        setData({ ...data, [property]: event.target.value })
    }

    const ResetPasswordHandler = (event) => {
        event.preventDefault()

        setButtonLoading(true);
        setLoading(true);

        if (!data.cPassword && !data.newPassword) {
            toast.error("please enter password..!")
            setButtonLoading(false);
            setLoading(false);
            return;
        }

        resetPass(data, localStorage.getItem("username")).then((response) => {
            setButtonLoading(false);
            setLoading(false);
            localStorage.removeItem("username")
            console.log("success", response)
            toast.success(response.message + " please login..")
            navigate('/')
        }).catch((error) => {
            setButtonLoading(false);
            setLoading(false);
            console.log("error", error)
        })
    }

    return (
        <div className="login-page">
            <div className='container-login'>
                <div className="header1">
                    <div className="text">Reset Password</div>
                    <div className="underline"></div>
                </div>
                <form>
                    <div className="inputs">
                        <div className="input">
                            <img src={password_icon} alt="" />
                            <input type="password" id="password" placeholder='Enter new Password' onChange={(e) => changeHandler(e, 'newPassword')} value={data.newPassword} />
                        </div>

                        <div className="input">
                            <img src={password_icon} alt="" />
                            <input type="password" id="cpassword" placeholder='Re-enter password' onChange={(e) => changeHandler(e, 'cPassword')} value={data.cPassword} />
                        </div>

                        <div className="submit-container">
                            <button className={`submit ${loading ? "submit-clicked" : ""} `} type='submit' onClick={ResetPasswordHandler}>{ButtonText}</button>
                        </div>
                    </div>
                </form>

            </div>
        </div>
    )
};

export default ResetPassword;
import React, { useEffect, useState } from 'react'
import { VerifyEmail } from '../../Components/ProfileComponents/VerifyEmail'
import useButtonLoader from '../../Components/UseButtonLoader';
import { toast } from 'react-toastify';
import { resetPass, resetPassword, updateContactDetails, VerifyOtp } from '../../Services/UserService';
import { useNavigate } from 'react-router-dom';
import { useUserInfo } from '../../Context/UserContext';

export const UpdateLS = () => {

    const from = localStorage.getItem("From");

    const [isVerfied, setVerified] = useState(false);

    const navigate = useNavigate();

    const [number, setNumber] = useState("");

    const [passwordDto, setPasswordDto] = useState({
        "oldPassword": '',
        "newPassword": '',
        "cPassword": ''
    })

    const { getUserInfo } = useUserInfo();
    const user = getUserInfo();

    const [loading, setLoading] = useState(false);
    const [ButtonText, setButtonLoading] = useButtonLoader(
        "Update",
        ""
    )

    const [data, setData] = useState({
        otp: '',
        username: user?.emailId,
    })

    // change handler for OTP
    const changeData = (event, property) => {
        setData({ ...data, [property]: event.target.value })
    }

    // change handler for contact number
    const changeHandler = (event) => {
        setNumber(event.target.value);
    }

    // handler for reset pssword 
    const passwordChange = (event, property) => {
        setPasswordDto({ ...passwordDto, [property]: event.target.value })
    }

    // function to verify emailid
    const verifyEmailAddress = (event) => {
        event.preventDefault();

        if (!data.otp) {
            toast.error("Please enter the OTP");
            return;
        }

        VerifyOtp(data.otp, data.username).then((response) => {
            setVerified(true);
            console.log(response)
            toast.success("OTP verified Successfully..!");
        }).catch((error) => {
            console.log(error);
        })
    }

    // function to update contact after email is verified 
    const UpdateContact = (event) => {
        event.preventDefault();

        if (!number) {
            toast.error("Please enter contact number")
            return;
        }

        updateContactDetails(user?.userId, number).then((response) => {
            console.log(response);
            toast.success("Contact number updated successfully..!")
            navigate('/login-security')
            console.log("updated number")
        }).catch((error) => {
            console.log(error);
        })
    }

    // function to reset password 
    const resetPasswordHandler = (event, from) => {
        event.preventDefault();

        if (!passwordDto.newPassword || !passwordDto.cPassword) {
            toast.error("Please enter the passwords");
            return;
        }

        if (!passwordDto.newPassword) {
            toast.error("Please enter the new password");
            return;
        }

        if (!passwordDto.cPassword) {
            toast.error("Please confirm the password");
            return;
        }

        if (from === 'ResetPassword') {

            if (!passwordDto.oldPassword) {
                toast.error("Please enter the old password");
                return;
            }

            resetPassword(passwordDto).then((response) => {
                toast.success("Password updated successfully..!")
                console.log("success update pasword")
                navigate('/login-security')
            }).catch((error) => {
                console.log(error);
            })
        }
        else if (from === 'ForgetPassword') {
            
            resetPass(passwordDto, user?.emailId).then((response) => {
                toast.success("Passowrd changed successfully..!");
                console.log(response);
                navigate('/login-security')
            }).catch((error) => {
                console.log(error);
            })
        }
    }

    return (
        <div className="container mt-5 p-3" style={{ backgroundColor: '#fff', minHeight: '85vh' }}>
            {from === 'ChangeMobileNumber' ? (
                <div>
                    <h2 className="text-3xl mb-4 heading text-center">Change contact number</h2>
                    {
                        isVerfied && (
                            <div>
                                <form className='mt-5 d-flex justify-content-center align-items-center' onSubmit={UpdateContact}>
                                    <div className="d-flex" style={{ gap: '10px' }}>
                                        <input type="text" className="form-control no-focus-outline" id="exampleInputPassword1" placeholder='Enter new contact number' onChange={changeHandler} value={number} style={{ width: '300px' }} />
                                        <button type="submit" className="btn button">Update Number</button>
                                    </div>
                                </form>
                            </div>
                        )
                    }
                    {
                        !isVerfied && (
                            <VerifyEmail onClickhandler={verifyEmailAddress} onChangeHandler={changeData} data={data.otp} ></VerifyEmail>
                        )
                    }
                </div>
            ) : from === 'ResetPassword' ? (
                <div>
                    <h2 className="text-3xl mb-4 heading text-center">Reset Password</h2>
                    <form className="mt-5 row g-3" onSubmit={(e) => resetPasswordHandler(e, 'ResetPassword')}>
                        <div className="col-md-4">
                            <input type="password" className="form-control no-focus-outline" placeholder='Old Password' id="inputMenuName" onChange={(e) => passwordChange(e, 'oldPassword')} value={passwordDto.oldPassword} />
                        </div>

                        <div className="col-md-4">
                            <input type="password" className="form-control no-focus-outline" placeholder='New Password' id="inputMenuName" onChange={(e) => passwordChange(e, 'newPassword')} value={passwordDto.newPassword} />
                        </div>

                        <div className="col-md-4">
                            <input type="password" className="form-control no-focus-outline" placeholder='Confirm Password' id="inputMenuName" onChange={(e) => passwordChange(e, 'cPassword')} value={passwordDto.cPassword} />
                        </div>

                        <div className="mt-3 col-12 mt-1 d-flex justify-content-center">
                            <button className={`btn button`} type='submit'>Reset Password</button>
                        </div>
                    </form>
                </div>
            ) : from === 'ForgetPassword' ? (
                <div>
                    <h2 className="text-3xl mb-4 heading text-center">Forget Password</h2>
                    {
                        isVerfied && (
                            <div>
                                <form className="mt-5 row g-3" onSubmit={(e) => resetPasswordHandler(e, 'ForgetPassword')}>
                                    <div className="col-md-6">
                                        <input type="password" className="form-control no-focus-outline" placeholder='New Password' id="inputMenuName" onChange={(e) => passwordChange(e, 'newPassword')} value={passwordDto.newPassword} />
                                    </div>

                                    <div className="col-md-6">
                                        <input type="password" className="form-control no-focus-outline" placeholder='Confirm Password' id="inputMenuName" onChange={(e) => passwordChange(e, 'cPassword')} value={passwordDto.cPassword} />
                                    </div>

                                    <div className="mt-3 col-12 mt-1 d-flex justify-content-center">
                                        <button className={`btn button`} type='submit'>Reset Password</button>
                                    </div>
                                </form>
                            </div>
                        )
                    }

                    {
                        !isVerfied && (
                            <VerifyEmail title='Forget Password' onClickhandler={verifyEmailAddress} onChangeHandler={changeData} data={data.otp} ></VerifyEmail>
                        )
                    }
                </div>
            ) : (
                <div>
                </div>
            )}

        </div>
    )
}

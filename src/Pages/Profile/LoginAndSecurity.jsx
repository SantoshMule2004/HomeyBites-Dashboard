import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import ConfirmModal from '../../Components/ConfirmModel'
import { sendOtp, sendOtpForUpdate } from '../../Services/UserService';
import { toast } from 'react-toastify';
import ScreenLoader from '../../Components/ScreenLoader';
import { useUserInfo } from '../../Context/UserContext';

export const LoginAndSecurity = () => {

    const [isModalOpen, setIsModalOpen] = useState(false);

    const navigate = useNavigate();

    const [isLoading, setLoading] = useState(false);

    const { getUserInfo } = useUserInfo();
    const user = getUserInfo();

    const handleConfirm = () => {
        setIsModalOpen(false);
        sendOTP('DeleteAccount')
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    const handleDeleteClick = () => {
        setIsModalOpen(true);
    };

    const sendOTP = (from) => {
        setLoading(true);
        localStorage.setItem("From", from);

        sendOtpForUpdate(user?.emailId).then((response) => {
            toast.success("OTP sent to your registered email Id");
            navigate('/update')
            setLoading(false);
        }).catch((error) => {
            setLoading(false);
            console.log(error);
        })
    }

    return (
        <div className="container mt-5 p-3" style={{ backgroundColor: '#fff', minHeight: '85vh' }}>
            {isLoading ? (
                <ScreenLoader />
            ) : (
                <>
                    <h2 className="text-3xl mb-5 heading">Login & Security</h2>
                    <div className="row g-3">
                        <div className="col-md-12">
                            <Link onClick={() => sendOTP("ChangeMobileNumber")} className='btn button-secondary login-security'><i className="fa-solid fa-mobile me-3"></i>Chanage Contact number</Link>
                        </div>
                        <div className="divider"></div>
                        <div className="col-md-12">
                            <Link to='/update' onClick={() => localStorage.setItem("From", "ResetPassword")} className='btn button-secondary login-security'><i className="fa-solid fa-key me-3"></i>Reset Password</Link>
                        </div>
                        <div className="divider"></div>
                        <div className="col-md-12">
                            <Link onClick={() => sendOTP("ForgetPassword")} className='btn button-secondary login-security'><i className="fa-solid fa-key me-3"></i>Forget Password?</Link>
                        </div>
                        <div className="divider"></div>
                    </div>

                    <ConfirmModal isOpen={isModalOpen} onConfirm={handleConfirm} onCancel={handleCancel} title="Confirm" content="Confirm, you want to delete your account?" />
                </>
            )}
        </div>
    )
}

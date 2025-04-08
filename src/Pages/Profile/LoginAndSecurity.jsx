import React from 'react'
import { Link } from 'react-router-dom'

export const LoginAndSecurity = () => {
    return (
        <div className="container mt-5 p-3" style={{ backgroundColor: '#faf9f6' }}>
            <h2 className="text-3xl mb-5 heading">Login & Security</h2>
            <div className="row g-3">
                <div className="col-md-12">
                    <Link className='btn button-secondary login-security'><i className="fa-solid fa-mobile me-3"></i>Chanage Mobile number</Link>
                </div>
                <div className="divider"></div>
                <div className="col-md-12">
                    <Link className='btn button-secondary login-security'><i className="fa-solid fa-key me-3"></i>Reset Password</Link>
                </div>
                <div className="divider"></div>
                <div className="col-md-12">
                    <Link className='btn button-secondary login-security'><i className="fa-solid fa-key me-3"></i>Forget Password?</Link>
                </div>
                <div className="divider"></div>

                <div className="col-md-12">
                    <Link className='btn button-secondary login-security'><i className="fa-solid fa-user-minus me-3"></i>Delete business account</Link>
                </div>
            </div>
        </div>
    )
}

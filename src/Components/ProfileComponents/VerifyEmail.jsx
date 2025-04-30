import React from 'react'

export const VerifyEmail = ({ onClickhandler, onChangeHandler, otp }) => {
    return (
        <div>
            {/* <h2 className="text-3xl mb-4 heading text-center">{title}</h2> */}
            <form className='mt-5 d-flex justify-content-center align-items-center' onSubmit={onClickhandler}>
                <div className="d-flex" style={{ gap: '10px' }}>
                    <input type="password" className="form-control no-focus-outline" id="exampleInputPassword1" placeholder='Enter OTP' onChange={(e)=> onChangeHandler(e, 'otp')} value={otp} style={{ width: '300px' }} />
                    <button type="submit" className="btn button">Verify OTP</button>
                </div>
            </form>
            <div id="emailHelp" className="mt-2 d-flex justify-content-center align-items-center">
                <p className='fs-6'>Enter OTP sent to your registered Email-Id.</p>
            </div>
        </div>
    )
}

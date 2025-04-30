import React from 'react'

export const ResetPass = () => {
    return (
        <div>
            <form className='mt-2 d-flex align-items-center' onSubmit={OnClickHandler}>
                <div className="col-md-6">
                    <label htmlFor="exampleInputEmail1" className="form-label">Email address</label>
                    <input type="email" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" />
                    <div id="emailHelp" className="form-text">We'll never share your email with anyone else.</div>
                </div>
                <div className="d-flex" style={{ gap: '10px' }}>
                    <input type="password" className="form-control no-focus-outline" id="exampleInputPassword1" placeholder='Enter OTP' style={{ width: '300px' }} />
                    <div className="col-md-6 form-check">
                        <input type="checkbox" className="form-check-input" id="exampleCheck1" />
                        <label className="form-check-label" htmlFor="exampleCheck1">Check me out</label>
                    </div>
                    <button type="submit" className="btn button">Verify OTP</button>
                </div>
            </form>
            <div id="emailHelp" className="mt-2 ms-2">
                <p className='fs-6'>Enter OTP sent to your registered Email-Id.</p>
            </div>
        </div>
    )
}

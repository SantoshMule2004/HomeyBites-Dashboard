import React, { useEffect, useState } from 'react'
import useButtonLoader from '../../Components/UseButtonLoader';
import { updateUserInfo } from '../../Services/UserService';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { useUserInfo } from '../../Context/UserContext';

export const UpdateProfile = () => {

    const { getUserInfo, setUserInfo } = useUserInfo();
    const user = getUserInfo();

    const navigate = useNavigate();
    
    const [data, setData] = useState({
        firstName: user.firstName,
        middleName: user.middleName,
        lastName: user.lastName,
        dob: user.dob,
        gender: user.gender,
        phoneNo: user.phoneNo,
        password: user.password,
        cpassword:user.cpassword,
        emailId: user.emailId
    })

    const [loading, setLoading] = useState(false);
    const [LoginButtonText, setLoginLoading] = useButtonLoader(
        "Update",
        ""
    )

    // change handler
    const changeHandler = (event, property) => {
        setData({ ...data, [property]: event.target.value })
    }

    useEffect(() => {
        console.log(data)
    }, [data])

    const updateUserHandler = (event) => {
        event.preventDefault();
        setLoginLoading(true);

        updateUserInfo(user.userId, data).then((response) => {
            setLoginLoading(false);
            console.log(response);
            setUserInfo(response?.classObj);
            toast.success("Updated successfully..!");
            navigate("/profile")
        }).catch((error) => {
            toast.error("error")
            console.log(error);
        })
    }

    return (
        <div className="container mt-5 p-3" style={{ backgroundColor: '#faf9f6' }}>
            <h2 className="text-3xl mb-5 heading">Update Profile Details</h2>
            <form className="row g-3">

                <div className="col-md-12">
                    <label htmlFor="inputFirstName" className="form-label fw-bold">First Name</label>
                    <input type="text" className="form-control no-focus-outline" id="inputFirstName" onChange={(e) => changeHandler(e, 'firstName')} value={data.firstName} />
                </div>

                <div className="col-md-12">
                    <label htmlFor="inputMiddleName" className="form-label fw-bold">Middle Name</label>
                    <input type="text" className="form-control no-focus-outline" id="inputMiddleName" onChange={(e) => changeHandler(e, 'middleName')} value={data.middleName} />
                </div>

                <div className="col-md-12">
                    <label htmlFor="inputLastName" className="form-label fw-bold">Last Name</label>
                    <input type="text" className="form-control no-focus-outline" id="inputLastName" onChange={(e) => changeHandler(e, 'lastName')} value={data.lastName} />
                </div>

                <div className="col-md-12">
                    <label className="form-label fw-bold me-3">Gender</label>
                    {/* <input type="text" className="form-control no-focus-outline" id="inputBusinessName" onChange={(e) => changeHandler(e, 'businessName')} value={businessData.businessName} /> */}

                    <div className="form-check form-check-inline">
                        <input className="form-check-input" type="radio" name="inlineRadioOptions" id="inlineRadio1" value="Male" onChange={(e) => changeHandler(e, 'gender')} checked={data.gender === "Male"} />
                        <label className="form-check-label" htmlFor="inlineRadio1">Male</label>
                    </div>
                    <div className="form-check form-check-inline">
                        <input className="form-check-input" type="radio" name="inlineRadioOptions" id="inlineRadio2" value="Female" onChange={(e) => changeHandler(e, 'gender')} checked={data.gender === "Female"} />
                        <label className="form-check-label" htmlFor="inlineRadio2">Female</label>
                    </div>
                    <div className="form-check form-check-inline">
                        <input className="form-check-input" type="radio" name="inlineRadioOptions" id="inlineRadio3" value="Other" onChange={(e) => changeHandler(e, 'gender')} checked={data.gender === "Other"} />
                        <label className="form-check-label" htmlFor="inlineRadio3">Other</label>
                    </div>
                </div>

                <div className="col-md-12">
                    <label htmlFor="inputDOB" className="form-label fw-bold">date Of Birth</label>
                    <input type="date" className="form-control no-focus-outline" id="inputDOB" onChange={(e) => changeHandler(e, 'dob')} value={data.dob} />
                </div>

                <div className="col-12 mt-5 d-flex justify-content-center">
                    <button className={`btn button`} type='submit' style={{ width: '250px' }} onClick={updateUserHandler}>{LoginButtonText}</button>
                </div>
            </form>
        </div>
    )
}

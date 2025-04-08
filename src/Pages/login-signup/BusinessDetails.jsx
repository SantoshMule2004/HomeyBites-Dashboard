import React from 'react'
import { useState, useEffect } from 'react'
import './LoginSignup.css'
import user_icon from '/person.png'
import email_icon from '/email.png'
import password_icon from '/password.png'
import phone_icon from '/phone.svg'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { addBusinessDetails, signIn } from '../../Services/UserService'
import useButtonLoader from '../../Components/UseButtonLoader'

const BusinessDetails = () => {

    const navigate = useNavigate();

    const [data, setData] = useState({
        businessName: '',
        foodLicenseNo: '',
        gstin: '',
        address: [
            {
                addressLine: '',
                landmark: '',
                city: '',
                state: '',
                country: '',
                latitude: '',
                longitude: '',
                serviceRadius: ''
            }
        ]
    })

    const [loading, setLoading] = useState(false);
    const [LoginButtonText, setLoginLoading] = useButtonLoader(
        "Create Business Account",
        ""
    )

    // change handler
    const changeHandler = (event, property) => {
        setData({ ...data, [property]: event.target.value })
    }

    const handleChange = (e, index = null, field = null) => {
        const { name, value } = e.target;

        setData(prevData => {
            if (index !== null && field) {
                // Updating address array
                const updatedAddress = [...prevData.address];
                updatedAddress[index] = { ...updatedAddress[index], [field]: value };
                return { ...prevData, address: updatedAddress };
            } else {
                // Updating top-level fields
                return { ...prevData, [name]: value };
            }
        });
    };

    console.log("provider ID",localStorage.getItem("providerId"))

    useEffect(()=> {
        console.log(data);
    }, [data])

    //login handler
    const signinHandler = (event) => {
        event.preventDefault()
        setLoginLoading(true);
        setLoading(true);

        if (!data.businessName && !data.foodLicenseNo && !data.foodLicenseNo && !data.gstin && !data.address[0].addressLine && !data.address[0].city && !data.address[0].country && !data.address[0].landmark && !data.address[0].latitude && !data.address[0].longitude &&  !data.address[0].serviceRadius && !data.address[0].state) {
            toast.error("Please fill all the details..!")
            setLoginLoading(false);
            setLoading(false);
            return;
        }

        //sending data to backend
        addBusinessDetails(localStorage.getItem("providerId"), data).then((response) => {
            setLoginLoading(false);
            setLoading(false);
            console.log("SUccess log")
            console.log(response)
            toast.success("Business account created successfully..!")
            navigate('/Login');

        }).catch((error) => {
            console.log(error)
            setLoginLoading(false);
            setLoading(false);

            // business name
            if (error.response?.data?.businessName) {
                toast.error("error")
                return;
            }
            // food license number
            if (error.response?.data?.foodLicenseNo) {
                toast.error("error")
                return;
            }

            // gstin number
            if (error.response?.data?.gstin) {
                toast.error("error")
                return;
            }
        })
    }

    return (
        <div className="login-page" style={{minHeight:"100%"}}>
            <div className='container-signup'>
                <div className="header1">
                    <div className="text">Add business details</div>
                    <div className="underline"></div>
                </div>
                <form>
                    <div className="inputs">
                        <div className="input">
                            <img src={user_icon} alt="" />
                            <input type="text" placeholder='enter business name' onChange={(e) => changeHandler(e, 'businessName')} value={data.businessName} />
                        </div>

                        <div className="input">
                            <img src={user_icon} alt="" />
                            <input type="text" placeholder='enter food license No.' onChange={(e) => changeHandler(e, 'foodLicenseNo')} value={data.foodLicenseNo} />
                        </div>

                        <div className="input">
                            <img src={email_icon} alt="" />
                            <input type="email" placeholder='enter GSTIN No.' onChange={(e) => changeHandler(e, 'gstin')} value={data.gstin} />
                        </div>

                        <h4>Enter Business Address:</h4>

                        <div className="input">
                            <img src={phone_icon} alt="" />
                            <input type="text" placeholder='address line' value={data.address[0].addressLine} onChange={(e) => handleChange(e, 0, 'addressLine')} />
                        </div>

                        <div className="input">
                            <img src={password_icon} alt="" />
                            <input type="text" placeholder='Landmark' value={data.address[0].landmark} onChange={(e) => handleChange(e, 0, 'landmark')} />
                        </div>
                        
                        <div className="input">
                            <img src={password_icon} alt="" />
                            <input type="text" placeholder='country' value={data.address[0].country} onChange={(e) => handleChange(e, 0, 'country')} />
                        </div>

                        <div className="input">
                            <img src={password_icon} alt="" />
                            <input type="text" placeholder='state' value={data.address[0].state} onChange={(e) => handleChange(e, 0, 'state')} />
                        </div>

                        <div className="input">
                            <img src={password_icon} alt="" />
                            <input type="text" placeholder='city' value={data.address[0].city} onChange={(e) => handleChange(e, 0, 'city')} />
                        </div>

                        <div className="input">
                            <img src={password_icon} alt="" />
                            <input type="text" placeholder='latitude' value={data.address[0].latitude} onChange={(e) => handleChange(e, 0, 'latitude')} />
                        </div>

                        <div className="input">
                            <img src={password_icon} alt="" />
                            <input type="text" placeholder='longitude' value={data.address[0].longitude} onChange={(e) => handleChange(e, 0, 'longitude')} />
                        </div>

                        <div className="input">
                            <img src={password_icon} alt="" />
                            <input type="text" placeholder='service radius' value={data.address[0].serviceRadius} onChange={(e) => handleChange(e, 0, 'serviceRadius')} />
                        </div>

                        <div className="submit-container">
                            <button className={`submit ${loading ? "submit-clicked" : ""} `} style={{width:"100%"}} type='submit' onClick={signinHandler}>{LoginButtonText}</button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default BusinessDetails;
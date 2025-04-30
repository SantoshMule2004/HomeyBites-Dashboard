import React, { useEffect, useState } from 'react'
import useButtonLoader from '../../Components/UseButtonLoader';
import { useNavigate } from 'react-router-dom';
import { getProviderInfo, updateBusinessDetails, updateUserInfo } from '../../Services/UserService';
import { toast } from 'react-toastify';
import ScreenLoader from '../../Components/ScreenLoader';
import { useUserInfo } from '../../Context/UserContext';

export const UpdateBusinessDetails = () => {

    const [loading, setLoading] = useState(false);
    const [LoginButtonText, setLoginLoading] = useButtonLoader(
        "Update business details",
        ""
    )
    const navigate = useNavigate();

    const { getUserInfo, setUserInfo } = useUserInfo();

    const user = getUserInfo();

    const [providerData, setproviderData] = useState({});

    const [businessData, setBusinessData] = useState({
        businessName: user.businessName,
        foodLicenseNo: user.foodLicenseNo,
        gstin: user.gstin,
        address: [
            {
                addressLine: user?.address[0]?.addressLine,
                landmark: user?.address[0]?.landmark,
                city: user?.address[0]?.city,
                state: user?.address[0]?.state,
                country: user?.address[0]?.country,
                latitude: user?.address[0]?.latitude,
                longitude: user?.address[0]?.longitude,
                serviceRadius: user?.address[0]?.serviceRadius
            }
        ]
    })

    // const getProviderInfoHandler = () => {
    //     getProviderInfo(user.userId).then((response) => {
    //         setproviderData(response);
    //         setLoading(false);
    //     }).catch((error) => {
    //         console.log(error);
    //     })
    // }

    // change handler
    const changeHandler = (event, property) => {
        setBusinessData({ ...businessData, [property]: event.target.value })
    }

    const handleChange = (e, index = null, field = null) => {
        const { name, value } = e.target;

        setBusinessData(prevData => {
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

    useEffect(() => {
        console.log(businessData)
    }, [businessData])

    const UpdateBusinessDetailsHandler = (event) => {
        event.preventDefault();
        setLoginLoading(true);

        console.log("userData to be sent", businessData)

        updateBusinessDetails(user.userId, businessData, user.address[0].addId).then((response) => {
            setLoginLoading(false);
            console.log("UserData", response?.classObj)
            setUserInfo(response?.classObj);
            toast.success("Business details updated successfully..!");
            console.log(response);
            navigate("/profile")

        }).catch((error) => {
            console.log(error);
            setLoginLoading(false);
        })
    }

    return (
        <div className="container mt-5 p-3" style={{ backgroundColor: '#faf9f6' }}>
            <h2 className="text-3xl mb-5 heading">Update Business Details</h2>
            <form className="row g-3">

                <div className="col-md-12">
                    <label htmlFor="inputBusinessName" className="form-label fw-bold">Business Name</label>
                    <input type="text" className="form-control no-focus-outline" id="inputBusinessName" onChange={(e) => changeHandler(e, 'businessName')} value={businessData.businessName || ""} />
                </div>

                <div className="col-md-6">
                    <label htmlFor="inputFoodNo" className="form-label fw-bold">Food License No.</label>
                    <input type="text" className="form-control no-focus-outline" id="inputFoodNo" onChange={(e) => changeHandler(e, 'foodLicenseNo')} value={businessData.foodLicenseNo || ""} readOnly />
                </div>

                <div className="col-md-6">
                    <label htmlFor="inputGSTIN" className="form-label fw-bold">GSTIN No.</label>
                    <input type="text" className="form-control no-focus-outline" id="inputGSTIN" onChange={(e) => changeHandler(e, 'gstin')} value={businessData.gstin || ""} readOnly />
                </div>

                <h4 className='heading mt-5'>Business address</h4>

                <div className="col-md-12">
                    <label htmlFor="inputAddressLine" className="form-label fw-bold">Address line</label>
                    <input type="text" className="form-control no-focus-outline" id="inputAddressLine" value={businessData.address[0].addressLine || ""} onChange={(e) => handleChange(e, 0, 'addressLine')} />
                </div>
                <div className="col-md-12">
                    <label htmlFor="inputLandmark" className="form-label fw-bold">Landmark</label>
                    <input type="text" className="form-control no-focus-outline" id="inputLandmark" value={businessData.address[0].landmark || ""} onChange={(e) => handleChange(e, 0, 'landmark')} />
                </div>
                {/* <div className="col-md-4">
                    <label htmlFor="inputCountry" className="form-label fw-bold">Country</label>
                    <input type="text" className="form-control no-focus-outline" id="inputCountry" value={businessData.address[0].country} onChange={(e) => handleChange(e, 0, 'country')} />
                </div> */}
                <div className="col-md-4">
                    <label htmlFor="inputState" className="form-label fw-bold">State</label>
                    <input type="text" className="form-control no-focus-outline" id="inputState" value={businessData.address[0].state || ""} onChange={(e) => handleChange(e, 0, 'state')} />
                </div>

                <div className="col-md-4">
                    <label htmlFor="inputCity" className="form-label fw-bold">City</label>
                    <input type="text" className="form-control no-focus-outline" id="inputCity" value={businessData.address[0].city || ""} onChange={(e) => handleChange(e, 0, 'city')} />
                </div>

                <div className="col-md-4">
                    <label htmlFor="inputSRadius" className="form-label fw-bold">Service radius</label>
                    <input type="text" className="form-control no-focus-outline" id="inputSRadius    " value={businessData.address[0].serviceRadius || ""} onChange={(e) => handleChange(e, 0, 'serviceRadius')} />
                </div>

                <div className="col-md-6">
                    <label htmlFor="inputLat" className="form-label fw-bold">Latitude</label>
                    <input type="text" className="form-control no-focus-outline" id="inputLat" value={businessData.address[0].latitude || ""} onChange={(e) => handleChange(e, 0, 'latitude')} />
                </div>
                <div className="col-md-6">
                    <label htmlFor="inputLon" className="form-label fw-bold">Longitude</label>
                    <input type="text" className="form-control no-focus-outline" id="inputLon" value={businessData.address[0].longitude || ""} onChange={(e) => handleChange(e, 0, 'longitude')} />
                </div>



                <div className="col-12 mt-5 d-flex justify-content-center">
                    <button className={`btn button`} type='submit' onClick={UpdateBusinessDetailsHandler} style={{ width: '250px' }}>{LoginButtonText}</button>
                </div>
            </form>
        </div>
    )
}

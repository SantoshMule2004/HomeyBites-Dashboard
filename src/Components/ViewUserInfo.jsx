import React from 'react'
import { getMenuOfProvider } from '../Services/MenuService'
import { useNavigate } from 'react-router-dom'

export const ViewUserInfo = ({ userData }) => {

    const navigate = useNavigate();
    return (
        <div>
            <h2 className="text-3xl mb-4 heading">Personal information</h2>
            <div className="row g-3">
                <div className="col-md-12">
                    <label htmlFor="Name" className="form-label fw-bold">Name</label>
                    <input type="text" className="form-control no-focus-outline" id="Name" value={userData.firstName || '' + " " + userData.lastName || ''} readOnly />
                </div>

                <div className="col-md-8">
                    <label htmlFor="emailId" className="form-label fw-bold">Email Id</label>
                    <input type="text" className="form-control no-focus-outline" id="emailId" value={userData.emailId || ''} readOnly />
                </div>

                <div className="col-md-4">
                    <label htmlFor="ContactNo" className="form-label fw-bold">Contact No.</label>
                    <input type="text" className="form-control no-focus-outline" id="ContactNo" value={userData.phoneNo || ''} readOnly />
                </div>

                <div className="col-md-6">
                    <label htmlFor="gender" className="form-label fw-bold">Gender</label>
                    <input type="text" className="form-control no-focus-outline" id="gender" value={userData.gender || ''} readOnly />
                </div>

                <div className="col-md-6">
                    <label htmlFor="dob" className="form-label fw-bold">Date of birth</label>
                    <input type="text" className="form-control no-focus-outline" id="dob" value={userData.dob || ''} readOnly />
                </div>

                <div className="col-md-12">
                    <label htmlFor="userRole" className="form-label fw-bold">User Role</label>
                    <input type="text" className="form-control no-focus-outline" id="userRole" value={userData.userRole || ''} readOnly />
                </div>

                {
                    userData.userRole === "ROLE_NORMAL_USER" && (
                        (userData?.address).map((address, index) => (
                            <div className="col-md-12" key={index}>
                                <label htmlFor="address" className="form-label fw-bold">Address {" "}</label>
                                <textarea className="form-control no-focus-outline" rows="3" id='address' value={address.addressLine || '' + ", near " + address.landmark || '' + ", " + address.city || '' + ", " + address.state || ''} readOnly></textarea>
                            </div>
                        ))
                    )
                }
            </div>

            {
                (userData.userRole === "ROLE_TIFFIN_PROVIDER") && (
                    <>
                        <h2 className="text-3xl mt-5 mb-4 heading">Business information</h2>
                        <div className="row g-3">
                            <div className="col-md-12">
                                <label htmlFor="businessname" className="form-label fw-bold">Business name</label>
                                <input type="text" className="form-control no-focus-outline" id="businessname" value={userData.businessName || ''} readOnly />
                            </div>

                            <div className="col-md-4">
                                <label htmlFor="GSTIN" className="form-label fw-bold">GSTIN</label>
                                <input type="text" className="form-control no-focus-outline" id="GSTIN" value={userData.gstin || ''} readOnly />
                            </div>

                            <div className="col-md-8">
                                <label htmlFor="FoodLicenseNo" className="form-label fw-bold">Food License No.</label>
                                <input type="text" className="form-control no-focus-outline" id="FoodLicenseNo" value={userData.foodLicenseNo || ''} readOnly />
                            </div>

                            {
                                userData.address !== null && (
                                    (userData?.address)?.map((address, index) => (
                                        <div className="col-md-12" key={index}>
                                            <label htmlFor="address" className="form-label fw-bold">Address {" "}</label>
                                            <textarea className="form-control no-focus-outline" rows="3" id='address' value={address.addressLine || '' + ", near " + address.landmark || '' + ", " + address.city || '' + ", " + address.state || ''} readOnly></textarea>
                                        </div>
                                    ))
                                )
                            }

                            <div className="col-12 mt-5 mb-5 d-flex justify-content-center">
                                <button className={`btn button`} type='submit' onClick={() => navigate('/tiffin-provider-plans')}>View tiffin plans of Provider</button>
                                <button className={`btn button`} type='submit' onClick={() => navigate('/tiffin-provider-menuitems')}>View menuitems of Provider</button>
                            </div>
                        </div>
                    </>
                )
            }
        </div>
    )
}

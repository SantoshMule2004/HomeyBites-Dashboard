import React, { useEffect, useState } from 'react'
import { Base } from '../Base/Base'
import { Link, useNavigate } from 'react-router-dom'
import { getUserInfo } from '../../Components/Auth/Index'
import { getTiffinPlans } from '../../Services/TiffinPlanService'
import ScreenLoader from '../../Components/ScreenLoader'
import { useTiffinPlans } from '../../Context/TiffinPlanContext'

export const TiffinPlan = () => {

    const [tiffiPlans, setTiffinPlans] = useState([]);

    const [loading, setLoading] = useState(true);

    const { getTiffinPlanData, setTiffinPlanData } = useTiffinPlans();

    const user = getUserInfo();

    const navigate = useNavigate();

    const ViewTiffinPlanInfo = (id) => {
        navigate("/view-tiffinplan")
        localStorage.setItem("planId", id);
    }

    const getTiffinPlanOfProvider = () => {
        setLoading(true);
        if (user != null) {
            if (getTiffinPlanData() == null) {
                console.log("API call")
                getTiffinPlans(user.userId).then((response) => {
                    setLoading(false);
                    console.log(response)
                    setTiffinPlans(response);
                    setTiffinPlanData(response);
                }).catch((error) => {
                    setLoading(false);
                    console.log(error);
                })
            } else {
                console.log("Localstorage")
                setLoading(false);
                setTiffinPlans(getTiffinPlanData());
            }
        }
    }

    useEffect(() => {
        getTiffinPlanOfProvider();
    }, [])

    return (
        <div className="container mt-5 p-2">
            {loading ? (
                <ScreenLoader />
            ) : (
                <>
                    <h2 className="text-3xl mb-3 heading">Tiffin Plans</h2>
                    {tiffiPlans.length === 0 ? (
                        <div className="text-center text-muted my-5">
                            <p className="fs-5">You don’t have any plans.</p>
                            <p className="fs-6">Click on <strong>"Add Plan"</strong> to create your first tiffin plan.</p>
                        </div>
                    ) : (
                        <div className="row">
                            {tiffiPlans.map((plan) => (
                                <div className="col-lg-3 col-md-4 col-sm-6 mb-3" key={plan.tiffinPlanId}>
                                    <div className="card shadow-sm h-100 d-flex flex-column">
                                        <div className="card-body d-flex flex-column flex-grow-1">
                                            <h5 className="card-title">{plan.planName}</h5>
                                            <p className="text-muted small">{plan.planType} Plan</p>
                                            <p className="fw-bold text-success mb-2">₹{plan.price}</p>
                                            <a className="btn" onClick={() => ViewTiffinPlanInfo(plan.tiffinPlanId)}>view</a>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                    <Link to='/add-tiffinplan'>
                        <button className="btn button position-fixed bottom-0 end-0 m-4 shadow-lg"
                            style={{ borderRadius: "50px", padding: "12px 20px", fontSize: "16px" }}>
                            <i className="fa fa-plus me-2"></i> Add Plan
                        </button>
                    </Link>
                </>
            )}
        </div>
    )
}

import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { getTiffinPlans } from '../../Services/TiffinPlanService'
import ScreenLoader from '../../Components/ScreenLoader'
import { useTiffinPlans } from '../../Context/TiffinPlanContext'
import { TiffinPlanCard } from '../../Components/TiffinPlanCard'
import { useUserInfo } from '../../Context/UserContext'

export const TiffinPlan = () => {

    const { getUserInfo } = useUserInfo();

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
                        <TiffinPlanCard tiffinPlans={tiffiPlans} OnClickHandler={ViewTiffinPlanInfo} />
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

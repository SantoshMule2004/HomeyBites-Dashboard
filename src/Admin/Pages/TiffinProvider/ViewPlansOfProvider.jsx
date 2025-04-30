import React, { useEffect, useState } from 'react'
import { TiffinPlanCard } from '../../../Components/TiffinPlanCard';
import { getTiffinPlans } from '../../../Services/TiffinPlanService';
import ScreenLoader from '../../../Components/ScreenLoader';
import { useNavigate } from 'react-router-dom';

export const ViewPlansOfProvider = () => {

    const userId = localStorage.getItem("singleUserId");

    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const [tiffinPlanData, setTiffinPlanData] = useState([]);

    const getTiffinplansOfProvider = () => {
        setLoading(true);

        getTiffinPlans(userId).then((response) => {
            setLoading(false);
            setTiffinPlanData(response);
            console.log(response)
        }).catch((error) => {
            setLoading(false);
            console.log(error);
        })
    }

    useEffect(() => {
        getTiffinplansOfProvider();
    }, [])

    const getMenuitemsOfProvider = () => {
        setviewMenuitemLoading(true);

        getMenuOfProvider(userData?.userId).then((response) => {
            setviewMenuitemLoading(false);
            console.log(response)
        }).catch((error) => {
            setviewMenuitemLoading(false);
            console.log(error)
        })
    }

    const ViewTiffinPlanInfo = (id) => {
        navigate("/tiffin-provider-plan")
        localStorage.setItem("planId", id);
    }

    return (
        <div className="container mt-5 p-2">
            {loading ? (
                <ScreenLoader />
            ) : (
                <>
                    <h2 className="text-3xl mb-3 heading">Tiffin Plans of Provider</h2>
                    {
                        tiffinPlanData.length === 0 ? (
                            <div className="text-center text-muted my-5">
                                <p className="fs-6">This provider don’t have any plans.</p>
                            </div>
                        ) : (
                            <>
                                <TiffinPlanCard tiffinPlans={tiffinPlanData} OnClickHandler={ViewTiffinPlanInfo} />
                            </>
                        )
                    }
                </>
            )}
        </div>
    )
}

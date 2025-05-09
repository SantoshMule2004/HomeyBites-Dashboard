import React, { useEffect, useState } from 'react'
import ScreenLoader from '../../../Components/ScreenLoader'
import { getAllTiffinPlans } from '../../../Services/TiffinPlanService';
import { TiffinPlanCard } from '../../../Components/TiffinPlanCard';
import { useNavigate } from 'react-router-dom';
import { useTiffinPlans } from '../../../Context/TiffinPlanContext';

export const AllTiffinPlans = () => {

    const [loading, setLoading] = useState(true);

    const { getTiffinPlanData, setTiffinPlanData } = useTiffinPlans();

    const [allTiffinPlans, setallTiffinPlans] = useState([]);

    const navigate = useNavigate();

    const getAllPlans = () => {
        setLoading(true);
        if (getTiffinPlanData() == null) {
            getAllTiffinPlans().then((response) => {
                setLoading(false);
                setallTiffinPlans(response)
                setTiffinPlanData(response)
            }).catch((error) => {
                setLoading(false);
                console.log(error)
            })
        } else {
            setLoading(false);
            setallTiffinPlans(getTiffinPlanData());
        }
    }

    useEffect(() => {
        getAllPlans();
    }, [])

    const ViewTiffinPlanInfo = (id) => {
        navigate("/tiffin-provider-plan")
        localStorage.setItem("planId", id);
    }

    return (
        <div className='container mt-5 p-2'>
            {loading ? (
                <ScreenLoader />
            ) : (
                <>
                    <h2 className="text-3xl mb-4 heading">Tiffin Plan’s</h2>
                    {allTiffinPlans.length === 0 ? (
                        <div className="text-center text-muted my-5">
                            <p className="fs-5">don’t have any plans to show.</p>
                            {/* <p className="fs-6">Click on <strong>"Add Plan"</strong> to create your first tiffin plan.</p> */}
                        </div>
                    ) : (
                        <TiffinPlanCard tiffinPlans={allTiffinPlans} OnClickHandler={ViewTiffinPlanInfo} />
                    )}
                </>)}
        </div>
    )
}

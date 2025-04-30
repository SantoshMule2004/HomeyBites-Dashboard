import React from 'react'

export const TiffinPlanCard = ({ tiffinPlans, OnClickHandler }) => {
    return (
        <div className="row mx-3">
            {tiffinPlans.map((plan) => (
                <div className="col-lg-3 col-md-4 col-sm-6 mb-3" key={plan.tiffinPlanId}>
                    <div className="card shadow-sm h-100 d-flex flex-column">
                        <div className="card-body d-flex flex-column flex-grow-1">
                            <h5 className="card-title">{plan.planName}</h5>
                            <p className="text-muted small">{plan.planType}</p>
                            <p className="text-muted">Add ons: {plan.addOns}</p>
                            <p className="fw-bold text-success mb-2">Weekly - ₹{plan.price * 7}</p>
                            <p className="fw-bold text-success mb-2">Biweekly - ₹{plan.price * 15}</p>
                            <p className="fw-bold text-success mb-4">Monthly - ₹{plan.price * 30}</p>
                            <a className="btn button" onClick={() => OnClickHandler(plan.tiffinPlanId)}>view</a>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
}

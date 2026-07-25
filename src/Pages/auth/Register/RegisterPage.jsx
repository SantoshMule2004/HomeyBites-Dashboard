// src/pages/Register/RegisterPage.jsx
//
// Two-step provider registration:
//   1. Personal Details -> Send OTP -> Verify OTP
//   2. Business Details -> Submit -> redirected to the provider dashboard
//
// 👇 Assumes the business-details response contains enough to log the
// person in directly (so they land on an already-authenticated dashboard,
// matching "navigated to the dashboard page" from the request) — adjust
// the `login(...)` call below if your backend's final response shape
// differs, or drop it and redirect to /login instead if you'd rather they
// log in explicitly after registering.

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Stepper from "../../../Components/common/Stepper";
import { useUserInfo } from "../../../Context/UserContext";
import PersonalDetailsForm from "./PersonalDetailsForm";
import BusinessDetailsForm from "./BusinessDetailsForm";
import "./Register.css";

const STEPS = ["Personal Details", "Business Details"];

export default function RegisterPage() {
  const navigate = useNavigate();
  const { login } = useUserInfo();

  const [activeStep, setActiveStep] = useState(1);
  const [providerId, setProviderId] = useState(null);

  const handleOtpVerified = (verifiedProviderId, emailId) => {
    setProviderId(verifiedProviderId);
    toast.success("Email verified! Now add your business details.");
    setActiveStep(2);
  };

  const handleRegistrationComplete = (response) => {
    toast.success("Registration complete! Login to continue.");
    // login("provider", { providerId, ...response });
    navigate("/login-page", { replace: true });
  };

  return (
    <div className="hb-register">
      <div className="hb-register__card">
        <div className="hb-login__brand">
          <span className="hb-login__brand-name">Homey Bites</span>
        </div>

        <h1 className="hb-login__title text-center">Become a Tiffin Provider</h1>
        <p className="hb-login__subtitle text-center">
          Register and start taking orders.
        </p>

        <Stepper steps={STEPS} activeStep={activeStep} completedSteps={activeStep > 1 ? [1] : []} />

        {activeStep === 1 && <PersonalDetailsForm onVerified={handleOtpVerified} />}
        {activeStep === 2 && (
          <BusinessDetailsForm providerId={providerId} onComplete={handleRegistrationComplete} />
        )}

        <p className="hb-register__login-link">
          Already have an account? <Link to="/auth/login">Sign in</Link>
        </p>
      </div>
    </div>
  );
}

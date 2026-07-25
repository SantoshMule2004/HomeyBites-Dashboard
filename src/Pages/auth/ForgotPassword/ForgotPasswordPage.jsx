// src/pages/ForgotPassword/ForgotPasswordPage.jsx
//
// Public page — reachable from the "Forgot password?" link on the login
// screen. Uses the same <ForgotPasswordFlow /> as Settings > Security,
// just with an editable email field (since there's no logged-in user to
// pull an email from here) and a redirect back to /login once the
// password's been reset.

import { Link, useNavigate } from "react-router-dom";
import ForgotPasswordFlow from "../../../Components/common/ForgotPasswordFlow";
import "../Login/Login.css";

export default function ForgotPasswordPage() {
  const navigate = useNavigate();

  return (
    <div className="hb-login">
      <div className="hb-login__card">
        <div className="hb-login__brand">
          <span className="hb-login__brand-name">Homey Bites</span>
        </div>

        <h1 className="hb-login__title">Forgot Password</h1>
        <p className="hb-login__subtitle">
          Enter your registered email and we'll send you a code to reset your password.
        </p>

        <ForgotPasswordFlow
          emailEditable
          onComplete={() => navigate("/login", { replace: true })}
        />

        <p className="hb-login__register-link">
          Remembered your password? <Link to="/login">Back to Sign In</Link>
        </p>
      </div>
    </div>
  );
}

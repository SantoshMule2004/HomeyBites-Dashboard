// src/pages/Settings/SecuritySection.jsx
//
// Three independent sub-forms:
//   1. Change Password — you know your current password.
//   2. Forgot Password — you don't; verify via OTP sent to your registered
//      email instead, then set a new password. (Shared with the login-time
//      flow — see Components/common/ForgotPasswordFlow.jsx.)
//   3. Change Email — changing your login email itself, also via OTP.
//
// 👇 API WIRING:
//   Change Password:  POST /api/v1/users/reset-password   (changePassword)
//     Body: { oldPassword, newPassword, cPassword }
//
//   Forgot Password: see ForgotPasswordFlow.jsx — same 3 PasswordService.js
//   calls used at login (sendOtp / verifyOtp / resetPassAfterForget), just
//   with the email fixed to the account's registered address here instead
//   of typed in by hand.
//
//   Change Email (2 calls — 👇 assumed endpoints, unrelated to the Forgot
//   Password OTP calls above since this verifies a NEW email, not the
//   existing one):
//     1. POST /tiffin-provider/{providerId}/settings/security/change-email/send-otp
//     2. POST /tiffin-provider/{providerId}/settings/security/change-email/verify-otp

import { useState } from "react";
import { toast } from "react-toastify";
import { FaLock, FaEnvelope, FaEye, FaEyeSlash } from "react-icons/fa";
import { changePassword } from "../../Services/authService";
import ForgotPasswordFlow from "../../Components/common/ForgotPasswordFlow";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const isStrongPassword = (value) =>
  value.length >= 8 && /[A-Za-z]/.test(value) && /[0-9]/.test(value);

export default function SecuritySection({ currentEmail, onEmailChanged }) {
  // --- Change Password (knows current password) ---
  const [pwForm, setPwForm] = useState({ oldPassword: "", newPassword: "", confirmNewPassword: "" });
  const [pwErrors, setPwErrors] = useState({});
  const [pwSaving, setPwSaving] = useState(false);
  const [showCurrentPw, setShowCurrentPw] = useState(false);
  const [showNewPw, setShowNewPw] = useState(false);

  const handlePwChange = (field, value) => {
    setPwForm((prev) => ({ ...prev, [field]: value }));
    if (pwErrors[field]) setPwErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const validatePassword = () => {
    const next = {};
    if (!pwForm.oldPassword) next.oldPassword = "Enter your current password.";
    if (!pwForm.newPassword) {
      next.newPassword = "Enter a new password.";
    } else if (!isStrongPassword(pwForm.newPassword)) {
      next.newPassword = "At least 8 characters, with a letter and a number.";
    }
    if (pwForm.confirmNewPassword !== pwForm.newPassword) {
      next.confirmNewPassword = "Passwords do not match.";
    }
    setPwErrors(next);
    return Object.keys(next).length === 0;
  };

  const handlePasswordSubmit = async (event) => {
    event.preventDefault();
    if (!validatePassword()) return;

    setPwSaving(true);
    try {
      await changePassword({
        oldPassword: pwForm.oldPassword,
        newPassword: pwForm.newPassword,
        cPassword: pwForm.confirmNewPassword,
      });
      toast.success("Password updated successfully..!");
      setPwForm({ oldPassword: "", newPassword: "", confirmNewPassword: "" });
    } catch (err) {
      console.error(err);
      const serverMessage = err?.response?.data?.message;
      toast.error(serverMessage || "Couldn't update your password. Please try again.");
    } finally {
      setPwSaving(false);
    }
  };

  // --- Change Email ---
  const [newEmail, setNewEmail] = useState("");
  const [emailStage, setEmailStage] = useState("idle"); // "idle" | "sent"
  const [otp, setOtp] = useState("");
  const [emailError, setEmailError] = useState(null);
  const [otpError, setOtpError] = useState(null);
  const [sendingOtp, setSendingOtp] = useState(false);
  const [verifyingOtp, setVerifyingOtp] = useState(false);

  const handleSendEmailOtp = async (event) => {
    event.preventDefault();
    if (!EMAIL_REGEX.test(newEmail.trim())) {
      setEmailError("Enter a valid email address.");
      return;
    }
    if (newEmail.trim().toLowerCase() === currentEmail.toLowerCase()) {
      setEmailError("This is already your current email.");
      return;
    }

    setSendingOtp(true);
    setEmailError(null);
    try {
      // 👇 await sendChangeEmailOtp(providerId, { newEmail })
      await new Promise((resolve) => setTimeout(resolve, 600));
      setEmailStage("sent");
    } finally {
      setSendingOtp(false);
    }
  };

  const handleVerifyEmailOtp = async (event) => {
    event.preventDefault();
    if (!/^[0-9]{4}$/.test(otp)) {
      setOtpError("Enter the 4-digit code sent to your new email.");
      return;
    }

    setVerifyingOtp(true);
    setOtpError(null);
    try {
      // 👇 await verifyChangeEmailOtp(providerId, { newEmail, otp })
      await new Promise((resolve) => setTimeout(resolve, 600));
      onEmailChanged(newEmail.trim());
      setEmailStage("idle");
      setNewEmail("");
      setOtp("");
    } finally {
      setVerifyingOtp(false);
    }
  };

  return (
    <div>
      {/* --- Change Password --- */}
      <h6 className="hb-settings-section__subheading">Change Password</h6>
      <form onSubmit={handlePasswordSubmit} noValidate>
        <div className="row">
          <div className="col-md-4 mb-3">
            <label className="hb-settings-section__field-label">Current Password</label>
            <div className="hb-login__input-group">
              <FaLock className="hb-login__input-icon" />
              <input
                type={showCurrentPw ? "text" : "password"}
                className={`form-control hb-login__input ${pwErrors.oldPassword ? "is-invalid" : ""}`}
                value={pwForm.oldPassword}
                onChange={(e) => handlePwChange("oldPassword", e.target.value)}
              />
              <button
                type="button"
                className="hb-login__toggle-visibility"
                onClick={() => setShowCurrentPw((s) => !s)}
                tabIndex={-1}
              >
                {showCurrentPw ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            {pwErrors.oldPassword && <div className="hb-login__field-error">{pwErrors.oldPassword}</div>}
          </div>

          <div className="col-md-4 mb-3">
            <label className="hb-settings-section__field-label">New Password</label>
            <div className="hb-login__input-group">
              <FaLock className="hb-login__input-icon" />
              <input
                type={showNewPw ? "text" : "password"}
                className={`form-control hb-login__input ${pwErrors.newPassword ? "is-invalid" : ""}`}
                value={pwForm.newPassword}
                onChange={(e) => handlePwChange("newPassword", e.target.value)}
              />
              <button
                type="button"
                className="hb-login__toggle-visibility"
                onClick={() => setShowNewPw((s) => !s)}
                tabIndex={-1}
              >
                {showNewPw ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            {pwErrors.newPassword && <div className="hb-login__field-error">{pwErrors.newPassword}</div>}
          </div>

          <div className="col-md-4 mb-3">
            <label className="hb-settings-section__field-label">Confirm New Password</label>
            <input
              type="password"
              className={`form-control hb-settings-input ${pwErrors.confirmNewPassword ? "is-invalid" : ""}`}
              value={pwForm.confirmNewPassword}
              onChange={(e) => handlePwChange("confirmNewPassword", e.target.value)}
            />
            {pwErrors.confirmNewPassword && (
              <div className="hb-login__field-error">{pwErrors.confirmNewPassword}</div>
            )}
          </div>
        </div>

        <button type="submit" className="btn hb-btn-primary" disabled={pwSaving}>
          {pwSaving ? "Updating..." : "Update Password"}
        </button>
      </form>

      {/* <div className="hb-settings-section__api-note">POST /api/v1/users/reset-password</div> */}

      <hr className="my-4" />

      {/* --- Forgot Password (shared component — see ForgotPasswordFlow.jsx) --- */}
      <h6 className="hb-settings-section__subheading">Forgot Password</h6>
      <p className="text-muted small mb-3">
        Don't remember your current password? Verify it's you via your registered email instead.
      </p>

      <ForgotPasswordFlow defaultEmail={currentEmail} emailEditable={false} onComplete={() => {}} />

      {/* <div className="hb-settings-section__api-note">
        POST /api/v1/auth/send-otp?username=&#123;email&#125;
        <br />
        POST /api/v1/auth/verify-otp?otp=&#123;otp&#125;&amp;username=&#123;email&#125;
        <br />
        POST /api/v1/auth/reset-pass?emailId=&#123;email&#125;
      </div> */}

      {/* <hr className="my-4" />

      --- Change Email --- 
      <h6 className="hb-settings-section__subheading">
        Change Email <span className="text-muted fw-normal small">(current: {currentEmail})</span>
      </h6>

      {emailStage === "idle" ? (
        <form onSubmit={handleSendEmailOtp} noValidate>
          <div className="row">
            <div className="col-md-6 mb-3">
              <label className="hb-settings-section__field-label">New Email Address</label>
              <div className="hb-login__input-group">
                <FaEnvelope className="hb-login__input-icon" />
                <input
                  type="email"
                  className={`form-control hb-login__input ${emailError ? "is-invalid" : ""}`}
                  value={newEmail}
                  onChange={(e) => {
                    setNewEmail(e.target.value);
                    if (emailError) setEmailError(null);
                  }}
                  placeholder="new-email@example.com"
                />
              </div>
              {emailError && <div className="hb-login__field-error">{emailError}</div>}
            </div>
          </div>
          <button type="submit" className="btn hb-btn-primary" disabled={sendingOtp}>
            {sendingOtp ? "Sending OTP..." : "Send OTP"}
          </button>
        </form>
      ) : (
        <form onSubmit={handleVerifyEmailOtp} noValidate>
          <div className="hb-otp-block">
            <div className="hb-otp-block__header">
              <span>
                A 4-digit code was sent to <strong>{newEmail}</strong>
              </span>
              <button
                type="button"
                className="hb-otp-block__edit"
                onClick={() => {
                  setEmailStage("idle");
                  setOtp("");
                  setOtpError(null);
                }}
              >
                Change email
              </button>
            </div>

            <label className="form-label fw-semibold">Enter OTP</label>
            <input
              type="text"
              inputMode="numeric"
              maxLength={4}
              className={`form-control hb-otp-input ${otpError ? "is-invalid" : ""}`}
              value={otp}
              onChange={(e) => {
                setOtp(e.target.value.replace(/\D/g, "").slice(0, 4));
                if (otpError) setOtpError(null);
              }}
              placeholder="0000"
            />
            {otpError && <div className="hb-login__field-error">{otpError}</div>}

            <div className="hb-otp-block__actions">
              <button type="submit" className="btn hb-btn-primary" disabled={verifyingOtp}>
                {verifyingOtp ? "Verifying..." : "Verify & Update Email"}
              </button>
            </div>
          </div>
        </form>
      )}

      <div className="hb-settings-section__api-note">
        POST /tiffin-provider/&#123;providerId&#125;/settings/security/change-email/send-otp
        <br />
        POST /tiffin-provider/&#123;providerId&#125;/settings/security/change-email/verify-otp
      </div> */}
    </div>
  );
}
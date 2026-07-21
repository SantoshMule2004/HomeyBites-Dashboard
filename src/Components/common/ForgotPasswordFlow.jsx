// src/components/common/ForgotPasswordFlow.jsx
//
// The email -> OTP -> new password flow, extracted so it can be used in
// two places without duplicating logic:
//   1. Standalone, at login time (ForgotPasswordPage.jsx) — email is
//      typed in by the person, since they're not authenticated yet.
//   2. Embedded in Settings > Security — email is fixed to the logged-in
//      user's registered email (read-only), since we already know it.
//
// Uses the exact API calls from PasswordService.js:
//   sendOtp(username), verifyOtp(otp, username), resetPassAfterForget(data, username)
//
// Renders three stages ("email" -> "otpSent" -> "verified") but no
// heading/title of its own — the page or section embedding it renders
// that, since the right heading differs by context.

import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { FaEnvelope } from "react-icons/fa";
import { sendOtptoVerifyEmail, verifyOtp, resetPassword } from "../../Services/authService";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const RESEND_COOLDOWN_SECONDS = 30;

const isStrongPassword = (value) =>
  value.length >= 8 && /[A-Za-z]/.test(value) && /[0-9]/.test(value);

export default function ForgotPasswordFlow({ defaultEmail = "", emailEditable = true, onComplete }) {
  const [email, setEmail] = useState(defaultEmail);
  const [emailError, setEmailError] = useState(null);

  // "email" -> enter/show email + Send OTP
  // "otpSent" -> enter OTP + Verify OTP
  // "verified" -> New Password + Confirm Password + Submit
  const [stage, setStage] = useState("email");
  const [otp, setOtp] = useState("");
  const [otpError, setOtpError] = useState(null);
  const [sendingOtp, setSendingOtp] = useState(false);
  const [verifyingOtp, setVerifyingOtp] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const cooldownRef = useRef(null);

  const [pwForm, setPwForm] = useState({ newPassword: "", confirmPassword: "" });
  const [pwErrors, setPwErrors] = useState({});
  const [resetting, setResetting] = useState(false);

  useEffect(() => {
    return () => clearInterval(cooldownRef.current);
  }, []);

  const startCooldown = () => {
    setResendCooldown(RESEND_COOLDOWN_SECONDS);
    clearInterval(cooldownRef.current);
    cooldownRef.current = setInterval(() => {
      setResendCooldown((prev) => {
        if (prev <= 1) {
          clearInterval(cooldownRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleSendOtp = async (event) => {
    event.preventDefault();
    if (emailEditable && !EMAIL_REGEX.test(email.trim())) {
      setEmailError("Enter a valid email address.");
      return;
    }

    setSendingOtp(true);
    setEmailError(null);
    try {
      await sendOtptoVerifyEmail(email.trim());
      setStage("otpSent");
      startCooldown();
      toast.success(`OTP sent to ${email.trim()}`);
    } catch (err) {
      console.error(err);
      const serverMessage = err?.response?.data?.message;
      setEmailError(serverMessage || "Couldn't send OTP. Please check the email and try again.");
    } finally {
      setSendingOtp(false);
    }
  };

  const handleResendOtp = async () => {
    if (resendCooldown > 0) return;
    setSendingOtp(true);
    setOtpError(null);
    try {
      await sendOtptoVerifyEmail(email.trim());
      startCooldown();
    } catch (err) {
      console.error(err);
      setOtpError("Couldn't resend OTP. Please try again.");
    } finally {
      setSendingOtp(false);
    }
  };

  const handleVerifyOtp = async (event) => {
    event.preventDefault();
    if (!/^[0-9]{4}$/.test(otp)) {
      setOtpError("Enter the 4-digit code sent to your email.");
      return;
    }

    setVerifyingOtp(true);
    setOtpError(null);
    try {
      await verifyOtp({ otp: otp, emailId: email.trim() });
      setStage("verified");
    } catch (err) {
      console.error(err);
      const serverMessage = err?.response?.data?.message;
      setOtpError(serverMessage || "Invalid or expired OTP. Please try again.");
    } finally {
      setVerifyingOtp(false);
    }
  };

  const handleChangeEmail = () => {
    setStage("email");
    setOtp("");
    setOtpError(null);
    clearInterval(cooldownRef.current);
    setResendCooldown(0);
  };

  const handlePwChange = (field, value) => {
    setPwForm((prev) => ({ ...prev, [field]: value }));
    if (pwErrors[field]) setPwErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const validatePassword = () => {
    const next = {};
    if (!pwForm.newPassword) {
      next.newPassword = "Enter a new password.";
    } else if (!isStrongPassword(pwForm.newPassword)) {
      next.newPassword = "At least 8 characters, with a letter and a number.";
    }
    if (pwForm.confirmPassword !== pwForm.newPassword) {
      next.confirmPassword = "Passwords do not match.";
    }
    setPwErrors(next);
    return Object.keys(next).length === 0;
  };

  const resetFlow = () => {
    setStage("email");
    setOtp("");
    setOtpError(null);
    setPwForm({ newPassword: "", confirmPassword: "" });
    setPwErrors({});
    clearInterval(cooldownRef.current);
    setResendCooldown(0);
  };

  const handleResetSubmit = async (event) => {
    event.preventDefault();
    if (!validatePassword()) return;

    setResetting(true);
    try {
      await resetPassword(
        { newPassword: pwForm.newPassword, cPassword: pwForm.confirmPassword },
        email.trim()
      );
      toast.success("Password reset successfully..!");
      const resetEmail = email.trim();
      resetFlow();
      onComplete?.(resetEmail);
    } catch (err) {
      console.error(err);
      const serverMessage = err?.response?.data?.message;
      toast.error(serverMessage || "Couldn't reset your password. Please try again.");
    } finally {
      setResetting(false);
    }
  };

  return (
    <div>
      {stage === "email" && (
        <form onSubmit={handleSendOtp} noValidate>
          <div className="mb-3">
            <label className="form-label fw-semibold">{emailEditable ? "Registered Email" : "Email"}</label>
            <div className="hb-login__input-group">
              <FaEnvelope className="hb-login__input-icon" />
              <input
                type="email"
                className={`form-control hb-login__input ${emailError ? "is-invalid" : ""}`}
                value={email}
                disabled={!emailEditable}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (emailError) setEmailError(null);
                }}
                placeholder={emailEditable ? "you@example.com" : undefined}
              />
            </div>
            {emailError && <div className="hb-login__field-error">{emailError}</div>}
          </div>
          <button type="submit" className="btn hb-btn-primary" disabled={sendingOtp}>
            {sendingOtp ? "Sending OTP..." : "Send OTP"}
          </button>
        </form>
      )}

      {stage === "otpSent" && (
        <form onSubmit={handleVerifyOtp} noValidate>
          <div className="hb-otp-block">
            <div className="hb-otp-block__header">
              <span>
                A 4-digit code was sent to <strong>{email}</strong>
              </span>
              <button type="button" className="hb-otp-block__edit" onClick={handleChangeEmail}>
                {emailEditable ? "Change email" : "Cancel"}
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
                {verifyingOtp ? "Verifying..." : "Verify OTP"}
              </button>
              <button
                type="button"
                className="btn hb-btn-secondary"
                onClick={handleResendOtp}
                disabled={resendCooldown > 0 || sendingOtp}
              >
                {resendCooldown > 0 ? `Resend OTP (${resendCooldown}s)` : "Resend OTP"}
              </button>
            </div>
          </div>
        </form>
      )}

      {stage === "verified" && (
        <form onSubmit={handleResetSubmit} noValidate>
          <div className="col">
            <div className="col-12 mb-3">
              <label className="form-label fw-semibold">New Password</label>
              <input
                type="password"
                className={`form-control ${pwErrors.newPassword ? "is-invalid" : ""}`}
                value={pwForm.newPassword}
                onChange={(e) => handlePwChange("newPassword", e.target.value)}
              />
              {pwErrors.newPassword && <div className="hb-login__field-error">{pwErrors.newPassword}</div>}
            </div>

            <div className="col-12 mb-3">
              <label className="form-label fw-semibold">Confirm New Password</label>
              <input
                type="password"
                className={`form-control ${pwErrors.confirmPassword ? "is-invalid" : ""}`}
                value={pwForm.confirmPassword}
                onChange={(e) => handlePwChange("confirmPassword", e.target.value)}
              />
              {pwErrors.confirmPassword && (
                <div className="hb-login__field-error">{pwErrors.confirmPassword}</div>
              )}
            </div>
          </div>

          <button type="submit" className="btn hb-btn-primary" disabled={resetting}>
            {resetting ? "Resetting..." : "Reset Password"}
          </button>
        </form>
      )}
    </div>
  );
}

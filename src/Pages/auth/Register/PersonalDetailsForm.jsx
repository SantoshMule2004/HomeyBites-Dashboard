// src/pages/Register/PersonalDetailsForm.jsx
//
// Step 1 of provider registration. Person fills in their details, hits
// "Send OTP" (fields lock once sent, since they're tied to what the OTP
// was issued for), enters the 4-digit code, and hits "Verify OTP".
// On successful verification, calls onVerified(providerId, emailId) so
// the parent <RegisterPage> can advance to step 2.

import { useEffect, useRef, useState } from "react";
import { FaEnvelope, FaLock, FaPhone, FaUser, FaEye, FaEyeSlash, FaPencilAlt } from "react-icons/fa";
import { providerRegister, sendOtp, verifyOtp } from "../../../Services/authService";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^[0-9]{10}$/; // 👇 assumes 10-digit phone numbers — adjust if your format differs
const RESEND_COOLDOWN_SECONDS = 30;

const emptyForm = {
  firstName: "",
  middleName: "",
  lastName: "",
  emailId: "",
  phoneNo: "",
  password: "",
  cPassword: "",
};

export default function PersonalDetailsForm({ onVerified }) {
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // "idle" -> hasn't sent OTP yet, fields editable
  // "sent"  -> OTP issued, fields locked, waiting for the code
  const [otpStage, setOtpStage] = useState("idle");
  const [otp, setOtp] = useState("");
  const [otpError, setOtpError] = useState(null);
  const [formError, setFormError] = useState(null);

  const [sendingOtp, setSendingOtp] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const cooldownRef = useRef(null);

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

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
    if (formError) setFormError(null);
  };

  const validate = () => {
    const next = {};

    if (!form.firstName.trim()) next.firstName = "First name cannot be empty.";
    if (!form.lastName.trim()) next.lastName = "Last name cannot be empty.";

    if (!form.emailId.trim()) {
      next.emailId = "Email cannot be empty.";
    } else if (!EMAIL_REGEX.test(form.emailId.trim())) {
      next.emailId = "Enter a valid email address.";
    }

    if (!form.phoneNo.trim()) {
      next.phoneNo = "Phone number cannot be empty.";
    } else if (!PHONE_REGEX.test(form.phoneNo.trim())) {
      next.phoneNo = "Enter a valid 10-digit phone number.";
    }

    if (!form.password) {
      next.password = "Password cannot be empty.";
    } else if (form.password.length < 8) {
      next.password = "Password must be at least 8 characters.";
    } else if (!/[A-Za-z]/.test(form.password) || !/[0-9]/.test(form.password)) {
      next.password = "Password must include at least one letter and one number.";
    }

    if (!form.cPassword) {
      next.cPassword = "Please confirm your password.";
    } else if (form.cPassword !== form.password) {
      next.cPassword = "Passwords do not match.";
    }

    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSendOtp = async (event) => {
    event.preventDefault();
    if (!validate()) return;

    setSendingOtp(true);
    setFormError(null);
    try {
      await sendOtp(form.emailId.trim());
      setOtpStage("sent");
      startCooldown();
    } catch (err) {
      console.error(err);
      const serverMessage = err?.response?.data?.message;
      setFormError(serverMessage || "Couldn't send OTP. try again.");
    } finally {
      setSendingOtp(false);
    }
  };

  const handleResendOtp = async () => {
    if (resendCooldown > 0) return;
    setSendingOtp(true);
    setOtpError(null);
    try {
      await sendOtp(form.emailId.trim());
      startCooldown();
    } catch (err) {
      console.error(err);
      setOtpError("Couldn't resend OTP. Please try again.");
    } finally {
      setSendingOtp(false);
    }
  };

  const handleEditDetails = () => {
    setOtpStage("idle");
    setOtp("");
    setOtpError(null);
    clearInterval(cooldownRef.current);
    setResendCooldown(0);
  };

  const handleVerifyOtp = async (event) => {
    event.preventDefault();

    if (!/^[0-9]{4}$/.test(otp)) {
      setOtpError("Enter the 4-digit code sent to your email.");
      return;
    }

    setVerifying(true);
    setOtpError(null);
    try {
      const response = await verifyOtp(otp, form.emailId.trim());
      // onVerified(response?.providerId, form.emailId.trim());
      await handleproviderRegister()
    } catch (err) {
      console.error(err);
      const serverMessage = err?.response?.data?.message;
      setOtpError(serverMessage || "Invalid or expired OTP. Please try again.");
    } finally {
      setVerifying(false);
    }
  };

  const handleproviderRegister = async (event) => {
    // event.preventDefault();

    setVerifying(true);

    try {
      const response = await providerRegister({
        firstName: form.firstName.trim(),
        middleName: form.middleName.trim(),
        lastName: form.lastName.trim(),
        emailId: form.emailId.trim(),
        phoneNo: form.phoneNo.trim(),
        password: form.password,
        cPassword: form.cPassword,
      });
      onVerified(response?.classObj, form.emailId.trim());
    } catch (err) {
      console.error(err);
      const serverMessage = err?.response?.data?.message;
      setOtpError(serverMessage || "Unable to Register. Please try again.");
    } finally {
      setVerifying(false);
    }
  };

  const fieldsLocked = otpStage === "sent";

  return (
    <div>
      {formError && <div className="hb-login__error">{formError}</div>}

      <form onSubmit={fieldsLocked ? handleVerifyOtp : handleSendOtp} noValidate>
        <div className="row">
          <div className="col-md-4 mb-3">
            <label className="form-label fw-semibold">First Name</label>
            <div className="hb-login__input-group">
              <FaUser className="hb-login__input-icon" />
              <input
                type="text"
                className={`form-control hb-login__input ${errors.firstName ? "is-invalid" : ""}`}
                value={form.firstName}
                onChange={(e) => handleChange("firstName", e.target.value)}
                disabled={fieldsLocked}
              />
            </div>
            {errors.firstName && <div className="hb-login__field-error">{errors.firstName}</div>}
          </div>

          <div className="col-md-4 mb-3">
            <label className="form-label fw-semibold">Middle Name</label>
            <input
              type="text"
              className="form-control"
              value={form.middleName}
              onChange={(e) => handleChange("middleName", e.target.value)}
              disabled={fieldsLocked}
              placeholder="Optional"
            />
          </div>

          <div className="col-md-4 mb-3">
            <label className="form-label fw-semibold">Last Name</label>
            <input
              type="text"
              className={`form-control ${errors.lastName ? "is-invalid" : ""}`}
              value={form.lastName}
              onChange={(e) => handleChange("lastName", e.target.value)}
              disabled={fieldsLocked}
            />
            {errors.lastName && <div className="hb-login__field-error">{errors.lastName}</div>}
          </div>
        </div>

        <div className="row">
          <div className="col-md-6 mb-3">
            <label className="form-label fw-semibold">Email</label>
            <div className="hb-login__input-group">
              <FaEnvelope className="hb-login__input-icon" />
              <input
                type="email"
                className={`form-control hb-login__input ${errors.emailId ? "is-invalid" : ""}`}
                value={form.emailId}
                onChange={(e) => handleChange("emailId", e.target.value)}
                disabled={fieldsLocked}
                autoComplete="username"
              />
            </div>
            {errors.emailId && <div className="hb-login__field-error">{errors.emailId}</div>}
          </div>

          <div className="col-md-6 mb-3">
            <label className="form-label fw-semibold">Phone Number</label>
            <div className="hb-login__input-group">
              <FaPhone className="hb-login__input-icon" />
              <input
                type="tel"
                className={`form-control hb-login__input ${errors.phoneNo ? "is-invalid" : ""}`}
                value={form.phoneNo}
                onChange={(e) => handleChange("phoneNo", e.target.value)}
                disabled={fieldsLocked}
                maxLength={10}
              />
            </div>
            {errors.phoneNo && <div className="hb-login__field-error">{errors.phoneNo}</div>}
          </div>
        </div>

        <div className="row">
          <div className="col-md-6 mb-3">
            <label className="form-label fw-semibold">Password</label>
            <div className="hb-login__input-group">
              <FaLock className="hb-login__input-icon" />
              <input
                type={showPassword ? "text" : "password"}
                className={`form-control hb-login__input ${errors.password ? "is-invalid" : ""}`}
                value={form.password}
                onChange={(e) => handleChange("password", e.target.value)}
                disabled={fieldsLocked}
                autoComplete="new-password"
              />
              <button
                type="button"
                className="hb-login__toggle-visibility"
                onClick={() => setShowPassword((s) => !s)}
                tabIndex={-1}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            {errors.password && <div className="hb-login__field-error">{errors.password}</div>}
          </div>

          <div className="col-md-6 mb-3">
            <label className="form-label fw-semibold">Confirm Password</label>
            <div className="hb-login__input-group">
              <FaLock className="hb-login__input-icon" />
              <input
                type={showConfirmPassword ? "text" : "password"}
                className={`form-control hb-login__input ${errors.cPassword ? "is-invalid" : ""}`}
                value={form.cPassword}
                onChange={(e) => handleChange("cPassword", e.target.value)}
                disabled={fieldsLocked}
                autoComplete="new-password"
              />
              <button
                type="button"
                className="hb-login__toggle-visibility"
                onClick={() => setShowConfirmPassword((s) => !s)}
                tabIndex={-1}
              >
                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            {errors.cPassword && <div className="hb-login__field-error">{errors.cPassword}</div>}
          </div>
        </div>

        {!fieldsLocked && (
          <button type="submit" className="btn hb-btn-primary hb-login__submit" disabled={sendingOtp}>
            {sendingOtp ? "Sending OTP..." : "Send OTP"}
          </button>
        )}

        {fieldsLocked && (
          <div className="hb-otp-block">
            <div className="hb-otp-block__header">
              <span>
                A 4-digit code was sent to <strong>{form.emailId}</strong>
              </span>
              <button type="button" className="hb-otp-block__edit" onClick={handleEditDetails}>
                <FaPencilAlt /> Edit details
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
              <button type="submit" className="btn hb-btn-primary" disabled={verifying}>
                {verifying ? "Verifying..." : "Verify OTP"}
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
        )}
      </form>
    </div>
  );
}

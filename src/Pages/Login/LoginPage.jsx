// src/pages/Login/LoginPage.jsx
//
// One login page, two backends — a tab toggle switches between "Tiffin
// Provider" and "Admin", and submits to whichever login call matches.
// On success, the returned user is stored via UserContext.login(role, data)
// and the person is redirected to their dashboard.

import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { FaStore, FaUserShield, FaEnvelope, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import { useUserInfo } from "../../Context/UserContext";
import { providerLogin, adminLogin, sendOtp } from '../../Services/authService'
import "./Login.css";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { doLogin } = useUserInfo();

  const [role, setRole] = useState("provider"); // "provider" | "admin"
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState(null);

  const handleTabChange = (nextRole) => {
    setRole(nextRole);
    setErrors({});
    setFormError(null);
  };

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
    if (formError) setFormError(null);
  };

  const validate = () => {
    const next = {};

    if (!form.email.trim()) {
      next.email = "Email cannot be empty.";
    } else if (!EMAIL_REGEX.test(form.email.trim())) {
      next.email = "Enter a valid email address.";
    }

    if (!form.password) {
      next.password = "Password cannot be empty.";
    } else if (form.password.length < 6) {
      next.password = "Password must be at least 6 characters.";
    }

    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    setFormError(null);

    try {
      const credentials = { username: form.email.trim(), password: form.password };
      const response = role === "admin" ? await adminLogin(credentials) : await providerLogin(credentials);

      // login(role, response);

      // save data to local storage
      doLogin(response, () => {
        //redirect
        // If ProtectedRoute redirected here from a specific page, send them
        // back there; otherwise go to the right dashboard for their role.
        const redirectTo = location.state?.from?.pathname || (role === "admin" ? "/admin/dashboard" : "/provider/dashboard");
        navigate(redirectTo, { replace: true });
      })

      toast.success(`Welcome back${response?.name ? `, ${response.name}` : ""}!`);

    } catch (err) {
      console.error(err);
      const serverMessage = err?.response?.data?.message;
      setFormError(serverMessage || "Invalid email or password. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="hb-login">
      <div className="hb-login__card">
        <div className="hb-login__brand">
          <span className="hb-login__brand-name">Homey Bites</span>
        </div>

        {/* <div className="hb-login__tabs" role="tablist">
          <button
            type="button"
            role="tab"
            aria-selected={role === "provider"}
            className={`hb-login__tab ${role === "provider" ? "hb-login__tab--active" : ""}`}
            onClick={() => handleTabChange("provider")}
          >
            <FaStore /> Tiffin Provider
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={role === "admin"}
            className={`hb-login__tab ${role === "admin" ? "hb-login__tab--active" : ""}`}
            onClick={() => handleTabChange("admin")}
          >
            <FaUserShield /> Admin
          </button>
        </div> */}

        <h1 className="hb-login__title">
          {role === "admin" ? "Admin Login" : "Provider Login"}
        </h1>
        <p className="hb-login__subtitle">
          {role === "admin"
            ? "Sign in to manage the platform."
            : "Sign in to manage your tiffin business."}
        </p>

        {formError && <div className="hb-login__error">{formError}</div>}

        <form onSubmit={handleSubmit} noValidate>
          <div className="mb-3">
            <label className="form-label fw-semibold">Email</label>
            <div className="hb-login__input-group">
              <FaEnvelope className="hb-login__input-icon" />
              <input
                type="email"
                className={`form-control hb-login__input ${errors.email ? "is-invalid" : ""}`}
                value={form.email}
                onChange={(e) => handleChange("email", e.target.value)}
                placeholder="you@example.com"
                autoComplete="username"
              />
            </div>
            {errors.email && <div className="hb-login__field-error">{errors.email}</div>}
          </div>

          <div className="mb-2">
            <label className="form-label fw-semibold">Password</label>
            <div className="hb-login__input-group">
              <FaLock className="hb-login__input-icon" />
              <input
                type={showPassword ? "text" : "password"}
                className={`form-control hb-login__input ${errors.password ? "is-invalid" : ""}`}
                value={form.password}
                onChange={(e) => handleChange("password", e.target.value)}
                placeholder="••••••••"
                autoComplete="current-password"
              />
              <button
                type="button"
                className="hb-login__toggle-visibility"
                onClick={() => setShowPassword((s) => !s)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            {errors.password && <div className="hb-login__field-error">{errors.password}</div>}
          </div>

          <div className="hb-login__forgot">
            <Link to="/forgot-password">Forgot password?</Link>
          </div>

          <button type="submit" className="btn hb-btn-primary hb-login__submit" disabled={submitting}>
            {submitting ? "Signing in..." : "Sign In"}
          </button>
        </form>

        {role === "provider" && (
          <p className="hb-login__register-link">
            New to Homey Bites? <Link to="/register-page">Register as a Tiffin Provider</Link>
          </p>
        )}

      </div>
    </div>
  );
}

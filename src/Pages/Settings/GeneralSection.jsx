// src/pages/Settings/GeneralSection.jsx
//
// 👇 API WIRING:
//   On mount (in SettingsPage): GET /tiffin-provider/{providerId}/settings/general
//   On Save here:                PUT /tiffin-provider/{providerId}/settings/general
//   Body: { firstName, lastName, dob, gender, mobileNumber }  (email is NOT
//   sent — it's read-only here; changing it lives in Security > Change
//   Email below, since that needs OTP verification.)

import { useState } from "react";
import { FaEdit, FaSave, FaTimes } from "react-icons/fa";
import { updateUserDetails } from "../../Services/userService";
import { useUserInfo } from "../../Context/UserContext";
import { toast } from "react-toastify";

const GENDER_OPTIONS = ["Male", "Female", "Other", "Prefer not to say"];

export default function GeneralSection({ data, providerId, onSave }) {
  const [form, setForm] = useState(data);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});

  const { setUserInfo } = useUserInfo();

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const validate = () => {
    const next = {};
    if (!form.firstName.trim()) next.firstName = "First name cannot be empty.";
    if (!form.lastName.trim()) next.lastName = "Last name cannot be empty.";
    if (!form.dob) {
      next.dob = "Select your date of birth.";
    } else if (new Date(form.dob) > new Date()) {
      next.dob = "Date of birth cannot be in the future.";
    }
    if (!form.gender) next.gender = "Select a gender.";
    if (!/^[0-9]{10}$/.test(form.mobileNumber.trim())) {
      next.mobileNumber = "Enter a valid 10-digit mobile number.";
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleCancel = () => {
    setForm(data);
    setErrors({});
    setIsEditing(false);
  };

  const handleSave = async () => {
    if (!validate()) return;
    setSaving(true);
    try {
      const response = await updateUserDetails(providerId, { firstName: form.firstName, lastName: form.lastName, dob: form.dob, gender: form.gender, phoneNo: form.mobileNumber })
      // await new Promise((resolve) => setTimeout(resolve, 600)); // simulated network delay
      toast.success("user details updated successfully")
      onSave(form);
      setUserInfo(response?.classObj)
      setIsEditing(false);
    } catch (err) {
      console.error(err);
      // Your backend returns 409 with a specific "already exists" message
      // for duplicate plan names — surface it if present, else a generic one.
      const serverMessage = err?.response?.data?.message;
      toast.error(serverMessage || "Couldn't save user info. Please try again.");
      throw err;
    }
    finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div className="row">
        <div className="col-md-6 mb-3">
          <label className="hb-settings-section__field-label">First Name</label>
          {isEditing ? (
            <>
              <input
                type="text"
                className={`form-control ${errors.firstName ? "is-invalid" : ""}`}
                value={form.firstName}
                onChange={(e) => handleChange("firstName", e.target.value)}
              />
              {errors.firstName && <div className="hb-login__field-error">{errors.firstName}</div>}
            </>
          ) : (
            <div className="hb-settings-section__field-value">{data.firstName}</div>
          )}
        </div>

        <div className="col-md-6 mb-3">
          <label className="hb-settings-section__field-label">Last Name</label>
          {isEditing ? (
            <>
              <input
                type="text"
                className={`form-control ${errors.lastName ? "is-invalid" : ""}`}
                value={form.lastName}
                onChange={(e) => handleChange("lastName", e.target.value)}
              />
              {errors.lastName && <div className="hb-login__field-error">{errors.lastName}</div>}
            </>
          ) : (
            <div className="hb-settings-section__field-value">{data.lastName}</div>
          )}
        </div>

        <div className="col-md-6 mb-3">
          <label className="hb-settings-section__field-label">Date of Birth</label>
          {isEditing ? (
            <>
              <input
                type="date"
                className={`form-control ${errors.dob ? "is-invalid" : ""}`}
                value={form.dob}
                onChange={(e) => handleChange("dob", e.target.value)}
                max={new Date().toISOString().slice(0, 10)}
              />
              {errors.dob && <div className="hb-login__field-error">{errors.dob}</div>}
            </>
          ) : (
            <div className="hb-settings-section__field-value">
              {data.dob ? new Date(data.dob).toLocaleDateString() : "—"}
            </div>
          )}
        </div>

        <div className="col-md-6 mb-3">
          <label className="hb-settings-section__field-label">Gender</label>
          {isEditing ? (
            <>
              <select
                className={`form-select ${errors.gender ? "is-invalid" : ""}`}
                value={form.gender}
                onChange={(e) => handleChange("gender", e.target.value)}
              >
                <option value="">Select gender</option>
                {GENDER_OPTIONS.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
              {errors.gender && <div className="hb-login__field-error">{errors.gender}</div>}
            </>
          ) : (
            <div className="hb-settings-section__field-value">{data.gender || "—"}</div>
          )}
        </div>

        <div className="col-md-6 mb-3">
          <label className="hb-settings-section__field-label">
            Email Address <span className="text-muted fw-normal">(change under Security)</span>
          </label>
          <div className="hb-settings-section__field-value text-muted">{data.email}</div>
        </div>

        <div className="col-md-6 mb-3">
          <label className="hb-settings-section__field-label">Mobile Number</label>
          {isEditing ? (
            <>
              <input
                type="tel"
                maxLength={10}
                className={`form-control ${errors.mobileNumber ? "is-invalid" : ""}`}
                value={form.mobileNumber}
                onChange={(e) => handleChange("mobileNumber", e.target.value)}
              />
              {errors.mobileNumber && <div className="hb-login__field-error">{errors.mobileNumber}</div>}
            </>
          ) : (
            <div className="hb-settings-section__field-value">{data.mobileNumber}</div>
          )}
        </div>
      </div>

      <div className="hb-settings-section__toolbar">
        {isEditing ? (
          <>
            <button type="button" className="btn hb-btn-secondary" onClick={handleCancel} disabled={saving}>
              <FaTimes className="me-1" /> Cancel
            </button>
            <button type="button" className="btn hb-btn-primary" onClick={handleSave} disabled={saving}>
              <FaSave className="me-1" /> {saving ? "Saving..." : "Save"}
            </button>
          </>
        ) : (
          <button type="button" className="btn hb-btn-secondary" onClick={() => setIsEditing(true)}>
            <FaEdit className="me-1" /> Edit
          </button>
        )}
      </div>
    </div>
  );
}
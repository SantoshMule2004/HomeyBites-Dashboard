// src/pages/Register/BusinessDetailsForm.jsx
//
// Step 2 of provider registration — only reachable after OTP verification.
// On submit, calls addBussinessDetails(providerId, ...) and reports
// success back to <RegisterPage> via onComplete(response).
//
// Address auto-detection: same reverse-geocode approach used in
// Settings > Business Information (see LocationService.js). "Use My
// Current Location" fills lat/lng via the browser and immediately looks up
// an address for those coordinates; "Detect Address from Coordinates"
// does the same lookup for whatever lat/lng were typed in by hand. Both
// fill Address Line + Area, which stay editable afterwards.

import { useState } from "react";
import { FaStore, FaMapMarkerAlt, FaCrosshairs, FaSearchLocation } from "react-icons/fa";
import { addBussinessDetails } from "../../Services/authService";
import { reverseGeocode } from "../../Services/locationService";
import "../../components/common/Common.css";

// 👇 FSSAI food license numbers are typically 14 digits — adjust if your
// backend accepts a different format.
const FOOD_LICENSE_REGEX = /^[0-9]{14}$/;
// Standard 15-character GSTIN format. GSTIN itself is optional here (not
// every small provider has one) — only validated if something is entered.
const GSTIN_REGEX = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;

const emptyForm = {
  businessName: "",
  foodLicenseNo: "",
  gstin: "",
  addressLine: "",
  area: "",
  latitude: "",
  longitude: "",
  serviceRadius: "",
};

export default function BusinessDetailsForm({ providerId, onComplete }) {
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState(null);
  const [locating, setLocating] = useState(false);
  const [fetchingAddress, setFetchingAddress] = useState(false);
  const [addressFetchError, setAddressFetchError] = useState(null);
  const [detectedFrom, setDetectedFrom] = useState(null); // last display_name applied, shown as a confirmation hint

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
    if (formError) setFormError(null);
  };

  // Calls the reverse-geocode API for whatever lat/lng are currently in the
  // form, and fills Address Line + Area from the response.
  const fetchAddressForCurrentCoords = async (lat, lon) => {
    setFetchingAddress(true);
    setAddressFetchError(null);
    try {
      const response = await reverseGeocode(lat, lon);
      const area =
        response.address?.village ||
        response.address?.town ||
        response.address?.city ||
        response.address?.county ||
        "";

      setForm((prev) => ({
        ...prev,
        addressLine: response.display_name || prev.addressLine,
        area: area || prev.area,
      }));
      setErrors((prev) => ({ ...prev, addressLine: undefined, area: undefined }));
      setDetectedFrom(response.display_name);
    } catch (err) {
      console.error(err);
      setAddressFetchError("Couldn't fetch an address for these coordinates. Please enter it manually.");
    } finally {
      setFetchingAddress(false);
    }
  };

  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      setFormError("Location access isn't supported by this browser. Please enter coordinates manually.");
      return;
    }

    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude.toFixed(6);
        const lon = position.coords.longitude.toFixed(6);
        setForm((prev) => ({ ...prev, latitude: String(lat), longitude: String(lon) }));
        setErrors((prev) => ({ ...prev, latitude: undefined, longitude: undefined }));
        setLocating(false);
        fetchAddressForCurrentCoords(lat, lon);
      },
      () => {
        setFormError("Couldn't access your location. Please enter coordinates manually.");
        setLocating(false);
      }
    );
  };

  // For when coordinates are typed in by hand instead of using
  // "Use My Current Location" — validates them first, then looks up the address.
  const handleDetectAddress = () => {
    if (form.latitude === "" || isNaN(form.latitude) || Math.abs(Number(form.latitude)) > 90) {
      setErrors((prev) => ({ ...prev, latitude: "Enter a valid latitude (-90 to 90) first." }));
      return;
    }
    if (form.longitude === "" || isNaN(form.longitude) || Math.abs(Number(form.longitude)) > 180) {
      setErrors((prev) => ({ ...prev, longitude: "Enter a valid longitude (-180 to 180) first." }));
      return;
    }
    fetchAddressForCurrentCoords(form.latitude, form.longitude);
  };

  const validate = () => {
    const next = {};

    if (!form.businessName.trim()) next.businessName = "Business name cannot be empty.";

    if (!form.foodLicenseNo.trim()) {
      next.foodLicenseNo = "Food license number cannot be empty.";
    } else if (!FOOD_LICENSE_REGEX.test(form.foodLicenseNo.trim())) {
      next.foodLicenseNo = "Enter a valid 14-digit FSSAI license number.";
    }

    if (form.gstin.trim() && !GSTIN_REGEX.test(form.gstin.trim().toUpperCase())) {
      next.gstin = "Enter a valid 15-character GSTIN, or leave blank.";
    }

    if (form.latitude === "" || isNaN(form.latitude)) {
      next.latitude = "Enter a valid latitude.";
    } else if (Number(form.latitude) < -90 || Number(form.latitude) > 90) {
      next.latitude = "Latitude must be between -90 and 90.";
    }

    if (form.longitude === "" || isNaN(form.longitude)) {
      next.longitude = "Enter a valid longitude.";
    } else if (Number(form.longitude) < -180 || Number(form.longitude) > 180) {
      next.longitude = "Longitude must be between -180 and 180.";
    }

    if (!form.addressLine.trim()) next.addressLine = "Address cannot be empty.";
    if (!form.area.trim()) next.area = "Area cannot be empty.";

    if (form.serviceRadius === "" || isNaN(form.serviceRadius) || Number(form.serviceRadius) <= 0) {
      next.serviceRadius = "Enter a service radius greater than 0.";
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
      const response = await addBussinessDetails(providerId, {
        businessName: form.businessName.trim(),
        foodLicenseNo: form.foodLicenseNo.trim(),
        gstin: form.gstin.trim() || null,
        addressLine: form.addressLine.trim(),
        area: form.area.trim(),
        latitude: Number(form.latitude),
        longitude: Number(form.longitude),
        serviceRadius: Number(form.serviceRadius),
      });
      onComplete(response);
    } catch (err) {
      console.error(err);
      const serverMessage = err?.response?.data?.message;
      setFormError(serverMessage || "Couldn't save your business details. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      {formError && <div className="hb-login__error">{formError}</div>}

      <form onSubmit={handleSubmit} noValidate>
        <div className="mb-3">
          <label className="form-label fw-semibold">Business Name</label>
          <div className="hb-login__input-group">
            <FaStore className="hb-login__input-icon" />
            <input
              type="text"
              className={`form-control hb-login__input ${errors.businessName ? "is-invalid" : ""}`}
              value={form.businessName}
              onChange={(e) => handleChange("businessName", e.target.value)}
            />
          </div>
          {errors.businessName && <div className="hb-login__field-error">{errors.businessName}</div>}
        </div>

        <div className="row">
          <div className="col-md-6 mb-3">
            <label className="form-label fw-semibold">Food License No. (FSSAI)</label>
            <input
              type="text"
              className={`form-control ${errors.foodLicenseNo ? "is-invalid" : ""}`}
              value={form.foodLicenseNo}
              onChange={(e) => handleChange("foodLicenseNo", e.target.value)}
              maxLength={14}
              placeholder="14-digit license number"
            />
            {errors.foodLicenseNo && <div className="hb-login__field-error">{errors.foodLicenseNo}</div>}
          </div>

          <div className="col-md-6 mb-3">
            <label className="form-label fw-semibold">
              GSTIN <span className="text-muted fw-normal">(optional)</span>
            </label>
            <input
              type="text"
              className={`form-control ${errors.gstin ? "is-invalid" : ""}`}
              value={form.gstin}
              onChange={(e) => handleChange("gstin", e.target.value.toUpperCase())}
              maxLength={15}
              placeholder="15-character GSTIN"
            />
            {errors.gstin && <div className="hb-login__field-error">{errors.gstin}</div>}
          </div>
        </div>

        {/* Location comes first — Address/Area below can be auto-filled from it */}
        <div className="mb-2">
          <div className="d-flex align-items-center justify-content-between">
            <label className="form-label fw-semibold mb-0">Location Coordinates</label>
            <button
              type="button"
              className="hb-use-location-btn"
              onClick={handleUseCurrentLocation}
              disabled={locating || fetchingAddress}
            >
              <FaCrosshairs /> {locating ? "Locating..." : "Use My Current Location"}
            </button>
          </div>
        </div>

        <div className="row">
          <div className="col-md-6 mb-3">
            <label className="form-label">Latitude</label>
            <input
              type="text"
              inputMode="decimal"
              className={`form-control ${errors.latitude ? "is-invalid" : ""}`}
              value={form.latitude}
              onChange={(e) => handleChange("latitude", e.target.value)}
              placeholder="e.g. 18.5204"
            />
            {errors.latitude && <div className="hb-login__field-error">{errors.latitude}</div>}
          </div>

          <div className="col-md-6 mb-3">
            <label className="form-label">Longitude</label>
            <input
              type="text"
              inputMode="decimal"
              className={`form-control ${errors.longitude ? "is-invalid" : ""}`}
              value={form.longitude}
              onChange={(e) => handleChange("longitude", e.target.value)}
              placeholder="e.g. 73.8567"
            />
            {errors.longitude && <div className="hb-login__field-error">{errors.longitude}</div>}
          </div>
        </div>

        <div className="mb-3">
          <button
            type="button"
            className="hb-use-location-btn"
            onClick={handleDetectAddress}
            disabled={fetchingAddress || locating}
          >
            <FaSearchLocation /> {fetchingAddress ? "Detecting address..." : "Detect Address from Coordinates"}
          </button>
          {addressFetchError && <div className="hb-login__field-error">{addressFetchError}</div>}
          {detectedFrom && !addressFetchError && (
            <div className="hb-settings-section__detected-hint">Detected: {detectedFrom}</div>
          )}
        </div>

        <div className="mb-3">
          <label className="form-label fw-semibold">Address Line</label>
          <div className="hb-login__input-group">
            <FaMapMarkerAlt className="hb-login__input-icon" />
            <input
              type="text"
              className={`form-control hb-login__input ${errors.addressLine ? "is-invalid" : ""}`}
              value={form.addressLine}
              onChange={(e) => handleChange("addressLine", e.target.value)}
              placeholder="Street, building, landmark..."
            />
          </div>
          {errors.addressLine && <div className="hb-login__field-error">{errors.addressLine}</div>}
        </div>

        <div className="row">
          <div className="col-md-6 mb-3">
            <label className="form-label fw-semibold">Area</label>
            <input
              type="text"
              className={`form-control ${errors.area ? "is-invalid" : ""}`}
              value={form.area}
              onChange={(e) => handleChange("area", e.target.value)}
              placeholder="e.g. Baner, Pimpri"
            />
            {errors.area && <div className="hb-login__field-error">{errors.area}</div>}
          </div>

          <div className="col-md-6 mb-3">
            <label className="form-label fw-semibold">Service Radius (km)</label>
            <input
              type="number"
              min="0"
              step="0.1"
              className={`form-control ${errors.serviceRadius ? "is-invalid" : ""}`}
              value={form.serviceRadius}
              onChange={(e) => handleChange("serviceRadius", e.target.value)}
              placeholder="e.g. 5"
            />
            {errors.serviceRadius && <div className="hb-login__field-error">{errors.serviceRadius}</div>}
          </div>
        </div>

        <button type="submit" className="btn hb-btn-primary hb-login__submit" disabled={submitting}>
          {submitting ? "Submitting..." : "Submit & Continue to Dashboard"}
        </button>
      </form>
    </div>
  );
}
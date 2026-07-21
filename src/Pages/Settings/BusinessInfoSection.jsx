// src/pages/Settings/BusinessInfoSection.jsx
//
// 👇 API WIRING:
//   On mount (in SettingsPage): GET /tiffin-provider/{providerId}/settings/business
//   On Save here:                PUT /tiffin-provider/{providerId}/settings/business
//   Body: { businessName, addressLine, area, latitude, longitude,
//           serviceRadius, openingTime, closingTime, fssaiLicenseNo, gstNumber }
//
//   Reverse geocoding (lat/lng -> address), used by both "Use Current
//   Location" and "Detect Address" below:
//     GET /location/reverse-geocode?lat={lat}&lon={lon}  (see LocationService.js)
//   Response is mapped as: addressLine <- display_name, area <- the first
//   available of address.village / address.town / address.city / address.county.

import { useState } from "react";
import { FaEdit, FaSave, FaTimes, FaCrosshairs, FaSearchLocation } from "react-icons/fa";
import { reverseGeocode } from "../../Services/locationService";
import { updateBusinessDetails } from "../../Services/userService";
import { useUserInfo } from "../../Context/UserContext";
import { toast } from "react-toastify";

const FOOD_LICENSE_REGEX = /^[0-9]{14}$/;
const GSTIN_REGEX = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;

function Field({ label, field, value, type = "text", optional, isEditing, form, errors, onChange, children }) {
  return (
    <div className="col-md-6 mb-3">
      <label className="hb-settings-section__field-label">
        {label} {optional && <span className="text-muted fw-normal">(optional)</span>}
      </label>
      {isEditing ? (
        children ?? (
          <>
            <input
              type={type}
              className={`form-control ${errors[field] ? "is-invalid" : ""}`}
              value={form[field]}
              onChange={(e) => onChange(field, e.target.value)}
            />
            {errors[field] && <div className="hb-login__field-error">{errors[field]}</div>}
          </>
        )
      ) : (
        <div className="hb-settings-section__field-value">{value || <span className="text-muted">—</span>}</div>
      )}
    </div>
  );
}

export default function BusinessInfoSection({ data, providerId, onSave }) {
  const [form, setForm] = useState(data);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [locating, setLocating] = useState(false);
  const [fetchingAddress, setFetchingAddress] = useState(false);
  const [addressFetchError, setAddressFetchError] = useState(null);
  const [detectedFrom, setDetectedFrom] = useState(null); // last display_name applied, shown as a confirmation hint
  const [errors, setErrors] = useState({});

  const { setBusinessDetails } = useUserInfo();

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  // Calls the reverse-geocode API for whatever lat/lng are currently in the
  // form, and fills Address + Area from the response. Address/Area stay
  // editable afterwards in case the detected value needs a tweak.
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
    if (!navigator.geolocation) return;
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude.toFixed(6);
        const lon = position.coords.longitude.toFixed(6);
        setForm((prev) => ({ ...prev, latitude: String(lat), longitude: String(lon) }));
        setLocating(false);
        fetchAddressForCurrentCoords(lat, lon);
      },
      () => setLocating(false)
    );
  };

  // For when the person types coordinates in by hand instead of using
  // "Use Current Location" — validates them first, then looks up the address.
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
    if (!form.addressLine.trim()) next.addressLine = "Address cannot be empty.";
    if (!form.area.trim()) next.area = "Area cannot be empty.";

    if (form.latitude === "" || isNaN(form.latitude) || Math.abs(Number(form.latitude)) > 90) {
      next.latitude = "Enter a valid latitude (-90 to 90).";
    }
    if (form.longitude === "" || isNaN(form.longitude) || Math.abs(Number(form.longitude)) > 180) {
      next.longitude = "Enter a valid longitude (-180 to 180).";
    }
    if (form.serviceRadius === "" || isNaN(form.serviceRadius) || Number(form.serviceRadius) <= 0) {
      next.serviceRadius = "Enter a service radius greater than 0.";
    }
    // if (!form.openingTime) next.openingTime = "Select an opening time.";
    // if (!form.closingTime) next.closingTime = "Select a closing time.";
    if (!FOOD_LICENSE_REGEX.test(form.fssaiLicenseNo.trim())) {
      next.fssaiLicenseNo = "Enter a valid 14-digit FSSAI license number.";
    }
    if (form.gstNumber && !GSTIN_REGEX.test(form.gstNumber.trim().toUpperCase())) {
      next.gstNumber = "Enter a valid 15-character GSTIN, or leave blank.";
    }

    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleCancel = () => {
    setForm(data);
    setErrors({});
    setAddressFetchError(null);
    setDetectedFrom(null);
    setIsEditing(false);
  };

  const handleSave = async () => {
    if (!validate()) return;
    setSaving(true);
    try {
      // 👇 await updateBusinessSettings(providerId, form)
      const response = await updateBusinessDetails(providerId,
        {
          businessName: form.businessName,
          addressLine: form.addressLine,
          area: form.area,
          latitude: form.latitude,
          longitude: form.longitude,
          serviceRadius: form.serviceRadius,
          // openingTime: form."08:00",
          // closingTime: form."21:00",
          foodLicenseNo: form.fssaiLicenseNo,
          gstin: form.gstNumber,
        })

      toast.success("Business details updated succesfully..!")

      setBusinessDetails(response.classObj)
      // await new Promise((resolve) => setTimeout(resolve, 600));
      onSave(form);
      setIsEditing(false);
    } catch (err) {
      console.error(err);
      // Your backend returns 409 with a specific "already exists" message
      // for duplicate plan names — surface it if present, else a generic one.
      const serverMessage = err?.response?.data?.message;
      toast.error(serverMessage || "Couldn't save business details. Please try again.");
      throw err;
    } finally {
      setSaving(false);
    }
  };

  // const Field = ({ label, field, value, type = "text", optional, children }) => (
  //   <div className="col-md-6 mb-3">
  //     <label className="hb-settings-section__field-label">
  //       {label} {optional && <span className="text-muted fw-normal">(optional)</span>}
  //     </label>
  //     {isEditing ? (
  //       children ?? (
  //         <>
  //           <input
  //             type={type}
  //             className={`form-control ${errors[field] ? "is-invalid" : ""}`}
  //             value={form[field]}
  //             onChange={(e) => handleChange(field, e.target.value)}
  //           />
  //           {errors[field] && <div className="hb-login__field-error">{errors[field]}</div>}
  //         </>
  //       )
  //     ) : (
  //       <div className="hb-settings-section__field-value">{value || <span className="text-muted">—</span>}</div>
  //     )}
  //   </div>
  // );

  return (
    <div>
      <div className="row">
        <div className="col-12 mb-3">
          <label className="hb-settings-section__field-label">Business Name</label>
          {isEditing ? (
            <>
              <input
                type="text"
                className={`form-control ${errors.businessName ? "is-invalid" : ""}`}
                value={form.businessName}
                onChange={(e) => handleChange("businessName", e.target.value)}
              />
              {errors.businessName && <div className="hb-login__field-error">{errors.businessName}</div>}
            </>
          ) : (
            <div className="hb-settings-section__field-value">{data.businessName}</div>
          )}
        </div>

        {/* Location comes first — Address/Area below can be auto-filled from it */}
        <div className="col-md-6 mb-3">
          <div className="d-flex align-items-center justify-content-between">
            <label className="hb-settings-section__field-label mb-0">Location (Latitude / Longitude)</label>
            {isEditing && (
              <button
                type="button"
                className="hb-use-location-btn"
                onClick={handleUseCurrentLocation}
                disabled={locating || fetchingAddress}
              >
                <FaCrosshairs /> {locating ? "Locating..." : "Use Current Location"}
              </button>
            )}
          </div>
          {isEditing ? (
            <>
              <div className="d-flex gap-2 mt-1">
                <div className="flex-fill">
                  <input
                    type="text"
                    className={`form-control ${errors.latitude ? "is-invalid" : ""}`}
                    value={form.latitude}
                    onChange={(e) => handleChange("latitude", e.target.value)}
                    placeholder="Latitude"
                  />
                  {errors.latitude && <div className="hb-login__field-error">{errors.latitude}</div>}
                </div>
                <div className="flex-fill">
                  <input
                    type="text"
                    className={`form-control ${errors.longitude ? "is-invalid" : ""}`}
                    value={form.longitude}
                    onChange={(e) => handleChange("longitude", e.target.value)}
                    placeholder="Longitude"
                  />
                  {errors.longitude && <div className="hb-login__field-error">{errors.longitude}</div>}
                </div>
              </div>

              <button
                type="button"
                className="hb-use-location-btn mt-2"
                onClick={handleDetectAddress}
                disabled={fetchingAddress || locating}
              >
                <FaSearchLocation /> {fetchingAddress ? "Detecting address..." : "Detect Address from Coordinates"}
              </button>

              {addressFetchError && <div className="hb-login__field-error">{addressFetchError}</div>}
              {detectedFrom && !addressFetchError && (
                <div className="hb-settings-section__detected-hint">Detected: {detectedFrom}</div>
              )}
            </>
          ) : (
            <div className="hb-settings-section__field-value">
              {data.latitude}, {data.longitude}
            </div>
          )}
        </div>

        {/* <Field
          label="Address"
          field="addressLine"
          value={data.addressLine}
        />
        <Field label="Area" field="area" value={data.area} />

        <Field label="Service Radius (km)" field="serviceRadius" value={`${Number(data.serviceRadius) / 1000} km`} type="number" />
        <Field label="Opening Time" field="openingTime" value={data.openingTime} type="time" />
        <Field label="Closing Time" field="closingTime" value={data.closingTime} type="time" />
        <Field label="FSSAI License Number" field="fssaiLicenseNo" value={data.fssaiLicenseNo} />
        <Field label="GST Number" field="gstNumber" value={data.gstNumber} optional /> */}

        <Field
          label="Address"
          field="addressLine"
          value={data.addressLine}
          isEditing={isEditing}
          form={form}
          errors={errors}
          onChange={handleChange}
        />
        <Field
          label="Area"
          field="area"
          value={data.area}
          isEditing={isEditing}
          form={form}
          errors={errors}
          onChange={handleChange}
        />

        <Field
          label="Service Radius (km)"
          field="serviceRadius"
          value={`${Number(data.serviceRadius) / 1000} km`}
          type="number"
          isEditing={isEditing}
          form={form}
          errors={errors}
          onChange={handleChange}
        />
        {/* <Field
          label="Opening Time"
          field="openingTime"
          value={data.openingTime}
          type="time"
          isEditing={isEditing}
          form={form}
          errors={errors}
          onChange={handleChange}
        />
        <Field
          label="Closing Time"
          field="closingTime"
          value={data.closingTime}
          type="time"
          isEditing={isEditing}
          form={form}
          errors={errors}
          onChange={handleChange}
        /> */}
        <Field
          label="FSSAI License Number"
          field="fssaiLicenseNo"
          value={data.fssaiLicenseNo}
          isEditing={isEditing}
          form={form}
          errors={errors}
          onChange={handleChange}
        />
        <Field
          label="GST Number"
          field="gstNumber"
          value={data.gstNumber}
          optional
          isEditing={isEditing}
          form={form}
          errors={errors}
          onChange={handleChange}
        />

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
// src/pages/Settings/DeliverySettingsSection.jsx
//
// 👇 API WIRING:
//   On mount (in SettingsPage): GET /tiffin-provider/{providerId}/settings/delivery
//   On Save here:                PUT /tiffin-provider/{providerId}/settings/delivery
//   Body: { acceptOneTimeOrders, acceptNewSubscriptions, maxOrdersPerDay,
//           maxActiveSubscriptions, deliveryRadius, estimatedDeliveryTime }

import { useState } from "react";
import { FaEdit, FaSave, FaTimes } from "react-icons/fa";
import "../../components/tables/Table.css";

// Defined OUTSIDE the component on purpose: declaring these inside
// DeliverySettingsSection's function body would make React see a brand-new
// component type on every render, remounting the <input> after each
// keystroke and dropping focus — exactly the bug this fixes.
function ToggleField({ label, field, description, isEditing, form, data, onChange }) {
  return (
    <div className="col-md-6 mb-3">
      <label className="hb-settings-section__field-label">{label}</label>
      {isEditing ? (
        <div className="form-check form-switch mt-1">
          <input
            className="form-check-input"
            type="checkbox"
            role="switch"
            checked={form[field]}
            onChange={(e) => onChange(field, e.target.checked)}
          />
          <label className="form-check-label small text-muted">{description}</label>
        </div>
      ) : (
        <div className="hb-settings-section__field-value">
          <span className={`hb-badge ${data[field] ? "hb-badge--success" : "hb-badge--neutral"}`}>
            {data[field] ? "Enabled" : "Disabled"}
          </span>
        </div>
      )}
    </div>
  );
}

function NumberField({ label, field, value, suffix, isEditing, form, errors, onChange }) {
  return (
    <div className="col-md-6 mb-3">
      <label className="hb-settings-section__field-label">{label}</label>
      {isEditing ? (
        <>
          <input
            type="number"
            min="0"
            className={`form-control ${errors[field] ? "is-invalid" : ""}`}
            value={form[field]}
            onChange={(e) => onChange(field, e.target.value)}
          />
          {errors[field] && <div className="hb-login__field-error">{errors[field]}</div>}
        </>
      ) : (
        <div className="hb-settings-section__field-value">
          {value}
          {suffix ? ` ${suffix}` : ""}
        </div>
      )}
    </div>
  );
}

export default function DeliverySettingsSection({ data, onSave }) {
  const [form, setForm] = useState(data);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const validate = () => {
    const next = {};
    if (form.maxOrdersPerDay === "" || isNaN(form.maxOrdersPerDay) || Number(form.maxOrdersPerDay) <= 0) {
      next.maxOrdersPerDay = "Enter a number greater than 0.";
    }
    if (
      form.maxActiveSubscriptions === "" ||
      isNaN(form.maxActiveSubscriptions) ||
      Number(form.maxActiveSubscriptions) <= 0
    ) {
      next.maxActiveSubscriptions = "Enter a number greater than 0.";
    }
    if (form.deliveryRadius === "" || isNaN(form.deliveryRadius) || Number(form.deliveryRadius) <= 0) {
      next.deliveryRadius = "Enter a radius greater than 0.";
    }
    if (!form.estimatedDeliveryTime.trim()) {
      next.estimatedDeliveryTime = "Enter an estimated delivery time.";
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
      // 👇 await updateDeliverySettings(providerId, form)
      await new Promise((resolve) => setTimeout(resolve, 600));
      onSave(form);
      setIsEditing(false);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div className="row">
        <ToggleField
          label="Accept One-Time Orders"
          field="acceptOneTimeOrders"
          description="Allow customers to place single tiffin orders"
          isEditing={isEditing}
          form={form}
          data={data}
          onChange={handleChange}
        />
        <ToggleField
          label="Accept New Subscriptions"
          field="acceptNewSubscriptions"
          description="Allow customers to subscribe to your tiffin plans"
          isEditing={isEditing}
          form={form}
          data={data}
          onChange={handleChange}
        />

        <NumberField
          label="Maximum Orders Per Day"
          field="maxOrdersPerDay"
          value={data.maxOrdersPerDay}
          isEditing={isEditing}
          form={form}
          errors={errors}
          onChange={handleChange}
        />
        <NumberField
          label="Maximum Active Subscriptions"
          field="maxActiveSubscriptions"
          value={data.maxActiveSubscriptions}
          isEditing={isEditing}
          form={form}
          errors={errors}
          onChange={handleChange}
        />
        <NumberField
          label="Delivery Radius"
          field="deliveryRadius"
          value={data.deliveryRadius}
          suffix="km"
          isEditing={isEditing}
          form={form}
          errors={errors}
          onChange={handleChange}
        />

        <div className="col-md-6 mb-3">
          <label className="hb-settings-section__field-label">Estimated Delivery Time</label>
          {isEditing ? (
            <>
              <input
                type="text"
                className={`form-control ${errors.estimatedDeliveryTime ? "is-invalid" : ""}`}
                value={form.estimatedDeliveryTime}
                onChange={(e) => handleChange("estimatedDeliveryTime", e.target.value)}
                placeholder="e.g. 30-45"
              />
              {errors.estimatedDeliveryTime && (
                <div className="hb-login__field-error">{errors.estimatedDeliveryTime}</div>
              )}
            </>
          ) : (
            <div className="hb-settings-section__field-value">{data.estimatedDeliveryTime} min</div>
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

      <div className="hb-settings-section__api-note">
        GET /tiffin-provider/&#123;providerId&#125;/settings/delivery (on load)
        <br />
        PUT /tiffin-provider/&#123;providerId&#125;/settings/delivery (on Save)
      </div>
    </div>
  );
}
// src/pages/MenuItems/MenuItemFormModal.jsx
//
// Popup form used for BOTH "Add New Item" and "Update" — pass an existing
// item via `initialData` to prefill it for editing, or omit it to add new.
//
// Validation:
//   menuName   -> required
//   price      -> required, must be a number > 0
//   description-> required
//   menuType   -> required, must pick one
//   categoryId -> required, must pick one (real categories passed in via
//                 the `categories` prop, e.g. [{ categoryId, categoryName }])
//   image      -> required when adding; when a file IS picked (add or
//                 edit), it must be an image type and under 5MB
//   active   -> boolean toggle, defaults to true when adding
//
// On submit, this calls onSave(payload) where payload is the plain field
// values PLUS `imageFile` (a File object, or null) and `categoryId`. The
// parent page is responsible for turning that into the multipart FormData
// your backend expects — see MenuItemsPage.jsx for both the "add with
// image" call and the separate "update image" call used when editing.

import { useEffect, useState } from "react";
import { FaCamera } from "react-icons/fa";
import { MENU_TYPE_OPTIONS } from "../../utils/config";
import "../../Components/tables/Table.css";
import "../../Components/Modal.css";
import "./MenuItems.css";

const MAX_IMAGE_SIZE_MB = 5;

const emptyForm = {
  menuName: "",
  price: "",
  description: "",
  menuType: "",
  categoryId: "",
  active: true,
};

export default function MenuItemFormModal({
  isOpen,
  mode,
  initialData,
  categories = [], // [{ categoryId, categoryName }]
  onSave,
  onClose,
}) {
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  // Reset / prefill whenever the modal opens
  useEffect(() => {
    if (isOpen) {
      setForm(
        initialData
          ? {
              menuId: initialData.menuId,
              menuName: initialData.menuName ?? "",
              price: initialData.price ?? "",
              description: initialData.description ?? "",
              menuType: initialData.menuType ?? "",
              categoryId: initialData.categoryId ?? "",
              active: initialData.active ?? true,
            }
          : emptyForm
      );
      setImageFile(null);
      setImagePreview(initialData?.imageUrl || null);
      setErrors({});
    }
  }, [isOpen, initialData]);

  // Build/clean up a preview URL whenever a new file is picked
  useEffect(() => {
    if (!imageFile) return;
    const objectUrl = URL.createObjectURL(imageFile);
    setImagePreview(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [imageFile]);

  if (!isOpen) return null;

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleImageChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setErrors((prev) => ({ ...prev, image: "Please select a valid image file (PNG, JPG, etc.)." }));
      event.target.value = ""; // clear so the same bad file can be re-picked after fixing
      return;
    }
    if (file.size > MAX_IMAGE_SIZE_MB * 1024 * 1024) {
      setErrors((prev) => ({ ...prev, image: `Image must be smaller than ${MAX_IMAGE_SIZE_MB}MB.` }));
      event.target.value = "";
      return;
    }

    setImageFile(file);
    setErrors((prev) => ({ ...prev, image: undefined }));
  };

  const validate = () => {
    const next = {};

    if (!form.menuName.trim()) {
      next.menuName = "Menu item name cannot be empty.";
    }

    if (form.price === "" || form.price === null) {
      next.price = "Price cannot be empty..!";
    } else if (isNaN(form.price) || Number(form.price) <= 0) {
      next.price = "Price must be a number greater than 0.";
    }

    if (!form.description.trim()) {
      next.description = "Description cannot be empty.";
    }

    if (!form.menuType) {
      next.menuType = "Select type of menu.";
    }

    if (!form.categoryId) {
      next.categoryId = "Select a category.";
    }

    if (mode === "add" && !imageFile) {
      next.image = "Please select an image for this menu item.";
    }

    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    try {
      await onSave({
        ...form,
        price: Number(form.price),
        categoryId: Number(form.categoryId),
        imageFile, // File object, or null if editing without changing the image
      });
      setSubmitting(false);
      onClose();
    } catch (err) {
      setSubmitting(false);
      // Let the parent's toast/error handling surface API errors;
      // this just makes sure the button doesn't stay stuck loading.
      console.error(err);
    }
  };

  return (
    <div className="hb-modal-backdrop" onMouseDown={onClose}>
      <div
        className="hb-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="menuItemModalTitle"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="hb-modal__header">
          <h5 id="menuItemModalTitle" className="hb-modal__title">
            {mode === "edit" ? "Update Menu Item" : "Add New Menu Item"}
          </h5>
          <button
            type="button"
            className="hb-modal__close"
            onClick={onClose}
            aria-label="Close"
          >
            &times;
          </button>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <div className="hb-modal__body">
            <div className="mb-4">
              <div className="hb-image-upload">
                <div className="hb-image-upload__preview">
                  {imagePreview ? (
                    <img src={imagePreview} alt="Menu item preview" />
                  ) : (
                    <span className="hb-image-upload__placeholder">No image</span>
                  )}
                  <label
                    htmlFor="menuItemImageInput"
                    className="hb-image-upload__edit-btn"
                    title={imagePreview ? "Change image" : "Upload image"}
                  >
                    <FaCamera />
                  </label>
                  <input
                    id="menuItemImageInput"
                    type="file"
                    accept="image/*"
                    className="hb-image-upload__input"
                    onChange={handleImageChange}
                  />
                </div>
                <div className="hb-image-upload__hint">
                  {mode === "edit"
                    ? "Tap the camera icon to replace the current image."
                    : "Tap the camera icon to add an image (PNG or JPG, up to 5MB)."}
                </div>
                {errors.image && <div className="text-danger small mt-1">{errors.image}</div>}
              </div>
            </div>

            <div className="mb-3">
              <label className="form-label fw-semibold">Menu Item Name</label>
              <input
                type="text"
                className={`form-control ${errors.menuName ? "is-invalid" : ""}`}
                value={form.menuName}
                onChange={(e) => handleChange("menuName", e.target.value)}
                placeholder="e.g. Kanda Poha"
              />
              {errors.menuName && (
                <div className="invalid-feedback">{errors.menuName}</div>
              )}
            </div>

            <div className="mb-3">
              <label className="form-label fw-semibold">Description</label>
              <textarea
                className={`form-control ${errors.description ? "is-invalid" : ""}`}
                rows={3}
                value={form.description}
                onChange={(e) => handleChange("description", e.target.value)}
                placeholder="Short description of the item"
              />
              {errors.description && (
                <div className="invalid-feedback">{errors.description}</div>
              )}
            </div>

            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label fw-semibold">Price</label>
                <div className="input-group">
                  <span className="input-group-text">₹</span>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    className={`form-control ${errors.price ? "is-invalid" : ""}`}
                    value={form.price}
                    onChange={(e) => handleChange("price", e.target.value)}
                    placeholder="0.00"
                  />
                  {errors.price && (
                    <div className="invalid-feedback">{errors.price}</div>
                  )}
                </div>
              </div>

              <div className="col-md-6 mb-3">
                <label className="form-label fw-semibold">Menu Type</label>
                <select
                  className={`form-select ${errors.menuType ? "is-invalid" : ""}`}
                  value={form.menuType}
                  onChange={(e) => handleChange("menuType", e.target.value)}
                >
                  <option value="">Select menu type</option>
                  {MENU_TYPE_OPTIONS.map((type) => (
                    <option key={type} value={type}>
                      {type.charAt(0) + type.slice(1).toLowerCase()}
                    </option>
                  ))}
                </select>
                {errors.menuType && (
                  <div className="invalid-feedback">{errors.menuType}</div>
                )}
              </div>
            </div>

            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label fw-semibold">Category</label>
                <select
                  className={`form-select ${errors.categoryId ? "is-invalid" : ""}`}
                  value={form.categoryId}
                  onChange={(e) => handleChange("categoryId", e.target.value)}
                >
                  <option value="">Select category</option>
                  {categories.map((cat) => (
                    <option key={cat.categoryId} value={cat.categoryId}>
                      {cat.categoryName}
                    </option>
                  ))}
                </select>
                {errors.categoryId && (
                  <div className="invalid-feedback">{errors.categoryId}</div>
                )}
              </div>

              <div className="col-md-6 mb-3">
                <label className="form-label fw-semibold d-block">Status</label>
                <div className="form-check form-switch mt-2">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    role="switch"
                    id="activeSwitch"
                    checked={form.active}
                    onChange={(e) => handleChange("active", e.target.checked)}
                  />
                  <label className="form-check-label" htmlFor="activeSwitch">
                    {form.active ? "Active" : "Inactive"}
                  </label>
                </div>
              </div>
            </div>
          </div>

          <div className="hb-modal__footer">
            <button
              type="button"
              className="btn hb-btn-secondary"
              onClick={onClose}
              disabled={submitting}
            >
              Cancel
            </button>
            <button type="submit" className="btn hb-btn-primary" disabled={submitting}>
              {submitting ? "Saving..." : mode === "edit" ? "Update" : "Add Item"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

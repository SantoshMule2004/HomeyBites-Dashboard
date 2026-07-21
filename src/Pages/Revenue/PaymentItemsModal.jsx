// src/pages/Orders/OrderItemsModal.jsx
//
// Read-only popup showing an order's items + summary. Fetches the full
// order detail (including orderItems) from the detail endpoint each time
// it's opened, rather than trusting whatever was in the list row — the
// list endpoint may or may not include the full items array.

import { useEffect, useState } from "react";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import ErrorState from "../../components/common/ErrorState";
import StatusBadge from "../../components/tables/StatusBadge";
import { getProviderOrder } from "../../Services/orderService";
import { ORDER_STATUS_META, PAYMENT_STATUS_META, getStatusMeta } from "../../utils/config";
import "../../components/tables/Table.css";
import "../../components/Modal.css";
import "./Payments.css";

export default function OrderItemsModal({ isOpen, providerId, providerOrderId, onClose }) {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchOrder = () => {
    if (!providerId || !providerOrderId) return;

    setLoading(true);
    setError(null);
    getProviderOrder(providerId, providerOrderId)
      .then((response) => {
        setOrder(response?.classObj ?? response);
      })
      .catch((err) => {
        console.error(err);
        setError("Couldn't load this order's items. Please try again.");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    if (isOpen) {
      setOrder(null);
      fetchOrder();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, providerOrderId]);

  if (!isOpen) return null;

  const orderStatusMeta = order ? getStatusMeta(ORDER_STATUS_META, order.fulfillmentStatus) : null;
  const paymentStatusMeta = order ? getStatusMeta(PAYMENT_STATUS_META, order.paymentStatus) : null;

  return (
    <div className="hb-modal-backdrop" onMouseDown={onClose}>
      <div
        className="hb-modal hb-modal--lg"
        role="dialog"
        aria-modal="true"
        aria-labelledby="orderItemsModalTitle"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="hb-modal__header">
          <h5 id="orderItemsModalTitle" className="hb-modal__title">
            Order #{providerOrderId}
          </h5>
          <button type="button" className="hb-modal__close" onClick={onClose} aria-label="Close">
            &times;
          </button>
        </div>

        <div className="hb-modal__body">
          {loading && <LoadingSpinner message="Loading order..." />}

          {!loading && error && <ErrorState message={error} onRetry={fetchOrder} />}

          {!loading && !error && order && (
            <>
              <div className="hb-order-summary">
                <div className="hb-order-summary__row">
                  <span className="hb-order-summary__label">Receiver</span>
                  <span>
                    {order.receiverName} · {order.receiverContactNo}
                  </span>
                </div>
                <div className="hb-order-summary__row">
                  <span className="hb-order-summary__label">Delivery Address</span>
                  <span>{order.deliveryAddress}</span>
                </div>
                <div className="hb-order-summary__row">
                  <span className="hb-order-summary__label">Payment</span>
                  <span>
                    {order.paymentMethod}{" - "}
                    {paymentStatusMeta && (
                      <StatusBadge label={paymentStatusMeta.label} variant={paymentStatusMeta.variant} />
                    )}
                  </span>
                </div>
                <div className="hb-order-summary__row">
                  <span className="hb-order-summary__label">Order Status</span>
                  <span>
                    {orderStatusMeta && (
                      <StatusBadge label={orderStatusMeta.label} variant={orderStatusMeta.variant} />
                    )}
                  </span>
                </div>
              </div>

              <table className="hb-table hb-order-items-table">
                <thead>
                  <tr>
                    <th>Item</th>
                    <th>Price</th>
                    <th>Qty</th>
                    <th>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {(order.orderItems ?? []).map((item) => (
                    <tr key={item.orderItemId}>
                      <td>{item.itemName}</td>
                      <td>₹ {item.purchasedPrice}</td>
                      <td>{item.quantity}</td>
                      <td>₹ {item.totalPrice}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr>
                    <td colSpan={3} className="text-end fw-semibold">
                      Subtotal
                    </td>
                    <td className="fw-semibold">₹ {order.vendorSubtotal}</td>
                  </tr>
                </tfoot>
              </table>
            </>
          )}
        </div>

        <div className="hb-modal__footer">
          <button type="button" className="btn hb-btn-secondary" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

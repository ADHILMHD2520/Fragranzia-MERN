import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import OrderService from "../../../services/OrderService";
import "./Orders.css";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingOrder, setUpdatingOrder] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const fetchOrders = async () => {
    try {
      setLoading(true);

      const response = await OrderService.getAllOrders();

      console.log("Admin Orders:", response.data);

      setOrders(response.data.orders || []);
    } catch (error) {
      console.error(
        "Error fetching orders:",
        error.response?.data?.message || error.message
      );

      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      setUpdatingOrder(orderId);

      const response = await OrderService.updateDeliveryStatus(
        orderId,
        newStatus
      );

      setOrders((previousOrders) =>
        previousOrders.map((order) =>
          order._id === orderId ? response.data.order : order
        )
      );

      if (selectedOrder && selectedOrder._id === orderId) {
        setSelectedOrder(response.data.order);
      }
    } catch (error) {
      console.error(
        "Error updating status:",
        error.response?.data?.message || error.message
      );

      toast.error(
        error.response?.data?.message ||
          "Failed to update order status"
      );
    } finally {
      setUpdatingOrder(null);
    }
  };

  const handleReturnStatusChange = async (orderId, newStatus) => {
    try {
      setUpdatingOrder(orderId);

      const response = await OrderService.updateReturnStatus(
        orderId,
        newStatus
      );

      setOrders((previousOrders) =>
        previousOrders.map((order) =>
          order._id === orderId ? response.data.order : order
        )
      );

      if (selectedOrder && selectedOrder._id === orderId) {
        setSelectedOrder(response.data.order);
      }
    } catch (error) {
      console.error(
        "Error updating return status:",
        error.response?.data?.message || error.message
      );

      toast.error(
        error.response?.data?.message ||
          "Failed to update return status"
      );
    } finally {
      setUpdatingOrder(null);
    }
  };

  const formatDate = (date) => {
    if (!date) {
      return "-";
    }

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const formatDateTime = (date) => {
    if (!date) {
      return "-";
    }

    return new Date(date).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const getStatusClass = (status) => {
    if (!status) {
      return "pending";
    }

    return status.toLowerCase().replace(/\s+/g, "-");
  };

  const getProductImage = (product) => {
    if (!product?.images || !product.images[0]) {
      return null;
    }

    if (product.images[0].startsWith("http")) {
      return product.images[0];
    }

    if (product.images[0].startsWith("/uploads/")) {
      return product.images[0];
    }

    return `/${product.images[0]}`;
  };

  const openOrderDetails = (order) => {
    setSelectedOrder(order);
  };

  const closeOrderDetails = () => {
    setSelectedOrder(null);
  };

  if (loading) {
    return (
      <div className="orders-page">
        <div className="orders-loading">
          Loading orders...
        </div>
      </div>
    );
  }

  return (
    <div className="orders-page">
      <div className="orders-header">
        <div>
          <h1>Orders</h1>
          <p>
            Manage customer orders, cancellations and returns
          </p>
        </div>

        <button
          className="refresh-orders-btn"
          onClick={fetchOrders}
        >
          Refresh
        </button>
      </div>

      <div className="orders-table-container">
        {orders.length === 0 ? (
          <div className="no-orders">
            No orders found.
          </div>
        ) : (
          <table className="orders-table">
            <thead>
              <tr>
                <th>Order</th>
                <th>Customer</th>
                <th>Products</th>
                <th>Total</th>
                <th>Payment</th>
                <th>Delivery Status</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {orders.map((order) => (
                <tr key={order._id}>
                  <td>
                    <strong>
                      #
                      {order._id
                        ?.slice(-6)
                        .toUpperCase()}
                    </strong>
                  </td>

                  <td>
                    <div className="customer-info">
                      <strong>
                        {order.user?.fullName ||
                          order.user?.name ||
                          "Customer"}
                      </strong>

                      <span>
                        {order.user?.email || "-"}
                      </span>
                    </div>
                  </td>

                  <td>
                    <div className="order-products">
                      {order.orderItems?.map(
                        (item, index) => (
                          <div
                            className="order-product"
                            key={index}
                          >
                            {getProductImage(
                              item.product
                            ) && (
                              <img
                                src={getProductImage(
                                  item.product
                                )}
                                alt={
                                  item.product?.name ||
                                  "Product"
                                }
                              />
                            )}

                            <div>
                              <span>
                                {item.product?.name ||
                                  "Product"}
                              </span>

                              <small>
                                Qty: {item.quantity}
                              </small>
                            </div>
                          </div>
                        )
                      )}
                    </div>
                  </td>

                  <td>
                    ₹
                    {Number(
                      order.totalPrice || 0
                    ).toFixed(2)}
                  </td>

                  <td>
                    <span
                      className={`payment-status ${getStatusClass(
                        order.paymentStatus
                      )}`}
                    >
                      {order.paymentStatus || "Pending"}
                    </span>
                  </td>

                  <td>
                    {order.cancelledByCustomer ? (
                      <span className="cancelled-customer-badge">
                        Cancelled by Customer
                      </span>
                    ) : (
                      <span
                        className={`payment-status ${getStatusClass(
                          order.deliveryStatus
                        )}`}
                      >
                        {order.deliveryStatus ||
                          "Pending"}
                      </span>
                    )}
                  </td>

                  <td>
                    {formatDate(order.createdAt)}
                  </td>

                  <td>
                    <button
                      className="show-order-btn"
                      onClick={() =>
                        openOrderDetails(order)
                      }
                    >
                      Show
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {selectedOrder && (
        <div
          className="order-modal-overlay"
          onClick={closeOrderDetails}
        >
          <div
            className="order-details-modal"
            onClick={(event) =>
              event.stopPropagation()
            }
          >
            <div className="modal-header">
              <div>
                <h2>Order Details</h2>

                <p>
                  #{selectedOrder._id}
                </p>
              </div>

              <button
                className="modal-close-btn"
                onClick={closeOrderDetails}
              >
                ×
              </button>
            </div>

            <div className="order-summary-grid">
              <div>
                <strong>Customer</strong>

                <p>
                  {selectedOrder.user?.fullName ||
                    selectedOrder.user?.name ||
                    "Customer"}
                </p>

                <p>
                  {selectedOrder.user?.email || "-"}
                </p>
              </div>

              <div>
                <strong>Order Date</strong>

                <p>
                  {formatDateTime(
                    selectedOrder.createdAt
                  )}
                </p>
              </div>

              <div>
                <strong>Payment Method</strong>

                <p>
                  {selectedOrder.paymentMethod || "-"}
                </p>
              </div>

              <div>
                <strong>Payment Status</strong>

                <p>
                  {selectedOrder.paymentStatus ||
                    "Pending"}
                </p>
              </div>
            </div>

            <div className="modal-section">
              <h3>Actions</h3>

              <div className="order-summary-grid">
                <div>
                  <strong>Delivery Status</strong>

                  {selectedOrder.cancelledByCustomer ? (
                    <p>
                      <span className="cancelled-customer-badge">
                        Cancelled by Customer
                      </span>
                    </p>
                  ) : (
                    <select
                      className={`order-status ${getStatusClass(
                        selectedOrder.deliveryStatus
                      )}`}
                      value={
                        selectedOrder.deliveryStatus ||
                        "Pending"
                      }
                      disabled={
                        updatingOrder ===
                        selectedOrder._id
                      }
                      onChange={(e) =>
                        handleStatusChange(
                          selectedOrder._id,
                          e.target.value
                        )
                      }
                    >
                      <option value="Pending">
                        Pending
                      </option>

                      <option value="Processing">
                        Processing
                      </option>

                      <option value="Shipped">
                        Shipped
                      </option>

                      <option value="Out for Delivery">
                        Out for Delivery
                      </option>

                      <option value="Delivered">
                        Delivered
                      </option>

                      <option value="Cancelled">
                        Cancelled
                      </option>

                      <option value="Returned">
                        Returned
                      </option>

                      <option value="Failed Delivery">
                        Failed Delivery
                      </option>
                    </select>
                  )}
                </div>

                <div>
                  <strong>Return Status</strong>

                  {selectedOrder.isReturned ? (
                    <select
                      className={`return-status ${getStatusClass(
                        selectedOrder.returnStatus
                      )}`}
                      value={
                        selectedOrder.returnStatus ||
                        "Requested"
                      }
                      disabled={
                        updatingOrder ===
                        selectedOrder._id
                      }
                      onChange={(e) =>
                        handleReturnStatusChange(
                          selectedOrder._id,
                          e.target.value
                        )
                      }
                    >
                      <option value="Requested">
                        Requested
                      </option>

                      <option value="Approved">
                        Approved
                      </option>

                      <option value="Rejected">
                        Rejected
                      </option>

                      <option value="Completed">
                        Completed
                      </option>
                    </select>
                  ) : (
                    <p>No Return</p>
                  )}
                </div>
              </div>
            </div>

            {selectedOrder.cancelledByCustomer && (
              <div className="request-box cancellation-box">
                <h3>Cancellation</h3>

                <p>
                  Customer cancelled this order.
                </p>

                <span>
                  {formatDateTime(
                    selectedOrder.cancelledAt
                  )}
                </span>
              </div>
            )}

            {selectedOrder.isReturned && (
              <div className="request-box return-box">
                <h3>Return Request</h3>

                <p>
                  <strong>Reason:</strong>{" "}
                  {selectedOrder.returnReason ||
                    "No reason provided"}
                </p>

                <p>
                  <strong>Status:</strong>{" "}
                  {selectedOrder.returnStatus ||
                    "Requested"}
                </p>

                {selectedOrder.returnedAt && (
                  <p>
                    <strong>Returned:</strong>{" "}
                    {formatDateTime(
                      selectedOrder.returnedAt
                    )}
                  </p>
                )}
              </div>
            )}

            <div className="modal-section">
              <h3>Products</h3>

              <div className="modal-products">
                {selectedOrder.orderItems?.map(
                  (item, index) => (
                    <div
                      className="modal-product"
                      key={index}
                    >
                      {getProductImage(
                        item.product
                      ) && (
                        <img
                          src={getProductImage(
                            item.product
                          )}
                          alt={
                            item.product?.name ||
                            "Product"
                          }
                        />
                      )}

                      <div>
                        <h4>
                          {item.product?.name ||
                            "Product"}
                        </h4>

                        <p>
                          Quantity: {item.quantity}
                        </p>

                        <p>
                          Price: ₹
                          {Number(
                            item.product?.salePrice ||
                              item.product?.price ||
                              0
                          ).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  )
                )}
              </div>
            </div>

            <div className="modal-section">
              <h3>Shipping Address</h3>

              <div className="shipping-address">
                <p>
                  <strong>
                    {
                      selectedOrder
                        .shippingAddress?.fullName
                    }
                  </strong>
                </p>

                <p>
                  {
                    selectedOrder
                      .shippingAddress?.address
                  }
                </p>

                <p>
                  {
                    selectedOrder
                      .shippingAddress?.city
                  }
                  ,{" "}
                  {
                    selectedOrder
                      .shippingAddress?.state
                  }{" "}
                  -{" "}
                  {
                    selectedOrder
                      .shippingAddress?.pincode
                  }
                </p>

                <p>
                  Phone:{" "}
                  {
                    selectedOrder
                      .shippingAddress?.phone
                  }
                </p>
              </div>
            </div>

            <div className="modal-total">
              <span>Total</span>

              <strong>
                ₹
                {Number(
                  selectedOrder.totalPrice || 0
                ).toFixed(2)}
              </strong>
            </div>

            <button
              className="close-details-btn"
              onClick={closeOrderDetails}
            >
              Close Details
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders;
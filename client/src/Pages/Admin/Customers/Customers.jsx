import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import Sidebar from "../../../Components/Admin/Sidebar/Sidebar";
import "./Customers.css";
import { useNavigate } from "react-router-dom";

const Customers = () => {
  const navigate = useNavigate();

  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [showCustomerDetails, setShowCustomerDetails] = useState(false);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("accessToken");

      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/admin/customers`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Admin Customers:", response.data);

      setCustomers(response.data.customers || []);
    } catch (error) {
      console.error("Error fetching customers:", error);

      setError(
        error.response?.data?.message || "Error fetching customers"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const handleShowCustomer = (customer) => {
    setSelectedCustomer(customer);
    setShowCustomerDetails(true);
  };

  const handleCloseCustomer = () => {
    setShowCustomerDetails(false);
    setSelectedCustomer(null);
  };

  const handleToggleStatus = async (customer) => {
    try {
      const token = localStorage.getItem("accessToken");

      const response = await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/admin/customers/${customer._id}/status`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Customer status updated:", response.data);

      setCustomers((prevCustomers) =>
        prevCustomers.map((item) =>
          item._id === customer._id
            ? {
                ...item,
                isActive: response.data.customer.isActive,
              }
            : item
        )
      );
    } catch (error) {
      console.error("Error updating customer status:", error);

      toast.error(
        error.response?.data?.message ||
          "Error updating customer status"
      );
    }
  };

  const formatJoinedDate = (date) => {
    if (!date) {
      return "N/A";
    }

    return new Date(date).toLocaleString("en-IN", {
      month: "long",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const getCustomerStatus = (customer) => {
    if (customer?.status && customer?.isActive) {
      return "Unblocked";
    }

    return "Blocked";
  };

  if (loading) {
    return (
      <div className="admin-customers-container">
        {/* <Sidebar /> */}
        <div className="customers-page">
          <h2>Loading customers...</h2>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-customers-container">
        {/* <Sidebar /> */}
        <div className="customers-page">
          <h2>{error}</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-customers-container">
      {/* <Sidebar /> */}

      <div className="customers-page">
        <div className="customers-actions">
          <div>
            <button className="export-btn">Export</button>
            <button className="import-btn">Import</button>
          </div>

          <button
            className="add-customer-btn"
            onClick={() => navigate("/admin/add-customer")}
          >
            + Add Customer
          </button>
        </div>

        <div className="customers-table-container">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Phone</th>
                <th>Email</th>
                <th>Actions</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {customers.length === 0 ? (
                <tr>
                  <td
                    colSpan="5"
                    style={{
                      textAlign: "center",
                      padding: "30px",
                    }}
                  >
                    No customers found
                  </td>
                </tr>
              ) : (
                customers.map((customer) => (
                  <tr key={customer._id}>
                    <td>{customer.name}</td>

                    <td>{customer.phone || "No phone"}</td>

                    <td>{customer.email}</td>

                    <td>
                      <button
                        className="show-btn"
                        onClick={() => handleShowCustomer(customer)}
                      >
                        ◉ Show
                      </button>
                    </td>

                    <td>
                      <button
                        className="status-btn"
                        onClick={() => handleToggleStatus(customer)}
                      >
                        {getCustomerStatus(customer)}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showCustomerDetails && selectedCustomer && (
        <div
          className="customer-modal-overlay"
          onClick={handleCloseCustomer}
        >
          <div
            className="customer-details-modal"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="customer-modal-header">
              <h2>User Details</h2>

              <button
                className="customer-modal-close"
                onClick={handleCloseCustomer}
              >
                ✕
              </button>
            </div>

            <div className="customer-detail-row">
              <span>FULL NAME</span>
              <strong>{selectedCustomer.name || "N/A"}</strong>
            </div>

            <div className="customer-detail-row">
              <span>EMAIL ADDRESS</span>
              <strong>{selectedCustomer.email || "N/A"}</strong>
            </div>

            <div className="customer-detail-row">
              <span>PHONE NUMBER</span>
              <strong>{selectedCustomer.phone || "N/A"}</strong>
            </div>

            <div className="customer-detail-two-column">
              <div>
                <span>ACCOUNT STATUS</span>

                <div
                  className={
                    getCustomerStatus(selectedCustomer) === "Unblocked"
                      ? "customer-active-badge"
                      : "customer-blocked-badge"
                  }
                >
                  {getCustomerStatus(selectedCustomer)}
                </div>
              </div>

              <div>
                <span>ROLE</span>

                <div className="customer-role-badge">
                  {selectedCustomer.role || "user"}
                </div>
              </div>
            </div>

            <div className="customer-detail-row">
              <span>JOINED DATE</span>

              <strong>
                {formatJoinedDate(selectedCustomer.createdAt)}
              </strong>
            </div>

            <div className="customer-modal-footer">
              <button
                className="customer-modal-close-button"
                onClick={handleCloseCustomer}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Customers;
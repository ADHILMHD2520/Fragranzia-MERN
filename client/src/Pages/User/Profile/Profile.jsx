import React, { useEffect, useState } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import AdminService from "../../../services/AdminService";
import OrderService from "../../../services/OrderService";

import "./Profile.css";

const Profile = () => {

    // =====================================================
    // URL TAB
    // =====================================================

    const [searchParams, setSearchParams] = useSearchParams();

    const initialTab =
        searchParams.get("tab") === "orders"
            ? "orders"
            : "profile";

    const [activeTab, setActiveTab] = useState(initialTab);


    // =====================================================
    // PROFILE
    // =====================================================

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const [isEditingProfile, setIsEditingProfile] =
        useState(false);

    const [updating, setUpdating] =
        useState(false);


    const navigate = useNavigate();

    // =====================================================
    // ADDRESS
    // =====================================================

    const [showAddressForm, setShowAddressForm] =
        useState(false);

    const [isEditingAddress, setIsEditingAddress] =
        useState(false);

    const [addresses, setAddresses] =
        useState([]);

    const [addressLoading, setAddressLoading] =
        useState(true);

    const [addressSaving, setAddressSaving] =
        useState(false);

    const [selectedAddressId, setSelectedAddressId] =
        useState(null);


    const emptyAddress = {
        fullName: "",
        phone: "",
        address: "",
        city: "",
        state: "",
        landmark: "",
        pincode: "",
        alternativePhone: ""
    };


    const [addressForm, setAddressForm] =
        useState(emptyAddress);


    // =====================================================
    // ORDERS
    // =====================================================

    const [orders, setOrders] =
        useState([]);

    const [orderLoading, setOrderLoading] =
        useState(false);

    // Selected order for popup
    const [selectedOrder, setSelectedOrder] =
        useState(null);

    // Order action loading
    const [orderActionLoading, setOrderActionLoading] =
        useState(null);

    const [showReturnPopup, setShowReturnPopup] = useState(false);
    const [returnOrderId, setReturnOrderId] = useState(null);
    const [returnReason, setReturnReason] = useState("");


    // =====================================================
    // ADMIN SERVICE
    // =====================================================

    const {
        getCurrentUser,
        updateCurrentUser,
        getAddresses,
        addAddress,
        updateAddress,
        deleteAddress,
        setPrimaryAddress
    } = AdminService();


    // =====================================================
    // INITIAL LOAD
    // =====================================================

    useEffect(() => {

        fetchUser();
        fetchAddresses();

    }, []);


    // =====================================================
    // KEEP TAB IN SYNC WITH URL
    // =====================================================

    useEffect(() => {

        const urlTab =
            searchParams.get("tab");

        if (urlTab === "orders") {

            setActiveTab("orders");

        } else if (!urlTab) {

            setActiveTab("profile");

        }

    }, [searchParams]);


    // =====================================================
    // CHANGE TAB
    // =====================================================

    const handleTabChange = (tab) => {

        setActiveTab(tab);

        if (tab === "orders") {

            setSearchParams({
                tab: "orders"
            });

        } else {

            setSearchParams({});

        }

    };


    // =====================================================
    // FETCH USER
    // =====================================================

    const fetchUser = async () => {

        setLoading(true);

        try {

            const response =
                await getCurrentUser();

            setUser(response.user);

        } catch (error) {

            console.error(
                "Error fetching user:",
                error
            );

        } finally {

            setLoading(false);

        }

    };


    // =====================================================
    // FETCH ADDRESSES
    // =====================================================

    const fetchAddresses = async () => {

        setAddressLoading(true);

        try {

            const response =
                await getAddresses();

            setAddresses(
                response.addresses || []
            );

        } catch (error) {

            console.error(
                "Error fetching addresses:",
                error
            );

            setAddresses([]);

        } finally {

            setAddressLoading(false);

        }

    };


    // =====================================================
    // FETCH ORDERS
    // =====================================================

    const fetchOrders = async () => {

        setOrderLoading(true);

        try {

            const response =
                await OrderService.getMyOrders();

            console.log(
                "My Orders:",
                response.data
            );

            setOrders(
                response.data.orders || []
            );

        } catch (error) {

            console.error(
                "Error fetching orders:",
                error.response?.data?.message ||
                error.message
            );

            setOrders([]);

        } finally {

            setOrderLoading(false);

        }

    };


    // =====================================================
    // LOAD ORDERS WHEN ORDERS TAB IS OPENED
    // =====================================================

    useEffect(() => {

        if (activeTab === "orders") {

            fetchOrders();

        }

    }, [activeTab]);


    // =====================================================
    // DATE VALUE
    // =====================================================

    const getDateValue = () => {

        if (!user?.dateOfBirth) {

            return "";

        }

        return new Date(user.dateOfBirth)
            .toISOString()
            .split("T")[0];

    };


    // =====================================================
    // PROFILE CHANGE
    // =====================================================

    const handleProfileChange =
        (field, value) => {

            setUser(
                (previousUser) => ({
                    ...previousUser,
                    [field]: value
                })
            );

        };


    // =====================================================
    // PROFILE EDIT / UPDATE
    // =====================================================

    const handleProfileButton =
        async () => {

            if (!isEditingProfile) {

                setIsEditingProfile(true);

                return;

            }


            if (updating) {

                return;

            }


            try {

                setUpdating(true);


                const profileData = {

                    name: user.name,

                    email: user.email,

                    phone:
                        user.phone || "",

                    dateOfBirth:
                        user.dateOfBirth || "",

                    gender:
                        user.gender || ""

                };


                const response =
                    await updateCurrentUser(
                        profileData
                    );


                setUser(
                    response.user
                );


                setIsEditingProfile(
                    false
                );


                toast.success("Profile updated successfully");


            } catch (error) {

                console.error(
                    "Error updating profile:",
                    error
                );


                toast.error(
                    error.response?.data?.message ||
                    "Failed to update profile"
                );


            } finally {

                setUpdating(false);

            }

        };


    // =====================================================
    // ADDRESS CHANGE
    // =====================================================

    const handleAddressChange =
        (field, value) => {

            setAddressForm(
                (previousAddress) => ({
                    ...previousAddress,
                    [field]: value
                })
            );

        };


    // =====================================================
    // ADD ADDRESS
    // =====================================================

    const handleAddAddress = () => {

        setIsEditingAddress(false);

        setSelectedAddressId(null);

        setAddressForm(
            emptyAddress
        );

        setShowAddressForm(true);

    };


    // =====================================================
    // EDIT ADDRESS
    // =====================================================

    const handleEditAddress =
        (address) => {

            setIsEditingAddress(true);

            setSelectedAddressId(
                address._id
            );


            setAddressForm({

                fullName:
                    address.fullName || "",

                phone:
                    address.phone || "",

                address:
                    address.address || "",

                city:
                    address.city || "",

                state:
                    address.state || "",

                landmark:
                    address.landmark || "",

                pincode:
                    address.pincode || "",

                alternativePhone:
                    address.alternativePhone || ""

            });


            setShowAddressForm(true);

        };


    // =====================================================
    // CLOSE ADDRESS FORM
    // =====================================================

    const closeAddressForm = () => {

        setShowAddressForm(false);

        setIsEditingAddress(false);

        setSelectedAddressId(null);

        setAddressForm(
            emptyAddress
        );

    };


    // =====================================================
    // SAVE ADDRESS
    // =====================================================

    const handleSaveAddress =
        async () => {

            if (addressSaving) {

                return;

            }


            const requiredFields = [

                "fullName",
                "phone",
                "address",
                "city",
                "state",
                "pincode"

            ];


            const missingField =
                requiredFields.find(
                    (field) =>
                        !addressForm[field]
                            .trim()
                );


            if (missingField) {

                toast.info("Please fill all required address fields");

                return;

            }


            try {

                setAddressSaving(true);


                if (
                    isEditingAddress &&
                    selectedAddressId
                ) {

                    await updateAddress(
                        selectedAddressId,
                        addressForm
                    );


                    toast.success("Address updated successfully");

                } else {

                    await addAddress(
                        addressForm
                    );


                    toast.success("Address added successfully");

                }


                await fetchAddresses();

                closeAddressForm();


            } catch (error) {

                console.error(
                    "Error saving address:",
                    error
                );


                toast.error(
                    error.response?.data?.message ||
                    "Failed to save address"
                );


            } finally {

                setAddressSaving(false);

            }

        };


    // =====================================================
    // DELETE ADDRESS
    // =====================================================

    const handleDeleteAddress =
        async (addressId) => {

            const confirmed =
                window.confirm(
                    "Are you sure you want to delete this address?"
                );


            if (!confirmed) {

                return;

            }


            try {

                await deleteAddress(
                    addressId
                );


                await fetchAddresses();


                toast.success("Address deleted successfully");


            } catch (error) {

                console.error(
                    "Error deleting address:",
                    error
                );


                toast.error(
                    error.response?.data?.message ||
                    "Failed to delete address"
                );

            }

        };


    // =====================================================
    // SET PRIMARY ADDRESS
    // =====================================================

    const handleSetPrimary =
        async (addressId) => {

            try {

                const response =
                    await setPrimaryAddress(
                        addressId
                    );


                setAddresses(
                    response.addresses || []
                );


            } catch (error) {

                console.error(
                    "Error setting primary address:",
                    error
                );


                toast.error(
                    error.response?.data?.message ||
                    "Failed to set primary address"
                );

            }

        };


    // =====================================================
    // PRODUCT IMAGE
    // =====================================================

    const getProductImage =
        (product) => {

            if (
                !product ||
                !Array.isArray(product.images) ||
                !product.images.length ||
                !product.images[0]
            ) {

                return null;

            }

            const image = String(product.images[0]).trim();

            if (!image) {
                return null;
            }

            if (
                image.startsWith("http://") ||
                image.startsWith("https://")
            ) {

                return image;

            }

            if (image.startsWith("/uploads/")) {

                return `localhost:5000${image}`;

            }

            return `${image}`;

        };


    // =====================================================
    // ORDER STATUS CLASS
    // =====================================================

    const getStatusClass =
        (status) => {

            if (!status) {

                return "";

            }


            return status
                .toLowerCase()
                .replace(/\s+/g, "-");

        };


    // =====================================================
    // ORDER ACTION TYPE
    // =====================================================

    const getOrderAction =
        (status) => {

            if (
                status === "Pending" ||
                status === "Processing" ||
                status === "Shipped"
            ) {

                return "cancel";

            }

            if (
                status === "Out for Delivery" ||
                status === "Delivered"
            ) {

                return "return";

            }

            return null;

        };


    // =====================================================
    // OPEN ORDER DETAILS
    // =====================================================

    const handleOrderClick =
        (order) => {

            setSelectedOrder(order);

        };


    // =====================================================
    // CLOSE ORDER DETAILS
    // =====================================================

    const closeOrderDetails = () => {

        setSelectedOrder(null);

    };


    // =====================================================
    // CANCEL ORDER
    // =====================================================

    const handleCancelOrder =
        async (event, orderId) => {

            event.stopPropagation();

            const confirmed =
                window.confirm(
                    "Are you sure you want to cancel this order?"
                );


            if (!confirmed) {

                return;

            }


            try {

                setOrderActionLoading(orderId);


                const response =
                    await OrderService.cancelOrder(
                        orderId
                    );


                const updatedOrder =
                    response.data.order;


                setOrders(
                    (previousOrders) =>
                        previousOrders.map(
                            (order) =>
                                order._id === orderId
                                    ? updatedOrder
                                    : order
                        )
                );


                if (
                    selectedOrder?._id === orderId
                ) {

                    setSelectedOrder(
                        updatedOrder
                    );

                }


                toast.success("Order cancelled successfully");


            } catch (error) {

                console.error(
                    "Cancel order error:",
                    error
                );


                toast.error(
                    error.response?.data?.message ||
                    "Failed to cancel order"
                );


            } finally {

                setOrderActionLoading(null);

            }

        };


    // =====================================================
    // RETURN ORDER
    // =====================================================

    const handleReturnOrder = (event, orderId) => {
        event.stopPropagation();

        setReturnOrderId(orderId);
        setReturnReason("");
        setShowReturnPopup(true);
    };

    const submitReturnRequest = async () => {
        if (!returnReason) {
            return;
        }

        try {
            setOrderActionLoading(returnOrderId);

            const response = await OrderService.requestReturn(
                returnOrderId,
                returnReason
            );

            const updatedOrder = response.data.order;

            setOrders((previousOrders) =>
                previousOrders.map((order) =>
                    order._id === returnOrderId
                        ? updatedOrder
                        : order
                )
            );

            if (selectedOrder?._id === returnOrderId) {
                setSelectedOrder(updatedOrder);
            }

            setShowReturnPopup(false);
            setReturnOrderId(null);
            setReturnReason("");

        } catch (error) {
            console.error(
                "Return order error:",
                error
            );

            toast.error(
                error.response?.data?.message ||
                "Failed to request return"
            );

        } finally {
            setOrderActionLoading(null);
        }
    };


    // =====================================================
    // ORDER DETAILS ITEM PRICE
    // =====================================================

    const getItemPrice =
        (item) => {

            return Number(
                item?.product?.salePrice ??
                item?.product?.price ??
                0
            );

        };


    // =====================================================
    // PROFILE LOADING
    // =====================================================

    if (loading) {

        return (

            <div
                style={{
                    padding: "100px",
                    textAlign: "center"
                }}
            >

                <h2>
                    Loading profile...
                </h2>

            </div>

        );

    }


    // =====================================================
    // LOGOUT
    // =====================================================

    const handleLogout = () => {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("role");

        toast.success("Logged out successfully");

        navigate("/signin");
    };


    // =====================================================
    // MAIN
    // =====================================================

    return (

        <div>


            <div className="profile-container">


                {/* =================================================
                    HEADER
                ================================================= */}

                <div className="profile-header">

                    <h1>
                        Profile
                    </h1>


                    <span>

                        <Link to="/">
                            Home
                        </Link>

                        {" > "}

                        <Link to="/profile">
                            Profile
                        </Link>

                    </span>

                </div>



                {/* =================================================
                    TABS
                ================================================= */}

                <div className="tabs">


                    <div
                        className={`tab-group ${activeTab === "profile"
                            ? "active"
                            : ""
                            }`}
                        onClick={() =>
                            handleTabChange(
                                "profile"
                            )
                        }
                    >

                        Profile

                    </div>



                    <div
                        className={`tab-group ${activeTab === "address"
                            ? "active"
                            : ""
                            }`}
                        onClick={() =>
                            handleTabChange(
                                "address"
                            )
                        }
                    >

                        Address

                    </div>



                    <div
                        className={`tab-group ${activeTab === "orders"
                            ? "active"
                            : ""
                            }`}
                        onClick={() =>
                            handleTabChange(
                                "orders"
                            )
                        }
                    >

                        My Orders

                    </div>


                </div>



                {/* =================================================
                    PROFILE TAB
                ================================================= */}

                {activeTab === "profile" && (

                    <div className="profile-info">


                        {user ? (

                            <>


                                {/* FULL NAME */}

                                <div className="profile-field">

                                    <label>
                                        Full Name
                                    </label>


                                    <input
                                        type="text"
                                        value={
                                            user.name ||
                                            ""
                                        }
                                        onChange={(event) =>
                                            handleProfileChange(
                                                "name",
                                                event.target.value
                                            )
                                        }
                                        disabled={
                                            !isEditingProfile
                                        }
                                    />

                                </div>



                                {/* EMAIL */}

                                <div className="profile-field">

                                    <label>
                                        Email
                                    </label>


                                    <input
                                        type="email"
                                        value={
                                            user.email ||
                                            ""
                                        }
                                        onChange={(event) =>
                                            handleProfileChange(
                                                "email",
                                                event.target.value
                                            )
                                        }
                                        disabled={
                                            !isEditingProfile
                                        }
                                    />

                                </div>



                                {/* PHONE */}

                                <div className="profile-field">

                                    <label>
                                        Phone Number
                                    </label>


                                    <input
                                        type="text"
                                        value={
                                            user.phone ||
                                            ""
                                        }
                                        placeholder="Not provided"
                                        onChange={(event) =>
                                            handleProfileChange(
                                                "phone",
                                                event.target.value
                                            )
                                        }
                                        disabled={
                                            !isEditingProfile
                                        }
                                    />

                                </div>



                                {/* DATE OF BIRTH */}

                                <div className="profile-field">

                                    <label>
                                        Date of Birth
                                    </label>


                                    <input
                                        type="date"
                                        value={
                                            getDateValue()
                                        }
                                        onChange={(event) =>
                                            handleProfileChange(
                                                "dateOfBirth",
                                                event.target.value
                                            )
                                        }
                                        disabled={
                                            !isEditingProfile
                                        }
                                    />

                                </div>



                                {/* GENDER */}

                                <div className="profile-field">

                                    <label>
                                        Gender
                                    </label>


                                    <select
                                        value={
                                            user.gender ||
                                            ""
                                        }
                                        onChange={(event) =>
                                            handleProfileChange(
                                                "gender",
                                                event.target.value
                                            )
                                        }
                                        disabled={
                                            !isEditingProfile
                                        }
                                    >

                                        <option value="">
                                            Select Gender
                                        </option>

                                        <option value="Male">
                                            Male
                                        </option>

                                        <option value="Female">
                                            Female
                                        </option>

                                        <option value="Other">
                                            Other
                                        </option>

                                    </select>

                                </div>



                                {/* EDIT / UPDATE */}
                                <div className="profile-actions">

                                    <button
                                        type="button"
                                        className="logout-btn"
                                        onClick={handleLogout}
                                    >
                                        Logout
                                    </button>

                                    <button
                                        type="button"
                                        className="profile-edit-btn"
                                        onClick={handleProfileButton}
                                        disabled={updating}
                                    >
                                        {updating
                                            ? "Updating..."
                                            : isEditingProfile
                                                ? "Update"
                                                : "Edit"
                                        }
                                    </button>

                                </div>


                            </>

                        ) : (

                            <p>
                                Unable to load profile.
                            </p>

                        )}


                    </div>

                )}



                {/* =================================================
                    ADDRESS TAB
                ================================================= */}

                {activeTab === "address" && (

                    <div className="address-content">


                        <div className="address-header">

                            <h2>
                                Address
                            </h2>


                            <button
                                className="add-address-btn"
                                onClick={
                                    handleAddAddress
                                }
                            >
                                Add Address
                            </button>

                        </div>



                        {addressLoading ? (

                            <p>
                                Loading addresses...
                            </p>

                        ) : addresses.length === 0 ? (

                            <p>
                                No addresses added yet.
                            </p>

                        ) : (

                            <div className="addresses-list">

                                {addresses.map(
                                    (address, index) => (

                                        <div
                                            className={`address-card ${address.isPrimary
                                                ? "primary-address"
                                                : ""
                                                }`}
                                            key={
                                                address._id
                                            }
                                        >

                                            <div className="address-card-header">

                                                <strong>
                                                    Address{" "}
                                                    {index + 1}
                                                </strong>


                                                <div className="address-card-actions">

                                                    {address.isPrimary && (

                                                        <span className="primary-badge">
                                                            Primary
                                                        </span>

                                                    )}


                                                    <button
                                                        className="edit-address-btn"
                                                        onClick={() =>
                                                            handleEditAddress(
                                                                address
                                                            )
                                                        }
                                                    >
                                                        Edit
                                                    </button>


                                                    <button
                                                        className="delete-address-btn"
                                                        onClick={() =>
                                                            handleDeleteAddress(
                                                                address._id
                                                            )
                                                        }
                                                    >
                                                        Delete
                                                    </button>

                                                </div>

                                            </div>


                                            <h4>
                                                {
                                                    address.fullName
                                                }
                                            </h4>


                                            <p>
                                                {
                                                    address.address
                                                }
                                            </p>


                                            <p>

                                                {
                                                    address.city
                                                }

                                                ,{" "}

                                                {
                                                    address.state
                                                }

                                                {" - "}

                                                {
                                                    address.pincode
                                                }

                                            </p>


                                            {address.landmark && (

                                                <p>

                                                    Landmark:{" "}

                                                    {
                                                        address.landmark
                                                    }

                                                </p>

                                            )}


                                            <p>
                                                {
                                                    address.phone
                                                }
                                            </p>


                                            {address.alternativePhone && (

                                                <p>

                                                    Alternative:{" "}

                                                    {
                                                        address.alternativePhone
                                                    }

                                                </p>

                                            )}


                                            {!address.isPrimary && (

                                                <button
                                                    className="primary-address-btn"
                                                    onClick={() =>
                                                        handleSetPrimary(
                                                            address._id
                                                        )
                                                    }
                                                >
                                                    Set as Primary
                                                </button>

                                            )}

                                        </div>

                                    )
                                )}

                            </div>

                        )}



                        {/* =================================================
                            ADDRESS MODAL
                        ================================================= */}

                        {showAddressForm && (

                            <div className="address-modal-overlay">

                                <div className="address-form">


                                    <h3>

                                        {isEditingAddress
                                            ? "Edit Address"
                                            : "Add Address"}

                                    </h3>


                                    <div className="address-form-row">


                                        <div className="address-form-field">

                                            <label>
                                                Full Name
                                            </label>


                                            <input
                                                type="text"
                                                placeholder="Enter full name"
                                                value={
                                                    addressForm.fullName
                                                }
                                                onChange={(event) =>
                                                    handleAddressChange(
                                                        "fullName",
                                                        event.target.value
                                                    )
                                                }
                                            />

                                        </div>



                                        <div className="address-form-field">

                                            <label>
                                                Phone Number
                                            </label>


                                            <input
                                                type="text"
                                                placeholder="Enter phone number"
                                                value={
                                                    addressForm.phone
                                                }
                                                onChange={(event) =>
                                                    handleAddressChange(
                                                        "phone",
                                                        event.target.value
                                                    )
                                                }
                                            />

                                        </div>

                                    </div>



                                    <div className="address-form-field">

                                        <label>
                                            Address
                                        </label>


                                        <textarea
                                            placeholder="Enter address"
                                            value={
                                                addressForm.address
                                            }
                                            onChange={(event) =>
                                                handleAddressChange(
                                                    "address",
                                                    event.target.value
                                                )
                                            }
                                        />

                                    </div>



                                    <div className="address-form-row">


                                        <div className="address-form-field">

                                            <label>
                                                City/District
                                            </label>


                                            <input
                                                type="text"
                                                placeholder="Enter city/district"
                                                value={
                                                    addressForm.city
                                                }
                                                onChange={(event) =>
                                                    handleAddressChange(
                                                        "city",
                                                        event.target.value
                                                    )
                                                }
                                            />

                                        </div>



                                        <div className="address-form-field">

                                            <label>
                                                State
                                            </label>


                                            <input
                                                type="text"
                                                placeholder="Enter state"
                                                value={
                                                    addressForm.state
                                                }
                                                onChange={(event) =>
                                                    handleAddressChange(
                                                        "state",
                                                        event.target.value
                                                    )
                                                }
                                            />

                                        </div>



                                        <div className="address-form-field">

                                            <label>
                                                Landmark
                                            </label>


                                            <input
                                                type="text"
                                                placeholder="Enter landmark"
                                                value={
                                                    addressForm.landmark
                                                }
                                                onChange={(event) =>
                                                    handleAddressChange(
                                                        "landmark",
                                                        event.target.value
                                                    )
                                                }
                                            />

                                        </div>

                                    </div>



                                    <div className="address-form-row">


                                        <div className="address-form-field">

                                            <label>
                                                Pincode
                                            </label>


                                            <input
                                                type="text"
                                                placeholder="Enter pincode"
                                                value={
                                                    addressForm.pincode
                                                }
                                                onChange={(event) =>
                                                    handleAddressChange(
                                                        "pincode",
                                                        event.target.value
                                                    )
                                                }
                                            />

                                        </div>



                                        <div className="address-form-field">

                                            <label>
                                                Alternative Phone Number
                                                (Optional)
                                            </label>


                                            <input
                                                type="text"
                                                placeholder="Enter alternative phone"
                                                value={
                                                    addressForm.alternativePhone
                                                }
                                                onChange={(event) =>
                                                    handleAddressChange(
                                                        "alternativePhone",
                                                        event.target.value
                                                    )
                                                }
                                            />

                                        </div>

                                    </div>



                                    <div className="address-form-actions">


                                        <button
                                            className="cancel-address-btn"
                                            onClick={
                                                closeAddressForm
                                            }
                                            disabled={
                                                addressSaving
                                            }
                                        >
                                            Cancel
                                        </button>


                                        <button
                                            className="save-address-btn"
                                            onClick={
                                                handleSaveAddress
                                            }
                                            disabled={
                                                addressSaving
                                            }
                                        >

                                            {addressSaving

                                                ? "Saving..."

                                                : isEditingAddress

                                                    ? "Update"

                                                    : "Save"

                                            }

                                        </button>

                                    </div>

                                </div>

                            </div>

                        )}

                    </div>

                )}



                {/* =================================================
                    ORDERS TAB
                ================================================= */}

                {activeTab === "orders" && (

                    <div className="orders-content">


                        <div className="orders-header">

                            <h2>
                                My Orders
                            </h2>

                        </div>



                        {orderLoading ? (

                            <p>
                                Loading orders...
                            </p>

                        ) : orders.length === 0 ? (

                            <p>
                                No orders found.
                            </p>

                        ) : (

                            <div className="orders-list">

                                {orders.map(
                                    (order) => (

                                        <div
                                            className="order-product-card"
                                            key={order._id}
                                            onClick={() =>
                                                handleOrderClick(
                                                    order
                                                )
                                            }
                                        >

                                            {/* ==========================
                                                ORDER HEADER
                                            ========================== */}

                                            <div className="order-card-top">

                                                <strong>

                                                    Order ID: #

                                                    {order._id
                                                        ?.slice(-8)
                                                        .toUpperCase()}

                                                </strong>


                                                <span
                                                    className={`order-status ${getStatusClass(
                                                        order.deliveryStatus ||
                                                        "Pending"
                                                    )}`}
                                                >

                                                    {
                                                        order.deliveryStatus ||
                                                        "Pending"
                                                    }

                                                </span>

                                            </div>


                                            {/* ==========================
                                                ORDER PRODUCTS
                                            ========================== */}

                                            <div className="order-products-preview">

                                                {order.orderItems?.map(
                                                    (
                                                        item,
                                                        index
                                                    ) => {

                                                        const product =
                                                            item.product;

                                                        if (!product) {

                                                            return null;

                                                        }


                                                        const productImage =
                                                            getProductImage(
                                                                product
                                                            );


                                                        const price =
                                                            Number(
                                                                product.salePrice ||
                                                                product.price ||
                                                                0
                                                            );


                                                        return (

                                                            <div
                                                                className="order-product-section"
                                                                key={
                                                                    item._id ||
                                                                    index
                                                                }
                                                            >

                                                                {/* IMAGE */}

                                                                <div className="order-product-image">

                                                                    {productImage ? (

                                                                        <>
                                                                            <img
                                                                                src={productImage}
                                                                                alt={
                                                                                    product.name ||
                                                                                    "Product"
                                                                                }
                                                                                onError={(event) => {
                                                                                    event.currentTarget.style.display =
                                                                                        "none";

                                                                                    const fallback =
                                                                                        event.currentTarget
                                                                                            .nextElementSibling;

                                                                                    if (fallback) {
                                                                                        fallback.style.display =
                                                                                            "flex";
                                                                                    }
                                                                                }}
                                                                            />

                                                                            <div
                                                                                className="no-product-image"
                                                                                style={{
                                                                                    display: "none"
                                                                                }}
                                                                            >
                                                                                No Image
                                                                            </div>
                                                                        </>

                                                                    ) : (

                                                                        <div className="no-product-image">
                                                                            No Image
                                                                        </div>

                                                                    )}

                                                                </div>


                                                                {/* DETAILS */}

                                                                <div className="order-product-info">

                                                                    <h3>
                                                                        {
                                                                            product.name
                                                                        }
                                                                    </h3>


                                                                    <p className="order-quantity">

                                                                        Qty:{" "}
                                                                        {
                                                                            item.quantity
                                                                        }

                                                                    </p>


                                                                    <h2>

                                                                        ₹
                                                                        {price.toLocaleString(
                                                                            "en-IN"
                                                                        )}

                                                                    </h2>

                                                                </div>

                                                            </div>

                                                        );

                                                    }
                                                )}

                                            </div>


                                            {/* ==========================
                                                ORDER TOTAL
                                            ========================== */}

                                            <div className="order-card-bottom">

                                                <div>

                                                    <span>
                                                        Order Total
                                                    </span>

                                                    <strong>

                                                        ₹
                                                        {Number(
                                                            order.totalPrice ||
                                                            0
                                                        ).toLocaleString(
                                                            "en-IN"
                                                        )}

                                                    </strong>

                                                </div>


                                                {/* ==========================
                                                    ACTION BUTTON
                                                ========================== */}

                                                <div
                                                    className="order-action-area"
                                                    onClick={(event) =>
                                                        event.stopPropagation()
                                                    }
                                                >

                                                    {getOrderAction(
                                                        order.deliveryStatus
                                                    ) === "cancel" && (

                                                            <button
                                                                className="order-cancel-btn"
                                                                onClick={(event) =>
                                                                    handleCancelOrder(
                                                                        event,
                                                                        order._id
                                                                    )
                                                                }
                                                                disabled={
                                                                    orderActionLoading ===
                                                                    order._id
                                                                }
                                                            >

                                                                {orderActionLoading ===
                                                                    order._id
                                                                    ? "Cancelling..."
                                                                    : "Cancel Order"}

                                                            </button>

                                                        )}


                                                    {getOrderAction(
                                                        order.deliveryStatus
                                                    ) === "return" && (

                                                            <button
                                                                className="order-return-btn"
                                                                onClick={(event) =>
                                                                    handleReturnOrder(
                                                                        event,
                                                                        order._id
                                                                    )
                                                                }
                                                                disabled={
                                                                    orderActionLoading ===
                                                                    order._id ||
                                                                    order.isReturned
                                                                }
                                                            >

                                                                {order.isReturned
                                                                    ? "Return Requested"
                                                                    : orderActionLoading ===
                                                                        order._id
                                                                        ? "Requesting..."
                                                                        : "Return Order"}

                                                            </button>

                                                        )}

                                                </div>

                                            </div>


                                            {/* CLICK HINT */}

                                            <div className="order-view-hint">

                                                Click order to view details

                                            </div>

                                        </div>

                                    )
                                )}

                            </div>

                        )}

                    </div>

                )}



                {/* =====================================================
                    ORDER DETAILS POPUP
                ===================================================== */}

                {selectedOrder && (

                    <div
                        className="order-details-overlay"
                        onClick={closeOrderDetails}
                    >

                        <div
                            className="order-details-popup"
                            onClick={(event) =>
                                event.stopPropagation()
                            }
                        >

                            {/* ==========================
                                POPUP HEADER
                            ========================== */}

                            <div className="order-details-header">

                                <div>

                                    <h2>
                                        Order Details
                                    </h2>

                                    <p>

                                        Order ID: #

                                        {selectedOrder._id
                                            ?.slice(-8)
                                            .toUpperCase()}

                                    </p>

                                </div>


                                <button
                                    className="order-details-close"
                                    onClick={
                                        closeOrderDetails
                                    }
                                >
                                    ✕
                                </button>

                            </div>


                            {/* ==========================
                                ORDER STATUS
                            ========================== */}

                            <div className="order-details-status-row">

                                <span>
                                    Order Status
                                </span>

                                <span
                                    className={`order-status ${getStatusClass(
                                        selectedOrder.deliveryStatus ||
                                        "Pending"
                                    )}`}
                                >
                                    {
                                        selectedOrder.deliveryStatus ||
                                        "Pending"
                                    }
                                </span>

                            </div>


                            {/* ==========================
                                ORDER INFORMATION
                            ========================== */}

                            <div className="order-details-info">

                                <div>

                                    <span>
                                        Order Date
                                    </span>

                                    <strong>
                                        {selectedOrder.createdAt
                                            ? new Date(
                                                selectedOrder.createdAt
                                            ).toLocaleString(
                                                "en-IN",
                                                {
                                                    day: "2-digit",
                                                    month: "short",
                                                    year: "numeric",
                                                    hour: "2-digit",
                                                    minute: "2-digit"
                                                }
                                            )
                                            : "-"
                                        }
                                    </strong>

                                </div>


                                <div>

                                    <span>
                                        Payment Method
                                    </span>

                                    <strong>
                                        {
                                            selectedOrder.paymentMethod ||
                                            "-"
                                        }
                                    </strong>

                                </div>


                                <div>

                                    <span>
                                        Payment Status
                                    </span>

                                    <strong>
                                        {
                                            selectedOrder.paymentStatus ||
                                            "Pending"
                                        }
                                    </strong>

                                </div>

                            </div>


                            {/* ==========================
                                SHIPPING ADDRESS
                            ========================== */}

                            <div className="order-details-section">

                                <h3>
                                    Shipping Address
                                </h3>


                                {selectedOrder.shippingAddress ? (

                                    <div className="order-shipping-address">

                                        <strong>
                                            {
                                                selectedOrder.shippingAddress.fullName ||
                                                selectedOrder.shippingAddress.name ||
                                                "Customer"
                                            }
                                        </strong>

                                        <p>
                                            {
                                                selectedOrder.shippingAddress.address ||
                                                selectedOrder.shippingAddress.addressLine ||
                                                ""
                                            }
                                        </p>

                                        <p>

                                            {
                                                selectedOrder.shippingAddress.city ||
                                                ""
                                            }

                                            {selectedOrder.shippingAddress.state
                                                ? `, ${selectedOrder.shippingAddress.state}`
                                                : ""
                                            }

                                            {" - "}

                                            {
                                                selectedOrder.shippingAddress.pincode ||
                                                selectedOrder.shippingAddress.zipCode ||
                                                ""
                                            }

                                        </p>

                                        <p>
                                            Phone:{" "}
                                            {
                                                selectedOrder.shippingAddress.phone ||
                                                selectedOrder.shippingAddress.contact ||
                                                user?.phone ||
                                                "-"
                                            }
                                        </p>

                                    </div>

                                ) : (

                                    <p>
                                        Shipping address unavailable
                                    </p>

                                )}

                            </div>


                            {/* ==========================
                                PRODUCTS
                            ========================== */}

                            <div className="order-details-section">

                                <h3>
                                    Items Ordered
                                </h3>


                                <div className="order-details-items">

                                    {selectedOrder.orderItems?.map(
                                        (item, index) => {

                                            const product =
                                                item.product;

                                            if (!product) {

                                                return null;

                                            }


                                            const image =
                                                getProductImage(
                                                    product
                                                );


                                            const price =
                                                getItemPrice(
                                                    item
                                                );


                                            const itemTotal =
                                                price *
                                                (
                                                    item.quantity ||
                                                    0
                                                );


                                            return (

                                                <div
                                                    className="order-details-item"
                                                    key={
                                                        item._id ||
                                                        index
                                                    }
                                                >

                                                    <div className="order-details-item-image">

                                                        {image ? (

                                                            <>
                                                                <img
                                                                    src={image}
                                                                    alt={
                                                                        product.name ||
                                                                        "Product"
                                                                    }
                                                                    onError={(event) => {
                                                                        event.currentTarget.style.display =
                                                                            "none";

                                                                        const fallback =
                                                                            event.currentTarget
                                                                                .nextElementSibling;

                                                                        if (fallback) {
                                                                            fallback.style.display =
                                                                                "flex";
                                                                        }
                                                                    }}
                                                                />

                                                                <div
                                                                    className="no-product-image"
                                                                    style={{
                                                                        display: "none"
                                                                    }}
                                                                >
                                                                    No Image
                                                                </div>
                                                            </>

                                                        ) : (

                                                            <div className="no-product-image">
                                                                No Image
                                                            </div>

                                                        )}

                                                    </div>


                                                    <div className="order-details-item-info">

                                                        <h4>
                                                            {
                                                                product.name
                                                            }
                                                        </h4>

                                                        <p>
                                                            Quantity:{" "}
                                                            {
                                                                item.quantity
                                                            }
                                                        </p>

                                                        <p>
                                                            Price: ₹
                                                            {price.toLocaleString(
                                                                "en-IN"
                                                            )}
                                                        </p>

                                                    </div>


                                                    <strong className="order-details-item-total">

                                                        ₹
                                                        {itemTotal.toLocaleString(
                                                            "en-IN"
                                                        )}

                                                    </strong>

                                                </div>

                                            );

                                        }
                                    )}

                                </div>

                            </div>


                            {/* ==========================
                                TOTAL
                            ========================== */}

                            <div className="order-details-total">

                                <span>
                                    Grand Total
                                </span>

                                <strong>

                                    ₹
                                    {Number(
                                        selectedOrder.totalPrice ||
                                        0
                                    ).toLocaleString(
                                        "en-IN"
                                    )}

                                </strong>

                            </div>


                            {/* ==========================
                                ACTION BUTTON
                            ========================== */}

                            <div className="order-details-actions">

                                {getOrderAction(
                                    selectedOrder.deliveryStatus
                                ) === "cancel" && (

                                        <button
                                            className="order-cancel-btn"
                                            onClick={(event) =>
                                                handleCancelOrder(
                                                    event,
                                                    selectedOrder._id
                                                )
                                            }
                                            disabled={
                                                orderActionLoading ===
                                                selectedOrder._id
                                            }
                                        >

                                            {orderActionLoading ===
                                                selectedOrder._id
                                                ? "Cancelling..."
                                                : "Cancel Order"}

                                        </button>

                                    )}


                                {getOrderAction(
                                    selectedOrder.deliveryStatus
                                ) === "return" && (

                                        <button
                                            className="order-return-btn"
                                            onClick={(event) =>
                                                handleReturnOrder(
                                                    event,
                                                    selectedOrder._id
                                                )
                                            }
                                            disabled={
                                                orderActionLoading ===
                                                selectedOrder._id ||
                                                selectedOrder.isReturned
                                            }
                                        >

                                            {selectedOrder.isReturned
                                                ? "Return Requested"
                                                : orderActionLoading ===
                                                    selectedOrder._id
                                                    ? "Requesting..."
                                                    : "Return Order"}

                                        </button>

                                    )}


                                <button
                                    className="order-details-close-bottom"
                                    onClick={
                                        closeOrderDetails
                                    }
                                >
                                    Close
                                </button>

                            </div>

                        </div>

                    </div>

                )}

            </div>
            {/* =====================================================
    RETURN ORDER POPUP
===================================================== */}

            {showReturnPopup && (

                <div
                    className="return-popup-overlay"
                    onClick={() => {
                        if (!orderActionLoading) {
                            setShowReturnPopup(false);
                            setReturnOrderId(null);
                            setReturnReason("");
                        }
                    }}
                >

                    <div
                        className="return-popup"
                        onClick={(event) =>
                            event.stopPropagation()
                        }
                    >

                        {/* HEADER */}

                        <div className="return-popup-header">

                            <h2>
                                Return Order
                            </h2>

                            <button
                                type="button"
                                className="return-popup-close"
                                onClick={() => {
                                    if (!orderActionLoading) {
                                        setShowReturnPopup(false);
                                        setReturnOrderId(null);
                                        setReturnReason("");
                                    }
                                }}
                                disabled={!!orderActionLoading}
                            >
                                ✕
                            </button>

                        </div>


                        {/* CONTENT */}

                        <div className="return-popup-content">

                            <p className="return-popup-message">
                                Please select a reason for returning this order.
                            </p>


                            <div className="return-reason-field">

                                <label htmlFor="returnReason">
                                    Return Reason
                                </label>

                                <select
                                    id="returnReason"
                                    value={returnReason}
                                    onChange={(event) =>
                                        setReturnReason(
                                            event.target.value
                                        )
                                    }
                                    disabled={!!orderActionLoading}
                                >

                                    <option value="">
                                        Select a reason
                                    </option>

                                    <option value="Damaged Product">
                                        Damaged Product
                                    </option>

                                    <option value="Wrong Item Received">
                                        Wrong Item Received
                                    </option>

                                    <option value="Defective Product">
                                        Defective Product
                                    </option>

                                    <option value="Item Not as Described">
                                        Item Not as Described
                                    </option>

                                    <option value="Size/Color Mismatch">
                                        Size/Color Mismatch
                                    </option>

                                    <option value="Other">
                                        Other
                                    </option>

                                </select>

                            </div>

                        </div>


                        {/* ACTIONS */}

                        <div className="return-popup-actions">

                            <button
                                type="button"
                                className="return-popup-cancel"
                                onClick={() => {
                                    setShowReturnPopup(false);
                                    setReturnOrderId(null);
                                    setReturnReason("");
                                }}
                                disabled={!!orderActionLoading}
                            >
                                Cancel
                            </button>


                            <button
                                type="button"
                                className="return-popup-submit"
                                onClick={submitReturnRequest}
                                disabled={
                                    !returnReason ||
                                    !!orderActionLoading
                                }
                            >
                                {orderActionLoading === returnOrderId
                                    ? "Submitting..."
                                    : "Submit Return"}
                            </button>

                        </div>

                    </div>

                </div>

            )}

        </div>

    );

};

export default Profile;
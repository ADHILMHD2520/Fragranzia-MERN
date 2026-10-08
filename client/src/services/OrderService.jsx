import axios from "axios";

const API_URL =
    "http://localhost:5000/api/orders";


// =====================================================
// CREATE ORDER
// =====================================================

const createOrder = (orderData) => {

    const token =
        localStorage.getItem(
            "accessToken"
        );


    return axios.post(

        `${API_URL}/create`,

        orderData,

        {
            headers: {
                Authorization:
                    `Bearer ${token}`,
            },
        }

    );

};



// =====================================================
// GET MY ORDERS
// =====================================================

const getMyOrders = () => {

    const token =
        localStorage.getItem(
            "accessToken"
        );


    return axios.get(

        `${API_URL}/my-orders`,

        {
            headers: {
                Authorization:
                    `Bearer ${token}`,
            },
        }

    );

};



// =====================================================
// GET SINGLE ORDER
// =====================================================

const getOrderById = (id) => {

    const token =
        localStorage.getItem(
            "accessToken"
        );


    return axios.get(

        `${API_URL}/${id}`,

        {
            headers: {
                Authorization:
                    `Bearer ${token}`,
            },
        }

    );

};



// =====================================================
// ADMIN - GET ALL ORDERS
// =====================================================

const getAllOrders = () => {

    const token =
        localStorage.getItem(
            "accessToken"
        );


    return axios.get(

        `${API_URL}/admin/all`,

        {
            headers: {
                Authorization:
                    `Bearer ${token}`,
            },
        }

    );

};



// =====================================================
// ADMIN - UPDATE DELIVERY STATUS
// =====================================================

const updateDeliveryStatus =
    (id, deliveryStatus) => {

        const token =
            localStorage.getItem(
                "accessToken"
            );


        return axios.put(

            `${API_URL}/admin/delivery/${id}`,

            {
                deliveryStatus
            },

            {
                headers: {
                    Authorization:
                        `Bearer ${token}`,
                },
            }

        );

    };



// =====================================================
// ADMIN - UPDATE PAYMENT STATUS
// =====================================================

const updatePaymentStatus =
    (id, paymentStatus) => {

        const token =
            localStorage.getItem(
                "accessToken"
            );


        return axios.put(

            `${API_URL}/admin/payment/${id}`,

            {
                paymentStatus
            },

            {
                headers: {
                    Authorization:
                        `Bearer ${token}`,
                },
            }

        );

    };



// =====================================================
// CANCEL ORDER
// =====================================================

const cancelOrder = (id) => {

    const token =
        localStorage.getItem(
            "accessToken"
        );


    return axios.put(

        `${API_URL}/cancel/${id}`,

        {},

        {
            headers: {
                Authorization:
                    `Bearer ${token}`,
            },
        }

    );

};



// =====================================================
// REQUEST RETURN
// =====================================================

const requestReturn =
    (id, returnReason) => {

        const token =
            localStorage.getItem(
                "accessToken"
            );


        return axios.post(

            `${API_URL}/return/${id}`,

            {
                returnReason
            },

            {
                headers: {
                    Authorization:
                        `Bearer ${token}`,
                },
            }

        );

    };



// =====================================================
// ADMIN - UPDATE RETURN STATUS
// =====================================================

const updateReturnStatus =
    (id, returnStatus) => {

        const token =
            localStorage.getItem(
                "accessToken"
            );


        return axios.put(

            `${API_URL}/admin/return/${id}`,

            {
                returnStatus
            },

            {
                headers: {
                    Authorization:
                        `Bearer ${token}`,
                },
            }

        );

    };



// =====================================================
// EXPORT
// =====================================================

const OrderService = {

    createOrder,

    getMyOrders,

    getOrderById,

    getAllOrders,

    updateDeliveryStatus,

    updatePaymentStatus,

    cancelOrder,

    requestReturn,

    updateReturnStatus,

};


export default OrderService;
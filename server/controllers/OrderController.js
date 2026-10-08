const { Order } = require("../models/Order");
const Product = require("../models/Product");
const { Address } = require("../models/Address");

const razorpay = require("../utils/razorpay");
const crypto = require("crypto");


// =====================================================
// CREATE ORDER
// =====================================================

const createOrder = async (req, res) => {

    const reservedItems = [];

    try {

        const {
            orderItems,
            shippingAddress,
            paymentMethod = "UPI",
            totalPrice,
            currency = "INR",
        } = req.body;


        // =================================================
        // VALIDATE PAYMENT METHOD
        // =================================================

        if (!["COD", "UPI"].includes(paymentMethod)) {

            return res.status(400).json({
                message:
                    "Invalid payment method. Use COD or UPI.",
            });

        }


        // =================================================
        // VALIDATE ORDER ITEMS
        // =================================================

        if (
            !orderItems ||
            !Array.isArray(orderItems) ||
            orderItems.length === 0
        ) {

            return res.status(400).json({
                message:
                    "Order items are required",
            });

        }


        // =================================================
        // VALIDATE ADDRESS
        // =================================================

        if (!shippingAddress) {

            return res.status(400).json({
                message:
                    "Shipping address is required",
            });

        }


        const address =
            await Address.findOne({
                _id: shippingAddress,
                user: req.user.id,
            });


        if (!address) {

            return res.status(400).json({
                message:
                    "Invalid shipping address",
            });

        }


        // =================================================
        // VALIDATE TOTAL
        // =================================================

        if (
            totalPrice === undefined ||
            Number(totalPrice) <= 0
        ) {

            return res.status(400).json({
                message:
                    "Invalid order total",
            });

        }


        // =================================================
        // CHECK PRODUCTS AND STOCK
        // =================================================

        for (const item of orderItems) {

            if (
                !item.product ||
                !item.quantity ||
                item.quantity <= 0
            ) {

                return res.status(400).json({
                    message:
                        "Invalid order item",
                });

            }


            const product =
                await Product.findById(
                    item.product
                );


            if (!product) {

                return res.status(404).json({
                    message:
                        "Product not found",
                });

            }


            if (
                item.quantity >
                product.stock
            ) {

                return res.status(400).json({

                    message:
                        product.stock > 0
                            ? `Only ${product.stock} items available for ${product.name}`
                            : `${product.name} is out of stock`,

                });

            }

        }


        // =================================================
        // RESERVE STOCK
        // =================================================

        for (const item of orderItems) {

            const updatedProduct =
                await Product.findOneAndUpdate(

                    {
                        _id: item.product,

                        stock: {
                            $gte:
                                item.quantity,
                        },
                    },

                    {
                        $inc: {
                            stock:
                                -item.quantity,
                        },
                    },

                    {
                        new: true,
                    }

                );


            if (!updatedProduct) {

                // Restore previously reserved items

                for (
                    const reserved
                    of reservedItems
                ) {

                    await Product.findByIdAndUpdate(

                        reserved.product,

                        {
                            $inc: {
                                stock:
                                    reserved.quantity,
                            },
                        }

                    );

                }


                return res.status(400).json({
                    message:
                        "Insufficient stock. Order was not placed.",
                });

            }


            reservedItems.push({
                product:
                    item.product,

                quantity:
                    item.quantity,
            });

        }


        // =================================================
        // CREATE DATABASE ORDER
        // =================================================

        let order;

        try {

            order =
                await Order.create({

                    user:
                        req.user.id,

                    orderItems:
                        orderItems.map(
                            (item) => ({

                                product:
                                    item.product,

                                quantity:
                                    item.quantity,

                            })
                        ),

                    shippingAddress,

                    paymentMethod,

                    paymentStatus:
                        "Pending",

                    totalPrice,

                });

        } catch (orderError) {

            // Restore stock

            for (
                const reserved
                of reservedItems
            ) {

                await Product.findByIdAndUpdate(

                    reserved.product,

                    {
                        $inc: {
                            stock:
                                reserved.quantity,
                        },
                    }

                );

            }

            throw orderError;

        }


        // =================================================
        // CREATE RAZORPAY ORDER FOR UPI ONLY
        // =================================================

        let razorpayOrder = null;

        if (paymentMethod === "UPI") {

            try {

                const options = {

                    amount:
                        Math.round(
                            Number(totalPrice) *
                            100
                        ),

                    currency,

                    receipt:
                        `receipt_${order._id}`,

                };


                razorpayOrder =
                    await razorpay.orders.create(
                        options
                    );


                if (!razorpayOrder) {

                    throw new Error(
                        "Razorpay order creation failed"
                    );

                }

            } catch (razorpayError) {

                // Restore stock

                for (
                    const reserved
                    of reservedItems
                ) {

                    await Product.findByIdAndUpdate(

                        reserved.product,

                        {
                            $inc: {
                                stock:
                                    reserved.quantity,
                            },
                        }

                    );

                }


                // Delete pending database order

                await Order.findByIdAndDelete(
                    order._id
                );


                throw razorpayError;

            }

        }


        // =================================================
        // POPULATE ORDER
        // =================================================

        const populatedOrder =
            await Order.findById(
                order._id
            )
                .populate(
                    "user",
                    "-password"
                )
                .populate(
                    "orderItems.product"
                )
                .populate(
                    "shippingAddress"
                );


        // =================================================
        // RESPONSE
        // =================================================

        return res.status(201).json({

            message:
                "Order created successfully",

            order:
                populatedOrder,

            razorpayOrder:
                razorpayOrder,

            totalAmount:
                totalPrice,

            success:
                true,

            paymentMethod,

        });


    } catch (error) {

        console.error(
            "Create order error:",
            error
        );


        // =================================================
        // SAFETY ROLLBACK
        // =================================================

        if (
            reservedItems.length > 0
        ) {

            for (
                const reserved
                of reservedItems
            ) {

                try {

                    await Product.findByIdAndUpdate(

                        reserved.product,

                        {
                            $inc: {
                                stock:
                                    reserved.quantity,
                            },
                        }

                    );

                } catch (
                rollbackError
                ) {

                    console.error(
                        "Stock rollback error:",
                        rollbackError
                    );

                }

            }

        }


        return res.status(500).json({

            message:
                "Error creating order",

            error:
                error.message,

        });

    }

};


// =====================================================
// VERIFY RAZORPAY PAYMENT
// =====================================================

const verifyPayment = async (
    req,
    res
) => {

    try {

        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
        } = req.body;


        // =================================================
        // VALIDATE DATA
        // =================================================

        if (
            !razorpay_order_id ||
            !razorpay_payment_id ||
            !razorpay_signature
        ) {

            return res.status(400).json({
                success: false,
                message:
                    "Payment verification data is missing",
            });

        }


        // =================================================
        // GENERATE SIGNATURE
        // =================================================

        const generatedSignature =
            crypto
                .createHmac(
                    "sha256",
                    process.env.RAZORPAY_KEY_SECRET
                )
                .update(
                    `${razorpay_order_id}|${razorpay_payment_id}`
                )
                .digest("hex");


        if (
            generatedSignature !==
            razorpay_signature
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Invalid payment signature",

            });

        }


        // =================================================
        // GET RAZORPAY ORDER
        // =================================================

        const razorpayOrder =
            await razorpay.orders.fetch(
                razorpay_order_id
            );


        if (!razorpayOrder) {

            return res.status(404).json({

                success: false,

                message:
                    "Razorpay order not found",

            });

        }


        // =================================================
        // GET OUR ORDER ID FROM RECEIPT
        // =================================================

        const receipt =
            razorpayOrder.receipt;


        if (
            !receipt ||
            !receipt.startsWith(
                "receipt_"
            )
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Invalid Razorpay receipt",

            });

        }


        const orderId =
            receipt.replace(
                "receipt_",
                ""
            );


        // =================================================
        // FIND OUR ORDER
        // =================================================

        const order =
            await Order.findById(
                orderId
            );


        if (!order) {

            return res.status(404).json({

                success: false,

                message:
                    "Order not found",

            });

        }


        // =================================================
        // SECURITY CHECK
        // =================================================

        if (
            order.user.toString() !==
            req.user.id.toString()
        ) {

            return res.status(403).json({

                success: false,

                message:
                    "You are not authorized to verify this order",

            });

        }


        // =================================================
        // UPDATE PAYMENT
        // =================================================

        order.paymentStatus =
            "Paid";


        await order.save();


        // =================================================
        // RESPONSE
        // =================================================

        return res.status(200).json({

            success: true,

            message:
                "Payment verified successfully",

            orderId:
                order._id,

        });


    } catch (error) {

        console.error(
            "Verify payment error:",
            error
        );


        return res.status(500).json({

            success: false,

            message:
                "Payment verification failed",

            error:
                error.message,

        });

    }

};


// =====================================================
// PAYMENT FAILED
// =====================================================

const paymentFailed = async (
    req,
    res
) => {

    try {

        const {
            orderId,
        } = req.body;


        if (!orderId) {

            return res.status(400).json({

                success: false,

                message:
                    "Order ID is required",

            });

        }


        const order =
            await Order.findOne({

                _id:
                    orderId,

                user:
                    req.user.id,

            });


        if (!order) {

            return res.status(404).json({

                success: false,

                message:
                    "Order not found",

            });

        }


        // =================================================
        // DON'T PROCESS TWICE
        // =================================================

        if (
            order.paymentStatus ===
            "Failed" ||
            order.stockRestoredOnCancel
        ) {

            return res.status(200).json({

                success: true,

                message:
                    "Payment failure already processed",

            });

        }


        // =================================================
        // RESTORE STOCK
        // =================================================

        for (
            const item
            of order.orderItems
        ) {

            await Product.findByIdAndUpdate(

                item.product,

                {
                    $inc: {
                        stock:
                            item.quantity,
                    },
                }

            );

        }


        // =================================================
        // UPDATE ORDER
        // =================================================

        order.paymentStatus =
            "Failed";

        order.deliveryStatus =
            "Cancelled";

        order.stockRestoredOnCancel =
            true;

        order.cancelledAt =
            new Date();


        await order.save();


        // =================================================
        // RESPONSE
        // =================================================

        return res.status(200).json({

            success: true,

            message:
                "Payment failed and stock restored",

        });


    } catch (error) {

        console.error(
            "Payment failed error:",
            error
        );


        return res.status(500).json({

            success: false,

            message:
                "Failed to process payment failure",

            error:
                error.message,

        });

    }

};


// =====================================================
// GET MY ORDERS
// =====================================================

const getMyOrders = async (req, res) => {

    try {

        const orders =
            await Order.find({

                user:
                    req.user.id,

            })
                .populate(
                    "orderItems.product"
                )
                .populate(
                    "shippingAddress"
                )
                .sort({
                    createdAt: -1,
                });


        res.status(200).json({

            message:
                "Orders fetched successfully",

            orders,

        });


    } catch (error) {

        console.error(
            "Get my orders error:",
            error
        );


        res.status(500).json({

            message:
                "Error fetching orders",

            error:
                error.message,

        });

    }

};


// =====================================================
// GET SINGLE ORDER
// =====================================================

const getOrder = async (req, res) => {

    try {

        const order =
            await Order.findOne({

                _id:
                    req.params.id,

                user:
                    req.user.id,

            })
                .populate(
                    "orderItems.product"
                )
                .populate(
                    "shippingAddress"
                );


        if (!order) {

            return res.status(404).json({

                message:
                    "Order not found",

            });

        }


        res.status(200).json({

            message:
                "Order fetched successfully",

            order,

        });


    } catch (error) {

        console.error(
            "Get order error:",
            error
        );


        res.status(500).json({

            message:
                "Error fetching order",

            error:
                error.message,

        });

    }

};


// =====================================================
// GET ALL ORDERS
// ADMIN
// =====================================================

const getAllOrders = async (
    req,
    res
) => {

    try {

        const orders =
            await Order.find()
                .populate(
                    "user",
                    "-password"
                )
                .populate(
                    "orderItems.product"
                )
                .populate(
                    "shippingAddress"
                )
                .sort({
                    createdAt: -1,
                });


        res.status(200).json({

            message:
                "All orders fetched successfully",

            orders,

        });


    } catch (error) {

        console.error(
            "Get all orders error:",
            error
        );


        res.status(500).json({

            message:
                "Error fetching all orders",

            error:
                error.message,

        });

    }

};


// =====================================================
// UPDATE DELIVERY STATUS
// ADMIN
// =====================================================

const updateDeliveryStatus =
    async (req, res) => {

        try {

            const {
                deliveryStatus,
            } = req.body;


            const validStatuses = [

                "Pending",
                "Processing",
                "Shipped",
                "Out for Delivery",
                "Delivered",
                "Cancelled",
                "Returned",
                "Failed Delivery",

            ];


            if (
                !validStatuses.includes(
                    deliveryStatus
                )
            ) {

                return res.status(400).json({

                    message:
                        "Invalid delivery status",

                });

            }


            const updateData = {

                deliveryStatus,

            };


            if (
                deliveryStatus ===
                "Delivered"
            ) {

                updateData.deliveredAt =
                    new Date();

            } else {

                updateData.deliveredAt =
                    null;

            }


            const order =
                await Order.findByIdAndUpdate(

                    req.params.id,

                    updateData,

                    {
                        new: true,
                        runValidators: true,
                    }

                )
                    .populate(
                        "user",
                        "-password"
                    )
                    .populate(
                        "orderItems.product"
                    )
                    .populate(
                        "shippingAddress"
                    );


            if (!order) {

                return res.status(404).json({

                    message:
                        "Order not found",

                });

            }


            res.status(200).json({

                message:
                    "Delivery status updated successfully",

                order,

            });


        } catch (error) {

            console.error(
                "Update delivery status error:",
                error
            );


            res.status(500).json({

                message:
                    "Error updating delivery status",

                error:
                    error.message,

            });

        }

    };


// =====================================================
// UPDATE PAYMENT STATUS
// ADMIN
// =====================================================

const updatePaymentStatus =
    async (req, res) => {

        try {

            const {
                paymentStatus,
            } = req.body;


            const validStatuses = [

                "Pending",
                "Paid",
                "Failed",

            ];


            if (
                !validStatuses.includes(
                    paymentStatus
                )
            ) {

                return res.status(400).json({

                    message:
                        "Invalid payment status",

                });

            }


            const order =
                await Order.findByIdAndUpdate(

                    req.params.id,

                    {
                        paymentStatus,
                    },

                    {
                        new: true,
                        runValidators: true,
                    }

                )
                    .populate(
                        "user",
                        "-password"
                    )
                    .populate(
                        "orderItems.product"
                    )
                    .populate(
                        "shippingAddress"
                    );


            if (!order) {

                return res.status(404).json({

                    message:
                        "Order not found",

                });

            }


            res.status(200).json({

                message:
                    "Payment status updated successfully",

                order,

            });


        } catch (error) {

            console.error(
                "Update payment status error:",
                error
            );


            res.status(500).json({

                message:
                    "Error updating payment status",

                error:
                    error.message,

            });

        }

    };


// =====================================================
// CANCEL ORDER
// CUSTOMER
// =====================================================

const cancelOrder = async (
    req,
    res
) => {

    try {

        const order =
            await Order.findOne({

                _id:
                    req.params.id,

                user:
                    req.user.id,

            });


        if (!order) {

            return res.status(404).json({

                message:
                    "Order not found",

            });

        }


        if (
            [

                "Shipped",
                "Out for Delivery",
                "Delivered",
                "Cancelled",
                "Returned",

            ].includes(
                order.deliveryStatus
            )
        ) {

            return res.status(400).json({

                message:
                    "This order cannot be cancelled",

            });

        }


        // =================================================
        // RESTORE STOCK ONLY ONCE
        // =================================================

        if (
            !order.stockRestoredOnCancel
        ) {

            for (
                const item
                of order.orderItems
            ) {

                await Product.findByIdAndUpdate(

                    item.product,

                    {
                        $inc: {
                            stock:
                                item.quantity,
                        },
                    }

                );

            }


            order.stockRestoredOnCancel =
                true;

        }


        order.deliveryStatus =
            "Cancelled";


        order.cancelledByCustomer =
            true;


        order.cancelledAt =
            new Date();


        await order.save();


        const updatedOrder =
            await Order.findById(
                order._id
            )
                .populate(
                    "orderItems.product"
                )
                .populate(
                    "shippingAddress"
                );


        res.status(200).json({

            message:
                "Order cancelled successfully",

            order:
                updatedOrder,

        });


    } catch (error) {

        console.error(
            "Cancel order error:",
            error
        );


        res.status(500).json({

            message:
                "Error cancelling order",

            error:
                error.message,

        });

    }

};


// =====================================================
// REQUEST RETURN
// CUSTOMER
// =====================================================

const requestReturn = async (
    req,
    res
) => {

    try {

        const {
            returnReason,
        } = req.body;


        const validReasons = [

            "Damaged Product",
            "Wrong Item Received",
            "Defective Product",
            "Item Not as Described",
            "Size/Color Mismatch",
            "Other",

        ];


        if (
            !validReasons.includes(
                returnReason
            )
        ) {

            return res.status(400).json({

                message:
                    "Invalid return reason",

            });

        }


        const order =
            await Order.findOne({

                _id:
                    req.params.id,

                user:
                    req.user.id,

            });


        if (!order) {

            return res.status(404).json({

                message:
                    "Order not found",

            });

        }


        if (
            order.deliveryStatus !==
            "Delivered"
        ) {

            return res.status(400).json({

                message:
                    "Return can only be requested for delivered orders",

            });

        }


        if (order.isReturned) {

            return res.status(400).json({

                message:
                    "Return already requested",

            });

        }


        order.isReturned =
            true;


        order.returnReason =
            returnReason;


        order.returnStatus =
            "Requested";


        await order.save();


        const updatedOrder =
            await Order.findById(
                order._id
            )
                .populate(
                    "orderItems.product"
                )
                .populate(
                    "shippingAddress"
                );


        res.status(200).json({

            message:
                "Return request submitted successfully",

            order:
                updatedOrder,

        });


    } catch (error) {

        console.error(
            "Request return error:",
            error
        );


        res.status(500).json({

            message:
                "Error requesting return",

            error:
                error.message,

        });

    }

};


// =====================================================
// UPDATE RETURN STATUS
// ADMIN
// =====================================================

const updateReturnStatus =
    async (req, res) => {

        try {

            const {
                returnStatus,
            } = req.body;


            const validStatuses = [

                "Requested",
                "Approved",
                "Rejected",
                "Completed",

            ];


            if (
                !validStatuses.includes(
                    returnStatus
                )
            ) {

                return res.status(400).json({

                    message:
                        "Invalid return status",

                });

            }


            const order =
                await Order.findById(
                    req.params.id
                );


            if (!order) {

                return res.status(404).json({

                    message:
                        "Order not found",

                });

            }


            // =================================================
            // RESTORE STOCK ONLY WHEN RETURN IS COMPLETED
            // =================================================

            if (
                returnStatus ===
                "Completed" &&
                !order.stockRestoredOnReturn
            ) {

                const shouldRestoreStock =

                    order.returnReason !==
                    "Damaged Product" &&

                    order.returnReason !==
                    "Defective Product";


                if (shouldRestoreStock) {

                    for (
                        const item
                        of order.orderItems
                    ) {

                        await Product.findByIdAndUpdate(

                            item.product,

                            {
                                $inc: {
                                    stock:
                                        item.quantity,
                                },
                            }

                        );

                    }


                    order.stockRestoredOnReturn =
                        true;

                }


                order.returnedAt =
                    new Date();


                order.deliveryStatus =
                    "Returned";

            }


            order.returnStatus =
                returnStatus;


            await order.save();


            const updatedOrder =
                await Order.findById(
                    order._id
                )
                    .populate(
                        "user",
                        "-password"
                    )
                    .populate(
                        "orderItems.product"
                    )
                    .populate(
                        "shippingAddress"
                    );


            res.status(200).json({

                message:
                    "Return status updated successfully",

                order:
                    updatedOrder,

            });


        } catch (error) {

            console.error(
                "Update return status error:",
                error
            );


            res.status(500).json({

                message:
                    "Error updating return status",

                error:
                    error.message,

            });

        }

    };


// =====================================================
// EXPORT
// =====================================================

module.exports = {

    createOrder,

    verifyPayment,

    paymentFailed,

    getMyOrders,

    getOrder,

    getAllOrders,

    updateDeliveryStatus,

    updatePaymentStatus,

    cancelOrder,

    requestReturn,

    updateReturnStatus,

};
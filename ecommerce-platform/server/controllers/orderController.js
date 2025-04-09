const Order = require('../models/Order');
const Product = require('../models/Product');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');

// @desc    Create new order
// @route   POST /api/order/new
// @access  Private
exports.newOrder = asyncHandler(async (req, res, next) => {
  const {
    orderItems,
    shippingInfo,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
    paymentInfo
  } = req.body;

  const order = await Order.create({
    orderItems,
    shippingInfo,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
    paymentInfo,
    paidAt: Date.now(),
    user: req.user._id
  });

  res.status(201).json({
    success: true,
    order
  });
});

// @desc    Get single order
// @route   GET /api/order/:id
// @access  Private
exports.getSingleOrder = asyncHandler(async (req, res, next) => {
  const order = await Order.findById(req.params.id).populate('user', 'name email');

  if (!order) {
    return next(new ErrorResponse(`No order found with ID: ${req.params.id}`, 404));
  }

  res.status(200).json({
    success: true,
    order
  });
});

// @desc    Get logged in user orders
// @route   GET /api/orders/me
// @access  Private
exports.myOrders = asyncHandler(async (req, res, next) => {
  const orders = await Order.find({ user: req.user._id });

  res.status(200).json({
    success: true,
    count: orders.length,
    orders
  });
});

// @desc    Get all orders (Admin)
// @route   GET /api/admin/orders
// @access  Private/Admin
exports.getAllOrders = asyncHandler(async (req, res, next) => {
  const orders = await Order.find().populate('user', 'id name');

  const totalAmount = orders.reduce((acc, order) => acc + order.totalPrice, 0);

  res.status(200).json({
    success: true,
    count: orders.length,
    totalAmount,
    orders
  });
});

// @desc    Update order (Admin)
// @route   PUT /api/admin/order/:id
// @access  Private/Admin
exports.updateOrder = asyncHandler(async (req, res, next) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    return next(new ErrorResponse(`No order found with ID: ${req.params.id}`, 404));
  }

  if (order.orderStatus === 'Delivered') {
    return next(new ErrorResponse('This order has already been delivered', 400));
  }

  order.orderStatus = req.body.status || order.orderStatus;
  order.deliveredAt = req.body.status === 'Delivered' ? Date.now() : null;

  await order.save({ validateBeforeSave: false });

  res.status(200).json({
    success: true,
    order
  });
});

// @desc    Delete order (Admin)
// @route   DELETE /api/admin/order/:id
// @access  Private/Admin
exports.deleteOrder = asyncHandler(async (req, res, next) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    return next(new ErrorResponse(`No order found with ID: ${req.params.id}`, 404));
  }

  await order.remove();

  res.status(200).json({
    success: true,
    message: 'Order deleted successfully'
  });
});
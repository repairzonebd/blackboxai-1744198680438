const User = require('../models/User');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const sendToken = require('../utils/jwtToken');

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
exports.registerUser = asyncHandler(async (req, res, next) => {
  const { name, email, password } = req.body;

  const user = await User.create({
    name,
    email,
    password
  });

  sendToken(user, 201, res);
});

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.loginUser = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new ErrorResponse('Please provide email and password', 400));
  }

  const user = await User.findOne({ email }).select('+password');

  if (!user) {
    return next(new ErrorResponse('Invalid credentials', 401));
  }

  const isMatch = await user.comparePassword(password);

  if (!isMatch) {
    return next(new ErrorResponse('Invalid credentials', 401));
  }

  sendToken(user, 200, res);
});

// @desc    Logout user
// @route   GET /api/auth/logout
// @access  Private
exports.logoutUser = asyncHandler(async (req, res, next) => {
  res.cookie('token', 'none', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true
  });

  res.status(200).json({
    success: true,
    data: {}
  });
});

// @desc    Get current logged in user profile
// @route   GET /api/auth/me
// @access  Private
exports.getUserProfile = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id);

  res.status(200).json({
    success: true,
    data: user
  });
});

// @desc    Update user profile
// @route   PUT /api/auth/me/update
// @access  Private
exports.updateProfile = asyncHandler(async (req, res, next) => {
  const newUserData = {
    name: req.body.name,
    email: req.body.email
  };

  const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    success: true,
    data: user
  });
});

// @desc    Get all users (admin)
// @route   GET /api/auth/admin/users
// @access  Private/Admin
exports.getAllUsers = asyncHandler(async (req, res, next) => {
  const users = await User.find();

  res.status(200).json({
    success: true,
    count: users.length,
    data: users
  });
});

// @desc    Get single user details (admin)
// @route   GET /api/auth/admin/user/:id
// @access  Private/Admin
exports.getUserDetails = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(new ErrorResponse(`User not found with id: ${req.params.id}`, 404));
  }

  res.status(200).json({
    success: true,
    data: user
  });
});

// @desc    Update user role (admin)
// @route   PUT /api/auth/admin/user/:id
// @access  Private/Admin
exports.updateUserRole = asyncHandler(async (req, res, next) => {
  const newUserData = {
    name: req.body.name,
    email: req.body.email,
    role: req.body.role
  };

  const user = await User.findByIdAndUpdate(req.params.id, newUserData, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    success: true,
    data: user
  });
});

// @desc    Delete user (admin)
// @route   DELETE /api/auth/admin/user/:id
// @access  Private/Admin
exports.deleteUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(new ErrorResponse(`User not found with id: ${req.params.id}`, 404));
  }

  await user.remove();

  res.status(200).json({
    success: true,
    data: {}
  });
});
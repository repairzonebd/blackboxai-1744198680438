const Product = require('../models/Product');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const APIFeatures = require('../utils/apiFeatures');

// @desc    Get all products
// @route   GET /api/products
// @access  Public
exports.getProducts = asyncHandler(async (req, res, next) => {
  const resPerPage = 8;
  const productCount = await Product.countDocuments();

  const features = new APIFeatures(Product.find(), req.query)
    .search()
    .filter()
    .pagination(resPerPage);

  const products = await features.query;

  res.status(200).json({
    success: true,
    count: products.length,
    productCount,
    resPerPage,
    data: products
  });
});

// @desc    Get all products (Admin)
// @route   GET /api/admin/products
// @access  Private/Admin
exports.getAdminProducts = asyncHandler(async (req, res, next) => {
  const products = await Product.find();

  res.status(200).json({
    success: true,
    data: products
  });
});

// @desc    Get single product
// @route   GET /api/product/:id
// @access  Public
exports.getSingleProduct = asyncHandler(async (req, res, next) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return next(new ErrorResponse(`Product not found with id: ${req.params.id}`, 404));
  }

  res.status(200).json({
    success: true,
    data: product
  });
});

// @desc    Create new product
// @route   POST /api/admin/product/new
// @access  Private/Admin
exports.newProduct = asyncHandler(async (req, res, next) => {
  const product = await Product.create(req.body);

  res.status(201).json({
    success: true,
    data: product
  });
});

// @desc    Update product
// @route   PUT /api/admin/product/:id
// @access  Private/Admin
exports.updateProduct = asyncHandler(async (req, res, next) => {
  let product = await Product.findById(req.params.id);

  if (!product) {
    return next(new ErrorResponse(`Product not found with id: ${req.params.id}`, 404));
  }

  product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    success: true,
    data: product
  });
});

// @desc    Delete product
// @route   DELETE /api/admin/product/:id
// @access  Private/Admin
exports.deleteProduct = asyncHandler(async (req, res, next) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return next(new ErrorResponse(`Product not found with id: ${req.params.id}`, 404));
  }

  await product.remove();

  res.status(200).json({
    success: true,
    data: {}
  });
});

// @desc    Create new review
// @route   PUT /api/review
// @access  Private
exports.createProductReview = asyncHandler(async (req, res, next) => {
  const { rating, comment, productId } = req.body;

  const review = {
    user: req.user._id,
    name: req.user.name,
    rating: Number(rating),
    comment
  };

  const product = await Product.findById(productId);

  if (!product) {
    return next(new ErrorResponse(`Product not found with id: ${productId}`, 404));
  }

  const isReviewed = product.reviews.find(
    r => r.user.toString() === req.user._id.toString()
  );

  if (isReviewed) {
    product.reviews.forEach(review => {
      if (review.user.toString() === req.user._id.toString()) {
        review.comment = comment;
        review.rating = rating;
      }
    });
  } else {
    product.reviews.push(review);
    product.numOfReviews = product.reviews.length;
  }

  product.ratings = product.reviews.reduce((acc, item) => item.rating + acc, 0) / product.reviews.length;

  await product.save({ validateBeforeSave: false });

  res.status(200).json({
    success: true
  });
});

// @desc    Get product reviews
// @route   GET /api/reviews
// @access  Private
exports.getProductReviews = asyncHandler(async (req, res, next) => {
  const product = await Product.findById(req.query.id);

  if (!product) {
    return next(new ErrorResponse(`Product not found with id: ${req.query.id}`, 404));
  }

  res.status(200).json({
    success: true,
    data: product.reviews
  });
});

// @desc    Delete review
// @route   DELETE /api/reviews
// @access  Private
exports.deleteReview = asyncHandler(async (req, res, next) => {
  const product = await Product.findById(req.query.productId);

  if (!product) {
    return next(new ErrorResponse(`Product not found with id: ${req.query.productId}`, 404));
  }

  const reviews = product.reviews.filter(
    review => review._id.toString() !== req.query.id.toString()
  );

  const numOfReviews = reviews.length;

  const ratings = numOfReviews > 0 
    ? product.reviews.reduce((acc, item) => item.rating + acc, 0) / numOfReviews
    : 0;

  await Product.findByIdAndUpdate(req.query.productId, {
    reviews,
    ratings,
    numOfReviews
  }, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    success: true
  });
});
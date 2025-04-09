const express = require('express');
const router = express.Router();
const {
  getProducts,
  getAdminProducts,
  newProduct,
  getSingleProduct,
  updateProduct,
  deleteProduct,
  createProductReview,
  getProductReviews,
  deleteReview
} = require('../controllers/productController');
const { isAuthenticated, authorizeRoles } = require('../middleware/authMiddleware');

// Public routes
router.get('/products', getProducts);
router.get('/product/:id', getSingleProduct);

// Protected routes
router.put('/review', isAuthenticated, createProductReview);
router.get('/reviews', isAuthenticated, getProductReviews);
router.delete('/reviews', isAuthenticated, deleteReview);

// Admin routes
router.get('/admin/products', isAuthenticated, authorizeRoles('admin'), getAdminProducts);
router.post('/admin/product/new', isAuthenticated, authorizeRoles('admin'), newProduct);
router.route('/admin/product/:id')
  .put(isAuthenticated, authorizeRoles('admin'), updateProduct)
  .delete(isAuthenticated, authorizeRoles('admin'), deleteProduct);

module.exports = router;
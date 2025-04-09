const express = require('express');
const router = express.Router();
const {
  registerUser,
  loginUser,
  logoutUser,
  getUserProfile,
  updateProfile,
  getAllUsers,
  getUserDetails,
  updateUserRole,
  deleteUser
} = require('../controllers/authController');
const { isAuthenticated, authorizeRoles } = require('../middleware/authMiddleware');

// Public routes
router.post('/register', registerUser);
router.post('/login', loginUser);

// Protected routes
router.get('/logout', isAuthenticated, logoutUser);
router.get('/me', isAuthenticated, getUserProfile);
router.put('/me/update', isAuthenticated, updateProfile);

// Admin routes
router.get('/admin/users', isAuthenticated, authorizeRoles('admin'), getAllUsers);
router.get('/admin/user/:id', isAuthenticated, authorizeRoles('admin'), getUserDetails);
router.put('/admin/user/:id', isAuthenticated, authorizeRoles('admin'), updateUserRole);
router.delete('/admin/user/:id', isAuthenticated, authorizeRoles('admin'), deleteUser);

module.exports = router;
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaCheckCircle, FaShoppingBag, FaHome, FaListAlt } from 'react-icons/fa';

const OrderConfirmationPage = () => {
  const location = useLocation();
  const order = location.state?.order || { id: '12345' }; // Default for demo

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-8">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-lg">
        <div className="text-center">
          <FaCheckCircle className="text-green-500 text-6xl mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Order Confirmed!</h1>
          <p className="text-gray-600 mb-6">
            Thank you for your purchase. We've sent a confirmation to your email.
          </p>
        </div>

        <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-center space-x-2 mb-2">
            <FaShoppingBag className="text-blue-500" />
            <span className="font-medium text-gray-800">Order #{order.id}</span>
          </div>
          <p className="text-sm text-center text-gray-600">
            Your items will be shipped within 2-3 business days.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Link
            to="/"
            className="flex items-center justify-center space-x-2 bg-white border border-gray-300 text-gray-700 px-4 py-3 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <FaHome />
            <span>Back to Home</span>
          </Link>
          <Link
            to="/orders"
            className="flex items-center justify-center space-x-2 bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <FaListAlt />
            <span>View Orders</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmationPage;
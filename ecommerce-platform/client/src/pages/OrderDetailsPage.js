import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getOrderDetails } from '../apiService';
import { FaBox, FaCheckCircle, FaTruck, FaCreditCard, FaHome } from 'react-icons/fa';

const OrderDetailsPage = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const orderDetails = await getOrderDetails(id);
        setOrder(orderDetails);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load order details');
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mx-auto mb-6"></div>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-100 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
          {error}
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <FaBox className="text-gray-400 text-5xl mx-auto mb-4" />
        <h2 className="text-xl font-semibold mb-2">Order Not Found</h2>
        <Link
          to="/orders"
          className="inline-block bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
        >
          Back to Orders
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Order #{order._id.substring(0, 8)}</h1>
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
          order.status === 'Delivered' ? 'bg-green-100 text-green-800' :
          order.status === 'Cancelled' ? 'bg-red-100 text-red-800' :
          'bg-blue-100 text-blue-800'
        }`}>
          {order.status}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Order Items */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold flex items-center">
              <FaBox className="mr-2" /> Order Items
            </h2>
          </div>
          <div className="divide-y divide-gray-200">
            {order.orderItems.map(item => (
              <div key={item._id} className="p-4 flex">
                <img 
                  src={item.image} 
                  alt={item.name}
                  className="w-16 h-16 object-contain mr-4"
                />
                <div className="flex-1">
                  <h3 className="font-medium">{item.name}</h3>
                  <p className="text-gray-600 text-sm">Qty: {item.quantity}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium">${item.price.toFixed(2)}</p>
                  <p className="text-gray-500 text-sm">${(item.price * item.quantity).toFixed(2)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Order Summary */}
        <div className="space-y-4">
          {/* Shipping Info */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="p-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold flex items-center">
                <FaTruck className="mr-2" /> Shipping Information
              </h2>
            </div>
            <div className="p-4">
              <p className="font-medium">{order.shippingAddress.address}</p>
              <p>{order.shippingAddress.city}, {order.shippingAddress.postalCode}</p>
              <p>{order.shippingAddress.country}</p>
            </div>
          </div>

          {/* Payment Info */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="p-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold flex items-center">
                <FaCreditCard className="mr-2" /> Payment Method
              </h2>
            </div>
            <div className="p-4">
              <p className="font-medium">{order.paymentMethod}</p>
              {order.paymentMethod === 'Credit Card' && (
                <p className="text-gray-600 text-sm mt-1">Card ending in ****</p>
              )}
            </div>
          </div>

          {/* Order Total */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="p-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold">Order Summary</h2>
            </div>
            <div className="p-4 space-y-2">
              <div className="flex justify-between">
                <span>Items:</span>
                <span>${order.itemsPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping:</span>
                <span>${order.shippingPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax:</span>
                <span>${order.taxPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between border-t border-gray-200 pt-2 font-bold">
                <span>Total:</span>
                <span>${order.totalPrice.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 text-center">
        <Link
          to="/orders"
          className="inline-flex items-center bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
        >
          <FaHome className="mr-2" />
          Back to Orders
        </Link>
      </div>
    </div>
  );
};

export default OrderDetailsPage;
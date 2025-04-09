import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { getOrders } from '../apiService';
import AuthContext from '../context/AuthContext';
import { FaBoxOpen, FaShoppingBag, FaCalendarAlt } from 'react-icons/fa';

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const orders = await getOrders();
        setOrders(orders);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load orders');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mx-auto mb-6"></div>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-24 bg-gray-100 rounded-lg"></div>
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

  if (orders.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <FaBoxOpen className="text-gray-400 text-5xl mx-auto mb-4" />
        <h2 className="text-xl font-semibold mb-2">No Orders Found</h2>
        <p className="text-gray-600 mb-4">You haven't placed any orders yet.</p>
        <Link
          to="/products"
          className="inline-block bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
        >
          Browse Products
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Your Orders</h1>
      
      <div className="space-y-4">
        {orders.map(order => (
          <div key={order._id} className="bg-white rounded-lg shadow overflow-hidden">
            <div className="p-4 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <FaShoppingBag className="text-blue-500" />
                  <span className="font-medium">Order #{order._id.substring(0, 8)}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                  <FaCalendarAlt />
                  <span>{new Date(order.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
            
            <div className="p-4">
              <div className="flex justify-between mb-2">
                <span>Status:</span>
                <span className={`font-medium ${
                  order.status === 'Delivered' ? 'text-green-600' : 
                  order.status === 'Cancelled' ? 'text-red-600' : 'text-blue-600'
                }`}>
                  {order.status}
                </span>
              </div>
              <div className="flex justify-between mb-2">
                <span>Items:</span>
                <span>{order.orderItems.reduce((sum, item) => sum + item.quantity, 0)}</span>
              </div>
              <div className="flex justify-between font-semibold">
                <span>Total:</span>
                <span>${order.totalPrice.toFixed(2)}</span>
              </div>
            </div>

            <div className="bg-gray-50 px-4 py-3 text-right">
              <Link
                to={`/orders/${order._id}`}
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                View Details
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrdersPage;
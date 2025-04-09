import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaCreditCard, FaUser, FaMapMarkerAlt, FaLock, FaSpinner } from 'react-icons/fa';
import { createOrder } from '../apiService';
import { useCart } from '../context/CartContext';
import AuthContext from '../context/AuthContext';

const CheckoutForm = () => {
  const [formData, setFormData] = useState({
    shippingAddress: {
      address: '',
      city: '',
      postalCode: '',
      country: ''
    },
    paymentMethod: 'Credit Card',
    cardNumber: '',
    expiryDate: '',
    cvv: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { cartItems, totalPrice, clearCart } = useCart();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name in formData.shippingAddress) {
      setFormData({
        ...formData,
        shippingAddress: {
          ...formData.shippingAddress,
          [name]: value
        }
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const orderData = {
        orderItems: cartItems,
        shippingAddress: formData.shippingAddress,
        paymentMethod: formData.paymentMethod,
        itemsPrice: totalPrice,
        shippingPrice: 0,
        taxPrice: 0,
        totalPrice: totalPrice,
        user: user._id
      };

      await createOrder(orderData);
      clearCart();
      navigate('/order-confirmation');
    } catch (err) {
      setError(err.response?.data?.message || 'Checkout failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form id="checkout-form" onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
          {error}
        </div>
      )}

      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-4 flex items-center">
          <FaUser className="mr-2" /> Shipping Information
        </h2>
        <div className="space-y-3">
          <input
            type="text"
            name="address"
            placeholder="Address"
            value={formData.shippingAddress.address}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
          <div className="grid grid-cols-2 gap-3">
            <input
              type="text"
              name="city"
              placeholder="City"
              value={formData.shippingAddress.city}
              onChange={handleChange}
              className="p-2 border rounded"
              required
            />
            <input
              type="text"
              name="postalCode"
              placeholder="Postal Code"
              value={formData.shippingAddress.postalCode}
              onChange={handleChange}
              className="p-2 border rounded"
              required
            />
          </div>
          <input
            type="text"
            name="country"
            placeholder="Country"
            value={formData.shippingAddress.country}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-4 flex items-center">
          <FaCreditCard className="mr-2" /> Payment Method
        </h2>
        <div className="space-y-3">
          <select
            name="paymentMethod"
            value={formData.paymentMethod}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          >
            <option value="Credit Card">Credit Card</option>
            <option value="PayPal">PayPal</option>
          </select>

          {formData.paymentMethod === 'Credit Card' && (
            <>
              <input
                type="text"
                name="cardNumber"
                placeholder="Card Number"
                value={formData.cardNumber}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
              />
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="text"
                  name="expiryDate"
                  placeholder="MM/YY"
                  value={formData.expiryDate}
                  onChange={handleChange}
                  className="p-2 border rounded"
                  required
                />
                <input
                  type="text"
                  name="cvv"
                  placeholder="CVV"
                  value={formData.cvv}
                  onChange={handleChange}
                  className="p-2 border rounded"
                  required
                />
              </div>
            </>
          )}
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 text-white py-3 px-4 rounded hover:bg-blue-700 flex items-center justify-center"
      >
        {loading ? (
          <>
            <FaSpinner className="animate-spin mr-2" />
            Processing...
          </>
        ) : (
          <>
            <FaLock className="mr-2" />
            Complete Purchase
          </>
        )}
      </button>
    </form>
  );
};

export default CheckoutForm;
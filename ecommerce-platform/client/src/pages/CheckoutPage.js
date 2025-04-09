import React, { useContext } from 'react';
import { useCart } from '../context/CartContext';
import CheckoutForm from '../components/CheckoutForm';

const CheckoutPage = () => {
  const { cartItems, totalPrice, totalItems } = useCart();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Checkout</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Shipping and Payment Info */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Shipping Information</h2>
          <CheckoutForm />
        </div>

        {/* Order Summary */}
        <div className="bg-white rounded-lg shadow p-6 h-fit sticky top-4">
          <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
          
          <div className="space-y-4">
            <div className="flex justify-between">
              <span>Items ({totalItems})</span>
              <span>${totalPrice.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping</span>
              <span className="text-green-600">FREE</span>
            </div>
            <div className="flex justify-between border-t border-gray-200 pt-4">
              <span className="font-semibold">Total</span>
              <span className="font-semibold">${totalPrice.toFixed(2)}</span>
            </div>
          </div>

          <button
            type="submit"
            form="checkout-form"
            className="w-full mt-6 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
          >
            Place Order
          </button>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
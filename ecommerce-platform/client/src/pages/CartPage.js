import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import CartItem from '../components/CartItem';

const CartPage = () => {
  const { 
    cartItems, 
    totalPrice, 
    totalItems,
    removeFromCart, 
    updateQuantity,
    clearCart 
  } = useCart();

  if (totalItems === 0) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Your Cart is Empty</h1>
        <Link 
          to="/products" 
          className="inline-block bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Your Shopping Cart ({totalItems} items)</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow divide-y divide-gray-200">
            {cartItems.map(item => (
              <CartItem 
                key={item._id}
                item={item}
                onRemove={() => removeFromCart(item._id)}
                onUpdateQuantity={(newQty) => updateQuantity(item._id, newQty)}
              />
            ))}
          </div>

          <div className="mt-4 flex justify-end">
            <button
              onClick={clearCart}
              className="text-red-600 hover:text-red-800 font-medium"
            >
              Clear Cart
            </button>
          </div>
        </div>

        {/* Order Summary */}
        <div className="bg-white rounded-lg shadow p-6 h-fit sticky top-4">
          <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
          
          <div className="space-y-4">
            <div className="flex justify-between">
              <span>Subtotal ({totalItems} items)</span>
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

          <Link
            to="/checkout"
            className="block w-full mt-6 bg-blue-600 text-white text-center py-2 px-4 rounded hover:bg-blue-700"
          >
            Proceed to Checkout
          </Link>

          <div className="mt-4 text-sm text-gray-500">
            <p>Free shipping on all orders</p>
            <p>30-day return policy</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
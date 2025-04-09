import React from 'react';
import { FaTrash, FaPlus, FaMinus } from 'react-icons/fa';

const CartItem = ({ item }) => {
  return (
    <div className="flex items-center border-b border-gray-200 py-4">
      <div className="w-20 h-20 overflow-hidden rounded-md">
        <img 
          src={item.image} 
          alt={item.name}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="ml-4 flex-1">
        <h3 className="text-gray-900 font-medium">{item.name}</h3>
        <p className="text-gray-600">${item.price}</p>
      </div>
      <div className="flex items-center">
        <button 
          className="text-gray-500 hover:text-gray-700"
          onClick={() => {/* Decrease quantity */}}
        >
          <FaMinus size={12} />
        </button>
        <span className="mx-2 text-gray-900">{item.quantity}</span>
        <button 
          className="text-gray-500 hover:text-gray-700"
          onClick={() => {/* Increase quantity */}}
        >
          <FaPlus size={12} />
        </button>
      </div>
      <div className="ml-4">
        <p className="text-gray-900 font-medium">${(item.price * item.quantity).toFixed(2)}</p>
      </div>
      <button 
        className="ml-4 text-red-500 hover:text-red-700"
        onClick={() => {/* Remove item */}}
      >
        <FaTrash />
      </button>
    </div>
  );
};

export default CartItem;
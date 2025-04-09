import React from 'react';
import { Link } from 'react-router-dom';

const ProductCard = ({ product }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
      <Link to={`/product/${product._id}`}>
        <img 
          src={product.images[0]} 
          alt={product.name} 
          className="w-full h-48 object-cover"
        />
        <div className="p-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-1">{product.name}</h3>
          <div className="flex justify-between items-center">
            <span className="text-gray-900 font-bold">${product.price}</span>
            <button 
              className="bg-blue-600 text-white px-3 py-1 rounded-md text-sm hover:bg-blue-700 transition-colors"
              onClick={(e) => {
                e.preventDefault();
                // Add to cart functionality will be implemented later
              }}
            >
              Add to Cart
            </button>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;
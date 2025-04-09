import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getProduct } from '../apiService';
import { useCart } from '../context/CartContext';
import { FaStar, FaShoppingCart } from 'react-icons/fa';

const ProductDetailPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await getProduct(id);
        setProduct(response.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load product');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) return <div className="text-center py-8">Loading product details...</div>;
  if (error) return <div className="text-center py-8 text-red-500">{error}</div>;
  if (!product) return <div className="text-center py-8">Product not found</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Product Images */}
        <div>
          <div className="bg-white rounded-lg shadow-md overflow-hidden mb-4">
            <img 
              src={product.images[activeImage]} 
              alt={product.name}
              className="w-full h-96 object-contain p-4"
            />
          </div>
          <div className="flex space-x-2">
            {product.images.map((img, index) => (
              <button
                key={index}
                onClick={() => setActiveImage(index)}
                className={`w-16 h-16 border rounded overflow-hidden ${activeImage === index ? 'border-blue-500' : 'border-gray-200'}`}
              >
                <img 
                  src={img} 
                  alt={`Thumbnail ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Product Details */}
        <div className="space-y-4">
          <h1 className="text-3xl font-bold">{product.name}</h1>
          
          <div className="flex items-center space-x-2">
            <div className="flex text-yellow-400">
              {[...Array(5)].map((_, i) => (
                <FaStar key={i} className={i < product.ratings ? 'text-yellow-400' : 'text-gray-300'} />
              ))}
            </div>
            <span>({product.numOfReviews} reviews)</span>
          </div>

          <p className="text-2xl font-semibold">${product.price}</p>
          <p className="text-gray-600">{product.description}</p>

          <div className="pt-4">
            <h3 className="font-semibold">Stock: {product.stock > 0 ? 
              <span className="text-green-500">In Stock</span> : 
              <span className="text-red-500">Out of Stock</span>}
            </h3>
          </div>

          {product.stock > 0 && (
            <div className="flex items-center space-x-4 pt-4">
              <div className="flex items-center border rounded">
                <button 
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-1 text-lg hover:bg-gray-100"
                >
                  -
                </button>
                <span className="px-4">{quantity}</span>
                <button 
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  className="px-3 py-1 text-lg hover:bg-gray-100"
                >
                  +
                </button>
              </div>

              <button
                onClick={() => addToCart(product, quantity)}
                className="flex items-center bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition-colors"
                disabled={product.stock === 0}
              >
                <FaShoppingCart className="mr-2" />
                Add to Cart
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Reviews Section */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-4">Customer Reviews</h2>
        {product.reviews.length > 0 ? (
          <div className="space-y-4">
            {product.reviews.map(review => (
              <div key={review._id} className="bg-white p-4 rounded shadow">
                <div className="flex items-center space-x-2 mb-2">
                  <div className="font-semibold">{review.name}</div>
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <FaStar key={i} className={i < review.rating ? 'text-yellow-400' : 'text-gray-300'} />
                    ))}
                  </div>
                </div>
                <p className="text-gray-700">{review.comment}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No reviews yet</p>
        )}
      </div>
    </div>
  );
};

export default ProductDetailPage;
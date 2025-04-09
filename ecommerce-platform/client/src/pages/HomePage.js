import React, { useEffect, useContext } from 'react';
import ProductCard from '../components/ProductCard';
import AuthContext from '../context/AuthContext';
import CartContext from '../context/CartContext';
import axios from 'axios';

const HomePage = () => {
  const { user } = useContext(AuthContext);
  const { addToCart } = useContext(CartContext);
  const [products, setProducts] = React.useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('/api/products');
        setProducts(response.data.data);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="container mx-auto px-4">
      <h1 className="text-2xl font-bold my-4">Welcome to GadgetStore</h1>
      <h2 className="text-xl font-semibold mb-4">Featured Products</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {products.map(product => (
          <ProductCard 
            key={product._id} 
            product={product} 
            addToCart={addToCart} 
          />
        ))}
      </div>
    </div>
  );
};

export default HomePage;
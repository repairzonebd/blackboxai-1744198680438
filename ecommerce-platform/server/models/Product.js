const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true,
    maxlength: [100, 'Product name cannot exceed 100 characters']
  },
  price: {
    type: Number,
    required: [true, 'Product price is required'],
    min: [0, 'Price must be at least 0']
  },
  description: {
    type: String,
    required: [true, 'Product description is required']
  },
  images: [{
    type: String,
    required: [true, 'At least one product image is required'],
    validate: {
      validator: function(array) {
        return array.length > 0;
      },
      message: 'At least one product image is required'
    }
  }],
  category: {
    type: String,
    required: [true, 'Product category is required'],
    enum: {
      values: ['phones', 'gadgets', 'accessories', 'other'],
      message: 'Please select correct category'
    }
  },
  brand: {
    type: String,
    required: [true, 'Product brand is required']
  },
  stock: {
    type: Number,
    required: [true, 'Product stock quantity is required'],
    min: [0, 'Stock cannot be negative']
  },
  ratings: {
    type: Number,
    default: 0
  },
  numOfReviews: {
    type: Number,
    default: 0
  },
  features: [{
    name: String,
    value: String
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Product', productSchema);
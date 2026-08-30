const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

const PRODUCTS_FILE = path.join(__dirname, '../data/products.json');

function getProducts() {
  try {
    const raw = fs.readFileSync(PRODUCTS_FILE, 'utf8');
    return JSON.parse(raw || '[]');
  } catch (err) {
    console.error('Error loading products:', err);
    return [];
  }
}

// GET all products with filtering, search, category, brand, sorting
router.get('/', (req, res) => {
  try {
    let products = getProducts();
    const { category, brand, gender, search, minPrice, maxPrice, sort, isSale, isFeatured, isBestSeller } = req.query;

    if (category && category !== 'All') {
      products = products.filter(p => p.category.toLowerCase() === category.toLowerCase());
    }

    if (brand && brand !== 'All') {
      products = products.filter(p => p.brand.toLowerCase() === brand.toLowerCase());
    }

    if (gender && gender !== 'All') {
      products = products.filter(p => p.gender.toLowerCase() === gender.toLowerCase() || p.gender.toLowerCase() === 'unisex');
    }

    if (search) {
      const q = search.toLowerCase().trim();
      products = products.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q)
      );
    }

    if (minPrice) {
      products = products.filter(p => p.price >= parseFloat(minPrice));
    }

    if (maxPrice) {
      products = products.filter(p => p.price <= parseFloat(maxPrice));
    }

    if (isSale === 'true') {
      products = products.filter(p => p.isOnSale || (p.discount && p.discount > 0));
    }

    if (isFeatured === 'true') {
      products = products.filter(p => p.isFeatured);
    }

    if (isBestSeller === 'true') {
      products = products.filter(p => p.isBestSeller);
    }

    // Sorting
    if (sort === 'price-low') {
      products.sort((a, b) => a.price - b.price);
    } else if (sort === 'price-high') {
      products.sort((a, b) => b.price - a.price);
    } else if (sort === 'rating') {
      products.sort((a, b) => b.rating - a.rating);
    } else if (sort === 'newest') {
      products.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
    }

    res.json({
      total: products.length,
      products
    });
  } catch (err) {
    console.error('Products error:', err);
    res.status(500).json({ error: 'Failed to fetch products.' });
  }
});

// GET single product by ID
router.get('/:id', (req, res) => {
  const products = getProducts();
  const product = products.find(p => p.id === req.params.id);
  if (!product) {
    return res.status(404).json({ error: 'Product not found.' });
  }
  res.json({ product });
});

// GET available categories
router.get('/meta/categories', (req, res) => {
  const products = getProducts();
  const categories = [
    { name: 'Running', image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=300&q=80', count: products.filter(p => p.category === 'Running').length },
    { name: 'Lifestyle', image: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=300&q=80', count: products.filter(p => p.category === 'Lifestyle').length },
    { name: 'Basketball', image: 'https://images.unsplash.com/photo-1575537302964-96cd47c06b1b?auto=format&fit=crop&w=300&q=80', count: products.filter(p => p.category === 'Basketball').length },
    { name: 'Training', image: 'https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?auto=format&fit=crop&w=300&q=80', count: products.filter(p => p.category === 'Training').length },
    { name: 'Sneakers', image: 'https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=300&q=80', count: products.filter(p => p.category === 'Sneakers').length },
    { name: 'Slides', image: 'https://images.unsplash.com/photo-1603808033192-082d6919d3e1?auto=format&fit=crop&w=300&q=80', count: products.filter(p => p.category === 'Slides').length },
    { name: 'Boots', image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=300&q=80', count: products.filter(p => p.category === 'Boots').length }
  ];
  res.json({ categories });
});

// GET available brands
router.get('/meta/brands', (req, res) => {
  const brands = [
    { name: 'Nike', slug: 'nike', tag: 'Just Do It' },
    { name: 'Adidas', slug: 'adidas', tag: 'Impossible Is Nothing' },
    { name: 'Puma', slug: 'puma', tag: 'Forever Faster' },
    { name: 'New Balance', slug: 'newbalance', tag: 'Fearlessly Independent' },
    { name: 'Converse', slug: 'converse', tag: 'All Star' },
    { name: 'Vans', slug: 'vans', tag: 'Off The Wall' },
    { name: 'Timberland', slug: 'timberland', tag: 'Original Yellow Boot' },
    { name: 'Jordan', slug: 'jordan', tag: 'Jumpman Heritage' }
  ];
  res.json({ brands });
});

module.exports = router;

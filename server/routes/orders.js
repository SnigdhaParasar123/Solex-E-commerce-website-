const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const ORDERS_FILE = path.join(__dirname, '../data/orders.json');
const MAIL_FILE = path.join(__dirname, '../data/mail_inbox.json');

function readData(file, defaultVal = []) {
  try {
    if (!fs.existsSync(file)) {
      fs.writeFileSync(file, JSON.stringify(defaultVal, null, 2));
      return defaultVal;
    }
    const raw = fs.readFileSync(file, 'utf8');
    return JSON.parse(raw || '[]');
  } catch (err) {
    return defaultVal;
  }
}

function writeData(file, data) {
  try {
    fs.writeFileSync(file, JSON.stringify(data, null, 2));
  } catch (err) {
    console.error('Error writing orders:', err);
  }
}

function sendOrderConfirmationEmail(order) {
  const inbox = readData(MAIL_FILE, []);
  const itemsList = order.items.map(item => `• ${item.name} (Size: US ${item.size}, Qty: ${item.quantity}) - $${(item.price * item.quantity).toFixed(2)}`).join('\n');
  const mailItem = {
    id: 'mail-' + uuidv4(),
    to: order.customer.email,
    subject: `SOLEX Order Confirmed #${order.orderNumber}`,
    type: 'order_confirmation',
    body: `Hi ${order.customer.firstName},\n\nThank you for stepping into greatness with SOLEX! Your order #${order.orderNumber} has been confirmed.\n\nORDER SUMMARY:\n${itemsList}\n\nSubtotal: $${order.pricing.subtotal.toFixed(2)}\nShipping: ${order.pricing.shipping === 0 ? 'FREE' : '$' + order.pricing.shipping.toFixed(2)}\nDiscount: -$${order.pricing.discount.toFixed(2)}\nEstimated Tax: $${order.pricing.tax.toFixed(2)}\nTOTAL: $${order.pricing.total.toFixed(2)}\n\nSHIPPING ADDRESS:\n${order.shippingAddress.address}, ${order.shippingAddress.city}, ${order.shippingAddress.state} ${order.shippingAddress.zipCode}\n\nEstimated Delivery: ${order.estimatedDelivery}\n\nTrack your order anytime in your SOLEX account dashboard.\n\nBest,\nThe SOLEX Team`,
    timestamp: new Date().toISOString(),
    read: false
  };
  inbox.unshift(mailItem);
  writeData(MAIL_FILE, inbox);
}

// POST create order
router.post('/', (req, res) => {
  try {
    const {
      userId,
      customer,
      items,
      shippingAddress,
      shippingMethod,
      paymentResult,
      pricing
    } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ error: 'Order must contain at least one item.' });
    }

    if (!customer || !customer.email || !shippingAddress) {
      return res.status(400).json({ error: 'Customer and shipping information are required.' });
    }

    const orderId = 'ORD-' + Math.floor(100000 + Math.random() * 900000);
    const trackingNumber = 'SLX-' + Math.random().toString(36).substring(2, 8).toUpperCase() + '-' + Math.floor(1000 + Math.random() * 9000);

    const deliveryDate = new Date();
    deliveryDate.setDate(deliveryDate.getDate() + (shippingMethod?.id === 'express' ? 2 : 4));

    const newOrder = {
      id: orderId,
      orderNumber: orderId,
      trackingNumber,
      userId: userId || 'guest',
      customer,
      items,
      shippingAddress,
      shippingMethod: shippingMethod || { name: 'Standard Delivery', price: 0 },
      payment: paymentResult || { paymentMethod: 'Card', status: 'succeeded' },
      pricing: {
        subtotal: pricing?.subtotal || 0,
        shipping: pricing?.shipping || 0,
        discount: pricing?.discount || 0,
        discountCode: pricing?.discountCode || '',
        tax: pricing?.tax || 0,
        total: pricing?.total || 0
      },
      status: 'Processing',
      timeline: [
        { status: 'Order Placed', time: new Date().toISOString(), completed: true, description: 'We have received your order.' },
        { status: 'Payment Verified', time: new Date().toISOString(), completed: true, description: 'Payment authorized successfully.' },
        { status: 'Preparing for Dispatch', time: null, completed: false, description: 'Our warehouse is packing your fresh kicks.' },
        { status: 'Shipped', time: null, completed: false, description: 'Carrier in transit.' },
        { status: 'Delivered', time: null, completed: false, description: 'Delivered to your doorstep.' }
      ],
      estimatedDelivery: deliveryDate.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' }),
      createdAt: new Date().toISOString()
    };

    const orders = readData(ORDERS_FILE, []);
    orders.unshift(newOrder);
    writeData(ORDERS_FILE, orders);

    // Send confirmation email
    sendOrderConfirmationEmail(newOrder);

    res.status(201).json({
      message: 'Order placed successfully!',
      order: newOrder
    });
  } catch (err) {
    console.error('Order creation error:', err);
    res.status(500).json({ error: 'Failed to create order.' });
  }
});

// GET orders for user
router.get('/user/:userId', (req, res) => {
  const orders = readData(ORDERS_FILE, []);
  const userOrders = orders.filter(o => o.userId === req.params.userId);
  res.json({ orders: userOrders });
});

// GET single order by ID or Tracking number
router.get('/:id', (req, res) => {
  const orders = readData(ORDERS_FILE, []);
  const order = orders.find(o => o.id === req.params.id || o.orderNumber === req.params.id || o.trackingNumber === req.params.id);
  if (!order) {
    return res.status(404).json({ error: 'Order not found.' });
  }
  res.json({ order });
});

module.exports = router;

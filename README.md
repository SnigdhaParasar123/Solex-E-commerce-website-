# 👟 SOLEX — Full-Stack E-Commerce Web Application

> 🛍️ **Step Into Greatness with SOLEX** — a modern footwear e-commerce platform designed to provide a smooth, interactive, and stylish online shopping experience.

SOLEX is a full-stack E-commerce footwear web application built with **HTML, CSS, JavaScript, Node.js, and Express.js**. The platform is designed around a modern sneaker-shopping experience with product browsing, authentication, cart and wishlist management, theme switching, checkout, and payment functionality.

---

## ✨ Features

### 🏠 Modern Homepage

- 🎯 Hero section with "Step Into Greatness" branding
- 👟 Featured footwear showcase
- 🏷️ Featured brands
- 🛍️ Shop by category
- 🔥 Best-selling products
- 💥 Limited-time sale section
- 📱 Responsive design for different screen sizes

### 👟 Product Catalog

- 🔎 Product search
- 🏷️ Category filtering
- 🏢 Brand filtering
- 💰 Price filtering
- 📊 Product sorting
- ⭐ Product ratings and reviews
- 🔥 Sale and discount labels
- 📦 Stock availability
- 👞 Multiple shoe sizes
- 🎨 Product color variants

### 🛒 Shopping Cart

- ➕ Add products to cart
- ➖ Increase/decrease product quantity
- 🗑️ Remove products
- 👟 Select shoe size
- 💰 Automatic subtotal calculation
- 🚚 Shipping calculation
- 🎟️ Promo/discount codes
- 📊 Free-shipping progress indicator
- 💳 Proceed to checkout

### ❤️ Wishlist

- ❤️ Add/remove products from wishlist
- 📋 Dedicated wishlist page
- 🛒 Move wishlist items directly to cart
- 📦 Display stock status
- 🔢 Wishlist item counter

### 🔐 Authentication

- 📝 User registration
- 🔑 User login
- 🚪 Logout
- 👤 User profile
- 🔒 Password management
- 🔄 Change password
- 📧 Forgot password functionality
- 🔗 Password reset flow
- 🎫 JWT-based authentication

### 🌙 Light & Dark Mode

- ☀️ Light theme
- 🌙 Dark theme
- ⚡ Instant theme switching
- 💾 Theme preference stored locally

### 💳 Checkout & Payments

The checkout system supports multiple payment methods:

- 💳 Credit/Debit Card
- 🅿️ PayPal
- 🍎 Apple Pay
- 💵 Cash on Delivery
- 🔐 Payment validation
- 🧾 Order receipt generation
- 📦 Order confirmation
- 🚚 Order tracking information

> ⚠️ Payment gateway functionality should use **sandbox/test credentials** during development. Never commit private API keys or secret credentials to GitHub.

---

# 🏗️ System Architecture

```mermaid
graph TD

    Client[🌐 HTML CSS JavaScript Frontend]
    API[🚀 Express.js REST API]
    DB[(🗄️ Database)]
    Auth[🔐 Authentication]
    Mail[📧 Email Service]
    Payment[💳 Payment Gateway]

    Client <--> API
    API <--> DB
    API <--> Auth
    API <--> Mail
    API <--> Payment

    subgraph Frontend
        Home[🏠 Homepage]
        Shop[👟 Shop]
        Product[🛍️ Product Details]
        Cart[🛒 Cart]
        Wishlist[❤️ Wishlist]
        Checkout[💳 Checkout]
        Profile[👤 Profile]
    end

    Client --> Home
    Client --> Shop
    Client --> Product
    Client --> Cart
    Client --> Wishlist
    Client --> Checkout
    Client --> Profile


SOLEX-E-commerce-website/
│
├── client/
│   ├── css/
│   │   ├── style.css
│   │   └── responsive.css
│   │
│   ├── js/
│   │   ├── script.js
│   │   ├── cart.js
│   │   ├── wishlist.js
│   │   └── auth.js
│   │
│   ├── images/
│   │   └── product-images/
│   │
│   └── index.html
│
├── server/
│   ├── data/
│   │   └── products.json
│   │
│   ├── routes/
│   │   ├── auth.js
│   │   ├── products.js
│   │   ├── orders.js
│   │   └── payment.js
│   │
│   └── index.js
│
├── .env
├── .gitignore
├── package.json
├── package-lock.json
└── README.md

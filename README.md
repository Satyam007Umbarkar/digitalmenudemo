# Savoria - Premium Digital Menu & Order Management System

Savoria is a modern, mobile-first web application designed for restaurants to provide a seamless digital menu and contactless ordering experience. It features a stunning dark-mode UI with glassmorphism design elements and operates entirely in the browser using `localStorage` and QR Code technology—**no backend or database required.**

---

## 🌟 Key Features

### 👨‍🍳 Customer Experience (Digital Menu)
* **Premium UI/UX:** A stunning, modern dark-mode aesthetic with smooth animations and glass-like components.
* **Smart Categorization & Search:** Customers can instantly filter the menu by category or search for specific dishes.
* **Rich Item Cards:** High-quality images, detailed descriptions, prices, and dietary badges (e.g., Popular, Veg, Spicy).
* **Frictionless Cart:** Easy "Add to Cart" functionality with quantity controls and a floating summary button.
* **Contactless Ordering:** Generates a dynamic QR code upon order placement.
* **No App Download Required:** Runs entirely in the mobile web browser.

### 🛎️ Staff Experience (Waiter Dashboard)
* **Secure Access:** Protected by a staff passcode (`1234567890`) to prevent unauthorized access.
* **Real-time Order Scanning:** Waiters can scan the customer's QR code using the device camera. The QR code magically transfers the entire order data to the waiter's device instantly!
* **Status Pipeline:** Orders can be moved through distinct stages: `New` ➔ `Accepted` ➔ `Preparing` ➔ `Ready` ➔ `Served`.
* **Order Notes:** Waiters can add critical notes (like Table Number, Family Name, or Special Requests) right from the dashboard, which are immediately visible on the outside of the order cards.
* **Quick Management:** One-tap buttons to clear specific sections or clear all orders at the end of a shift.
* **Live Dashboard Analytics:** A quick-glance stats bar showing how many orders are in each phase of preparation.

---

## ⚙️ How it Works (The Technical Magic)

Savoria is uniquely built to operate **100% offline and serverless**, eliminating server costs, database maintenance, and network latency issues.

1. **Local Storage Engine:** Everything happens locally on the device. When a customer adds items to their cart, it saves to their browser's local memory.
2. **Data-Encoded QR Codes:** When the customer places an order, the system compresses their entire cart (item IDs, quantities, timestamps) and encodes it directly into the QR code graphic. 
3. **Smart Decoding:** When the Waiter scans the QR code, the dashboard decodes the graphic, rebuilds the order using the restaurant's menu data, and syncs it into the Waiter's dashboard instantly.
4. **No Database Needed:** Because data is physically transferred via the QR code scan, the restaurant doesn't need to pay for cloud hosting or databases!

---

## 🚀 Setup & Usage Instructions

1. **Deploy:** Simply upload the 3 files (`index.html`, `style.css`, `script.js`) to any free static host (like GitHub Pages, Cloudflare Pages, or Netlify).
2. **Customer Flow:** 
   * Customers scan a static QR code on their physical table to open the website.
   * They browse, add items, and tap "Place Order".
   * A dynamic QR code is generated on their screen.
3. **Waiter Flow:**
   * Staff clicks the faint grey gear icon (bottom left) and enters the passcode (`1234567890`).
   * Tap **Scan QR** and point the camera at the customer's screen.
   * The order immediately appears in the Waiter Dashboard under the "New" tab!

---

## 💻 Tech Stack
* **HTML5:** Semantic, accessible structure.
* **Vanilla CSS3:** Custom variables, grid/flexbox layouts, responsive design, and CSS animations.
* **Vanilla JavaScript (ES6+):** Complete application logic, DOM manipulation, and state management.
* **Libraries:** `qrcode.js` (for QR generation) and `html5-qrcode` (for camera scanning).

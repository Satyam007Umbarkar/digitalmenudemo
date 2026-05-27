/* =============================================================
   SAVORIA — Digital Restaurant Menu  |  script.js
   Customer + Waiter mode, QR generation, QR scanning,
   Order management — all via localStorage, no backend.
   ============================================================= */

'use strict';

// ================================================================
// CONFIG
// ================================================================
const CFG = {
  PASSWORD:      '1234567890',
  KEY_ORDERS:    'savoria_orders',
  KEY_CART:      'savoria_cart',
  KEY_THEME:     'savoria_theme',
};

// ================================================================
// MENU DATA
// ================================================================
const CATEGORIES = [
  { id: 'all',      name: 'All Items',  icon: '🍽️' },
  { id: 'starters', name: 'Starters',   icon: '🥗' },
  { id: 'mains',    name: 'Mains',      icon: '🥩' },
  { id: 'pizza',    name: 'Pizza',      icon: '🍕' },
  { id: 'pasta',    name: 'Pasta',      icon: '🍝' },
  { id: 'desserts', name: 'Desserts',   icon: '🍰' },
  { id: 'drinks',   name: 'Drinks',     icon: '🥤' },
];

const MENU = [
  // ── Starters ──────────────────────────────────────────────────
  {
    id: 1, name: 'Bruschetta al Pomodoro', cat: 'starters', price: 8.99,
    desc: 'Grilled bread rubbed with garlic, topped with diced heirloom tomatoes, fresh basil and extra-virgin olive oil.',
    img: 'https://images.unsplash.com/photo-1572695157366-5e585ab2b69f?w=400&h=300&fit=crop&auto=format',
    popular: true, veg: true, emoji: '🥖'
  },
  {
    id: 2, name: 'Crispy Calamari', cat: 'starters', price: 12.99,
    desc: 'Golden-fried calamari rings with a light panko crust, served with house marinara and fresh lemon.',
    img: 'https://images.unsplash.com/photo-1625944525533-473f1a3d54e7?w=400&h=300&fit=crop&auto=format',
    popular: true, emoji: '🦑'
  },
  {
    id: 3, name: 'Burrata & Prosciutto', cat: 'starters', price: 14.99,
    desc: 'Creamy burrata mozzarella paired with aged prosciutto di Parma, rocket leaves and balsamic glaze.',
    img: 'https://images.unsplash.com/photo-1546793665-c74683f339c1?w=400&h=300&fit=crop&auto=format',
    emoji: '🧀'
  },
  {
    id: 4, name: 'French Onion Soup', cat: 'starters', price: 9.99,
    desc: 'Classic slow-caramelised onion broth topped with a toasted baguette crouton and melted Gruyère.',
    img: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400&h=300&fit=crop&auto=format',
    veg: true, emoji: '🥣'
  },

  // ── Mains ─────────────────────────────────────────────────────
  {
    id: 5, name: 'Grilled Ribeye Steak', cat: 'mains', price: 34.99,
    desc: '300g prime ribeye, grilled to your liking, served with truffle butter, confit potatoes and seasonal vegetables.',
    img: 'https://images.unsplash.com/photo-1544025162-d76538f9e304?w=400&h=300&fit=crop&auto=format',
    popular: true, emoji: '🥩'
  },
  {
    id: 6, name: 'Pan-Seared Salmon', cat: 'mains', price: 26.99,
    desc: 'Atlantic salmon fillet with crispy skin, lemon-caper butter sauce, asparagus and wild-rice pilaf.',
    img: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=400&h=300&fit=crop&auto=format',
    popular: true, emoji: '🐟'
  },
  {
    id: 7, name: 'Truffle Roast Chicken', cat: 'mains', price: 22.99,
    desc: 'Free-range half chicken roasted with black truffle butter under the skin, served with root vegetable purée.',
    img: 'https://images.unsplash.com/photo-1598103442097-8b74394b95c7?w=400&h=300&fit=crop&auto=format',
    emoji: '🍗'
  },
  {
    id: 8, name: 'Braised Short Rib', cat: 'mains', price: 29.99,
    desc: 'Slow-braised beef short rib in red wine reduction, served over silky mashed potatoes with gremolata.',
    img: 'https://images.unsplash.com/photo-1558030006-450675393462?w=400&h=300&fit=crop&auto=format',
    emoji: '🍖'
  },

  // ── Pizza ─────────────────────────────────────────────────────
  {
    id: 9, name: 'Margherita Classica', cat: 'pizza', price: 15.99,
    desc: 'San Marzano tomato base, fior di latte mozzarella, fresh basil and a drizzle of extra-virgin olive oil.',
    img: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&h=300&fit=crop&auto=format',
    popular: true, veg: true, emoji: '🍕'
  },
  {
    id: 10, name: 'Truffle Mushroom', cat: 'pizza', price: 18.99,
    desc: 'Wild mushrooms, black truffle cream, taleggio cheese and fresh thyme finished with truffle oil.',
    img: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&h=300&fit=crop&auto=format',
    veg: true, emoji: '🍕'
  },
  {
    id: 11, name: 'Pepperoni Supreme', cat: 'pizza', price: 16.99,
    desc: 'Double-layered premium pepperoni, mozzarella, roasted red capsicum and a spicy tomato base.',
    img: 'https://images.unsplash.com/photo-1534308983496-4fabb1a015ee?w=400&h=300&fit=crop&auto=format',
    spicy: true, emoji: '🍕'
  },
  {
    id: 12, name: 'Quattro Formaggi', cat: 'pizza', price: 17.99,
    desc: 'Four-cheese celebration — mozzarella, gorgonzola, fontina and pecorino romano on a cream base.',
    img: 'https://images.unsplash.com/photo-1571407970349-bc81e7e96d47?w=400&h=300&fit=crop&auto=format',
    veg: true, emoji: '🍕'
  },

  // ── Pasta ─────────────────────────────────────────────────────
  {
    id: 13, name: 'Spaghetti Carbonara', cat: 'pasta', price: 16.99,
    desc: 'Silky egg-yolk and pecorino sauce with crispy guanciale and freshly cracked black pepper.',
    img: 'https://images.unsplash.com/photo-1621996346565-ead343701eea?w=400&h=300&fit=crop&auto=format',
    popular: true, emoji: '🍝'
  },
  {
    id: 14, name: 'Penne Arrabiata', cat: 'pasta', price: 14.99,
    desc: 'Fiery San Marzano tomato sauce with garlic, chilli flakes and fresh flat-leaf parsley. Vegan.',
    img: 'https://images.unsplash.com/photo-1563379926898-05f4575a45d8?w=400&h=300&fit=crop&auto=format',
    veg: true, spicy: true, emoji: '🍝'
  },
  {
    id: 15, name: 'Lobster Linguine', cat: 'pasta', price: 28.99,
    desc: 'Fresh lobster tail with cherry tomatoes, chilli, bisque-butter sauce over silky linguine.',
    img: 'https://images.unsplash.com/photo-1612929633738-8fe44f7ec841?w=400&h=300&fit=crop&auto=format',
    emoji: '🦞'
  },
  {
    id: 16, name: 'Ravioli al Burro', cat: 'pasta', price: 15.99,
    desc: 'Handmade ricotta & spinach ravioli tossed in brown butter and sage, topped with toasted pine nuts.',
    img: 'https://images.unsplash.com/photo-1598866594230-a7c12756260f?w=400&h=300&fit=crop&auto=format',
    veg: true, emoji: '🍝'
  },

  // ── Desserts ──────────────────────────────────────────────────
  {
    id: 17, name: 'Tiramisu Classico', cat: 'desserts', price: 9.99,
    desc: 'Layers of mascarpone cream and espresso-soaked Savoiardi, dusted with premium Valrhona cocoa.',
    img: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=400&h=300&fit=crop&auto=format',
    popular: true, veg: true, emoji: '🍮'
  },
  {
    id: 18, name: 'Crème Brûlée', cat: 'desserts', price: 8.99,
    desc: 'Vanilla bean custard beneath a perfectly torched caramelised sugar crust. Timeless and elegant.',
    img: 'https://images.unsplash.com/photo-1470124182917-cc6e71b22ecc?w=400&h=300&fit=crop&auto=format',
    veg: true, emoji: '🍮'
  },
  {
    id: 19, name: 'Dark Chocolate Fondant', cat: 'desserts', price: 10.99,
    desc: 'Warm 70% bittersweet chocolate cake with a molten centre, paired with vanilla bean ice cream.',
    img: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476f?w=400&h=300&fit=crop&auto=format',
    veg: true, emoji: '🍫'
  },
  {
    id: 20, name: 'Panna Cotta', cat: 'desserts', price: 7.99,
    desc: 'Silky Italian vanilla cream, gently set and topped with vibrant mixed-berry coulis.',
    img: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400&h=300&fit=crop&auto=format',
    veg: true, emoji: '🍮'
  },

  // ── Drinks ────────────────────────────────────────────────────
  {
    id: 21, name: 'Sparkling Lemonade', cat: 'drinks', price: 4.99,
    desc: 'House-squeezed lemon juice, elderflower cordial, fresh mint and sparkling water. Refreshing.',
    img: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=400&h=300&fit=crop&auto=format',
    veg: true, emoji: '🍋'
  },
  {
    id: 22, name: 'Mango Passionfruit Mocktail', cat: 'drinks', price: 5.99,
    desc: 'Blended mango with passionfruit syrup, fresh lime and sparkling water. Tropical and vibrant.',
    img: 'https://images.unsplash.com/photo-1546171753-97d7676e4602?w=400&h=300&fit=crop&auto=format',
    popular: true, veg: true, emoji: '🥭'
  },
  {
    id: 23, name: 'Espresso Martini', cat: 'drinks', price: 12.99,
    desc: 'Premium vodka, freshly pulled espresso, Kahlúa and sugar syrup — shaken until velvety.',
    img: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=400&h=300&fit=crop&auto=format',
    emoji: '🍸'
  },
  {
    id: 24, name: 'Craft Lager', cat: 'drinks', price: 7.99,
    desc: 'Locally brewed craft lager, crisp and clean. Ask your waiter about today\'s tap selection.',
    img: 'https://images.unsplash.com/photo-1535958636474-b021ee887b13?w=400&h=300&fit=crop&auto=format',
    emoji: '🍺'
  },
];

// ================================================================
// APP STATE
// ================================================================
const S = {
  cart:        {},   // { itemId(str): quantity }
  category:    'all',
  query:       '',
  view:        'home',
  waiterTab:   'new',
  waiterOId:   null, // currently viewed order in waiter mode
  scanner:     null, // Html5Qrcode instance
  scanning:    false,
  unlocked:    false,
};

// ================================================================
// LOCAL STORAGE HELPERS
// ================================================================
function getOrders() {
  try { return JSON.parse(localStorage.getItem(CFG.KEY_ORDERS)) || {}; }
  catch { return {}; }
}
function saveOrders(o) { localStorage.setItem(CFG.KEY_ORDERS, JSON.stringify(o)); }

function loadCart() {
  try { return JSON.parse(localStorage.getItem(CFG.KEY_CART)) || {}; }
  catch { return {}; }
}
function persistCart() { localStorage.setItem(CFG.KEY_CART, JSON.stringify(S.cart)); }

// ================================================================
// THEME
// ================================================================
function initTheme() {
  const saved = localStorage.getItem(CFG.KEY_THEME) || 'dark';
  applyTheme(saved);
}
function toggleTheme() {
  const cur = document.documentElement.getAttribute('data-theme');
  applyTheme(cur === 'dark' ? 'light' : 'dark');
}
function applyTheme(t) {
  document.documentElement.setAttribute('data-theme', t);
  localStorage.setItem(CFG.KEY_THEME, t);
  const moon = document.getElementById('icon-moon');
  const sun  = document.getElementById('icon-sun');
  if (moon) moon.classList.toggle('hidden', t === 'light');
  if (sun)  sun.classList.toggle('hidden',  t === 'dark');
}

// ================================================================
// TOAST
// ================================================================
let _toastTimer = null;
function toast(msg, type = 'success') {
  const el = document.getElementById('toast');
  el.textContent = msg;
  el.className = `toast show ${type}`;
  clearTimeout(_toastTimer);
  _toastTimer = setTimeout(() => el.classList.remove('show'), 2600);
}

// ================================================================
// VIEW ROUTER
// ================================================================
function showView(id) {
  document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
  const el = document.getElementById(`view-${id}`);
  if (el) { el.classList.add('active'); window.scrollTo(0, 0); }
  S.view = id;
  // FAB visibility
  const isCustomer = ['home'].includes(id);
  const isWaiter   = ['waiter', 'scanner', 'order-detail'].includes(id);
  document.getElementById('cart-fab').classList.toggle('hidden', !isCustomer || cartCount() === 0);
  document.getElementById('admin-fab').classList.toggle('hidden', isWaiter);
}

// ================================================================
// CART HELPERS
// ================================================================
function cartCount() {
  return Object.values(S.cart).reduce((a, b) => a + b, 0);
}
function cartTotal() {
  return Object.entries(S.cart).reduce((sum, [id, qty]) => {
    const item = MENU.find(m => m.id === +id);
    return sum + (item ? item.price * qty : 0);
  }, 0);
}
function addToCart(id) {
  S.cart[id] = (S.cart[id] || 0) + 1;
  persistCart(); refreshCartFAB();
}
function setQty(id, delta) {
  const next = (S.cart[id] || 0) + delta;
  if (next <= 0) delete S.cart[id];
  else S.cart[id] = next;
  persistCart(); refreshCartFAB();
}
function clearCart() {
  S.cart = {}; persistCart(); refreshCartFAB();
}
function refreshCartFAB() {
  const n   = cartCount();
  const fab = document.getElementById('cart-fab');
  fab.classList.toggle('hidden', S.view !== 'home' || n === 0);
  document.getElementById('cart-count').textContent = n;
}
function fmt(n) { return '$' + n.toFixed(2); }
function fmtTime(ts) {
  return new Date(ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

// ================================================================
// IMAGE HTML HELPER
// ================================================================
function imgHtml(item, wrapCls, imgCls) {
  if (!item.img) {
    return `<div class="${wrapCls}"><div class="${imgCls}-placeholder">${item.emoji||'🍽️'}</div></div>`;
  }
  return `
    <div class="${wrapCls}">
      <img class="${imgCls}" src="${item.img}" alt="${escHtml(item.name)}" loading="lazy"
           onerror="this.style.display='none';this.nextElementSibling.style.display='flex'">
      <div class="${imgCls}-placeholder" style="display:none">${item.emoji||'🍽️'}</div>
    </div>`;
}
function escHtml(s) {
  return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

// ================================================================
// RENDER — CATEGORIES
// ================================================================
function renderCategories() {
  document.getElementById('categories-scroll').innerHTML =
    CATEGORIES.map(c => `
      <button class="cat-chip${S.category===c.id?' active':''}"
              data-cat="${c.id}" role="listitem"
              aria-pressed="${S.category===c.id}">
        <span class="cat-emoji">${c.icon}</span>${c.name}
      </button>`).join('');
}

// ================================================================
// RENDER — POPULAR SCROLL
// ================================================================
function renderPopular() {
  const popular = MENU.filter(i => i.popular);
  document.getElementById('popular-scroll').innerHTML = popular.map(item => {
    const qty = S.cart[item.id] || 0;
    return `
      <div class="pop-card" data-id="${item.id}" role="listitem">
        <div class="pop-popular-badge">★ Popular</div>
        ${imgHtml(item, 'pop-card-img-wrap', 'pop-card-img')}
        <div class="pop-card-body">
          <div class="pop-card-name">${escHtml(item.name)}</div>
          <div class="pop-card-footer">
            <span class="pop-card-price">${fmt(item.price)}</span>
            <div>
              <button class="add-btn pop-add${qty>0?' hidden':''}"
                      data-id="${item.id}" aria-label="Add ${escHtml(item.name)}">+</button>
              <div class="qty-controls pop-qty${qty>0?'':' hidden'}" data-id="${item.id}">
                <button class="qty-btn" data-action="dec" data-id="${item.id}" aria-label="Remove one">−</button>
                <span class="qty-display">${qty}</span>
                <button class="qty-btn" data-action="inc" data-id="${item.id}" aria-label="Add one">+</button>
              </div>
            </div>
          </div>
        </div>
      </div>`;
  }).join('');
}

// ================================================================
// RENDER — MENU GRID
// ================================================================
function renderMenu() {
  const q   = S.query.trim().toLowerCase();
  const cat = S.category;

  let items = MENU;
  if (cat !== 'all') items = items.filter(i => i.cat === cat);
  if (q)             items = items.filter(i =>
    i.name.toLowerCase().includes(q) ||
    i.desc.toLowerCase().includes(q) ||
    i.cat.toLowerCase().includes(q)
  );

  // Section visibility
  const showPop = cat === 'all' && !q;
  document.getElementById('popular-section').classList.toggle('hidden', !showPop);

  // Heading
  const hd = document.getElementById('menu-heading');
  if (cat !== 'all') {
    const c = CATEGORIES.find(x => x.id === cat);
    hd.textContent = `${c.icon} ${c.name}`;
  } else if (q) {
    hd.textContent = `🔍 Results for "${S.query}"`;
  } else {
    hd.textContent = '🍽️ Full Menu';
  }

  const grid    = document.getElementById('menu-grid');
  const noFound = document.getElementById('no-results');

  if (!items.length) {
    grid.innerHTML = '';
    noFound.classList.remove('hidden');
    return;
  }
  noFound.classList.add('hidden');

  grid.innerHTML = items.map(item => {
    const qty  = S.cart[item.id] || 0;
    const bdgs = [
      item.popular ? '<span class="badge badge-popular">★ Popular</span>' : '',
      item.veg     ? '<span class="badge badge-veg">🌿 Veg</span>'       : '',
      item.spicy   ? '<span class="badge badge-spicy">🌶️ Spicy</span>'  : '',
    ].filter(Boolean).join('');

    return `
      <article class="menu-card" data-id="${item.id}" role="listitem">
        ${imgHtml(item, 'menu-card-img-wrap', 'menu-card-img')}
        ${bdgs ? `<div class="card-badges">${bdgs}</div>` : ''}
        <div class="menu-card-body">
          <div class="menu-card-name">${escHtml(item.name)}</div>
          <div class="menu-card-desc">${escHtml(item.desc)}</div>
          <div class="menu-card-footer">
            <span class="menu-card-price">${fmt(item.price)}</span>
            <div>
              <button class="add-btn${qty>0?' hidden':''}"
                      data-id="${item.id}" aria-label="Add ${escHtml(item.name)} to order">+</button>
              <div class="qty-controls${qty>0?'':' hidden'}" data-id="${item.id}">
                <button class="qty-btn" data-action="dec" data-id="${item.id}" aria-label="Decrease quantity">−</button>
                <span class="qty-display">${qty}</span>
                <button class="qty-btn" data-action="inc" data-id="${item.id}" aria-label="Increase quantity">+</button>
              </div>
            </div>
          </div>
        </div>
      </article>`;
  }).join('');
}

// ================================================================
// RENDER — CART
// ================================================================
function renderCart() {
  const entries = Object.entries(S.cart).filter(([,q]) => q > 0);
  const body    = document.getElementById('cart-body');

  if (!entries.length) {
    body.innerHTML = `
      <div class="cart-empty">
        <div class="cart-empty-icon">🛒</div>
        <h3>Your order is empty</h3>
        <p>Add some dishes from our menu</p>
        <button class="btn btn-primary" style="margin-top:18px"
                onclick="showView('home');renderMenu();renderCategories();renderPopular()">Browse Menu</button>
      </div>`;
    return;
  }

  const sub   = cartTotal();
  const tax   = sub * 0.10;
  const total = sub + tax;

  const itemsHtml = entries.map(([id, qty]) => {
    const item = MENU.find(m => m.id === +id);
    if (!item) return '';
    const sub = item.price * qty;
    return `
      <div class="cart-item" data-id="${id}">
        ${item.img
          ? `<img class="cart-item-img" src="${item.img}" alt="${escHtml(item.name)}" loading="lazy"
                  onerror="this.style.display='none';this.nextElementSibling.style.display='flex'">
             <div class="cart-item-img-ph" style="display:none">${item.emoji||'🍽️'}</div>`
          : `<div class="cart-item-img-ph">${item.emoji||'🍽️'}</div>`}
        <div class="cart-item-info">
          <div class="cart-item-name">${escHtml(item.name)}</div>
          <div class="cart-item-unit">${fmt(item.price)} each</div>
          <div class="cart-qty-row">
            <button class="cart-qty-btn" data-action="dec" data-id="${id}" aria-label="Decrease">−</button>
            <span class="cart-qty-num">${qty}</span>
            <button class="cart-qty-btn" data-action="inc" data-id="${id}" aria-label="Increase">+</button>
          </div>
        </div>
        <div class="cart-item-sub">${fmt(sub)}</div>
      </div>`;
  }).join('');

  body.innerHTML = `
    <div class="cart-items-list">${itemsHtml}</div>
    <div class="order-summary-card">
      <div class="order-summary-title">Order Summary</div>
      <div class="summary-row">
        <span>Subtotal (${cartCount()} item${cartCount()!==1?'s':''})</span>
        <span>${fmt(sub)}</span>
      </div>
      <div class="summary-row">
        <span>Service tax (10%)</span>
        <span>${fmt(tax)}</span>
      </div>
      <div class="summary-row total">
        <span>Total</span>
        <span class="total-amt">${fmt(total)}</span>
      </div>
    </div>
    <div class="place-order-wrap">
      <button class="btn btn-primary btn-block" id="place-order-btn">
        🎯 Place Order — ${fmt(total)}
      </button>
    </div>`;

  // Attach cart quantity listeners
  body.querySelectorAll('.cart-qty-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      setQty(btn.dataset.id, btn.dataset.action === 'inc' ? 1 : -1);
      renderCart();
    });
  });
  document.getElementById('place-order-btn').addEventListener('click', placeOrder);
}

// ================================================================
// PLACE ORDER
// ================================================================
function generateOrderId() {
  const orders = getOrders();
  let id;
  do { id = String(Math.floor(1000 + Math.random() * 9000)); }
  while (orders[id]);
  return id;
}

function placeOrder() {
  const entries = Object.entries(S.cart).filter(([,q]) => q > 0);
  if (!entries.length) { toast('Your cart is empty!', 'error'); return; }

  const orderId = generateOrderId();
  const sub     = cartTotal();
  const tax     = sub * 0.10;
  const total   = sub + tax;

  const items = entries.map(([id, qty]) => {
    const item = MENU.find(m => m.id === +id);
    return { id: +id, name: item.name, price: item.price, qty, sub: item.price * qty };
  });

  const order = { orderId, items, sub, tax, total, ts: Date.now(), status: 'new' };
  const orders = getOrders();
  orders[orderId] = order;
  saveOrders(orders);

  clearCart();
  showOrderSuccess(order);
}

// ================================================================
// ORDER SUCCESS — QR SCREEN
// ================================================================
function showOrderSuccess(order) {
  showView('order-success');

  const itemsHtml = order.items.map(i => `
    <div class="s-row">
      <div>
        <div class="s-name">${escHtml(i.name)}</div>
        <div class="s-qty">× ${i.qty}</div>
      </div>
      <div class="s-price">${fmt(i.sub)}</div>
    </div>`).join('');

  document.getElementById('success-body').innerHTML = `
    <div class="success-check" role="img" aria-label="Order confirmed">✓</div>
    <h2 class="success-title">Order Placed!</h2>
    <p class="success-sub">Your order is on its way to the kitchen</p>

    <div class="qr-card">
      <div class="qr-label">Show to your waiter</div>
      <div class="qr-wrap">
        <div id="qr-code-display"></div>
      </div>
      <div class="order-id-row">
        <span class="order-id-lbl">Order #</span>
        <span class="order-id-val">${order.orderId}</span>
        <button class="copy-id-btn" onclick="copyOrderId('${order.orderId}')" aria-label="Copy order ID">Copy</button>
      </div>
    </div>

    <div class="qr-hint">
      📱 Show this QR code or Order ID — <strong>#${order.orderId}</strong> — to the waiter
    </div>

    <div class="success-summary">
      <div class="success-summary-hd">Order Summary</div>
      <div class="success-summary-body">
        ${itemsHtml}
        <div class="s-row" style="margin-top:8px;border-top:1px solid var(--border);padding-top:12px">
          <div class="s-name" style="color:var(--text-muted)">Tax (10%)</div>
          <div class="s-price" style="color:var(--text-muted)">${fmt(order.tax)}</div>
        </div>
        <div class="s-row" style="font-size:17px;font-weight:700">
          <div class="s-name">Total</div>
          <div class="s-price" style="color:var(--accent)">${fmt(order.total)}</div>
        </div>
      </div>
    </div>

    <button class="btn btn-ghost btn-block" style="margin-top:8px"
            onclick="showView('home');renderMenu();renderCategories();renderPopular()">
      ← Back to Menu
    </button>`;

  // Generate QR code with a small delay to ensure DOM is ready
  setTimeout(() => {
    try {
      const container = document.getElementById('qr-code-display');
      if (!container) return;
      container.innerHTML = '';
      if (typeof QRCode !== 'undefined') {
        const qrData = {
          oId: order.orderId,
          ts: order.ts,
          i: order.items.map(item => ({ id: item.id, q: item.qty }))
        };
        new QRCode(container, {
          text:         JSON.stringify(qrData),
          width:        200,
          height:       200,
          colorDark:    '#000000',
          colorLight:   '#ffffff',
          correctLevel: QRCode.CorrectLevel.L,
        });
      } else {
        container.innerHTML = `<div style="padding:16px;font-size:13px;color:#888;text-align:center">
          QR library loading…<br>Use Order ID: <strong>${order.orderId}</strong></div>`;
      }
    } catch(e) { console.error('QR gen error:', e); }
  }, 350);
}

function copyOrderId(id) {
  navigator.clipboard?.writeText(id)
    .then(() => toast('Order ID copied!'))
    .catch(() => toast('Order ID: ' + id, 'info'));
}

// ================================================================
// PASSWORD MODAL
// ================================================================
function openModal() {
  const modal = document.getElementById('password-modal');
  modal.classList.remove('hidden');
  const inp = document.getElementById('staff-password');
  inp.value = '';
  document.getElementById('modal-error').classList.add('hidden');
  setTimeout(() => inp.focus(), 80);
}
function closeModal() {
  document.getElementById('password-modal').classList.add('hidden');
}
function checkPassword() {
  const inp = document.getElementById('staff-password');
  const err = document.getElementById('modal-error');
  if (inp.value === CFG.PASSWORD) {
    closeModal();
    S.unlocked = true;
    enterWaiter();
  } else {
    err.classList.remove('hidden');
    inp.value = '';
    inp.classList.remove('shake');
    // Force reflow so animation restarts
    void inp.offsetWidth;
    inp.classList.add('shake');
    setTimeout(() => inp.classList.remove('shake'), 400);
    inp.focus();
  }
}

// ================================================================
// WAITER MODE
// ================================================================
function enterWaiter() {
  showView('waiter');
  S.waiterTab = 'new';
  // Reset tab UI
  document.querySelectorAll('.tab-btn').forEach(t => t.classList.remove('active'));
  const defTab = document.querySelector('.tab-btn[data-status="new"]');
  if (defTab) defTab.classList.add('active');
  renderWaiter();
}

function exitWaiter() {
  S.unlocked = false;
  stopScanner();
  showView('home');
  renderCategories();
  renderPopular();
  renderMenu();
}

function renderWaiter() {
  renderStats();
  renderTabBadges();
  renderOrders();
}

function renderStats() {
  const orders  = getOrders();
  const all     = Object.values(orders);
  const counts  = {
    new:       all.filter(o => o.status === 'new').length,
    accepted:  all.filter(o => o.status === 'accepted').length,
    preparing: all.filter(o => o.status === 'preparing').length,
    ready:     all.filter(o => o.status === 'ready').length,
    served:    all.filter(o => o.status === 'served').length,
  };
  const labels = { new:'New', accepted:'Accepted', preparing:'Preparing', ready:'Ready', served:'Served' };
  document.getElementById('stats-bar').innerHTML =
    Object.keys(counts).map(s => `
      <div class="stat-card s-${s}" role="group" aria-label="${labels[s]} orders">
        <div class="stat-num">${counts[s]}</div>
        <div class="stat-lbl">${labels[s]}</div>
      </div>`).join('');
}

function renderTabBadges() {
  const orders = getOrders();
  const all    = Object.values(orders);
  ['new','accepted','preparing','ready','served'].forEach(s => {
    const el = document.getElementById(`badge-${s}`);
    if (el) el.textContent = all.filter(o => o.status === s).length;
  });
}

function renderOrders() {
  const orders   = getOrders();
  const filtered = Object.values(orders)
    .filter(o => o.status === S.waiterTab)
    .sort((a, b) => b.ts - a.ts);

  const container = document.getElementById('orders-list');

  if (!filtered.length) {
    const icons = { new:'📋', accepted:'✅', preparing:'👨‍🍳', ready:'🔔', served:'✅' };
    container.innerHTML = `
      <div class="empty-orders">
        <div class="empty-orders-icon">${icons[S.waiterTab] || '📋'}</div>
        <p>No <strong>${S.waiterTab}</strong> orders right now</p>
      </div>`;
    return;
  }

  const pillClass = { new:'pill-new', accepted:'pill-accepted', preparing:'pill-preparing', ready:'pill-ready', served:'pill-served' };
  const pillLabel = { new:'New', accepted:'Accepted', preparing:'Preparing', ready:'Ready', served:'Served' };

  container.innerHTML = filtered.map(o => {
    const preview = o.items.slice(0,2).map(i => `${i.name} ×${i.qty}`).join(', ')
      + (o.items.length > 2 ? ` +${o.items.length-2} more` : '');
    return `
      <div class="order-card" data-order-id="${o.orderId}"
           role="button" tabindex="0" aria-label="Order ${o.orderId}"
           onclick="openOrderDetail('${o.orderId}')">
        <div class="order-card-head">
          <div class="order-card-id-row">
            <span class="order-num-tag">#${o.orderId}</span>
            <span class="order-time-tag">${fmtTime(o.ts)}</span>
          </div>
          <span class="status-pill ${pillClass[o.status]}">${pillLabel[o.status]}</span>
        </div>
        <div class="order-card-body">
          <div class="order-preview">${escHtml(preview)}</div>
        </div>
        <div class="order-card-foot">
          <span class="order-total-tag">${fmt(o.total)}</span>
          <span class="order-count-tag">${o.items.length} dish${o.items.length!==1?'es':''}</span>
        </div>
      </div>`;
  }).join('');
}

// ================================================================
// ORDER DETAIL (Waiter)
// ================================================================
function openOrderDetail(orderId) {
  S.waiterOId = orderId;
  const orders = getOrders();
  const order  = orders[orderId];
  if (!order) { toast('Order not found', 'error'); return; }
  showView('order-detail');
  renderOrderDetail(order);
}

function renderOrderDetail(order) {
  const itemsHtml = order.items.map(i => `
    <div class="detail-item">
      <div class="di-name">${escHtml(i.name)}</div>
      <div class="di-right">
        <span class="di-qty">×${i.qty}</span>
        <span class="di-sub">${fmt(i.sub)}</span>
      </div>
    </div>`).join('');

  const statusInfo = {
    new:       { label:'New Order',      pill:'pill-new' },
    accepted:  { label:'Accepted',       pill:'pill-accepted' },
    preparing: { label:'Preparing',      pill:'pill-preparing' },
    ready:     { label:'Ready to Serve', pill:'pill-ready' },
    served:    { label:'Served',         pill:'pill-served' },
  };
  const si = statusInfo[order.status] || statusInfo.new;

  const actionBtns = [
    { status:'accepted',  label:'✓ Accept',      cls:'btn-s-accept' },
    { status:'preparing', label:'👨‍🍳 Preparing', cls:'btn-s-prepare' },
    { status:'ready',     label:'🔔 Ready',       cls:'btn-s-ready' },
    { status:'served',    label:'✅ Served',      cls:'btn-s-served' },
  ];

  document.getElementById('order-detail-body').innerHTML = `
    <!-- Order Info -->
    <div class="detail-block">
      <div class="detail-block-title">Order Info</div>
      <div class="detail-info-grid">
        <div class="detail-info-cell">
          <div class="dic-label">Order ID</div>
          <div class="dic-value accent">#${order.orderId}</div>
        </div>
        <div class="detail-info-cell">
          <div class="dic-label">Status</div>
          <div class="dic-value">
            <span class="status-pill ${si.pill}">${si.label}</span>
          </div>
        </div>
        <div class="detail-info-cell">
          <div class="dic-label">Time</div>
          <div class="dic-value" style="font-size:14px">${fmtTime(order.ts)}</div>
        </div>
        <div class="detail-info-cell">
          <div class="dic-label">Dishes</div>
          <div class="dic-value">${order.items.length}</div>
        </div>
      </div>
    </div>

    <!-- Description / Notes -->
    <div class="detail-block">
      <div class="detail-block-title">Customer / Order Notes</div>
      <div style="padding: 0 var(--sp-md) 14px;">
        <textarea id="order-notes-input" class="order-note-input" placeholder="E.g. Family name, table number, special requests...">${order.notes || ''}</textarea>
      </div>
    </div>

    <!-- Items -->
    <div class="detail-block">
      <div class="detail-block-title">Ordered Items</div>
      ${itemsHtml}
      <div class="detail-total">
        <span class="dt-label">Total</span>
        <span class="dt-value">${fmt(order.total)}</span>
      </div>
    </div>

    <!-- Status Actions -->
    <div class="detail-block">
      <div class="detail-block-title">Update Status</div>
      <div class="status-actions">
        ${actionBtns.map(a => `
          <button class="btn ${a.cls}${order.status===a.status?' on':''}"
                  onclick="updateStatus('${order.orderId}','${a.status}')"
                  aria-pressed="${order.status===a.status}">
            ${a.label}
          </button>`).join('')}
      </div>
    </div>`;

  document.getElementById('order-notes-input').addEventListener('input', (e) => {
    const orders = getOrders();
    if (orders[order.orderId]) {
      orders[order.orderId].notes = e.target.value;
      saveOrders(orders);
    }
  });
}

function updateStatus(orderId, newStatus) {
  const orders = getOrders();
  if (!orders[orderId]) return;
  orders[orderId].status = newStatus;
  saveOrders(orders);
  renderOrderDetail(orders[orderId]);
  const labels = { accepted:'Accepted', preparing:'Preparing', ready:'Ready to serve!', served:'Served ✓' };
  toast(`Status updated: ${labels[newStatus] || newStatus}`);
}

// ================================================================
// MANUAL ORDER LOOKUP
// ================================================================
function lookupOrder() {
  const inp  = document.getElementById('manual-order-id');
  const id   = (inp.value || '').trim();
  if (!id) { toast('Enter an Order ID', 'error'); return; }
  const orders = getOrders();
  if (orders[id]) {
    inp.value = '';
    openOrderDetail(id);
  } else {
    toast(`Order #${id} not found`, 'error');
  }
}

// ================================================================
// QR SCANNER
// ================================================================
function openScanner() {
  showView('scanner');
  document.getElementById('scanner-status').textContent = '';
  document.getElementById('qr-reader').innerHTML = '';
  S.scanning = false;
  startScanner();
}

function startScanner() {
  if (typeof Html5Qrcode === 'undefined') {
    document.getElementById('scanner-status').textContent =
      'QR scanner not available. Please use manual Order ID entry.';
    return;
  }
  try {
    S.scanner = new Html5Qrcode('qr-reader');
    S.scanner.start(
      { facingMode: 'environment' },
      { fps: 10, qrbox: { width: 240, height: 240 } },
      (text) => {
        // Success callback
        if (S.scanning) return; // already handled
        S.scanning = true;
        S.scanner.stop().catch(() => {});
        handleQRScan(text);
      },
      () => {} // Scan failure — fires continuously, ignore
    ).then(() => {
      S.scanning = false;
    }).catch(err => {
      document.getElementById('scanner-status').textContent =
        'Camera not available. Please use manual entry.';
      console.warn('QR Scanner:', err);
    });
  } catch(e) {
    document.getElementById('scanner-status').textContent =
      'Could not start scanner. Please use manual entry.';
    console.error(e);
  }
}

function stopScanner() {
  if (S.scanner) {
    S.scanner.stop().catch(() => {});
    S.scanner = null;
  }
  S.scanning = false;
}

function handleQRScan(text) {
  const statusEl = document.getElementById('scanner-status');
  try {
    const data = JSON.parse(text);
    const oId = data.oId || data.orderId;
    
    if (oId) {
      if (data.i) {
        const orders = getOrders();
        if (!orders[oId]) {
          let sub = 0;
          const items = data.i.map(it => {
            const menuIt = MENU.find(m => m.id === it.id);
            const price = menuIt ? menuIt.price : 0;
            const name = menuIt ? menuIt.name : 'Unknown';
            const itemSub = price * it.q;
            sub += itemSub;
            return { id: it.id, name, price, qty: it.q, sub: itemSub };
          });
          const tax = sub * 0.10;
          orders[oId] = {
            orderId: oId,
            items: items,
            sub: sub,
            tax: tax,
            total: sub + tax,
            ts: data.ts || Date.now(),
            status: 'new'
          };
          saveOrders(orders);
        }
      }

      statusEl.innerHTML = `<span style="color:var(--success)">✓ Found Order #${oId}</span>`;
      setTimeout(() => openOrderDetail(oId), 700);
    } else {
      statusEl.textContent = 'QR code does not contain an order.';
      S.scanning = false;
    }
  } catch {
    statusEl.textContent = 'Unrecognised QR code. Try manual entry.';
    S.scanning = false;
  }
}

// ================================================================
// EVENT LISTENERS
// ================================================================
function initEvents() {
  // Theme toggle
  document.getElementById('theme-toggle').addEventListener('click', toggleTheme);

  // Admin FAB → open password modal (or re-enter waiter if already unlocked)
  document.getElementById('admin-fab').addEventListener('click', () => {
    if (S.unlocked) enterWaiter();
    else openModal();
  });

  // Cart FAB → go to cart
  document.getElementById('cart-fab').addEventListener('click', () => {
    showView('cart');
    renderCart();
  });

  // --- Modal ---
  document.getElementById('modal-cancel-btn').addEventListener('click', closeModal);
  document.getElementById('modal-confirm-btn').addEventListener('click', checkPassword);
  document.getElementById('staff-password').addEventListener('keydown', e => {
    if (e.key === 'Enter') checkPassword();
  });
  document.getElementById('password-modal').addEventListener('click', e => {
    if (e.target === e.currentTarget) closeModal();
  });

  // --- Back buttons ---
  document.getElementById('cart-back').addEventListener('click', () => {
    showView('home'); renderMenu();
  });
  document.getElementById('success-back').addEventListener('click', () => {
    showView('home'); renderMenu(); renderCategories(); renderPopular();
  });
  document.getElementById('detail-back').addEventListener('click', () => {
    showView('waiter'); renderWaiter();
  });
  document.getElementById('scanner-back').addEventListener('click', () => {
    stopScanner(); showView('waiter'); renderWaiter();
  });

  // --- Search ---
  const searchInput = document.getElementById('search-input');
  const clearBtn    = document.getElementById('search-clear');
  searchInput.addEventListener('input', () => {
    S.query    = searchInput.value;
    S.category = 'all';
    clearBtn.classList.toggle('hidden', !S.query);
    renderCategories();
    renderMenu();
  });
  clearBtn.addEventListener('click', () => {
    searchInput.value = '';
    S.query = '';
    clearBtn.classList.add('hidden');
    renderCategories();
    renderMenu();
    renderPopular();
  });

  // --- Category chips (delegated) ---
  document.getElementById('categories-scroll').addEventListener('click', e => {
    const chip = e.target.closest('.cat-chip');
    if (!chip) return;
    S.category = chip.dataset.cat;
    S.query    = '';
    document.getElementById('search-input').value = '';
    document.getElementById('search-clear').classList.add('hidden');
    renderCategories();
    renderMenu();
    if (chip.dataset.cat === 'all') renderPopular();
  });

  // --- Menu grid (delegated) ---
  document.getElementById('menu-grid').addEventListener('click', e => {
    const addBtn = e.target.closest('.add-btn');
    const qtyBtn = e.target.closest('.qty-btn');
    if (addBtn) {
      addToCart(addBtn.dataset.id);
      renderMenu();
    } else if (qtyBtn) {
      setQty(qtyBtn.dataset.id, qtyBtn.dataset.action === 'inc' ? 1 : -1);
      renderMenu();
    }
  });

  // --- Popular scroll (delegated) ---
  document.getElementById('popular-scroll').addEventListener('click', e => {
    const addBtn = e.target.closest('.pop-add');
    const qtyBtn = e.target.closest('.qty-btn');
    if (addBtn) {
      addToCart(addBtn.dataset.id);
      renderPopular();
      // Also refresh menu grid quantities if visible
      if (!document.getElementById('popular-section').classList.contains('hidden')) {
        renderMenu();
      }
    } else if (qtyBtn) {
      setQty(qtyBtn.dataset.id, qtyBtn.dataset.action === 'inc' ? 1 : -1);
      renderPopular();
      renderMenu();
    }
  });

  // --- Clear cart ---
  document.getElementById('clear-cart-btn').addEventListener('click', () => {
    if (Object.keys(S.cart).length === 0) { toast('Cart is already empty', 'info'); return; }
    if (confirm('Remove all items from your order?')) {
      clearCart();
      renderCart();
    }
  });

  // --- Waiter: status tabs ---
  document.getElementById('tabs-bar').addEventListener('click', e => {
    const tab = e.target.closest('.tab-btn');
    if (!tab) return;
    document.querySelectorAll('.tab-btn').forEach(t => {
      t.classList.remove('active');
      t.setAttribute('aria-selected', 'false');
    });
    tab.classList.add('active');
    tab.setAttribute('aria-selected', 'true');
    S.waiterTab = tab.dataset.status;
    renderOrders();
  });

  // --- Waiter: Clear Actions ---
  document.getElementById('clear-status-btn').addEventListener('click', () => {
    if (confirm(`Are you sure you want to clear all '${S.waiterTab}' orders?`)) {
      const orders = getOrders();
      let cleared = 0;
      Object.keys(orders).forEach(id => {
        if (orders[id].status === S.waiterTab) {
          delete orders[id];
          cleared++;
        }
      });
      if (cleared > 0) {
        saveOrders(orders);
        renderWaiter();
        toast(`Cleared ${cleared} orders.`);
      } else {
        toast(`No '${S.waiterTab}' orders to clear.`, 'info');
      }
    }
  });

  document.getElementById('clear-all-btn').addEventListener('click', () => {
    if (confirm('Are you sure you want to clear ALL orders? This cannot be undone.')) {
      saveOrders({});
      renderWaiter();
      toast('All orders cleared.');
    }
  });

  // --- Waiter: manual lookup ---
  document.getElementById('manual-lookup-btn').addEventListener('click', lookupOrder);
  document.getElementById('manual-order-id').addEventListener('keydown', e => {
    if (e.key === 'Enter') lookupOrder();
  });

  // --- Waiter: Scan QR ---
  document.getElementById('scan-qr-btn').addEventListener('click', openScanner);

  // --- Waiter: Logout ---
  document.getElementById('logout-btn').addEventListener('click', exitWaiter);
}

// ================================================================
// INIT
// ================================================================
function init() {
  initTheme();
  S.cart = loadCart();

  renderCategories();
  renderPopular();
  renderMenu();
  refreshCartFAB();
  initEvents();

  // If cart has items show FAB right away
  if (cartCount() > 0) {
    document.getElementById('cart-fab').classList.remove('hidden');
    document.getElementById('cart-count').textContent = cartCount();
  }

  console.log('%c🍽️  Savoria — Digital Menu loaded', 'color:#f0a500;font-size:14px;font-weight:bold');
}

// Start when DOM + scripts are ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

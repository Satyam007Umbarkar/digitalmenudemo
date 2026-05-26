/* ============================================================
   Hotel Pahunchar – Customer Menu
   script.js  (fully self-contained)
   ============================================================ */

/* ══════════════════════════════════════
   MENU DATA
══════════════════════════════════════ */
const MENU = {
  breakfast: [
    { id:'b1', emoji:'🥞', name:'Poha',             desc:'Kanda poha with sev, lemon & coriander',         price:40,  badge:'popular' },
    { id:'b2', emoji:'🫓', name:'Upma',             desc:'Rava upma with green chutney',                   price:40  },
    { id:'b3', emoji:'🥙', name:'Idli Sambar',      desc:'2 soft idli with hot sambar & coconut chutney',  price:50,  badge:'popular' },
    { id:'b4', emoji:'🥗', name:'Sabudana Khichdi', desc:'With roasted peanut, lemon & ghee',              price:60  },
    { id:'b5', emoji:'🥞', name:'Dosa',             desc:'Crispy plain dosa with sambar & chutney',        price:70,  badge:'spicy'   },
    { id:'b6', emoji:'🥙', name:'Masala Dosa',      desc:'Crispy dosa stuffed with spiced potato filling', price:90,  badge:'popular' },
  ],
  thali: [
    { id:'t1', emoji:'🍛', name:'Pahunchar Special Thali', desc:'Dal, 3 sabzi, roti, rice, salad, papad, chaas – unlimited', price:150, badge:'popular' },
    { id:'t2', emoji:'🥘', name:'Mini Thali',              desc:'Dal, 1 sabzi, 2 roti, rice, papad',                         price:90  },
    { id:'t3', emoji:'🎊', name:'Festival Thali',          desc:'Dal, 4 sabzi, puri, kheer, papad, pickle',                  price:200, badge:'popular' },
  ],
  roti: [
    { id:'r1', emoji:'🫓', name:'Chapati (2 pcs)', desc:'Soft wheat chapati with ghee',      price:20 },
    { id:'r2', emoji:'🥙', name:'Puri Bhaji (4)',  desc:'Crispy puris with aloo bhaji',       price:60, badge:'popular' },
    { id:'r3', emoji:'🍚', name:'Plain Rice',      desc:'Steamed basmati rice',               price:40 },
    { id:'r4', emoji:'🍛', name:'Jeera Rice',      desc:'Basmati with cumin & ghee',          price:60 },
    { id:'r5', emoji:'🍱', name:'Dal Fry + Rice',  desc:'Yellow dal tadka with steamed rice', price:80, badge:'popular' },
  ],
  snacks: [
    { id:'s1', emoji:'🥙', name:'Vada Pav',      desc:'Mumbai-style potato vada in pav with chutneys', price:25, badge:'popular' },
    { id:'s2', emoji:'🍞', name:'Pav Bhaji',      desc:'Spicy bhaji with 4 butter pav & lemon',         price:90, badge:'spicy'   },
    { id:'s3', emoji:'🫙', name:'Samosa (2 pcs)', desc:'Crispy with green & tamarind chutney',           price:30 },
    { id:'s4', emoji:'🥗', name:'Bhel Puri',      desc:'Tangy with tamarind chutney & sev',              price:40 },
    { id:'s5', emoji:'🧆', name:'Misal Pav',      desc:'Sprouted moth curry with pav, farsan & onion',   price:70, badge:'spicy'   },
  ],
  sweets: [
    { id:'sw1', emoji:'🍮', name:'Gulab Jamun (2 pcs)', desc:'Soft khoya balls in sugar syrup',          price:40, badge:'popular' },
    { id:'sw2', emoji:'🍚', name:'Kheer',                desc:'Rice pudding with cardamom & dry fruits',  price:50 },
    { id:'sw3', emoji:'🟡', name:'Shrikhand',            desc:'Strained yogurt with saffron & cardamom',  price:60 },
  ],
  drinks: [
    { id:'d1', emoji:'☕', name:'Cutting Chai', desc:'Strong ginger masala tea',               price:15, badge:'popular' },
    { id:'d2', emoji:'🥛', name:'Lassi',         desc:'Sweet / salted / mango – chilled',       price:60 },
    { id:'d3', emoji:'🥛', name:'Chaas / Taak',  desc:'Chilled buttermilk with jeera & pudina', price:25, badge:'popular' },
    { id:'d4', emoji:'🍋', name:'Lemon Soda',    desc:'Sweet / salted / masala',                price:40 },
    { id:'d5', emoji:'🥭', name:'Mango Juice',   desc:'Fresh seasonal mango juice',             price:50 },
  ]
};

/* ══════════════════════════════════════
   ORDER STORE  (localStorage)
   Waiter page reads the same key to get order details
   and writes confirmed:true — customer polls for it
══════════════════════════════════════ */
const OrderStore = {
  _key: 'pahunchar_orders',
  _all() {
    try { return JSON.parse(localStorage.getItem(this._key) || '{}'); } catch(e) { return {}; }
  },
  save(order) {
    try { const a = this._all(); a[order.code] = order; localStorage.setItem(this._key, JSON.stringify(a)); } catch(e) {}
  },
  isConfirmed(code) {
    try { const o = this._all()[code]; return o ? !!o.confirmed : false; } catch(e) { return false; }
  }
};

/* ══════════════════════════════════════
   CART STATE
══════════════════════════════════════ */
let cart = {};
let currentOrderCode = null;
let pollTimer = null;

/* ══════════════════════════════════════
   HELPERS
══════════════════════════════════════ */
function findMenuItem(id) {
  for (const cat of Object.values(MENU)) {
    const found = cat.find(i => i.id === id);
    if (found) return found;
  }
  return null;
}

function generateCode() {
  return 'PAH-' + Math.floor(10 + Math.random() * 90);
}

/* ══════════════════════════════════════
   RENDER MENU
══════════════════════════════════════ */
function renderMenu() {
  Object.keys(MENU).forEach(cat => {
    const el = document.getElementById('items-' + cat);
    if (el) el.innerHTML = MENU[cat].map(buildCard).join('');
  });
}

function buildCard(item) {
  const badge = item.badge === 'popular'
    ? '<span class="badge-popular">⭐ Popular</span>'
    : item.badge === 'spicy'
    ? '<span class="badge-spicy">🌶 Spicy</span>'
    : '';
  return `
    <div class="item-card" id="card-${item.id}">
      <div class="item-emoji">${item.emoji}</div>
      <div class="item-body">
        <div class="item-top"><span class="item-name">${item.name}</span>${badge}</div>
        <div class="item-desc">${item.desc}</div>
      </div>
      <div class="item-right">
        <div class="item-price">₹${item.price}</div>
        <div id="ctrl-${item.id}">
          <button class="add-btn" onclick="addItem('${item.id}')">+ Add</button>
        </div>
      </div>
    </div>`;
}

/* ══════════════════════════════════════
   CART ACTIONS
══════════════════════════════════════ */
function addItem(id) {
  cart[id] = (cart[id] || 0) + 1;
  refreshCtrl(id);
  updateCartBar();
}

function changeQty(id, delta) {
  cart[id] = (cart[id] || 0) + delta;
  if (cart[id] <= 0) delete cart[id];
  refreshCtrl(id);
  updateCartBar();
}

function refreshCtrl(id) {
  const ctrl = document.getElementById('ctrl-' + id);
  const card = document.getElementById('card-' + id);
  const qty  = cart[id] || 0;
  if (!ctrl) return;
  if (qty === 0) {
    ctrl.innerHTML = `<button class="add-btn" onclick="addItem('${id}')">+ Add</button>`;
    card && card.classList.remove('in-cart');
  } else {
    ctrl.innerHTML = `
      <div class="qty-ctrl">
        <button class="qty-btn" onclick="changeQty('${id}',-1)">−</button>
        <span class="qty-num">${qty}</span>
        <button class="qty-btn" onclick="changeQty('${id}',+1)">+</button>
      </div>`;
    card && card.classList.add('in-cart');
  }
}

function addSpecial() {
  cart['special'] = (cart['special'] || 0) + 1;
  updateCartBar();
  const card = document.querySelector('.special-card');
  if (card) { card.style.transform = 'scale(0.97)'; setTimeout(() => card.style.transform = '', 200); }
}

function calcTotal() {
  let total = 0;
  Object.entries(cart).forEach(([id, qty]) => {
    if (id === 'special') { total += 130 * qty; return; }
    const item = findMenuItem(id);
    if (item) total += item.price * qty;
  });
  return total;
}

function updateCartBar() {
  const qty = Object.values(cart).reduce((a, b) => a + b, 0);
  const amt = calcTotal();
  document.getElementById('cart-count').textContent = qty;
  document.getElementById('cart-items-text').textContent = qty === 1 ? '1 item' : qty + ' items';
  document.getElementById('cart-total-price').textContent = '₹' + amt;
  qty > 0
    ? document.getElementById('cart-bar').classList.add('visible')
    : document.getElementById('cart-bar').classList.remove('visible');
}

/* ══════════════════════════════════════
   CATEGORY FILTER
══════════════════════════════════════ */
function filter(cat, btn) {
  document.querySelectorAll('.cat-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  const special = document.getElementById('special-section');
  if (cat === 'all') {
    document.querySelectorAll('.cat-section').forEach(s => s.style.display = 'block');
    if (special) special.style.display = 'block';
  } else {
    if (special) special.style.display = 'none';
    document.querySelectorAll('.cat-section').forEach(s => {
      if (s.id === 'special-section') return;
      s.style.display = s.dataset.cat === cat ? 'block' : 'none';
    });
  }
  window.scrollTo({ top: 60, behavior: 'smooth' });
}

/* ══════════════════════════════════════
   ORDER PAGE
══════════════════════════════════════ */
function showOrderPage() {
  if (Object.keys(cart).length === 0) return;

  currentOrderCode = generateCode();

  const items = [];
  Object.entries(cart).forEach(([id, qty]) => {
    if (id === 'special') {
      items.push({ id, emoji:'🍛', name:"Today's Special Thali", price:130, qty });
    } else {
      const item = findMenuItem(id);
      if (item) items.push({ id, emoji:item.emoji, name:item.name, price:item.price, qty });
    }
  });

  const total = calcTotal();
  const time  = new Date().toLocaleTimeString('en-IN', { hour:'2-digit', minute:'2-digit' });
  const order = { code: currentOrderCode, items, total, time, confirmed: false };

  /* Save to localStorage — waiter page reads this */
  OrderStore.save(order);

  /* Render order code */
  document.getElementById('display-code').textContent = currentOrderCode;

  /* Render items list */
  document.getElementById('order-items-list').innerHTML = items.map(it => `
    <div class="order-item-row">
      <div>
        <div class="order-item-name">${it.emoji} ${it.name}</div>
        <div class="order-item-qty">× ${it.qty}</div>
      </div>
      <div class="order-item-price">₹${it.price * it.qty}</div>
    </div>`).join('');
  document.getElementById('order-total').textContent = '₹' + total;

  /* Generate QR code — embeds full order as JSON */
  document.getElementById('qrcode').innerHTML = '';
  new QRCode(document.getElementById('qrcode'), {
    text: JSON.stringify({ code: currentOrderCode, items, total, time }),
    width: 200, height: 200,
    colorDark: '#5C3A1E', colorLight: '#FFFFFF',
    correctLevel: QRCode.CorrectLevel.M
  });

  showPage('page-order');
  startPolling();
}

/* ══════════════════════════════════════
   POLL — checks every 1.5s if waiter confirmed
══════════════════════════════════════ */
function startPolling() {
  if (pollTimer) clearInterval(pollTimer);
  pollTimer = setInterval(() => {
    if (currentOrderCode && OrderStore.isConfirmed(currentOrderCode)) {
      clearInterval(pollTimer);
      showReceivedOverlay(currentOrderCode);
    }
  }, 1500);
}

function showReceivedOverlay(code) {
  document.getElementById('received-ref').textContent = code;
  document.getElementById('received-overlay').classList.add('show');
}

/* ══════════════════════════════════════
   PAGE NAVIGATION
══════════════════════════════════════ */
function showPage(id) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.getElementById(id).classList.add('active');
  window.scrollTo(0, 0);
}

function goBack() {
  if (pollTimer) clearInterval(pollTimer);
  showPage('page-menu');
}

function resetAll() {
  cart = {};
  currentOrderCode = null;
  if (pollTimer) clearInterval(pollTimer);
  document.getElementById('received-overlay').classList.remove('show');
  renderMenu();
  updateCartBar();
  showPage('page-menu');
}

/* ══════════════════════════════════════
   INIT
══════════════════════════════════════ */
renderMenu();

/* ============================================================
   Hotel Pahunchar – customer.js
   Cart, menu rendering, order QR generation, confirmation poll
   ============================================================ */

/* ── CART STATE ── */
let cart = {};           // { itemId: qty }
let currentOrderCode = null;
let pollTimer = null;

/* ── RENDER MENU ── */
function renderMenu() {
  Object.keys(MENU).forEach(cat => {
    const el = document.getElementById('items-' + cat);
    if (el) el.innerHTML = MENU[cat].map(buildItemCard).join('');
  });
}

function buildItemCard(item) {
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

/* ── ADD / CHANGE QTY ── */
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

/* ── CART BAR ── */
function updateCartBar() {
  const totalQty = Object.values(cart).reduce((a, b) => a + b, 0);
  const totalAmt = calcTotal();
  const bar = document.getElementById('cart-bar');
  document.getElementById('cart-count').textContent = totalQty;
  document.getElementById('cart-items-text').textContent = totalQty === 1 ? '1 item' : totalQty + ' items';
  document.getElementById('cart-total-price').textContent = '₹' + totalAmt;
  totalQty > 0 ? bar.classList.add('visible') : bar.classList.remove('visible');
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

/* ── CATEGORY FILTER ── */
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

/* ── SHOW ORDER PAGE ── */
function showOrderPage() {
  if (Object.keys(cart).length === 0) return;

  currentOrderCode = generateOrderCode();

  // Build items array
  const items = [];
  Object.entries(cart).forEach(([id, qty]) => {
    if (id === 'special') {
      items.push({ id, emoji: '🍛', name: "Today's Special Thali", price: 130, qty });
    } else {
      const item = findMenuItem(id);
      if (item) items.push({ id, emoji: item.emoji, name: item.name, price: item.price, qty });
    }
  });

  const total = calcTotal();
  const time  = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
  const order = { code: currentOrderCode, items, total, time, confirmed: false };

  // Persist to localStorage so waiter.html can read it
  OrderStore.save(order);

  // Render code + QR
  document.getElementById('display-code').textContent = currentOrderCode;

  // Items list
  document.getElementById('order-items-list').innerHTML = items.map(it => `
    <div class="order-item-row">
      <div>
        <div class="order-item-name">${it.emoji} ${it.name}</div>
        <div class="order-item-qty">× ${it.qty}</div>
      </div>
      <div class="order-item-price">₹${it.price * it.qty}</div>
    </div>`).join('');
  document.getElementById('order-total').textContent = '₹' + total;

  // Generate QR code
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

/* ── POLL FOR CONFIRMATION ── */
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

/* ── PAGE SWITCH ── */
function showPage(id) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.getElementById(id).classList.add('active');
  window.scrollTo(0, 0);
}

/* ── INIT ── */
renderMenu();
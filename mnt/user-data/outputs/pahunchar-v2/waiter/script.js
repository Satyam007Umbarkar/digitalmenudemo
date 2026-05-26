/* ============================================================
   Hotel Pahunchar – Waiter Panel
   script.js  (fully self-contained)
   ============================================================ */

/* ══════════════════════════════════════
   ORDER STORE  (localStorage)
   Reads orders saved by customer page.
   Writes confirmed:true so customer page detects it.
   NOTE: Both pages must be served from the SAME domain
         so they share the same localStorage.
══════════════════════════════════════ */
const OrderStore = {
  _key: 'pahunchar_orders',
  _all() {
    try { return JSON.parse(localStorage.getItem(this._key) || '{}'); } catch(e) { return {}; }
  },
  get(code) {
    try { return this._all()[code] || null; } catch(e) { return null; }
  },
  save(order) {
    try {
      const a = this._all();
      a[order.code] = order;
      localStorage.setItem(this._key, JSON.stringify(a));
    } catch(e) {}
  },
  confirm(code) {
    try {
      const a = this._all();
      if (a[code]) {
        a[code].confirmed = true;
        localStorage.setItem(this._key, JSON.stringify(a));
      }
    } catch(e) {}
  }
};

/* ══════════════════════════════════════
   SCANNER STATE
══════════════════════════════════════ */
let scanInterval = null;

/* ══════════════════════════════════════
   TAB SWITCH
══════════════════════════════════════ */
function switchTab(tab) {
  document.getElementById('tab-scan').classList.toggle('active', tab === 'scan');
  document.getElementById('tab-type').classList.toggle('active', tab === 'type');
  document.getElementById('panel-scan').style.display = tab === 'scan' ? 'block' : 'none';
  document.getElementById('panel-type').style.display = tab === 'type' ? 'block' : 'none';
  clearResult();
  if (tab !== 'scan') stopScan();
}

/* ══════════════════════════════════════
   QR SCANNER
══════════════════════════════════════ */
function startScan() {
  const video       = document.getElementById('scanner-video');
  const placeholder = document.getElementById('scan-placeholder');
  const stopBtn     = document.getElementById('scan-stop-btn');

  navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
    .then(stream => {
      video.srcObject = stream;
      video.style.display = 'block';
      placeholder.style.display = 'none';
      stopBtn.style.display = 'inline-block';

      scanInterval = setInterval(() => {
        const canvas = document.getElementById('scanner-canvas');
        const ctx    = canvas.getContext('2d');
        canvas.width  = video.videoWidth;
        canvas.height = video.videoHeight;
        if (!canvas.width) return;
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const result  = jsQR(imgData.data, imgData.width, imgData.height);
        if (result && result.data) {
          try {
            const parsed = JSON.parse(result.data);
            if (parsed.code && parsed.items) {
              stopScan();
              /* Save scanned order into localStorage so confirm works */
              OrderStore.save(parsed);
              showFlash('✓ QR Scanned!');
              displayOrder(parsed);
            }
          } catch(e) { /* not valid JSON — keep scanning */ }
        }
      }, 300);
    })
    .catch(() => {
      const p = document.querySelector('#scan-placeholder p');
      if (p) p.textContent = 'Camera not available. Please use Enter Code tab.';
    });
}

function stopScan() {
  const video = document.getElementById('scanner-video');
  if (video && video.srcObject) {
    video.srcObject.getTracks().forEach(t => t.stop());
    video.srcObject = null;
  }
  if (video) video.style.display = 'none';
  const placeholder = document.getElementById('scan-placeholder');
  if (placeholder) placeholder.style.display = 'flex';
  const stopBtn = document.getElementById('scan-stop-btn');
  if (stopBtn) stopBtn.style.display = 'none';
  if (scanInterval) { clearInterval(scanInterval); scanInterval = null; }
}

/* ══════════════════════════════════════
   MANUAL CODE LOOKUP
══════════════════════════════════════ */
function lookupCode() {
  const input = document.getElementById('code-input');
  const code  = (input.value || '').trim().toUpperCase();
  if (!code) return;

  const order = OrderStore.get(code);
  if (!order) {
    document.getElementById('w-error').classList.add('show');
    clearOrderCard();
    return;
  }
  document.getElementById('w-error').classList.remove('show');
  displayOrder(order);
}

/* Allow Enter key in input */
document.addEventListener('DOMContentLoaded', () => {
  const input = document.getElementById('code-input');
  if (input) input.addEventListener('keydown', e => { if (e.key === 'Enter') lookupCode(); });
});

/* ══════════════════════════════════════
   DISPLAY ORDER CARD
══════════════════════════════════════ */
function displayOrder(order) {
  document.getElementById('w-order-code-display').textContent = order.code;
  document.getElementById('w-order-time').textContent = order.time || '';

  document.getElementById('w-order-items-list').innerHTML = order.items.map(it => `
    <div class="w-order-item">
      <div class="w-item-left">
        <div class="w-item-emoji">${it.emoji}</div>
        <div>
          <div class="w-item-name">${it.name}</div>
          <div class="w-item-qty">Qty: ${it.qty}</div>
        </div>
      </div>
      <div class="w-item-price">₹${it.price * it.qty}</div>
    </div>`).join('');

  document.getElementById('w-order-total').textContent = '₹' + order.total;

  document.getElementById('w-order-card').classList.add('show');

  const btn = document.getElementById('w-confirm-btn');
  btn.dataset.code = order.code;
  btn.classList.add('visible');

  if (order.confirmed) {
    btn.classList.add('confirmed');
    btn.textContent = '✅ Already Confirmed';
  } else {
    btn.classList.remove('confirmed');
    btn.innerHTML = '✓ &nbsp; Order Received — Confirm';
  }
}

function clearOrderCard() {
  document.getElementById('w-order-card').classList.remove('show');
  const btn = document.getElementById('w-confirm-btn');
  btn.classList.remove('visible', 'confirmed');
}

function clearResult() {
  clearOrderCard();
  document.getElementById('w-error').classList.remove('show');
}

/* ══════════════════════════════════════
   CONFIRM ORDER
   Writes confirmed:true to localStorage →
   Customer page polls for this and shows overlay
══════════════════════════════════════ */
function confirmOrder() {
  const btn  = document.getElementById('w-confirm-btn');
  const code = btn.dataset.code;
  if (!code) return;

  OrderStore.confirm(code);

  btn.classList.add('confirmed');
  btn.textContent = '✅ Confirmed!';
  showFlash('Order ' + code + ' confirmed!');
}

/* ══════════════════════════════════════
   TOAST FLASH
══════════════════════════════════════ */
function showFlash(msg) {
  const el = document.getElementById('scan-flash');
  el.textContent = msg;
  el.classList.add('show');
  setTimeout(() => el.classList.remove('show'), 2500);
}

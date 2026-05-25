/* ============================================================
   Hotel Pahunchar – waiter.js
   QR scanner, manual code lookup, order confirm
   ============================================================ */

let scanInterval = null;

/* ══ TAB SWITCH ══ */
function switchTab(tab) {
  document.getElementById('tab-scan').classList.toggle('active', tab === 'scan');
  document.getElementById('tab-type').classList.toggle('active', tab === 'type');
  document.getElementById('panel-scan').style.display = tab === 'scan' ? 'block' : 'none';
  document.getElementById('panel-type').style.display = tab === 'type' ? 'block' : 'none';
  clearResult();
  if (tab !== 'scan') stopScan();
}

/* ══ QR SCANNER ══ */
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
              showFlash('✓ QR Scanned!');
              // Save scanned order so confirmation is persisted
              OrderStore.save(parsed);
              displayOrder(parsed);
            }
          } catch (e) { /* not valid JSON, ignore */ }
        }
      }, 300);
    })
    .catch(() => {
      const p = document.querySelector('#scan-placeholder p');
      if (p) p.textContent = 'Camera not available. Please use the Enter Code tab.';
    });
}

function stopScan() {
  const video = document.getElementById('scanner-video');
  if (video.srcObject) {
    video.srcObject.getTracks().forEach(t => t.stop());
    video.srcObject = null;
  }
  video.style.display = 'none';
  document.getElementById('scan-placeholder').style.display = 'flex';
  document.getElementById('scan-stop-btn').style.display = 'none';
  if (scanInterval) { clearInterval(scanInterval); scanInterval = null; }
}

/* ══ MANUAL CODE LOOKUP ══ */
function lookupCode() {
  const input = document.getElementById('code-input');
  const code  = input.value.trim().toUpperCase();
  if (!code) return;

  const order = OrderStore.get(code);
  if (!order) {
    document.getElementById('w-error').classList.add('show');
    document.getElementById('w-order-card').classList.remove('show');
    document.getElementById('w-confirm-btn').style.display = 'none';
    return;
  }
  document.getElementById('w-error').classList.remove('show');
  displayOrder(order);
}

/* Allow pressing Enter in the input */
document.addEventListener('DOMContentLoaded', () => {
  const input = document.getElementById('code-input');
  if (input) {
    input.addEventListener('keydown', e => { if (e.key === 'Enter') lookupCode(); });
  }
});

/* ══ DISPLAY ORDER ══ */
function displayOrder(order) {
  document.getElementById('w-order-code-display').textContent = order.code;
  document.getElementById('w-order-time').textContent = order.time || '';

  const listEl = document.getElementById('w-order-items-list');
  listEl.innerHTML = order.items.map(it => `
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

  const card = document.getElementById('w-order-card');
  card.classList.add('show');

  const btn = document.getElementById('w-confirm-btn');
  btn.style.display = 'flex';
  btn.dataset.code = order.code;

  // If already confirmed earlier, show that state
  if (order.confirmed) {
    btn.classList.add('confirmed');
    btn.textContent = '✅ Already Confirmed';
  } else {
    btn.classList.remove('confirmed');
    btn.innerHTML = '✓ &nbsp; Order Received — Confirm';
  }
}

function clearResult() {
  document.getElementById('w-order-card').classList.remove('show');
  document.getElementById('w-confirm-btn').style.display = 'none';
  document.getElementById('w-error').classList.remove('show');
}

/* ══ CONFIRM ORDER ══ */
function confirmOrder() {
  const btn  = document.getElementById('w-confirm-btn');
  const code = btn.dataset.code;
  if (!code) return;

  OrderStore.confirm(code);

  btn.classList.add('confirmed');
  btn.textContent = '✅ Confirmed!';
  showFlash('Order ' + code + ' confirmed!');
}

/* ══ TOAST FLASH ══ */
function showFlash(msg) {
  const el = document.getElementById('scan-flash');
  el.textContent = msg;
  el.classList.add('show');
  setTimeout(() => el.classList.remove('show'), 2500);
}
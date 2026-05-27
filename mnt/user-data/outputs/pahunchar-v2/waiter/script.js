/* Hotel Pahunchar – Waiter script.js */

var scanInterval = null;

/* ── ORDER STORE ── */
var OrderStore = {
  _key: 'pahunchar_orders',
  get: function(code) {
    try { return (JSON.parse(localStorage.getItem(this._key) || '{}'))[code] || null; } catch(e) { return null; }
  },
  save: function(order) {
    try {
      var a = JSON.parse(localStorage.getItem(this._key) || '{}');
      a[order.code] = order;
      localStorage.setItem(this._key, JSON.stringify(a));
    } catch(e) {}
  },
  confirm: function(code) {
    try {
      var a = JSON.parse(localStorage.getItem(this._key) || '{}');
      if (a[code]) { a[code].confirmed = true; localStorage.setItem(this._key, JSON.stringify(a)); }
    } catch(e) {}
  }
};

/* ── TAB SWITCH ── */
function switchTab(tab) {
  document.getElementById('tab-scan').classList.toggle('active', tab === 'scan');
  document.getElementById('tab-type').classList.toggle('active', tab === 'type');
  document.getElementById('panel-scan').style.display = tab === 'scan' ? 'block' : 'none';
  document.getElementById('panel-type').style.display = tab === 'type' ? 'block' : 'none';
  clearResult();
  if (tab !== 'scan') stopScan();
}

/* ── QR SCANNER ── */
function startScan() {
  var video       = document.getElementById('scanner-video');
  var placeholder = document.getElementById('scan-placeholder');
  var stopBtn     = document.getElementById('scan-stop-btn');

  navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
    .then(function(stream) {
      video.srcObject = stream;
      video.style.display = 'block';
      placeholder.style.display = 'none';
      stopBtn.style.display = 'inline-block';

      scanInterval = setInterval(function() {
        var canvas = document.getElementById('scanner-canvas');
        var ctx    = canvas.getContext('2d');
        canvas.width  = video.videoWidth;
        canvas.height = video.videoHeight;
        if (!canvas.width) return;
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        var imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        var result  = jsQR(imgData.data, imgData.width, imgData.height);
        if (result && result.data) {
          try {
            var parsed = JSON.parse(result.data);
            if (parsed.code && parsed.items) {
              stopScan();
              OrderStore.save(parsed);
              showFlash('✓ QR Scanned!');
              displayOrder(parsed);
            }
          } catch(e) {}
        }
      }, 300);
    })
    .catch(function() {
      document.querySelector('#scan-placeholder p').textContent = 'Camera not available. Use Enter Code tab.';
    });
}

function stopScan() {
  var video = document.getElementById('scanner-video');
  if (video && video.srcObject) {
    video.srcObject.getTracks().forEach(function(t){ t.stop(); });
    video.srcObject = null;
  }
  if (video) video.style.display = 'none';
  document.getElementById('scan-placeholder').style.display = 'block';
  document.getElementById('scan-stop-btn').style.display = 'none';
  if (scanInterval) { clearInterval(scanInterval); scanInterval = null; }
}

/* ── MANUAL LOOKUP ── */
document.addEventListener('DOMContentLoaded', function() {
  var input = document.getElementById('code-input');
  if (input) input.addEventListener('keydown', function(e){ if (e.key === 'Enter') lookupCode(); });
});

function lookupCode() {
  var code = (document.getElementById('code-input').value || '').trim().toUpperCase();
  if (!code) return;
  var order = OrderStore.get(code);
  if (!order) {
    document.getElementById('w-error').classList.add('show');
    clearOrderCard();
    return;
  }
  document.getElementById('w-error').classList.remove('show');
  displayOrder(order);
}

/* ── DISPLAY ORDER ── */
function displayOrder(order) {
  document.getElementById('w-order-code-display').textContent = order.code;
  document.getElementById('w-order-time').textContent = order.time || '';

  document.getElementById('w-order-items-list').innerHTML = order.items.map(function(it) {
    return '<div class="w-order-item">'
      + '<div class="w-item-left">'
      + '<div class="w-item-emoji">' + it.emoji + '</div>'
      + '<div><div class="w-item-name">' + it.name + '</div>'
      + '<div class="w-item-qty">Qty: ' + it.qty + '</div></div>'
      + '</div>'
      + '<div class="w-item-price">₹' + (it.price * it.qty) + '</div>'
      + '</div>';
  }).join('');

  document.getElementById('w-order-total').textContent = '₹' + order.total;

  document.getElementById('w-order-card').style.display = 'block';

  var btn = document.getElementById('w-confirm-btn');
  btn.dataset.code = order.code;
  btn.style.display = 'flex';

  if (order.confirmed) {
    btn.classList.add('confirmed');
    btn.textContent = '✅ Already Confirmed';
  } else {
    btn.classList.remove('confirmed');
    btn.innerHTML = '✓ &nbsp;Order Received — Confirm';
  }
}

function clearOrderCard() {
  document.getElementById('w-order-card').style.display = 'none';
  document.getElementById('w-confirm-btn').style.display = 'none';
}

function clearResult() {
  clearOrderCard();
  document.getElementById('w-error').classList.remove('show');
}

/* ── CONFIRM ── */
function confirmOrder() {
  var btn  = document.getElementById('w-confirm-btn');
  var code = btn.dataset.code;
  if (!code) return;
  OrderStore.confirm(code);
  btn.classList.add('confirmed');
  btn.textContent = '✅ Confirmed!';
  showFlash('Order ' + code + ' confirmed!');
}

/* ── FLASH ── */
function showFlash(msg) {
  var el = document.getElementById('scan-flash');
  el.textContent = msg;
  el.classList.add('show');
  setTimeout(function(){ el.classList.remove('show'); }, 2500);
}

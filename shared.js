/* ============================================================
   Hotel Pahunchar – shared.js
   Menu data + in-memory order store shared by both pages
   ============================================================ */

const MENU = {
  breakfast: [
    { id:'b1', emoji:'🥞', name:'Poha',             desc:'Kanda poha with sev, lemon & coriander',         price:40,  badge:'popular' },
    { id:'b2', emoji:'🫓', name:'Upma',             desc:'Rava upma with green chutney',                   price:40  },
    { id:'b3', emoji:'🥙', name:'Idli Sambar',      desc:'2 soft idli with hot sambar & coconut chutney',  price:50,  badge:'popular' },
    { id:'b4', emoji:'🥗', name:'Sabudana Khichdi', desc:'With roasted peanut, lemon & ghee',              price:60  },
    { id:'b5', emoji:'🥞', name:'Dosa',             desc:'Crispy plain dosa with sambar & chutney',        price:70,  badge:'spicy' },
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
    { id:'s2', emoji:'🍞', name:'Pav Bhaji',      desc:'Spicy bhaji with 4 butter pav & lemon',         price:90, badge:'spicy' },
    { id:'s3', emoji:'🫙', name:'Samosa (2 pcs)', desc:'Crispy with green & tamarind chutney',           price:30 },
    { id:'s4', emoji:'🥗', name:'Bhel Puri',      desc:'Tangy with tamarind chutney & sev',              price:40 },
    { id:'s5', emoji:'🧆', name:'Misal Pav',      desc:'Sprouted moth curry with pav, farsan & onion',   price:70, badge:'spicy' },
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

/* In-memory order store — lives in localStorage so both pages
   on the same device (or same browser) can share orders.
   Key: order code → JSON order object */
const OrderStore = {
  save(order) {
    try {
      const all = this.getAll();
      all[order.code] = order;
      localStorage.setItem('pahunchar_orders', JSON.stringify(all));
    } catch(e) {}
  },
  get(code) {
    try {
      return this.getAll()[code] || null;
    } catch(e) { return null; }
  },
  confirm(code) {
    try {
      const all = this.getAll();
      if (all[code]) { all[code].confirmed = true; localStorage.setItem('pahunchar_orders', JSON.stringify(all)); }
    } catch(e) {}
  },
  isConfirmed(code) {
    try {
      const o = this.get(code);
      return o ? o.confirmed === true : false;
    } catch(e) { return false; }
  },
  getAll() {
    try {
      return JSON.parse(localStorage.getItem('pahunchar_orders') || '{}');
    } catch(e) { return {}; }
  }
};

/* Utility: find item across all categories */
function findMenuItem(id) {
  for (const cat of Object.values(MENU)) {
    const found = cat.find(i => i.id === id);
    if (found) return found;
  }
  return null;
}

/* Utility: generate short order code like PAH-47 */
function generateOrderCode() {
  const n = Math.floor(10 + Math.random() * 90);
  return 'PAH-' + n;
}
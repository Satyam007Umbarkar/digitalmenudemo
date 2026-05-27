// =======================
// MENU DATA
// =======================

const menuItems = [

{
id:1,
name:"Poha",
price:40,
category:"breakfast",
image:"https://images.unsplash.com/photo-1515003197210-e0cd71810b5f?w=800",
description:"Fresh Poha"
},

{
id:2,
name:"Samosa",
price:20,
category:"snacks",
image:"https://images.unsplash.com/photo-1601050690597-df0568f70950?w=800",
description:"Crispy Samosa"
},

{
id:3,
name:"Tea",
price:15,
category:"drinks",
image:"https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=800",
description:"Hot Tea"
},

{
id:4,
name:"Coffee",
price:30,
category:"drinks",
image:"https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800",
description:"Premium Coffee"
}

];

// =======================
// CART
// =======================

let cart = [];

const menuContainer =
document.getElementById("menu-container");

function renderMenu(items){

menuContainer.innerHTML="";

items.forEach(item=>{

menuContainer.innerHTML += `
<div class="menu-card">

<img src="${item.image}">

<div class="menu-info">

<div class="menu-title">
${item.name}
</div>

<div class="menu-desc">
${item.description}
</div>

<div class="menu-bottom">

<div class="price">
₹${item.price}
</div>

<button
class="add-btn"
onclick="addToCart(${item.id})">
Add
</button>

</div>

</div>

</div>
`;

});

}

renderMenu(menuItems);

// =======================
// ADD TO CART
// =======================

function addToCart(id){

const item =
menuItems.find(x=>x.id===id);

const found =
cart.find(x=>x.id===id);

if(found){

found.qty++;

}else{

cart.push({
...item,
qty:1
});

}

updateCart();

}

// =======================
// UPDATE CART
// =======================

function updateCart(){

let count=0;
let total=0;

cart.forEach(item=>{

count += item.qty;
total += item.qty*item.price;

});

document.getElementById(
"cart-count"
).textContent=count;

document.getElementById(
"cart-total"
).textContent=total;

renderCart();

}

// =======================
// RENDER CART
// =======================

function renderCart(){

const cartItems =
document.getElementById(
"cart-items"
);

cartItems.innerHTML="";

cart.forEach(item=>{

cartItems.innerHTML += `

<div class="cart-item">

<div>
${item.name}
x ${item.qty}
</div>

<div>
₹${item.qty*item.price}
</div>

</div>

`;

});

}

// =======================
// CART OPEN
// =======================

const cartModal =
document.getElementById(
"cart-modal"
);

document
.getElementById("cart-btn")
.onclick=()=>{

cartModal.style.display="flex";

};

document
.getElementById("close-cart")
.onclick=()=>{

cartModal.style.display="none";

};

// =======================
// SEARCH
// =======================

document
.getElementById("searchInput")
.addEventListener("input",e=>{

const search =
e.target.value.toLowerCase();

const filtered =
menuItems.filter(item=>

item.name
.toLowerCase()
.includes(search)

);

renderMenu(filtered);

});

// =======================
// CATEGORY
// =======================

document
.querySelectorAll(".category")
.forEach(btn=>{

btn.onclick=()=>{

document
.querySelectorAll(".category")
.forEach(x=>
x.classList.remove("active")
);

btn.classList.add("active");

const category =
btn.dataset.category;

if(category==="all"){

renderMenu(menuItems);

}else{

renderMenu(

menuItems.filter(item=>
item.category===category
)

);

}

};

});

// =======================
// QR GENERATE
// =======================

document
.getElementById(
"generate-order"
)
.onclick=()=>{

if(cart.length===0){

alert("Cart Empty");
return;

}

const total =
cart.reduce(
(sum,item)=>
sum+item.price*item.qty,
0
);

const orderData = {

orderId:
"ORD"+
Math.floor(
Math.random()*99999
),

time:
new Date()
.toLocaleTimeString(),

items:cart,

total

};

document
.getElementById(
"qr-page"
)
.style.display="block";

document
.getElementById(
"qrcode"
)
.innerHTML="";

new QRCode(
document.getElementById(
"qrcode"
),
{
text:
JSON.stringify(orderData),
width:250,
height:250
}
);

document
.getElementById(
"order-summary"
)
.innerHTML=`

<h3>
${orderData.orderId}
</h3>

<p>
Total:
₹${orderData.total}
</p>

`;

cartModal.style.display="none";

};

// =======================
// NEW ORDER
// =======================

document
.getElementById(
"new-order"
)
.onclick=()=>{

cart=[];

updateCart();

document
.getElementById(
"qr-page"
)
.style.display="none";

};

// =======================
// WAITER LOGIN
// =======================

document
.getElementById(
"waiter-btn"
)
.onclick=()=>{

document
.getElementById(
"waiter-login"
)
.style.display="flex";

};

document
.getElementById(
"login-btn"
)
.onclick=()=>{

const pass =
document
.getElementById(
"waiter-password"
)
.value;

if(pass==="1234"){

document
.getElementById(
"waiter-login"
)
.style.display="none";

document
.getElementById(
"waiter-panel"
)
.style.display="block";

}else{

alert("Wrong Password");

}

};

// =======================
// CLOSE WAITER
// =======================

document
.getElementById(
"close-waiter"
)
.onclick=()=>{

document
.getElementById(
"waiter-panel"
)
.style.display="none";

};

// =======================
// QR SCANNER
// =======================

let scanInterval;

document
.getElementById(
"start-scan"
)
.onclick=startScanner;

function startScanner(){

const video =
document
.getElementById(
"scanner-video"
);

navigator
.mediaDevices
.getUserMedia({
video:{
facingMode:
"environment"
}
})
.then(stream=>{

video.srcObject=
stream;

video.style.display=
"block";

scanInterval=
setInterval(()=>{

const canvas =
document
.getElementById(
"scanner-canvas"
);

const ctx =
canvas.getContext("2d");

canvas.width=
video.videoWidth;

canvas.height=
video.videoHeight;

ctx.drawImage(
video,
0,
0
);

const imageData=
ctx.getImageData(
0,
0,
canvas.width,
canvas.height
);

const code=
jsQR(
imageData.data,
imageData.width,
imageData.height
);

if(code){

try{

const order=
JSON.parse(
code.data
);

showOrder(order);

clearInterval(
scanInterval
);

stream
.getTracks()
.forEach(track=>
track.stop()
);

}catch(e){}

}

},300);

});

}

// =======================
// SHOW ORDER
// =======================

function showOrder(order){

let html=`

<h2>
${order.orderId}
</h2>

`;

order.items.forEach(item=>{

html += `

<div
style="
display:flex;
justify-content:
space-between;
padding:10px 0;
">

<div>
${item.name}
x ${item.qty}
</div>

<div>
₹${item.price*item.qty}
</div>

</div>

`;

});

html += `

<hr>

<h3>
Total:
₹${order.total}
</h3>

<button
style="
margin-top:15px;
padding:15px;
width:100%;
background:#22c55e;
border:none;
border-radius:10px;
font-weight:bold;
cursor:pointer;
">

Order Received

</button>

`;

document
.getElementById(
"order-result"
)
.innerHTML=html;

}
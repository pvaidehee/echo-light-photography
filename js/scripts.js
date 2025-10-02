// js/scripts.js - small helper for Echo Light Photography prototype

document.addEventListener('DOMContentLoaded', function(){
  // Mobile nav toggle
  const toggle = document.querySelector('.mobile-toggle');
  if(toggle){
    toggle.addEventListener('click', ()=> {
      const nav = document.querySelector('nav.main-nav');
      if(nav) nav.style.display = (nav.style.display === 'flex') ? 'none' : 'flex';
    });
  }
// nav toggle
document.addEventListener('DOMContentLoaded', function () {
  const btn = document.getElementById('nav-toggle');
  const menu = document.getElementById('nav-menu');

  btn.addEventListener('click', () => {
    const expanded = btn.getAttribute('aria-expanded') === 'true' || false;
    btn.setAttribute('aria-expanded', !expanded);
    menu.classList.toggle('open');
  });
});

  // Cart functionality (localStorage)
  updateCartCount();

  // Order page: file preview and form submission
  const fileInput = document.querySelector('#photoFile');
  if(fileInput){
    fileInput.addEventListener('change', function(e){
      const preview = document.querySelector('#filePreview');
      const file = e.target.files[0];
      if(!file) { preview.innerHTML = ''; return; }
      if(!file.type.startsWith('image/')) { preview.innerHTML = '<p class="small">Please select an image file.</p>'; return; }

      const reader = new FileReader();
      reader.onload = function(evt){
        preview.innerHTML = '<img src="'+evt.target.result+'" style="max-width:100%;border-radius:8px"/>';
        // store base64 in a hidden input for simulated submission
        const hidden = document.querySelector('#photoData');
        if(hidden) hidden.value = evt.target.result.slice(0,500000); // truncated to avoid huge storage
      };
      reader.readAsDataURL(file);
    });
  }

  // Order submit simulation
  const orderForm = document.querySelector('#orderForm');
  if(orderForm){
    orderForm.addEventListener('submit', function(e){
      e.preventDefault();
      const name = orderForm.querySelector('[name="name"]').value || 'Customer';
      const email = orderForm.querySelector('[name="email"]').value || '';
      const product = orderForm.querySelector('[name="product"]').value || 'Print';
      const notes = orderForm.querySelector('[name="notes"]').value || '';
      // read (optional) base64
      const imgData = orderForm.querySelector('#photoData') ? orderForm.querySelector('#photoData').value : '';
      const order = { name, email, product, notes, imgData, date: new Date().toISOString() };
      // Save to localStorage as lastOrder
      localStorage.setItem('lastOrder', JSON.stringify(order));
      // Also store in cart like quick checkout
      const cart = JSON.parse(localStorage.getItem('cart')||'[]');
      cart.push({ id: Date.now(), name: product, price: 9.99 });
      localStorage.setItem('cart', JSON.stringify(cart));
      // redirect to confirmation
      window.location.href = 'confirmation.html';
    });
  }

  // Cart page: render list
  if(document.querySelector('#cartList')){
    renderCart();
  }

  // Confirmation page: render last order
  if(document.querySelector('#confirmDetails')){
    const data = JSON.parse(localStorage.getItem('lastOrder')||'null');
    const el = document.querySelector('#confirmDetails');
    if(!data) el.innerHTML = '<p>No recent order found (prototype only).</p>';
    else {
      el.innerHTML = '<h3>Thank you, '+escapeHtml(data.name) + '!</h3>';
      el.innerHTML += '<p class="small">Product: '+escapeHtml(data.product) +'</p>';
      el.innerHTML += '<p class="small">Date: '+new Date(data.date).toLocaleString() +'</p>';
      if(data.imgData) el.innerHTML += '<div style="margin-top:12px"><strong>Uploaded photo preview:</strong><br/><img src="'+data.imgData+'" style="max-width:260px;border-radius:8px;margin-top:8px"/></div>';
      el.innerHTML += '<p class="small" style="margin-top:12px">Note: This is a prototype submission stored in your browser (no server upload).</p>';
    }
  }

});

// small helper
function updateCartCount(){
  const countEl = document.querySelector('#cartCount');
  if(!countEl) return;
  const cart = JSON.parse(localStorage.getItem('cart')||'[]');
  countEl.textContent = cart.length;
}
function addToCart(name, price){
  const cart = JSON.parse(localStorage.getItem('cart')||'[]');
  cart.push({ id: Date.now(), name, price });
  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartCount();
  alert('Added to cart: ' + name);
}
function renderCart(){
  const listEl = document.querySelector('#cartList');
  const cart = JSON.parse(localStorage.getItem('cart')||'[]');
  if(cart.length===0) listEl.innerHTML = '<p class="small">Your cart is empty.</p>';
  else {
    listEl.innerHTML = '';
    cart.forEach(item=>{
      const li = document.createElement('li');
      li.textContent = item.name + ' — $' + item.price;
      listEl.appendChild(li);
    });
    // checkout button
    const btn = document.querySelector('#checkoutBtn');
    if(btn) btn.addEventListener('click', ()=>{
      // simple move to order page
      window.location.href = 'order.html';
    });
  }
}
function escapeHtml(s){ return (s||'').replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;'); }

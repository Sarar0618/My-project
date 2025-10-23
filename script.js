
  let UNIT = 'kg';
  const KG_TO_LB = 2.20462;
  let cart = [];
  let activeSectionId = (window && window.INITIAL_SECTION) ? window.INITIAL_SECTION : CATALOG[0].sectionId; // Por defecto la primera sección
    function renderCatalog(){
      const root = document.getElementById('catalogRoot');
      root.innerHTML = '';
      const search = document.getElementById('searchInput').value.toLowerCase();
      let nav = document.getElementById('catalogNav');
      if (!nav) {
        nav = document.createElement('nav');
        nav.id = 'catalogNav';
        nav.style.marginBottom = '18px';
        root.parentNode.insertBefore(nav, root);
      }
      nav.innerHTML = '';
      CATALOG.forEach(section => {
        if (window && window.MULTI_PAGE) {
          const a = document.createElement('a');
          a.href = section.sectionId + '.html';
          a.className = 'section-btn section-btn--' + section.sectionId + (section.sectionId === activeSectionId ? ' active' : '');
          a.textContent = section.title;
          nav.appendChild(a);
        } else {
          const btn = document.createElement('button');
          btn.className = 'section-btn section-btn--' + section.sectionId + (section.sectionId === activeSectionId ? ' active' : '');
          btn.textContent = section.title;
          btn.onclick = () => { activeSectionId = section.sectionId; renderCatalog(); };
          nav.appendChild(btn);
        }
      });
      const section = CATALOG.find(s => s.sectionId === activeSectionId);
      if (!section) return;

  const secDiv = document.createElement('div');
  secDiv.className = 'panel panel-' + section.sectionId;
  const secH = document.createElement('h2'); secH.textContent = section.title; secDiv.appendChild(secH);

      section.subsections.forEach(sub => {
        const matched = sub.products.filter(p => (p.name + ' ' + p.desc).toLowerCase().includes(search));
        if (matched.length === 0 && search) return; 

        const subDiv = document.createElement('div');
        subDiv.className = 'subsection';
        const subH = document.createElement('div'); subH.innerHTML = '<strong>' + sub.title + '</strong>';
        subDiv.appendChild(subH);

        const prodWrap = document.createElement('div'); prodWrap.className = 'products';

          (search ? matched : sub.products).forEach(p => {
            const card = document.createElement('div'); card.className = 'card';
            const imgSrc = (typeof p.img === 'string') ? p.img.trim() : '';
            const img = document.createElement('img'); img.src = imgSrc; img.loading = 'lazy'; img.alt = p.name || 'Producto';
           
            img.onerror = function(){ this.onerror = null; this.src = 'images/placeholder.png'; };
            card.appendChild(img);
          const h3 = document.createElement('h3'); h3.textContent = p.name; card.appendChild(h3);
          const d = document.createElement('div'); d.className = 'muted'; d.textContent = p.desc; card.appendChild(d);

          const meta = document.createElement('div'); meta.className = 'meta';
          const priceDiv = document.createElement('div');
          const displayPrice = (UNIT === 'kg')? Math.round(p.pricePerKg) + ' / kg': Math.round(p.pricePerKg / KG_TO_LB) + ' / lb';

          priceDiv.innerHTML = '<div class="price">' + displayPrice + '</div>';
          meta.appendChild(priceDiv);

          const controls = document.createElement('div');
          const qtyInput = document.createElement('input'); qtyInput.type = 'number'; qtyInput.min = '0.1'; qtyInput.step = '0.1'; qtyInput.value = '0.5'; qtyInput.className = 'qty';
          const addBtn = document.createElement('button'); addBtn.className = 'btn small btn-add'; addBtn.textContent = 'AÑADIR';
          addBtn.onclick = () => addToCart(p.id, Number(qtyInput.value));
          controls.appendChild(qtyInput); controls.appendChild(addBtn);
          meta.appendChild(controls);

          card.appendChild(meta);
          prodWrap.appendChild(card);
        });

        subDiv.appendChild(prodWrap);
        secDiv.appendChild(subDiv);
      });

      root.appendChild(secDiv);
    }
    function addToCart(productId, qty){
      if(!qty || qty<=0){alert('Ingrese una cantidad válida.');return}
      
      const qtyKg = (UNIT==='kg')? qty : qty / KG_TO_LB;
      const product = findProduct(productId);
      if(!product) return;
      const existing = cart.find(ci=>ci.id===productId);
      if(existing){ existing.qtyKg += qtyKg; }
      else{ cart.push({id:productId, qtyKg}); }
      renderCart();
    }

    function findProduct(id){
      for(const s of CATALOG) for(const sub of s.subsections) for(const p of sub.products) if(p.id===id) return p;
      return null;
    }

    function renderCart(){
      const div = document.getElementById('cartItems'); div.innerHTML='';
      if(cart.length===0){ div.innerHTML='<div class="muted">El carrito está vacío.</div>'; document.getElementById('cartTotals').innerHTML=''; return }

      cart.forEach(item=>{
        const p = findProduct(item.id);
        const row = document.createElement('div'); row.className='cart-item';
  const imgSrc = (typeof p.img === 'string') ? p.img.trim() : '';
  const img = document.createElement('img'); img.src = imgSrc; img.loading = 'lazy'; img.alt = p.name || 'Producto';
  img.onerror = function(){ this.onerror = null; this.src = 'images/placeholder.png'; };
  row.appendChild(img);
        const info = document.createElement('div'); info.style.flex='1';
        info.innerHTML = `<strong>${p.name}</strong><div class="muted">${p.desc}</div>`;
        row.appendChild(info);

        const right = document.createElement('div'); right.style.textAlign='right';
        const qtyDisplay = document.createElement('div');
        const qty = (UNIT==='kg')? item.qtyKg : (item.qtyKg * KG_TO_LB);
        qtyDisplay.innerHTML = `<div>Cantidad: <input type="number" min="0.1" step="0.1" value="${qty.toFixed(2)}" onchange="changeQty('${item.id}', this.value)"></div>`;
        right.appendChild(qtyDisplay);

        const priceEach = (UNIT==='kg')? p.pricePerKg : p.pricePerKg / KG_TO_LB;
        const subtotal = priceEach * qty;
        const subDiv = document.createElement('div'); subDiv.innerHTML = `<div style="font-weight:700">Subtotal: ${Math.round(subtotal)}</div><div class="muted">Precio unit: ${Math.round(priceEach)} / ${UNIT}</div>`;
        right.appendChild(subDiv);

        const remBtn = document.createElement('button'); remBtn.className='small'; remBtn.style.marginTop='8px'; remBtn.textContent='Eliminar'; remBtn.onclick=()=> removeFromCart(item.id);
        right.appendChild(remBtn);

        row.appendChild(right);
        div.appendChild(row);
      });

      // totals
      const totalsDiv = document.getElementById('cartTotals');
      const totalKg = cart.reduce((s,i)=>s + i.qtyKg,0);
      const total = cart.reduce((s,i)=>{
        const p = findProduct(i.id);
        return s + p.pricePerKg * i.qtyKg;
      },0);
      const displayQty = (UNIT==='kg')? totalKg.toFixed(2)+' kg' : (totalKg*KG_TO_LB).toFixed(2)+' lb';
      const displayTotal = (UNIT==='kg')? Math.round(total)+' pesos' : Math.round(total/ KG_TO_LB)+' pesos';
      totalsDiv.innerHTML = `<div>Items: ${cart.length} <br> Cantidad total: <strong>${displayQty}</strong> <br> Total: <strong>${displayTotal}</strong></div>`;
    }

    function changeQty(id, newQty){
      let qty = Number(newQty);
      if(!qty || qty<=0){ alert('Cantidad inválida'); return }
      const item = cart.find(c=>c.id===id);
      if(!item) return;
      item.qtyKg = (UNIT==='kg')? qty : qty / KG_TO_LB;
      renderCart();
    }

    function removeFromCart(id){ cart = cart.filter(c=>c.id!==id); renderCart(); }
    function clearCart(){ if(confirm('¿Vaciar el carrito?')){ cart=[]; renderCart(); } }

    function toggleUnit(){ UNIT = (UNIT==='kg')? 'lb' : 'kg'; document.getElementById('unitLabel').textContent = UNIT; renderCatalog(); renderCart(); }

    function checkout(){
      if(cart.length===0){ alert('Carrito vacío. Añade productos para simular checkout.'); return }
      for(const item of cart){ if(!item.qtyKg || item.qtyKg <= 0){ alert('Revisa las cantidades en el carrito.'); return } }
      const modal = document.getElementById('checkoutModal');
      const body = document.getElementById('modalBody');
      let html = '<ul>';
      let total = 0;
      cart.forEach(item=>{
        const p = findProduct(item.id);
        const qty = item.qtyKg.toFixed(2) + ' kg';
        const subtotal = Math.round(p.pricePerKg * item.qtyKg);
        html += `<li><strong>${p.name}</strong> — ${qty} — subtotal: ${subtotal} pesos</li>`;
        total += subtotal;
      });
      html += `</ul><div style="margin-top:8px;font-weight:700">Total: ${Math.round(total)} pesos</div>`;
      body.innerHTML = html;
      modal.setAttribute('aria-hidden','false');
    }

    function closeModal(){ const modal = document.getElementById('checkoutModal'); modal.setAttribute('aria-hidden','true'); }

    function confirmCheckout(){
      alert('Compra confirmada. Gracias por su compra (simulada).');
      cart = []; renderCart(); closeModal();
    }
    (async function initData(){
      try{
        if(window.DB){
          await migrateLocalUsersToDB();
          await window.DB.seedProductsFromCatalog(CATALOG);
        }
      }catch(e){ console.warn('initData error', e); }
      renderCatalog(); renderCart();
    })();
    function openAuthModal(){ document.getElementById('authModal').setAttribute('aria-hidden','false'); }
    function closeAuthModal(){ document.getElementById('authModal').setAttribute('aria-hidden','true'); document.getElementById('authMsg').textContent=''; }

 
    async function migrateLocalUsersToDB(){
      try{
        if(!window.DB) return;
        const raw = localStorage.getItem('tfv_users');
        if(!raw) return;
        const users = JSON.parse(raw||'[]');
        if(Array.isArray(users) && users.length>0){
          const normalized = users.map(u=>({ email: u.email, passHash: u.passHash || (u.pass? u.pass : undefined) }));
          await window.DB.bulkAddUsers(normalized);
          localStorage.removeItem('tfv_users');
        }
      }catch(e){ console.warn('migrateLocalUsersToDB failed', e); }
    }
    async function getAllUsersFromStore(){
      if(window.DB) return await window.DB.getAllUsers();
      try{ return JSON.parse(localStorage.getItem('tfv_users')||'[]'); }catch(e){ return []; }
    }
    async function sha256Hex(str){
      try{
        if(window.crypto && crypto.subtle){
          const enc = new TextEncoder();
          const data = enc.encode(str);
          const hash = await crypto.subtle.digest('SHA-256', data);
          const bytes = new Uint8Array(hash);
          return Array.from(bytes).map(b=>b.toString(16).padStart(2,'0')).join('');
        } else {
          let h = 0x811c9dc5;
          for (let i=0;i<str.length;i++){
            h ^= str.charCodeAt(i);
            h = Math.imul(h, 16777619);
          }
          let hex = (h >>> 0).toString(16).padStart(8,'0');
          return (hex+hex+hex+hex).slice(0,64);
        }
      }catch(e){
        console.error('Hash error', e);
        let s=''; for(let i=0;i<str.length;i++) s += str.charCodeAt(i).toString(16);
        return s.slice(0,64).padEnd(64,'0');
      }
    }

    async function signup(){
      const email = document.getElementById('authEmail').value.trim();
      const pass = document.getElementById('authPass').value;
      const msg = document.getElementById('authMsg');
      if(!email || !pass){ msg.textContent = 'Ingresa email y contraseña.'; return }
      try{
        const existing = window.DB ? await window.DB.getUser(email) : null;
        if(existing){ msg.textContent='Usuario ya existe. Intenta ingresar.'; return }
        const passHash = await sha256Hex(pass);
        const userObj = { email, passHash };
        if(window.DB){ await window.DB.addOrUpdateUser(userObj); }
        else {
          const users = getAllUsersFromStore(); users.push(userObj); localStorage.setItem('tfv_users', JSON.stringify(users));
        }
        msg.textContent='Registro exitoso. Ya puedes ingresar.'; document.getElementById('authEmail').value=''; document.getElementById('authPass').value='';
      }catch(err){ console.error(err); msg.textContent='Error al registrar. Intenta nuevamente.'; }
    }

    async function login(){
      const email = document.getElementById('authEmail').value.trim();
      const pass = document.getElementById('authPass').value;
      const msg = document.getElementById('authMsg');
      if(!email || !pass){ msg.textContent = 'Ingresa email y contraseña.'; return }
      try{
        const passHash = await sha256Hex(pass);
        let found = null;
        if(window.DB){
          const user = await window.DB.getUser(email);
          if(user && (user.passHash===passHash || user.pass===pass)) found = user;
        } else {
          const users = await getAllUsersFromStore();
          found = users.find(u=>u.email===email && (u.passHash===passHash || u.pass===pass));
        }
        if(!found){ msg.textContent='Credenciales inválidas.'; return }
        if(!found.passHash){ found.passHash = passHash; delete found.pass; if(window.DB) await window.DB.addOrUpdateUser(found); else { const users = await getAllUsersFromStore(); /* replace */ }
        }
        localStorage.setItem('tfv_session', JSON.stringify({email}));
        msg.textContent='Sesión iniciada.';
        document.getElementById('loginBtn').textContent = 'Cerrar sesión';
        document.getElementById('loginBtn').onclick = logout;
        setTimeout(()=>{ closeAuthModal(); },700);
      }catch(err){ console.error(err); document.getElementById('authMsg').textContent='Error al iniciar sesión.'; }
    }

  function logout(){ localStorage.removeItem('tfv_session'); document.getElementById('loginBtn').textContent='Iniciar sesión'; document.getElementById('loginBtn').onclick = openAuthModal; refreshProfileLink(); closeAuthModal(); }

    function requireLoginForCheckout(){
      const sess = localStorage.getItem('tfv_session');
      if(!sess){ openAuthModal(); return false }
      return true;
    }
    const originalCheckout = checkout;
    checkout = function(){ if(!requireLoginForCheckout()) return; originalCheckout(); };
    if(localStorage.getItem('tfv_session')){ document.getElementById('loginBtn').textContent='Cerrar sesión'; document.getElementById('loginBtn').onclick = logout; }
    function refreshProfileLink(){
      const profileLink = document.getElementById('profileLink');
      if(!profileLink) return;
      if(localStorage.getItem('tfv_session')) profileLink.style.display='inline-block'; else profileLink.style.display='none';
    }
    refreshProfileLink();

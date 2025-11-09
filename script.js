
  let UNIT = 'kg';
  const KG_TO_LB = 2.20462;
  let cart = [];
  let activeSectionId = (window && window.INITIAL_SECTION) ? window.INITIAL_SECTION : CATALOG[0].sectionId; 
    function renderCatalog(){
      const root = document.getElementById('catalogRoot');
      root.innerHTML = '';
      
      const topSearch = document.getElementById('topSearch');
      const searchInputEl = document.getElementById('searchInput');
      const rawSearch = (topSearch ? topSearch.value : (searchInputEl ? searchInputEl.value : '')) || '';
      const search = rawSearch.trim().toLowerCase();
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
      
      if(search){
        const results = [];
        CATALOG.forEach(section => {
          section.subsections.forEach(sub => {
            sub.products.forEach(p => {
              const hay = (p.name + ' ' + (p.desc||'') + ' ' + (section.title||'') + ' ' + (sub.title||'')).toLowerCase();
              if(hay.includes(search)) results.push({section: section.title, subsection: sub.title, product: p});
            });
          });
        });

        const secDiv = document.createElement('div');
        secDiv.className = 'panel panel-search';
        const secH = document.createElement('h2'); secH.textContent = results.length ? `Resultados (${results.length})` : 'No se encontraron productos';
        secDiv.appendChild(secH);

        const prodWrap = document.createElement('div'); prodWrap.className = 'products';
        results.forEach(r => {
          const p = r.product;
          const card = document.createElement('div'); card.className = 'card';
          const imgSrc = (typeof p.img === 'string') ? p.img.trim() : '';
          const img = document.createElement('img'); img.src = imgSrc; img.loading = 'lazy'; img.alt = p.name || 'Producto';
          img.onerror = function(){ this.onerror = null; this.src = 'images/placeholder.jpg'; };
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
        secDiv.appendChild(prodWrap);
        root.appendChild(secDiv);
        
        const rEl = document.getElementById('catalogRoot'); if(rEl) rEl.scrollIntoView({behavior:'smooth', block:'start'});
        return;
      }

      
      const section = CATALOG.find(s => s.sectionId === activeSectionId);
      if (!section) return;
      const secDiv = document.createElement('div');
      secDiv.className = 'panel panel-' + section.sectionId;
      const secH = document.createElement('h2'); secH.textContent = section.title; secDiv.appendChild(secH);

      section.subsections.forEach(sub => {
        const subDiv = document.createElement('div');
        subDiv.className = 'subsection';
        const subH = document.createElement('div'); subH.innerHTML = '<strong>' + sub.title + '</strong>';
        subDiv.appendChild(subH);

        const prodWrap = document.createElement('div'); prodWrap.className = 'products';

        sub.products.forEach(p => {
          const card = document.createElement('div'); card.className = 'card';
          const imgSrc = (typeof p.img === 'string') ? p.img.trim() : '';
          const img = document.createElement('img'); img.src = imgSrc; img.loading = 'lazy'; img.alt = p.name || 'Producto';
          img.onerror = function(){ this.onerror = null; this.src = 'images/placeholder.jpg'; };
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
  img.onerror = function(){ this.onerror = null; this.src = 'images/placeholder.jpg'; };
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
      try{
        const top = document.getElementById('topSearch');
        if(top){
          top.addEventListener('keydown', function(e){
            if(e.key === 'Enter'){
              e.preventDefault();
              renderCatalog();
              const rEl = document.getElementById('catalogRoot'); if(rEl) rEl.scrollIntoView({behavior:'smooth', block:'start'});
            }
          });
        }
      }catch(e){console.warn('attach topSearch listener failed', e)}
      
      try{ if(window.CATEGORIES && typeof renderCategories === 'function') renderCategories(); }catch(e){ console.warn('renderCategories error', e); }
    })();

    
    function renderCategories(){
      const root = document.getElementById('categoriesRow');
      if(!root || !window.CATEGORIES) return;
      root.innerHTML = '';
      CATEGORIES.forEach(cat => {
        const el = document.createElement('div'); el.className = 'category-pill';
        el.innerHTML = `<div style="display:flex;flex-direction:column;align-items:center;gap:8px;padding:12px;">
          <img src="${cat.thumbnail || 'images/placeholder.jpg'}" alt="${cat.title}" style="width:84px;height:84px;object-fit:cover;border-radius:10px;"/>
          <div style="font-weight:700">${cat.title}</div>
          <div class="muted" style="font-size:12px">${cat.subsections.length} sub</div>
        </div>`;
        el.onclick = ()=>{ activeSectionId = cat.sectionId; renderCatalog(); window.scrollTo({top: document.querySelector('.catalog')?.offsetTop || 0, behavior:'smooth'}); };
        root.appendChild(el);
      });

      
      const prev = document.getElementById('catPrev');
      const next = document.getElementById('catNext');
      if(prev && next){
        prev.onclick = ()=> root.scrollBy({left: -320, behavior:'smooth'});
        next.onclick = ()=> root.scrollBy({left: 320, behavior:'smooth'});
      }
    }

    const HERO_SLIDES = [
      {
        badge: 'Envío gratis - pedidos superiores a $50.000',
        title: 'Envío gratis en pedidos superiores a',
        highlight: ' $50.000',
        text: 'Envío gratis solo para clientes primerizos. Las promociones y descuentos se aplican según corresponda.',
        image: 'images/placeholder.jpg'
      },
      {
        badge: 'Oferta limitada 50% OFF',
        title: 'Productos frescos directo del campo',
        highlight: '',
        text: 'Frutas y verduras de alta calidad para tu familia.',
        image: 'images/Mandarina.jpg'
      },
      {
        badge: 'Oferta limitada 50% OFF',
        title: 'Productos frescos directo del campo',
        highlight: '',
        text: 'Frutas y verduras de alta calidad para tu familia.',
        image: 'images/Papaya.jpg'
      }
    ];
    let heroIndex = 0;
    let heroTimer = null;

  function renderHero(){
      const copy = document.querySelector('.hero-copy');
      const img = document.querySelector('.hero-image');
      const dotsRoot = document.getElementById('heroDots');
      if(!copy || !img || !dotsRoot) return;
      dotsRoot.innerHTML = '';
      HERO_SLIDES.forEach((s, i)=>{
        const d = document.createElement('div'); d.className='hero-dot' + (i===0? ' active':''); d.setAttribute('role','button'); d.setAttribute('aria-label','Slide '+(i+1)); d.onclick = ()=> showHeroSlide(i);
        dotsRoot.appendChild(d);
      });
      showHeroSlide(0);
      startHeroAutoplay();
      
      const banner = document.querySelector('.promo-banner');
      banner.addEventListener('mouseenter', stopHeroAutoplay);
      banner.addEventListener('mouseleave', startHeroAutoplay);
    }

    function showHeroSlide(i){
      heroIndex = (i + HERO_SLIDES.length) % HERO_SLIDES.length;
      const s = HERO_SLIDES[heroIndex];
      
      const badgeEl = document.querySelector('.hero-copy .badge');
      const titleEl = document.querySelector('.hero-copy .hero-title');
      const para = document.querySelector('.hero-copy .muted');
      if(badgeEl) badgeEl.textContent = s.badge;
      if(titleEl) titleEl.innerHTML = s.title + (s.highlight? ' <span class="accent">' + s.highlight + '</span>' : '');
      if(para) para.textContent = s.text;
      
      const img = document.querySelector('.hero-image');
      if(img) img.style.backgroundImage = 'url("' + s.image + '")';
      
      const dots = document.querySelectorAll('.hero-dot');
      dots.forEach((d, idx)=> d.classList.toggle('active', idx===heroIndex));
    }

    function startHeroAutoplay(){
      stopHeroAutoplay();
      heroTimer = setInterval(()=>{ showHeroSlide(heroIndex+1); }, 4200);
    }

    function stopHeroAutoplay(){ if(heroTimer){ clearInterval(heroTimer); heroTimer = null; } }

    try{ document.addEventListener('DOMContentLoaded', function(){ renderHero(); }); }catch(e){ console.warn('hero init failed', e); }
    function openAuthModal(view){ document.getElementById('authModal').setAttribute('aria-hidden','false'); toggleAuthView(view || 'login'); }
    function closeAuthModal(){
      const m = document.getElementById('authModal'); if(m) m.setAttribute('aria-hidden','true');
      const m1 = document.getElementById('authMsg'); if(m1) m1.textContent='';
      const m2 = document.getElementById('authMsgSignup'); if(m2) m2.textContent='';
    
      const fields = ['authEmail','authPass','authName','authEmailSignup','authPassSignup'];
      fields.forEach(id=>{ const el=document.getElementById(id); if(el) el.value=''; });
    }

    function toggleAuthView(view){
      const loginForm = document.getElementById('loginForm');
      const signupForm = document.getElementById('signupForm');
      const tabLogin = document.getElementById('tab-login');
      const tabSignup = document.getElementById('tab-signup');
      const title = document.getElementById('authTitle');
      if(view === 'signup'){
        if(loginForm) loginForm.style.display='none';
        if(signupForm) signupForm.style.display='flex';
        if(tabLogin) tabLogin.classList.remove('active');
        if(tabSignup) tabSignup.classList.add('active');
        if(title) title.textContent = 'Registrarse';
        
        const n = document.getElementById('authName'); if(n) n.focus();
      } else {
        if(loginForm) loginForm.style.display='flex';
        if(signupForm) signupForm.style.display='none';
        if(tabLogin) tabLogin.classList.add('active');
        if(tabSignup) tabSignup.classList.remove('active');
        if(title) title.textContent = 'Iniciar sesión';
        const e = document.getElementById('authEmail'); if(e) e.focus();
      }
      const m1 = document.getElementById('authMsg'); if(m1) m1.textContent='';
      const m2 = document.getElementById('authMsgSignup'); if(m2) m2.textContent='';
    }

 
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
      const name = (document.getElementById('authName')||{}).value || '';
      const email = (document.getElementById('authEmailSignup')||{}).value.trim();
      const pass = (document.getElementById('authPassSignup')||{}).value;
      const msg = document.getElementById('authMsgSignup') || document.getElementById('authMsg');
      if(!email || !pass || !name){ if(msg) msg.textContent = 'Ingresa nombre, email y contraseña.'; return }
      
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if(!emailPattern.test(email)){ msg.textContent = 'Email inválido.'; return }
      if(pass.length < 6){ msg.textContent = 'La contraseña debe tener al menos 6 caracteres.'; return }
      try{
  const existing = window.DB ? await window.DB.getUser(email) : (await getAllUsersFromStore()).find(u=>u.email===email);
        if(existing){ msg.textContent='Usuario ya existe. Intenta ingresar.'; return }
        const passHash = await sha256Hex(pass);
        const userObj = { email, passHash };
        if(window.DB){
          await window.DB.addOrUpdateUser(userObj);
        } else {
          const users = await getAllUsersFromStore();
          users.push(userObj);
          localStorage.setItem('tfv_users', JSON.stringify(users));
        }
  localStorage.setItem('tfv_session', JSON.stringify({email}));
  if(msg) msg.textContent='Registro exitoso. Sesión iniciada.';
  const a = document.getElementById('authName'); if(a) a.value='';
  const b = document.getElementById('authEmailSignup'); if(b) b.value='';
  const c = document.getElementById('authPassSignup'); if(c) c.value='';
  const btn = document.getElementById('loginBtn'); if(btn){ btn.textContent='Cerrar sesión'; btn.onclick = logout; }
  const btnTop = document.getElementById('loginBtnTop'); if(btnTop){ btnTop.textContent='Cerrar sesión'; btnTop.onclick = logout; }
        refreshProfileLink();
        setTimeout(()=>{ closeAuthModal(); },700);
      }catch(err){ console.error(err); msg.textContent='Error al registrar. Intenta nuevamente.'; }
    }

    async function login(){
      const email = (document.getElementById('authEmail')||{}).value.trim();
      const pass = (document.getElementById('authPass')||{}).value;
      const msg = document.getElementById('authMsg');
      if(!email || !pass){ if(msg) msg.textContent = 'Ingresa email y contraseña.'; return }
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
          if(!found.passHash){
            
            found.passHash = passHash;
            delete found.pass;
            if(window.DB){
              await window.DB.addOrUpdateUser(found);
            } else {
              const users = await getAllUsersFromStore();
              const updated = users.map(u=> u.email===found.email ? found : u);
              localStorage.setItem('tfv_users', JSON.stringify(updated));
            }
        }
        localStorage.setItem('tfv_session', JSON.stringify({email}));
        if(msg) msg.textContent='Sesión iniciada.';
          
          const btn = document.getElementById('loginBtn');
          if(btn){ btn.textContent = 'Cerrar sesión'; btn.onclick = logout; }
          const btnTop = document.getElementById('loginBtnTop'); if(btnTop){ btnTop.textContent='Cerrar sesión'; btnTop.onclick = logout; }
          refreshProfileLink();
        setTimeout(()=>{ closeAuthModal(); },700);
      }catch(err){ console.error(err); document.getElementById('authMsg').textContent='Error al iniciar sesión.'; }
    }

  function logout(){ localStorage.removeItem('tfv_session'); const b = document.getElementById('loginBtn'); if(b){ b.textContent='Iniciar sesión'; b.onclick = openAuthModal; } const bt = document.getElementById('loginBtnTop'); if(bt){ bt.textContent='Iniciar sesión'; bt.onclick = openAuthModal; } refreshProfileLink(); closeAuthModal(); }

    function requireLoginForCheckout(){
      const sess = localStorage.getItem('tfv_session');
      if(!sess){ openAuthModal(); return false }
      return true;
    }
    const originalCheckout = checkout;
    checkout = function(){ if(!requireLoginForCheckout()) return; originalCheckout(); };
    if(localStorage.getItem('tfv_session')){
      const b = document.getElementById('loginBtn'); if(b){ b.textContent='Cerrar sesión'; b.onclick = logout; }
      const bt = document.getElementById('loginBtnTop'); if(bt){ bt.textContent='Cerrar sesión'; bt.onclick = logout; }
    }
    function refreshProfileLink(){
      const profileLink = document.getElementById('profileLink');
      if(!profileLink) return;
      if(localStorage.getItem('tfv_session')) profileLink.style.display='inline-block'; else profileLink.style.display='none';
    }
    refreshProfileLink();

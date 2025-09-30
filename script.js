
    /***** Datos del catálogo *****/
    
    const CATALOG = [
  {sectionId:'frutas', title:'Frutas Frescas', subsections:[
    {id:'tropicales', title:'Frutas tropicales', products:[
      {id:'mango', name:'Mango Ataulfo', pricePerKg:26000, img:'images/mango.jpg', desc:'Mango dulce, originario de climas cálidos. Ideal en postres y jugos.'},
      {id:'pina', name:'Piña', pricePerKg:16800, img:'images/Piña_Oro.jpg', desc:'Piña jugosa, rica en vitamina C. Perfecta para ensaladas y jugos.'},
      {id:'papaya', name:'Papaya', pricePerKg:15200, img:'Images/Papaya.jpg', desc:'Papaya suave, buena para la digestión.'}
    ]},
    {id:'citricas', title:'Frutas cítricas', products:[
      {id:'naranja', name:'Naranja de Mesa', pricePerKg:10000, img:'images/Naranjas.jpg', desc:'Naranja fresca para jugo.'},
      {id:'limon', name:'Limón Tahití', pricePerKg:12000, img:'images/Lemon.jpg', desc:'Limón aromático, ideal para aderezos.'},
      {id:'mandarina', name:'Mandarina', pricePerKg:11600, img:'images/Mandarina.jpg', desc:'Mandarina dulce y fácil de pelar.'}
    ]}
  ]},

  {sectionId:'verduras', title:'Verduras', subsections:[
    {id:'hojas', title:'De hoja verde', products:[
      {id:'espinaca', name:'Espinaca', pricePerKg:20000, img:'images/espinacas.jpg', desc:'Hoja verde rica en hierro.'},
      {id:'lechuga', name:'Lechuga Batavia', pricePerKg:8800, img:'images/Lechuga.jpg', desc:'Crujiente, ideal para ensaladas.'},
      {id:'acelga', name:'Acelga', pricePerKg:12400, img:'images/Acelga.jpg', desc:'Buena para salteados.'}
    ]},
    {id:'tuberculos', title:'Tubérculos', products:[
      {id:'papa', name:'Papa Criolla', pricePerKg:8000, img:'images/Papa.jpg', desc:'Papa ideal para sancochos.'},
      {id:'yuca', name:'Yuca', pricePerKg:7200, img:'images/yuca.jpg', desc:'Tubérculo energético para guisos.'},
      {id:'zanahoria', name:'Zanahoria', pricePerKg:7600, img:'images/zanahoria.jpg', desc:'Rica en betacarotenos.'}
    ]}
  ]},

  {sectionId:'hierbas', title:'Hierbas y Especias', subsections:[
    {id:'herbas', title:'Hierbas frescas', products:[
      {id:'cilantro', name:'Cilantro', pricePerKg:32000, img:'images/cilantro.jpg', desc:'Aporta aroma y sabor a muchos platos.'},
      {id:'perejil', name:'Perejil', pricePerKg:30000, img:'images/perejil.jpg', desc:'Excelente para salsas.'},
      {id:'albahaca', name:'Albahaca', pricePerKg:40000, img:'images/albahaca.jpg', desc:'Uso en pesto y pastas.'}
    ]},
    {id:'especias', title:'Especias secas', products:[
      {id:'oregano', name:'Orégano seco', pricePerKg:160000, img:'images/oregano.jpg', desc:'Bolsa de 50g - aromático.'},
      {id:'comino', name:'Comino', pricePerKg:140000, img:'images/comino.jpg', desc:'Bolsa de 50g - especia tradicional.'},
      {id:'pimienta', name:'Pimienta negra', pricePerKg:220000, img:'images/pimienta.jpg', desc:'Bolsa de 50g - molida.'}
    ]}
  ]},

  {sectionId:'organicos', title:'Orgánicos y Especiales', subsections:[
    {id:'organicos', title:'Orgánicos certificados', products:[
      {id:'tomate', name:'Tomate Orgánico', pricePerKg:27200, img:'images/tomate.jpg', desc:'Cultivado sin pesticidas.'},
      {id:'pepino', name:'Pepino Orgánico', pricePerKg:18000, img:'images/pepino.jpg ', desc:'Crujiente y fresco.'},
      {id:'aguacate', name:'Aguacate Orgánico', pricePerKg:48000, img:'images/aguacate.jpg ', desc:'Rico en grasas saludables.'}
    ]},
    {id:'exoticas', title:'Frutas exóticas', products:[
      {id:'maracuya', name:'Maracuyá', pricePerKg:38000, img:'images/maracuya.jpg', desc:'Sabor ácido y aromático.'},
      {id:'pitahaya', name:'Pitahaya', pricePerKg:56000, img:'images/pitaya.jpg', desc:'Color y textura única.'},
      {id:'uchuva', name:'Uchuva', pricePerKg:100000, img:'images/uchuva.jpg', desc:'Pequeñas bayas tropicales.'}
    ]}
  ]}
];


  /***** Estado de la app *****/
  let UNIT = 'kg'; // or 'lb'
  const KG_TO_LB = 2.20462;
  let cart = [];
  let activeSectionId = CATALOG[0].sectionId; // Por defecto la primera sección

    /***** Renderizado del catálogo con navegación por sección *****/
    function renderCatalog(){
      const root = document.getElementById('catalogRoot');
      root.innerHTML = '';
      const search = document.getElementById('searchInput').value.toLowerCase();

      // Renderizar botones de navegación de secciones
      let nav = document.getElementById('catalogNav');
      if (!nav) {
        nav = document.createElement('nav');
        nav.id = 'catalogNav';
        nav.style.marginBottom = '18px';
        root.parentNode.insertBefore(nav, root);
      }
      nav.innerHTML = '';
      CATALOG.forEach(section => {
        const btn = document.createElement('button');
        btn.className = 'section-btn' + (section.sectionId === activeSectionId ? ' active' : '');
        btn.textContent = section.title;
        btn.onclick = () => { activeSectionId = section.sectionId; renderCatalog(); };
        nav.appendChild(btn);
      });

      // Buscar la sección activa
      const section = CATALOG.find(s => s.sectionId === activeSectionId);
      if (!section) return;

  const secDiv = document.createElement('div');
  secDiv.className = 'panel panel-' + section.sectionId;
  const secH = document.createElement('h2'); secH.textContent = section.title; secDiv.appendChild(secH);

      section.subsections.forEach(sub => {
        // filtrar productos por búsqueda
        const matched = sub.products.filter(p => (p.name + ' ' + p.desc).toLowerCase().includes(search));
        if (matched.length === 0 && search) return; // omitir si no hay coincidencias

        const subDiv = document.createElement('div');
        subDiv.className = 'subsection';
        const subH = document.createElement('div'); subH.innerHTML = '<strong>' + sub.title + '</strong>';
        subDiv.appendChild(subH);

        const prodWrap = document.createElement('div'); prodWrap.className = 'products';

        (search ? matched : sub.products).forEach(p => {
          const card = document.createElement('div'); card.className = 'card';
          const img = document.createElement('img'); img.src = p.img; card.appendChild(img);
          const h3 = document.createElement('h3'); h3.textContent = p.name; card.appendChild(h3);
          const d = document.createElement('div'); d.className = 'muted'; d.textContent = p.desc; card.appendChild(d);

          const meta = document.createElement('div'); meta.className = 'meta';
          const priceDiv = document.createElement('div');
          const displayPrice = (UNIT === 'kg')? Math.round(p.pricePerKg) + ' / kg': Math.round(p.pricePerKg / KG_TO_LB) + ' / lb';

          priceDiv.innerHTML = '<div style="font-weight:700">' + displayPrice + '</div>';
          meta.appendChild(priceDiv);

          const controls = document.createElement('div');
          const qtyInput = document.createElement('input'); qtyInput.type = 'number'; qtyInput.min = '0.1'; qtyInput.step = '0.1'; qtyInput.value = '0.5'; qtyInput.className = 'qty';
          const addBtn = document.createElement('button'); addBtn.className = 'btn small'; addBtn.textContent = 'Agregar';
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

    /***** Carrito *****/
    function addToCart(productId, qty){
      if(!qty || qty<=0){alert('Ingrese una cantidad válida.');return}
      // qty is in current UNIT
      // convert qty to kg for internal storage
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
        const img = document.createElement('img'); img.src=p.img; row.appendChild(img);
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
      // Build summary
      let summary = 'Resumen de compra:\n\n';
      cart.forEach(item=>{
        const p = findProduct(item.id);
        const qty = item.qtyKg.toFixed(2) + ' kg';
        summary += `${p.name} - ${qty} - subtotal: ${(p.pricePerKg*item.qtyKg).toFixed(2)}\n`;
      });
      const total = cart.reduce((s,i)=> s + findProduct(i.id).pricePerKg * i.qtyKg,0).toFixed(2);
      summary += `\nTotal: ${total} pesos\n`;
      alert(summary + '\n(Checkout simulado)');
    }

    // Init
    renderCatalog(); renderCart();

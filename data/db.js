
(function(){
  const DB_NAME = 'tfv_db';
  const DB_VERSION = 1;

  function openDB(){
    return new Promise((resolve, reject)=>{
      const req = indexedDB.open(DB_NAME, DB_VERSION);
      req.onupgradeneeded = function(e){
        const db = e.target.result;
        if(!db.objectStoreNames.contains('users')) db.createObjectStore('users', {keyPath:'email'});
        if(!db.objectStoreNames.contains('products')) db.createObjectStore('products', {keyPath:'id'});
        if(!db.objectStoreNames.contains('carts')) db.createObjectStore('carts', {keyPath:'user'});
      };
      req.onsuccess = ()=> resolve(req.result);
      req.onerror = ()=> reject(req.error);
    });
  }

  async function withStore(storeName, mode, cb){
    const db = await openDB();
    return new Promise((resolve,reject)=>{
      const tx = db.transaction(storeName, mode);
      const store = tx.objectStore(storeName);
      const result = cb(store);
      tx.oncomplete = ()=> resolve(result);
      tx.onerror = ()=> reject(tx.error || new Error('IDB transaction error'));
    });
  }
  async function addOrUpdateUser(user){
    const db = await openDB();
    return new Promise((resolve,reject)=>{
      const tx = db.transaction('users','readwrite');
      const store = tx.objectStore('users');
      const req = store.put(user);
      req.onsuccess = ()=> resolve(req.result);
      req.onerror = ()=> reject(req.error);
    });
  }

  async function getUser(email){
    const db = await openDB();
    return new Promise((resolve,reject)=>{
      const tx = db.transaction('users','readonly');
      const store = tx.objectStore('users');
      const req = store.get(email);
      req.onsuccess = ()=> resolve(req.result);
      req.onerror = ()=> reject(req.error);
    });
  }

  async function getAllUsers(){
    const db = await openDB();
    return new Promise((resolve,reject)=>{
      const tx = db.transaction('users','readonly');
      const store = tx.objectStore('users');
      const req = store.getAll();
      req.onsuccess = ()=> resolve(req.result || []);
      req.onerror = ()=> reject(req.error);
    });
  }

  async function bulkAddUsers(users){
    const db = await openDB();
    return new Promise((resolve,reject)=>{
      const tx = db.transaction('users','readwrite');
      const store = tx.objectStore('users');
      users.forEach(u=>{ try{ store.put(u);}catch(e){} });
      tx.oncomplete = ()=> resolve();
      tx.onerror = ()=> reject(tx.error);
    });
  }

  // Products
  async function seedProductsFromCatalog(catalog){
    const db = await openDB();
    return new Promise((resolve,reject)=>{
      const tx = db.transaction('products','readwrite');
      const store = tx.objectStore('products');
      const reqAll = store.count();
      reqAll.onsuccess = function(){
        if(reqAll.result > 0){ resolve(); return; }
        try{
          catalog.forEach(section=>{
            section.subsections.forEach(sub=>{
              sub.products.forEach(p=>{
                const doc = Object.assign({}, p, {sectionId: section.sectionId, subsectionId: sub.id});
                try{ store.put(doc); }catch(e){}
              });
            });
          });
        }catch(e){}
        tx.oncomplete = ()=> resolve();
        tx.onerror = ()=> reject(tx.error);
      };
      reqAll.onerror = ()=> reject(reqAll.error);
    });
  }

  async function getProduct(id){
    const db = await openDB();
    return new Promise((resolve,reject)=>{
      const tx = db.transaction('products','readonly');
      const store = tx.objectStore('products');
      const req = store.get(id);
      req.onsuccess = ()=> resolve(req.result);
      req.onerror = ()=> reject(req.error);
    });
  }

  async function getAllProducts(){
    const db = await openDB();
    return new Promise((resolve,reject)=>{
      const tx = db.transaction('products','readonly');
      const store = tx.objectStore('products');
      const req = store.getAll();
      req.onsuccess = ()=> resolve(req.result || []);
      req.onerror = ()=> reject(req.error);
    });
  }
  async function saveCartForUser(userEmail, cart){
    return addOrUpdateUserCart(userEmail, cart);
  }

  async function addOrUpdateUserCart(userEmail, cart){
    const db = await openDB();
    return new Promise((resolve,reject)=>{
      const tx = db.transaction('carts','readwrite');
      const store = tx.objectStore('carts');
      const req = store.put({user: userEmail, cart});
      req.onsuccess = ()=> resolve();
      req.onerror = ()=> reject(req.error);
    });
  }

  async function getCartForUser(userEmail){
    const db = await openDB();
    return new Promise((resolve,reject)=>{
      const tx = db.transaction('carts','readonly');
      const store = tx.objectStore('carts');
      const req = store.get(userEmail);
      req.onsuccess = ()=> resolve((req.result && req.result.cart) || []);
      req.onerror = ()=> reject(req.error);
    });
  }
  window.DB = {
    openDB,
    addOrUpdateUser,
    getUser,
    getAllUsers,
    bulkAddUsers,
    seedProductsFromCatalog,
    getProduct,
    getAllProducts,
    saveCartForUser,
    getCartForUser
  };
})();

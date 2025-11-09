# Proyecto Tienda Frutas y Verduras Romero

Este repositorio contiene un prototipo de una tienda online de frutas y verduras en HTML/CSS/JS puro. Está orientado a demostración local.

Contenido principal
- `index.html` — página principal (cliente).
- `frutas.html`, `verduras.html`, `hierbas.html`, `organicos.html` — páginas por sección (multi-page support).
- `styles.css` — estilos.
- `script.js` — lógica del cliente (renderizado, carrito, autenticación, checkout simulado).
- `data/catalog.js` — datos del catálogo (productos por sección).
- `data/db.js` — wrapper simple de IndexedDB (users, products, carts) usado por la app.
 - `data/categories.js` — lista desacoplada y ligera de secciones y subsecciones (útil para menús o carruseles de categorías).
- `images/` — carpeta donde colocar las imágenes de los productos (no incluida automáticamente).

Requisitos
- Navegador moderno (Chrome, Edge, Firefox).
- Para evitar limitaciones de Web Crypto y rutas `file://`, sirve el proyecto con un servidor local.

Servir localmente (rápido)
- Con Python 3.x (PowerShell):

```powershell
python -m http.server 8000
```

- Con Node (http-server):

```powershell
npx http-server -p 8000
```

Abrir: http://localhost:8000/index.html

Notas sobre IndexedDB
- La app usa IndexedDB (`data/db.js`) para persistir usuarios, productos y carritos en el navegador.
- Al cargar, si hay usuarios guardados en `localStorage.tfv_users`, se migran automáticamente a IndexedDB.
- Revisa DevTools → Application → IndexedDB → `tfv_db` para ver datos.

Añadir imágenes
- Coloca las imágenes en la carpeta `images/` con los nombres que aparecen en `data/catalog.js`.
- Si una imagen no está disponible, la app usará `images/placeholder.jpg` como fallback (incluida en el proyecto).

Autenticación y seguridad
- El prototipo hace hashing de contraseñas en el navegador usando SHA-256 (Web Crypto), con un fallback no criptográfico para entornos `file://`.
- Para producción necesitas un backend y usar un KDF (PBKDF2 / Argon2) con salt y almacenamiento seguro.

Mejoras incluidas en esta versión
- Página de inicio (hero/promo) con información general de la tienda y promoción visible.
- Carrito que permite compra por peso y cambio de unidad entre kg/lb.
- Catálogo con 4 secciones principales, cada una con al menos 2 subsecciones y 3 productos por subsección.

Cómo probar rápido
1. Servir el proyecto con un servidor local (ej. `python -m http.server 8000` o `npx http-server -p 8000`).
2. Abrir `http://localhost:8000/index.html`.
3. Navegar por secciones, añadir productos al carrito (usar cantidades decimales) y cambiar la unidad con el botón "Cambiar".

Notas finales
- Este es un prototipo frontend. Para pasar a producción se recomienda añadir un backend para procesar pagos, almacenar usuarios de forma segura y validar precios al crear pedidos.

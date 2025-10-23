# Tienda Frutas y Verduras — Prototipo

Este repositorio contiene un prototipo de una tienda online de frutas y verduras en HTML/CSS/JS puro. Está orientado a demostración local y entregas escolares/profesor.

Contenido principal
- `index.html` — página principal (cliente).
- `frutas.html`, `verduras.html`, `hierbas.html`, `organicos.html` — páginas por sección (multi-page support).
- `styles.css` — estilos.
- `script.js` — lógica del cliente (renderizado, carrito, autenticación, checkout simulado).
- `data/catalog.js` — datos del catálogo (productos por sección).
- `data/db.js` — wrapper simple de IndexedDB (users, products, carts) usado por la app.
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
- Si una imagen no está disponible, la app usará `images/placeholder.png` como fallback.

Autenticación y seguridad
- El prototipo hace hashing de contraseñas en el navegador usando SHA-256 (Web Crypto), con un fallback no criptográfico para entornos `file://`.
- Para producción necesitas un backend y usar un KDF (PBKDF2 / Argon2) con salt y almacenamiento seguro.

Siguientes pasos recomendados
- Implementar un backend real (Express + SQLite/Postgres o usar Supabase/Firebase) para persistencia y autenticación segura.
- Mejorar el KDF en cliente si no hay servidor (temporal).
- Añadir pruebas unitarias y validación de inputs.

Contacto
- Si quieres que te ayude a desplegarlo o a convertir esto en una app full-stack, dime y te doy los pasos.

---
Generado automáticamente por el asistente de desarrollo local.
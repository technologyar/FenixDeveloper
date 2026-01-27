import { auth } from "./firebase.js";
import {
  GoogleAuthProvider,
  signInWithPopup,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

// ===== Splash (entrada) =====
const splash = document.getElementById("splash");
const SPLASH_MS = 2200;

window.addEventListener("load", () => {
  setTimeout(() => {
    splash.classList.add("is-hidden");
    splash.setAttribute("aria-hidden", "true");
  }, SPLASH_MS);
});

// ===== Menú lateral =====
const btnMenu = document.getElementById("btnMenu");
const btnCloseMenu = document.getElementById("btnCloseMenu");
const sideMenu = document.getElementById("sideMenu");
const overlay = document.getElementById("overlay");

function openMenu(){
  sideMenu.classList.add("is-open");
  sideMenu.setAttribute("aria-hidden", "false");
  btnMenu.setAttribute("aria-expanded", "true");
  overlay.hidden = false;
}
function closeMenu(){
  sideMenu.classList.remove("is-open");
  sideMenu.setAttribute("aria-hidden", "true");
  btnMenu.setAttribute("aria-expanded", "false");
  if (authModal.hidden === true) overlay.hidden = true;
}

// ====== MODAL AUTH ======
const btnEnter = document.getElementById("btnEnter");
const authModal = document.getElementById("authModal");
const btnCloseAuth = document.getElementById("btnCloseAuth");

authModal.hidden = true;
authModal.setAttribute("aria-hidden", "true");

function openAuth(){
  authModal.hidden = false;
  authModal.setAttribute("aria-hidden", "false");
  overlay.hidden = false;
}
function closeAuth(){
  authModal.hidden = true;
  authModal.setAttribute("aria-hidden", "true");
  if (!sideMenu.classList.contains("is-open")) overlay.hidden = true;
}

// Eventos del menú
btnMenu.addEventListener("click", openMenu);
btnCloseMenu.addEventListener("click", closeMenu);
btnCloseAuth.addEventListener("click", closeAuth);

// Click fuera del cuadro cierra el modal
authModal.addEventListener("click", (e) => {
  if (e.target === authModal) closeAuth();
});

// Overlay cierra TODO
overlay.addEventListener("click", () => {
  closeMenu();
  closeAuth();
  closeFab();
});

// Cierra con ESC
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    closeMenu();
    closeAuth();
    closeFab();
  }
});

// ===== FAB =====
const fab = document.getElementById("fab");
const fabMenu = document.getElementById("fabMenu");

function openFab(){
  fabMenu.classList.add("is-open");
  fabMenu.setAttribute("aria-hidden", "false");
  fab.setAttribute("aria-expanded", "true");
}
function closeFab(){
  fabMenu.classList.remove("is-open");
  fabMenu.setAttribute("aria-hidden", "true");
  fab.setAttribute("aria-expanded", "false");
}
function toggleFab(){
  if (fabMenu.classList.contains("is-open")) closeFab();
  else openFab();
}
fab.addEventListener("click", toggleFab);

// ===== Carrito (demo) =====
const btnAddCart = document.getElementById("btnAddCart");
const cartCount = document.getElementById("cartCount");

btnAddCart.addEventListener("click", () => {
  const current = parseInt(cartCount.textContent || "0", 10);
  cartCount.textContent = String(current + 1);
});

// ===== Vistas del modal =====
const viewRegister = document.getElementById("viewRegister");
const viewLogin = document.getElementById("viewLogin");
const viewEmailLogin = document.getElementById("viewEmailLogin");

function showView(which){
  viewRegister.hidden = true;
  viewLogin.hidden = true;
  viewEmailLogin.hidden = true;
  which.hidden = false;
}

// Abrir modal desde "Entrar" -> muestra LOGIN
btnEnter.addEventListener("click", () => {
  showView(viewLogin);
  openAuth();
});

// Links cambiar vistas
document.getElementById("goLogin").addEventListener("click", (e)=>{ e.preventDefault(); showView(viewLogin); });
document.getElementById("goRegister").addEventListener("click", (e)=>{ e.preventDefault(); showView(viewRegister); });
document.getElementById("goRegister2").addEventListener("click", (e)=>{ e.preventDefault(); showView(viewRegister); });

document.getElementById("btnEmailLogin").addEventListener("click", ()=> showView(viewEmailLogin));
document.getElementById("backToLogin").addEventListener("click", ()=> showView(viewLogin));

// ===== Firebase AUTH real =====

// Google login (desde LOGIN)
const googleProvider = new GoogleAuthProvider();
document.getElementById("btnGoogleLogin").addEventListener("click", async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    alert("Bienvenido " + (result.user.displayName || result.user.email));
    closeAuth();
  } catch (e) {
    alert(e.message);
  }
});

// Google register (desde REGISTER) -> igual, Google no “registra”, simplemente inicia sesión
document.getElementById("btnGoogleRegister").addEventListener("click", async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    alert("Bienvenido " + (result.user.displayName || result.user.email));
    closeAuth();
  } catch (e) {
    alert(e.message);
  }
});

// Ir a formulario email desde REGISTER
document.getElementById("btnEmailRegister").addEventListener("click", () => {
  showView(viewEmailLogin);
});

// Formulario email: LOGIN o REGISTER según lo que quieras
// (Aquí haremos 2 botones si deseas: uno para iniciar y otro para registrarse)
// Si tu HTML solo tiene 1 submit, por defecto lo usaré como LOGIN:
const emailForm = document.getElementById("emailForm");
emailForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  // INTENTO 1: iniciar sesión
  try {
    await signInWithEmailAndPassword(auth, email, password);
    alert("Sesión iniciada ✅");
    closeAuth();
  } catch (errLogin) {
    // INTENTO 2: si no existe, crear cuenta
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      alert("Cuenta creada ✅");
      closeAuth();
    } catch (errCreate) {
      alert(errCreate.message);
    }
  }
});

// Cambiar texto del botón "Entrar" si hay usuario
onAuthStateChanged(auth, (user) => {
  if (user) {
    btnEnter.innerHTML = `<i class="fa-regular fa-user"></i> <span class="only-desktop">${user.displayName || user.email}</span>`;
  } else {
    btnEnter.innerHTML = `<i class="fa-regular fa-user"></i> <span class="only-desktop">Entrar</span>`;
  }
});



/* =========================
   CARRITO (LocalStorage)
========================= */

const CART_KEY = "carrito_ar_technology";

function getCart() {
  try { return JSON.parse(localStorage.getItem(CART_KEY)) || []; }
  catch { return []; }
}
function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

function formatPEN(n) {
  return `S/ ${Number(n).toFixed(2)}`;
}

function cartCount(cart) {
  return cart.reduce((acc, it) => acc + it.qty, 0);
}
function cartTotal(cart) {
  return cart.reduce((acc, it) => acc + (it.price * it.qty), 0);
}

function addToCart(product) {
  const cart = getCart();
  const idx = cart.findIndex(p => p.id === product.id);
  if (idx >= 0) cart[idx].qty += 1;
  else cart.push({ ...product, qty: 1 });
  saveCart(cart);
  updateCartUI();
}

function changeQty(id, delta) {
  const cart = getCart();
  const idx = cart.findIndex(p => p.id === id);
  if (idx < 0) return;

  cart[idx].qty += delta;
  if (cart[idx].qty <= 0) cart.splice(idx, 1);

  saveCart(cart);
  updateCartUI();
}

function removeItem(id) {
  const cart = getCart().filter(p => p.id !== id);
  saveCart(cart);
  updateCartUI();
}

/* =========================
   UI: Drawer + badge
========================= */

const btnCarrito = document.getElementById("btnCarrito");
const badgeCarrito = document.getElementById("badgeCarrito");
const overlayCarrito = document.getElementById("overlayCarrito");
const drawerCarrito = document.getElementById("drawerCarrito");
const cerrarCarrito = document.getElementById("cerrarCarrito");

const listaCarrito = document.getElementById("listaCarrito");
const itemsCount = document.getElementById("itemsCount");
const totalCarrito = document.getElementById("totalCarrito");

function openCart() {
  overlayCarrito.classList.remove("hidden");
  drawerCarrito.classList.remove("hidden");
  drawerCarrito.setAttribute("aria-hidden", "false");
}

function closeCart() {
  overlayCarrito.classList.add("hidden");
  drawerCarrito.classList.add("hidden");
  drawerCarrito.setAttribute("aria-hidden", "true");
}

if (btnCarrito) btnCarrito.addEventListener("click", openCart);
if (cerrarCarrito) cerrarCarrito.addEventListener("click", closeCart);
if (overlayCarrito) overlayCarrito.addEventListener("click", closeCart);

function renderCartItems(cart) {
  if (!listaCarrito) return;

  if (cart.length === 0) {
    listaCarrito.innerHTML = `<p style="opacity:.8;margin-top:10px;">Tu carrito está vacío.</p>`;
    return;
  }

  listaCarrito.innerHTML = cart.map(item => `
    <div class="item-carrito">
      <img src="${item.img || ""}" alt="${item.name}">
      <div class="item-info">
        <div class="item-top">
          <div>
            <div class="item-nombre">${item.name}</div>
            <div class="item-precio">${formatPEN(item.price)}</div>
          </div>
          <button class="btn-delete" data-del="${item.id}" title="Eliminar">🗑️</button>
        </div>

        <div class="qty-row">
          <div class="qty-control">
            <button data-minus="${item.id}">−</button>
            <span>${item.qty}</span>
            <button data-plus="${item.id}">+</button>
          </div>

          <div class="item-subtotal">${formatPEN(item.price * item.qty)}</div>
        </div>
      </div>
    </div>
  `).join("");

  // eventos del drawer (delegación)
  listaCarrito.querySelectorAll("[data-plus]").forEach(btn => {
    btn.addEventListener("click", () => changeQty(btn.dataset.plus, +1));
  });
  listaCarrito.querySelectorAll("[data-minus]").forEach(btn => {
    btn.addEventListener("click", () => changeQty(btn.dataset.minus, -1));
  });
  listaCarrito.querySelectorAll("[data-del]").forEach(btn => {
    btn.addEventListener("click", () => removeItem(btn.dataset.del));
  });
}

function updateCartUI() {
  const cart = getCart();
  const count = cartCount(cart);
  const total = cartTotal(cart);

  if (badgeCarrito) badgeCarrito.textContent = count;
  if (itemsCount) itemsCount.textContent = count;
  if (totalCarrito) totalCarrito.textContent = formatPEN(total);

  renderCartItems(cart);
}

// iniciar UI al cargar
document.addEventListener("DOMContentLoaded", updateCartUI);

/* =========================
   CONECTAR BOTONES "AGREGAR"
   (usa data-attributes)
========================= */

/*
En cada producto, tu botón "Agregar" o ícono descarga debe tener:
class="btnAgregar"
data-id="tidal"
data-name="TIDAL"
data-price="12"
data-img="ruta/imagen.png"
*/

document.addEventListener("click", (e) => {
  const btn = e.target.closest(".btnAgregar");
  if (!btn) return;

  const product = {
    id: btn.dataset.id,
    name: btn.dataset.name,
    price: Number(btn.dataset.price),
    img: btn.dataset.img || ""
  };

  if (!product.id || !product.name || Number.isNaN(product.price)) {
    console.warn("Faltan data-attributes en el botón Agregar");
    return;
  }

  addToCart(product);
});

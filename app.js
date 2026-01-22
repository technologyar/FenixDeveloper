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

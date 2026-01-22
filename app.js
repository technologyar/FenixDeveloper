// ===== Splash (entrada) =====
const splash = document.getElementById("splash");

// Tiempo de splash (ms)
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

  // SOLO ocultar overlay si el modal NO está abierto
  if (authModal.hidden === true) overlay.hidden = true;
}

// ====== MODAL REGISTRO (ENTRAR) ======
const btnEnter = document.getElementById("btnEnter");      // <- botón Entrar (en el header)
const authModal = document.getElementById("authModal");    // <- modal Regístrate (en el HTML)
const btnCloseAuth = document.getElementById("btnCloseAuth"); // <- X cerrar


// Asegurar que el modal inicie cerrado
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

  // SOLO ocultar overlay si el menú lateral NO está abierto
  if (!sideMenu.classList.contains("is-open")) overlay.hidden = true;
}

// Eventos del menú
btnMenu.addEventListener("click", openMenu);
btnCloseMenu.addEventListener("click", closeMenu);

// Evento del modal (click en Entrar)
btnEnter.addEventListener("click", openAuth);
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

// ===== FAB (botón azul “...”) =====
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

// Demo: acciones
fabMenu.addEventListener("click", (e) => {
  const btn = e.target.closest("button");
  if (!btn) return;

  if (btn.classList.contains("phone")) alert("Teléfono: aquí va tu número");
  if (btn.classList.contains("email")) alert("Email: aquí va tu correo");
  if (btn.classList.contains("fb")) alert("Facebook: aquí va tu enlace");
  if (btn.classList.contains("wa")) alert("WhatsApp: aquí va tu enlace wa.me");
  if (btn.classList.contains("chat")) alert("Chat: aquí abres tu chat");

  closeFab();
});

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
  // ocultar todas
  viewRegister.hidden = true;
  viewLogin.hidden = true;
  viewEmailLogin.hidden = true;

  // mostrar una
  which.hidden = false;
}

// Abrir modal desde "Entrar" -> muestra LOGIN (como Wix)
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

// ===== Botones: abrir Google/Facebook (DEMO) =====
// Esto abre las páginas reales. Para que sea login real necesitas OAuth y hosting https.
function popup(url){
  window.open(url, "authPopup", "width=520,height=700");
}

// Login
document.getElementById("btnGoogleLogin").addEventListener("click", ()=> popup("https://accounts.google.com/"));
document.getElementById("btnFacebookLogin").addEventListener("click", ()=> popup("https://www.facebook.com/login/"));
document.getElementById("btnGoogleMini").addEventListener("click", ()=> popup("https://accounts.google.com/"));
document.getElementById("btnFacebookMini").addEventListener("click", ()=> popup("https://www.facebook.com/login/"));

// Register
document.getElementById("btnGoogleRegister").addEventListener("click", ()=> popup("https://accounts.google.com/"));
document.getElementById("btnFacebookRegister").addEventListener("click", ()=> popup("https://www.facebook.com/login/"));
document.getElementById("btnEmailRegister").addEventListener("click", ()=> {
  // de momento te muestro el formulario email (luego lo convertimos a registro)
  showView(viewEmailLogin);
});

// Submit email (demo)
document.getElementById("emailForm").addEventListener("submit", (e)=>{
  e.preventDefault();
  alert("Demo: aquí iría la validación real del email/contraseña.");
});

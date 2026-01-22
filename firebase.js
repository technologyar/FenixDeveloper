// firebase.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyC5eIq5F7HTBxV-Cl9WRCEDE4JgZHPdGsI",
  authDomain: "fenixdeveloper-2e0b3.firebaseapp.com",
  projectId: "fenixdeveloper-2e0b3",
  storageBucket: "fenixdeveloper-2e0b3.firebasestorage.app",
  messagingSenderId: "945653442431",
  appId: "1:945653442431:web:a774d952f00eb477e81c4a"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

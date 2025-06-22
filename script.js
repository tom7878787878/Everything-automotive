// Firebase setup
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyDe84hTd3Xw56hZVsJ4z4MBogeQU-EhPRA",
  authDomain: "auto-affiliate-6fa46.firebaseapp.com",
  projectId: "auto-affiliate-6fa46",
  storageBucket: "auto-affiliate-6fa46.firebasestorage.app",
  messagingSenderId: "429244578986",
  appId: "1:429244578986:web:aad251eaf24426dcc364d3"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const loginForm = document.getElementById("auth-form");
const registerForm = document.getElementById("register-form");
const logoutBtn = document.getElementById("logout-btn");
const authStatus = document.getElementById("auth-status");
const registerStatus = document.getElementById("register-status");
const garageForm = document.getElementById("garage-form");
const garageStatus = document.getElementById("garage-status");
const amazonBtn = document.getElementById("search-amazon");
const resultsDiv = document.getElementById("results");

loginForm?.addEventListener("submit", (e) => {
  e.preventDefault();
  const email = document.getElementById("username").value;
  const password = document.getElementById("password").value;
  signInWithEmailAndPassword(auth, email, password)
    .then(() => authStatus.textContent = "Logged in!")
    .catch(err => authStatus.textContent = err.message);
});

registerForm?.addEventListener("submit", (e) => {
  e.preventDefault();
  const email = document.getElementById("reg-username").value;
  const password = document.getElementById("reg-password").value;
  createUserWithEmailAndPassword(auth, email, password)
    .then(() => registerStatus.textContent = "Registered!")
    .catch(err => registerStatus.textContent = err.message);
});

logoutBtn?.addEventListener("click", () => {
  signOut(auth).then(() => authStatus.textContent = "Logged out");
});

onAuthStateChanged(auth, user => {
  if (user) {
    logoutBtn.style.display = "block";
    loadGarage();
  } else {
    logoutBtn.style.display = "none";
  }
});

garageForm?.addEventListener("submit", (e) => {
  e.preventDefault();
  const vehicle = {
    make: document.getElementById("make").value,
    model: document.getElementById("model").value,
    year: document.getElementById("year").value,
    engine: document.getElementById("engine").value
  };
  localStorage.setItem("garage", JSON.stringify(vehicle));
  garageStatus.textContent = "Vehicle saved!";
});

function loadGarage() {
  const vehicle = JSON.parse(localStorage.getItem("garage"));
  if (vehicle) {
    document.getElementById("make").value = vehicle.make;
    document.getElementById("model").value = vehicle.model;
    document.getElementById("year").value = vehicle.year;
    document.getElementById("engine").value = vehicle.engine;
  }
}

amazonBtn?.addEventListener("click", () => {
  const vehicle = JSON.parse(localStorage.getItem("garage"));
  if (!vehicle) return resultsDiv.textContent = "Please save your vehicle first.";
  const query = `${vehicle.year} ${vehicle.make} ${vehicle.model} ${vehicle.engine} parts`;
  const affiliateTag = "YOUR_AMAZON_TAG";
  const amazonURL = `https://www.amazon.com/s?k=${encodeURIComponent(query)}&tag=${affiliateTag}`;
  resultsDiv.innerHTML = `<a href="${amazonURL}" target="_blank">Search Amazon for ${vehicle.make} parts</a>`;
});
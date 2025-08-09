// Populate dropdowns and handle language switch
const states = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
  "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka",
  "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram",
  "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu",
  "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal",
  "Andaman & Nicobar"
];

const stateSelect = document.getElementById("state");
states.forEach(state => {
  const option = document.createElement("option");
  option.textContent = state;
  stateSelect.appendChild(option);
});

const schemeSelect = document.getElementById("scheme");

function populateSchemes(language) {
  schemeSelect.innerHTML = "";
  translations[language].schemes.forEach(scheme => {
    const option = document.createElement("option");
    option.textContent = scheme;
    schemeSelect.appendChild(option);
  });
}

// Language switching
const langSelector = document.getElementById("languageSelector");

function applyLanguage(lang) {
  const t = translations[lang];
  document.getElementById("title").textContent = t.title;
  document.getElementById("welcome").textContent = t.welcome;
  document.getElementById("intro").textContent = t.intro;
  document.getElementById("form_heading").textContent = t.form_heading;
  document.getElementById("labelName").textContent = t.labelName;
  document.getElementById("labelPhone").textContent = t.labelPhone;
  document.getElementById("labelState").textContent = t.labelState;
  document.getElementById("labelScheme").textContent = t.labelScheme;
  document.getElementById("submitBtn").textContent = t.submitBtn;
  document.getElementById("schemes_title").textContent = t.schemes_title;
  document.getElementById("schemes_desc").textContent = t.schemes_desc;
  document.getElementById("alerts_title").textContent = t.alerts_title;
  document.getElementById("alerts_desc").textContent = t.alerts_desc;
  document.getElementById("prices_title").textContent = t.prices_title;
  document.getElementById("prices_desc").textContent = t.prices_desc;
  document.getElementById("language_title").textContent = t.language_title;
  document.getElementById("language_desc").textContent = t.language_desc;

  populateSchemes(lang);
}

langSelector.addEventListener("change", () => {
  applyLanguage(langSelector.value);
});

applyLanguage("en"); // Default to English

// Firebase OTP and Form Logic
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getAuth,
  RecaptchaVerifier,
  signInWithPhoneNumber
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import {
  getFirestore,
  collection,
  addDoc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyBjfW-mQInjOdDGJ62PQ6zFvI18-Ls3xU0",
  authDomain: "krushi-setu-01.firebaseapp.com",
  projectId: "krushi-setu-01",
  storageBucket: "krushi-setu-01.appspot.com",
  messagingSenderId: "1069217279616",
  appId: "1:1069217279616:web:a36d8f2e18c2301ac4d4df"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
  'size': 'normal',
  'callback': (response) => {
    console.log("Recaptcha verified");
  }
});

let confirmationResult;

document.getElementById("send-otp").addEventListener("click", () => {
  const phoneNumber = document.getElementById("phone").value;
  const appVerifier = window.recaptchaVerifier;

  signInWithPhoneNumber(auth, "+91" + phoneNumber, appVerifier)
    .then(result => {
      confirmationResult = result;
      alert("OTP sent!");
    })
    .catch(error => {
      alert("Error sending OTP: " + error.message);
    });
});

document.getElementById("verify-otp").addEventListener("click", () => {
  const code = document.getElementById("otp").value;
  confirmationResult.confirm(code)
    .then(result => {
      alert("Phone verified!");
    })
    .catch(error => {
      alert("Invalid OTP.");
    });
});

document.getElementById("schemeForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const name = document.getElementById("name").value;
  const phone = document.getElementById("phone").value;
  const state = document.getElementById("state").value;
  const scheme = document.getElementById("scheme").value;

  try {
    await addDoc(collection(db, "farmerForms"), {
      name,
      phone,
      state,
      scheme,
      timestamp: new Date()
    });
    alert("Form submitted successfully!");
    document.getElementById("schemeForm").reset();
  } catch (error) {
    alert("Error submitting form: " + error.message);
  }
});

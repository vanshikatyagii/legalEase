// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBErAB9GwzYl2-IGFw5nvEllMFX8LO-X34",
  authDomain: "legalease-login-page.firebaseapp.com",
  projectId: "legalease-login-page",
  storageBucket: "legalease-login-page.firebasestorage.app",
  messagingSenderId: "2773922235",
  appId: "1:2773922235:web:17cda61dd7223c57ed149e"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export default app;
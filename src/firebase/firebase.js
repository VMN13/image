// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";


const firebaseConfig = {
  apiKey: "AIzaSyD5v2M6QumAgrMf8oieIw6NEanyeU3tM_g",
  authDomain: "images-6c290.firebaseapp.com",
  projectId: "images-6c290",
  storageBucket: "images-6c290.firebasestorage.app",
  messagingSenderId: "378109781614",
  appId: "1:378109781614:web:ec3757396f178076aae87f",
  measurementId: "G-H25F8HN4VC"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth, app };


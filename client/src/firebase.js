// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "thaika-construction-easy.firebaseapp.com",
  projectId: "thaika-construction-easy",
  storageBucket: "thaika-construction-easy.appspot.com",
  messagingSenderId: "536122096195",
  appId: "1:536122096195:web:39e24f7df2700138e272f6"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
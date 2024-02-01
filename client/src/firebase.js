// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "real-estate-d0863.firebaseapp.com",
  projectId: "real-estate-d0863",
  storageBucket: "real-estate-d0863.appspot.com",
  messagingSenderId: "847318552692",
  appId: "1:847318552692:web:2a80624aef69507c55c121"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
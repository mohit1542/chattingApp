// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
//import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import {getAuth, onAuthState, createUserWithEmailAndPassword} from 'firebase/auth'
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional


const firebaseConfig = {
  apiKey: "AIzaSyCvPiy_M7ydwXjOgHQUhbqFfTLk8eKZE44",
  authDomain: "chatting-app-c522a.firebaseapp.com",
  projectId: "chatting-app-c522a",
  storageBucket: "chatting-app-c522a.appspot.com",
  messagingSenderId: "669511753729",
  appId: "1:669511753729:web:7bdbeda6cb858952a6e000",
  measurementId: "G-MLTVRCC2G0",
  storageBucket: "chatting-app-c522a.appspot.com",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// const analytics = getAnalytics(app);
const db = getFirestore(app);

const auth =getAuth(app);

// Initialize Cloud Storage and get a reference to the service
const storage = getStorage(app);

export {auth,db, storage};
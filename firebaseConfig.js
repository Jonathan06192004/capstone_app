// firebaseConfig.js
import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyCMC6ey1OowRw138NJZOKY9t7f12BlczS0",
  authDomain: "clearmeter-app.firebaseapp.com",
  projectId: "clearmeter-app",
  storageBucket: "clearmeter-app.firebasestorage.app",
  messagingSenderId: "1054590461381",
  appId: "1:1054590461381:android:7dd306d975c11ad40c97ac"
};

export const app = initializeApp(firebaseConfig);

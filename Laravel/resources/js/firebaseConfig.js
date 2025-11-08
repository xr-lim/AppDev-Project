import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyBX3FxX-oM692yMykor9DXEf3jh-wSlUk0",
  authDomain: "utm-report-system.firebaseapp.com",
  projectId: "utm-report-system",
  storageBucket: "utm-report-system.firebasestorage.app",
  messagingSenderId: "861693293959",
  appId: "1:861693293959:web:58e42d7687e460e27c0f22",
  measurementId: "G-0TBKBELNKP"
};

export const app = initializeApp(firebaseConfig);
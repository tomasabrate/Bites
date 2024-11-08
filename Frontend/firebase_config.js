// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBQMcpWhyYv0g8DcbwJNDyBgr1dKKew9Ng",
  authDomain: "bites-d97c7.firebaseapp.com",
  projectId: "bites-d97c7",
  storageBucket: "bites-d97c7.firebasestorage.app",
  messagingSenderId: "450223259168",
  appId: "1:450223259168:web:5e747173f8cc2871e54645"
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);

export default firebaseApp;
//ClienteID web: 450223259168-tsl71mm95565km09onfvn7fe0r01o48n.apps.googleusercontent.com
//ClienteID android 1: 450223259168-rfhmemkmk1k8sppunio88bl2l2rqqqv6.apps.googleusercontent.com
//ClienteID android 2: 450223259168-iec5tvfuilstub7o2kqt4ta5mrqer1gl.apps.googleusercontent.com
//key=AIzaSyBPwmsl677QH-kwbxYi44bUANnqm9A_HOs

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
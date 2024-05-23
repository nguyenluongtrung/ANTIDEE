// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAuth } from "firebase/auth";
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
	apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
	authDomain: 'antidee-18c14.firebaseapp.com',
	projectId: 'antidee-18c14',
	storageBucket: 'antidee-18c14.appspot.com',
	messagingSenderId: '105386810790',
	appId: '1:105386810790:web:8a482bc27e9f5120cec367',
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const app = initializeApp(firebaseConfig);
const auth = getAuth(app)

export {app,auth, firebase};
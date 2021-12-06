import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/storage';
const firebaseConfig = {
  apiKey: "AIzaSyAIII4BX-ppO0maAuvfoRbP0Dc9glvzPpQ",
  authDomain: "daily-moments-37e15.firebaseapp.com",
  databaseURL: "https://daily-moments-37e15.firebaseapp.com",
  projectId: "daily-moments-37e15",
  storageBucket: "daily-moments-37e15.appspot.com",
  messagingSenderId: "158283668378",
  appId: "1:158283668378:web:f26291bc69b92daeeab823",
  measurementId: "G-7E9YJPCZX7"
  
};

const app = firebase.initializeApp(firebaseConfig);
export const auth = app.auth();
export const firestore = app.firestore();
export const store = app.storage();

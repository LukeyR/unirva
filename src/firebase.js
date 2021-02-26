import firebase from 'firebase/app';
import "firebase/firestore";
import "firebase/storage";
import 'firebase/auth';

/**
 * This file will be used to load and access all firebase components that we use (example firestore, authentication etc)
 */

/**
 * Initializing the firebase app.
 */
firebase.initializeApp({
    apiKey: "AIzaSyCkkDn22OebVmZLKm3mcmaQdydoZRRCIiY",
    authDomain: "ipproject-27ae8.firebaseapp.com",
    projectId: "ipproject-27ae8",
    storageBucket: "ipproject-27ae8.appspot.com",
    messagingSenderId: "640003406501",
    appId: "1:640003406501:web:6b5620b6e19432b52f6b4c",
    measurementId: "G-VF6R3H8V80"
  });

const storage = firebase.storage();
const auth = firebase.auth();

export {auth, storage, firebase as default};
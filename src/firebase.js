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
    apiKey: process.env.REACT_APP_apiKey,
    authDomain: process.env.REACT_APP_authDomain,
    projectId: process.env.REACT_APP_projectId,
    storageBucket: process.env.REACT_APP_storageBucket,
    messagingSenderId: process.env.REACT_APP_messagingSenderId,
    appId: process.env.REACT_APP_appId,
    measurementId: process.env.REACT_APP_measurementId
});

const storage = firebase.storage();
const auth = firebase.auth();

export {auth, storage, firebase as default};
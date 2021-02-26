import React from 'react';
import './App.css';
import firebase from 'firebase/app';
import {auth} from "./firebase";

function SignIn(){
    const signInWithGoogle = () => {
        const provider = new firebase.auth.GoogleAuthProvider();
        auth.signInWithPopup(provider);
      }
    return (
        <div className='App-d'>
            <h1>Sign in</h1>
            <button className="sign-in" onClick={signInWithGoogle}>Sign in with Google</button>
        </div>
    )
}

export default SignIn;
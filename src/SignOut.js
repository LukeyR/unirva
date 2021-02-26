import React from 'react';
import './App.css';
import firebase from 'firebase/app';
import {auth} from "./firebase";

function SignOut(){
    return auth.currentUser && (
        <button className="sign-out" onClick={() => auth.signOut()}>Sign Out</button>
      )
}

export default SignOut;
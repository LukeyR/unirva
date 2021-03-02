import React, {useState} from "react";
import { Redirect } from "react-router-dom";
import '../App.css';
import firebase from 'firebase/app';
import firebaseConfig from "../firebase";

const Register = () => {
  const [currentUser, setCurrentUser] = useState(null);    
  const handleSubmit = async (e) => {
    e.preventDefault();    
    const { email, password } = e.target.elements;
    try {
        if(email.value.includes(".ac")||email.value.includes(".edu")){
            const new_user = await firebaseConfig.auth().createUserWithEmailAndPassword(email.value, password.value);
            if(new_user.user != null){
                new_user.user.sendEmailVerification();
                alert("Verification email sent.");
            }
            setCurrentUser(true);
        }
        else{
            throw 'Email is not a university email!';
        }
    } catch (error) {
        alert(error);
    }
  };
  if (currentUser) {
      return <Redirect to="/Profile" />;
  }
  return (
    <div>
      <h1>Sign Up</h1>
      <form onSubmit={handleSubmit}>
        <label for="email">Email</label>
        <input type="email" name="email" placeholder="Email" />
        <label for="password">Password</label>
        <input type="password" name="password" placeholder="Password" />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default Register;
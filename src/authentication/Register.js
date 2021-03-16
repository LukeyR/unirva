import React, {useState} from "react";
import { Redirect } from "react-router-dom";
import '../App.css';
import firebase from 'firebase/app';
import firebaseConfig, { auth } from "../firebase";
import { AlternateEmail } from "@material-ui/icons";

const Register = () => {
  const [currentUser, setCurrentUser] = useState(null);    
  const handleSubmit = async (e) => {
    e.preventDefault();    
    const { email, password, password2, firstname, lastname, university } = e.target.elements;
    try {
        if((email.value.includes(".ac")||email.value.includes(".edu"))){
          if(password.value===password2.value){
            const new_user = await firebaseConfig.auth().createUserWithEmailAndPassword(email.value, password.value);
            await auth.currentUser.updateProfile({displayName: firstname.value + " " + lastname.value})
            var userid = auth.currentUser.uid;
            var db = firebase.firestore();
            db.collection('users').doc(userid).set({
              ID: userid,
              Name: firstname.value,
              LastName: lastname.value,
              University: university.value,
              chatsNo: 0
            });
            if(new_user.user != null){
              new_user.user.sendEmailVerification();
              alert("Verification email sent.");
            }
            else{
              alert('user null');
            }
            setCurrentUser(true);
          }
          else{
            console.log(password);
            console.log(password2);
            throw 'Passwords do not match';
          }
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
        <label for="firstname">First Name</label>
        <input type="firstname" name="firstname" placeholder="First Name" />
        <label for="lastname">Last Name</label>
        <input type="lastname" name="lastname" placeholder="Lastname" />
        <label for="email">Email</label>
        <input type="email" name="email" placeholder="Email" />
        <label for="password">Password</label>
        <input type="password" name="password" placeholder="Password" />
        <label for="password">Confirm Password</label>
        <input type="password" name="password2" placeholder="Password" />
        <label for="university">University</label>
        <input type="university" name="university" placeholder="University" />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default Register;
import React, {useContext} from "react";
import {useHistory} from "react-router-dom";
import {AuthContext} from "../Auth";
import '../App.css';
import firebaseConfig from "../firebase";

const SignIn = () => {
    const history = useHistory();
    const handleSubmit = (e) => {
        e.preventDefault();
        const {email, password} = e.target.elements;
        try {
            firebaseConfig.auth().signInWithEmailAndPassword(email.value, password.value);
        } catch (error) {
            alert(error);
        }
    };
    const {currentUser} = useContext(AuthContext);
    if (currentUser) {
        history.push("./")
    }
    return (
        <div>
            <h1>Sign In</h1>
            <form onSubmit={handleSubmit}>
                <label>Email</label>
                <input type="email" name="email" placeholder="Email"/>
                <label>Password</label>
                <input type="password" name="password" placeholder="Password"/>
                <button type="submit">Submit</button>
            </form>
        </div>
    );
};

export default SignIn;
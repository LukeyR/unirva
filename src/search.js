import React from 'react';
import { useLocation, useParams } from "react-router-dom";
import './Home.css';
import firebase from './firebase';


const firestore = firebase.firestore();

function Search(){

    let pathLoc = useLocation();
    var searchTerm = pathLoc.pathname.replace('/search=','');
    
   
    return(
        <div>
            <h1>Search Results for {searchTerm}</h1> 
        </div>
    )
}




export default Search;
import React from 'react';
import { useLocation, useParams } from "react-router-dom";
import './Home.css';
import firebase from './firebase';


const firestore = firebase.firestore();

function Search(){

    let pathLoc = useLocation();
    var searchTerm = pathLoc.pathname.replace('/search=','');

    //TODO: Add listings view of products
    //TODO: Search through database to find products
    
   
    return(
        <div>
            <h1>Search Results for {searchTerm}</h1> 



        </div>
    )
}




export default Search;
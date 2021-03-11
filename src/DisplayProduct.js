import React, { useState } from 'react';
import firebase from './firebase';
import { useCollection } from 'react-firebase-hooks/firestore';
import { useLocation } from 'react-router-dom';
import {useAuthState} from "react-firebase-hooks/auth";
import {auth} from "./firebase";
import {Link} from 'react-router-dom';

const firestore = firebase.firestore();


var globalID = null;
var globalUserID = null;
var sellerID = null;
var oldVal = "";
function DisplayProduct(){
    let id = useLocation().state[0].iD;
    globalID = id;
    const [user] = useAuthState(auth);
    var userID = null;
    var match = false;
    var msg = "Loading";
    if(user != null){
        userID = user.uid;
    }
    globalUserID = userID;

    // Getting the listings from the database.
    const listingsRef = firestore.collection('listings').doc(id);
    var [document, loading] = useCollection(listingsRef);

    var listingName = "Loading", listingDes = "Loading", listingPrice = "Loading", listingSeller = "Loading";
    var listingUrl = "https://via.placeholder.com/150.jpg";
    var userName = "Loading";
    var myListing = null;
    var path="";
    var state = [];
    var sold = false;

    if(!loading){
        myListing = document.data();
        listingName = myListing.name;
        listingDes = myListing.description;
        listingSeller = myListing.seller;
        listingPrice = myListing.price;
        listingUrl = myListing.imgUrl;
        oldVal = myListing.interestedUsers;
        if(oldVal == null) oldVal = "";
        sold = myListing.sold;
        if(sold == null) sold = "false";
    } else {
        console.log("Still loading");
    }

    var userRef = firestore.collection('users').where("ID", "==", listingSeller);
    var [trueSeller, loadingSeller] = useCollection(userRef);
    var SellerID;
    if(!loadingSeller) {
        trueSeller.forEach(seller => {
            userName = seller.data().Name;
            SellerID = seller.data().ID;
            sellerID = SellerID;
        })
    }

    if(listingSeller == userID) {
        msg = "Edit details";
        match = true; 
        path = "/EditProduct"
        state = [{
            iDListing: id,
            name: listingName,
            description: listingDes,
            price: listingPrice,
            url: listingUrl
        }]
    }
    else {
        msg = "Message Seller"
        path = "/ChatRoom";
        state = [{
            targetUserID: SellerID,
            targetUserName: userName,
            myUID: userID
    }]
    }

    const updateInterested = () => {
        var newVal = "";
        if(oldVal == null || oldVal == ""){
            newVal = globalUserID;
        }else{
            if(oldVal.includes(globalUserID)){
                if(oldVal.includes("," + globalUserID))var toRemove = "," + globalUserID;
                else var toRemove = globalUserID;
                newVal = oldVal.replace(toRemove, "");
            }
            else{
                newVal = oldVal + "," + globalUserID;
            }
        }
        
        firestore.collection('listings').doc(globalID).update({
            interestedUsers: newVal
        })
    }
    console.log(globalUserID, sellerID);
    return (
        <div>
            <h1>{ listingName }</h1>
            <h1> { listingPrice } </h1>
            <h1> { listingDes} </h1>
            <h1> { userName } </h1>
            <img src={listingUrl} alt='react logo' className='productImage' />
            <h1><Link to={{
                pathname:path,
                state:state
            }}> <button>{msg}</button></Link></h1>
            { globalUserID != sellerID?
                <>{sold == "false" ?
                    <button onClick={updateInterested}>{
                    oldVal.includes(globalUserID)?
                        "Cancel request"
                        :
                        "Request to buy"
                    }</button>
                    :
                    <h1>Sorry, this listing has been sold.</h1>
                }</>
                :
                <></>
            }
        </div>
    )
}

export default DisplayProduct;

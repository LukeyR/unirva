import React from 'react';
import firebase from './firebase';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import { useLocation } from 'react-router-dom';
const firestore = firebase.firestore();

function DisplayProduct(){
    let params = useLocation().state[0].index;
    let id = useLocation().state[0].iD;
    console.log(params);
    console.log(useLocation())

    // Getting the listings from the database.
    const listingsRef = firestore.collection('listings');
    const query = listingsRef.orderBy('createdAt'); // ordering by time

    // retrieving them
    const [listings, loading] = useCollectionData(query);
    var listingName = "Loading", listingDes = "Loading", listingPrice = "Loading", listingSeller = "Loading";
    var listingUrl = "https://via.placeholder.com/150.jpg";
    var myListing = null;

    if(!loading){
        const length = listings.length;
        myListing = listings[length - params];
        listingName = myListing.name;
        listingDes = myListing.description;
        listingSeller = myListing.seller;
        listingPrice = myListing.price;
        listingUrl = myListing.imgUrl;
    } else {
        console.log("Still loading");
    }

    return (
        <div>
            <h1>{ listingName }</h1>
            <h1> { listingPrice } </h1>
            <h1> { listingDes} </h1>
            <h1> { listingSeller } </h1>
            <img src={listingUrl} alt='react logo' className='productImage' />
        </div>
    )
}

export default DisplayProduct;

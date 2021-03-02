import React, {useState} from 'react';

import ReactLogo from './img/logo.svg';

import './Home.css';
import firebase from './firebase';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import {Link} from 'react-router-dom';

const firestore = firebase.firestore();

// TEMPORARY VARIABLE TO CHOOSE SORTING ORDER
var sortNewestToOldest = true;

function Home(){

    //Creating route to DisplayProduct
    //<Route exact path="/DisplayProduct" component={DisplayProduct} />
    // Getting the listings from the database.
    const listingsRef = firestore.collection('listings');
    const query = listingsRef.orderBy('createdAt'); // ordering by time

    // retrieving them
    const [listings, loading] = useCollectionData(query);

    const defaultListing = "loading...";
    const defaultPrice = "loading...";
    const defaultUrl = "https://via.placeholder.com/150.jpg";

    var listing1 = defaultListing, listing2 = defaultListing, listing3 = defaultListing,
        price1 = defaultPrice, price2 = defaultPrice, price3 = defaultPrice,
        url1 = defaultUrl, url2 = defaultUrl, url3 = defaultUrl;
    var length;
    // check if data is still being loaded
    if(loading){
        console.log("still loading");
    }
    return(
        <div>
            <h1><code>Testing what would work best. </code></h1>
            <h2>Categories</h2>
            <button>A</button>
            <button>B</button>
            <button>C</button>
            <button>More Categories</button> 
            <h2>Sorting (NOT WORKING FOR NOW)</h2>
            <div>
                <button onClick={toggleSort}>Oldest first</button>
                <button onClick={toggleSort}>Newset first</button>
            </div>
            
            {!loading ? 
                listingRow(listings)
                : <h1>Listings Loading...</h1>
            }
        </div>
    )
}

function toggleSort(){
    sortNewestToOldest = !sortNewestToOldest;
}

function getListings(listings){
    return (!sortNewestToOldest ? listings : listings.reverse());
}

function listingRow(listings){
    return (
        <div className="listingRow">
            {/* .reverse() here to reverse the array (to achieve newest to oldest) */}
            {getListings(listings).map((listing, index) =>{
                return (
                    <Link to={{
                    pathname:"/DisplayProduct",
                    state:[{index: index, iD: 'default'}]
                    }}>
                        <div key={index.toString()} className="product">
                            
                            {/* alt='' with a link to default/missing image needed */}
                            <img src={listing.imgUrl} className='productImage' />
                            <p className='productTitle' >{listing.name}</p>
                            <p className='productPrice' >Price: £{listing.price}</p>    
                        </div>
                    </Link>
                )
            })} 
        </div>
    )
}
export default Home;
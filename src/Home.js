import React, { useState } from 'react';
import './Home.css';
import firebase from './firebase';
import { useCollection } from 'react-firebase-hooks/firestore';
import {Link} from 'react-router-dom';

const firestore = firebase.firestore();

var listings = [];
var listingsPrice = [];
var docsID = [];

function Home(){

    // Getting the listings from the database.
    const listingsRef = firestore.collection('listings');
    var query = listingsRef.orderBy('createdAt', "desc"); // ordering by time

    const [showNew, setShowNew] = useState(true);
    const [showOld, setShowOld] = useState(false);
    const [showLow, setShowLow] = useState(false); 
    const [showHigh, setShowHigh] = useState(false); 

    function listingsTimeNew() {
        setShowNew(true);
        setShowOld(false);
        setShowLow(false);
        setShowHigh(false);
    }
    function listingsTimeOld() {
        setShowNew(false);
        setShowOld(true);
        setShowLow(false);
        setShowHigh(false);
    }
    function listingsPriceLow() {
        setShowNew(false);
        setShowOld(false);
        setShowLow(true);
        setShowHigh(false);
    }
    function listingsPriceHigh() {
        setShowNew(false);
        setShowOld(false);
        setShowLow(false);
        setShowHigh(true);
    }


    const [listingsBig, loading] = useCollection(query);

    const defaultListing = "loading...";
    const defaultPrice = "loading...";
    const defaultUrl = "https://via.placeholder.com/150.jpg";

    // check if data is still being loaded
    if(!loading){
        var index = 0;
        listingsBig.forEach(doc => {
            listings[index] = doc.data();
            docsID[index] = doc.id;
            index++;
        })

        // changes string-prices to float-prices. if not parseable, it sets it to 0
        var index = 0;
        listings.forEach(doc => {
            doc.price = parseFloat(doc.price);
            if (isNaN(doc.price)){
                doc.price = 0;
            }
            listingsPrice[index] = doc;
            index++;
        })
        
        // sorts price listing. 
        listingsPrice = listingsPrice.sort((a, b) => (a.price > b.price) ? 1 : -1);

    }

    return(
        <div>
            <h1><code>Testing what would work best. </code></h1>
            <h2>Categories</h2>
            <button>A</button>
            <button>B</button>
            <button>C</button>
            <button>More Categories</button> 
            <h2>Listings in Bath</h2>
            <h2>Sorting cost not implemented (need to change type in database first)</h2>
            <div className="sortingRow">
                <button onClick={listingsTimeNew}>Newest</button>
                <button onClick={listingsTimeOld}>Oldest</button>
                <button onClick={listingsPriceLow}>£: Low</button>
                <button onClick={listingsPriceHigh}>£: High</button>
            </div>
            {showNew ? 
                (<div>
                    {!loading ? 
                    listingsRow(listings)
                    : <h1>Listings Loading...</h1>}
                </div>) : <></>}
            {showOld ? 
                (<div>
                    {!loading ? 
                    listingsRow(listings.reverse())
                    : <h1>Listings Loading...</h1>}
                </div>) : <></>}
            {showLow ? 
                (<div>
                    {!loading ? 
                    listingsRow(listingsPrice)
                    : <h1>Listings Loading...</h1>}
                </div>) : <></>}
            {showHigh ? 
                (<div>
                    {!loading ? 
                    listingsRow(listingsPrice.reverse())
                    : <h1>Listings Loading...</h1>}
                </div>) : <></>}
        </div>
    )
}

function listingsRow(listings){
    return (
        <div className="listingRow">
            {listings.map((listing, index) =>{
                return (
                    <Link to={{
                        pathname:"/DisplayProduct",
                        state:[{iD: docsID[index]}]
                    }}>
                        <div key={docsID[index].toString()} className="product">    
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
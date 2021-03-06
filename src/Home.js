import React, { useState } from 'react';
import './Home.css';
import firebase from './firebase';
import { useCollection } from 'react-firebase-hooks/firestore';
import {Link} from 'react-router-dom';

const firestore = firebase.firestore();

var listings = [];
var docsID = [];

function Home(){

    // Getting the listings from the database.
    const listingsRef = firestore.collection('listings');
    var query = listingsRef.orderBy('createdAt', "desc"); // ordering by time

    // TODO: Change database-price to integer/float and only allow for that as input <-- can then sort by price as well

    const [showNew, setShowNew] = useState(true);
    const [showOld, setShowOld] = useState(false);
    const [showLow, setShowLow] = useState(false); // TODO: Change database type
    const [showHigh, setShowHigh] = useState(false); // same ^^

    function refreshTimeNew() {
        setShowNew(true);
        setShowOld(false);
        setShowLow(false);
        setShowHigh(false);
    }
    function refreshTimeOld() {
        setShowNew(false);
        setShowOld(true);
        setShowLow(false);
        setShowHigh(false);
    }
    function refreshPriceLow() {
        setShowNew(false);
        setShowOld(false);
        setShowLow(true);
        setShowHigh(false);
    }
    function refreshPriceHigh() {
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
                <button onClick={refreshTimeNew}>Newest</button>
                <button onClick={refreshTimeOld}>Oldest</button>
                <button onClick={refreshPriceLow}>£: Low</button>
                <button onClick={refreshPriceHigh}>£: High</button>
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
                (<p>working on this</p>) : <></>}
            {showHigh ? 
                (<p>working on this</p>) : <></>}
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
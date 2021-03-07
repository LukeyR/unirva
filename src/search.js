import React, { useState } from 'react';
import { useLocation, Link } from "react-router-dom";
import './Home.css';
import firebase from './firebase';
import { useCollection } from 'react-firebase-hooks/firestore';

const firestore = firebase.firestore();

var listings = [];
var listingsPrice = [];
var docsID = [];

function Search(){

    var searchTerm = useLocation().pathname.replace('/search=',''); // uses this so can enter dedicated URL - not only search from navbar
    //var searchTerm = useLocation().state[0].iD; 

    var foundResults = false;
    listings = [];

    const listingsRef = firestore.collection('listings');
    var query = listingsRef.orderBy('createdAt', "desc"); // sort by time - newest 
    
    // retrieving them
    const [listingsBig, loading] = useCollection(query);

    // check if data is still being loaded
    if(!loading){
        var index = 0;
        listingsBig.forEach(doc => {
            if (doc.data().name.toLowerCase().includes(searchTerm.toLowerCase())){
                foundResults = true;
                listings[index] = doc.data();
                docsID[index] = doc.id;
                index++;
            }
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
        
        // sorts listings by price
        listingsPrice = listingsPrice.sort((a, b) => (a.price > b.price) ? 1 : -1);



    } else{
        console.log("Still loading");
    }

    const [showNew, setShowNew] = useState(true);
    const [showOld, setShowOld] = useState(false);
    const [showLow, setShowLow] = useState(false);
    const [showHigh, setShowHigh] = useState(false);

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
   
    return(
        <div>
            {foundResults ? (
                <div>
                    <h1>Search results for '{searchTerm}'</h1>
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
                </div>) : (<h1>We did not find any results for '{searchTerm}'</h1>)}
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

export default Search;
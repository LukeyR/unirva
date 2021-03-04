import React from 'react';
import { useLocation, Link } from "react-router-dom";
import './Home.css';
import firebase from './firebase';
import { useCollection } from 'react-firebase-hooks/firestore';

const firestore = firebase.firestore();

var listings = [];
var docsID = [];

function Search(){

    var searchTerm = useLocation().pathname.replace('/search=',''); // uses this so can enter dedicated URL - not only search from navbar
    //var searchTerm = useLocation().state[0].iD; 

    var foundResults = false;
    listings = [];

    const listingsRef = firestore.collection('listings');
    const query = listingsRef.orderBy('createdAt', "desc"); // ordering by time
    
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

    } else{
        console.log("Still loading");
    }
   
    return(
        <div>
            {foundResults ? (
                <div>
                    <h1>Search results for '{searchTerm}'</h1>
                    {!loading ? 
                    listingsRow(listings)
                    : <h1>Listings Loading...</h1>
                    }
                </div>
                ) : (<h1>We did not find any results for '{searchTerm}'</h1>)}
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
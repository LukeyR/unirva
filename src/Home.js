import React from 'react';
import './Home.css';
import firebase from './firebase';
import { useCollection } from 'react-firebase-hooks/firestore';
import {Link} from 'react-router-dom';

const firestore = firebase.firestore();

var sortNewestToOldest = true;
var listings = [];
var docsID = [];

// function HomeListingCard(listingObj) {
//     const {name, price, imgUrl, seller, description} = listingObj
//
//
//     return (
//
//     )
// }

function Home(){

    // Getting the listings from the database.
    const listingsRef = firestore.collection('listings');
    const query = listingsRef.orderBy('createdAt', "desc"); // ordering by time
    // retrieving them

    const [listingsBig, loading] = useCollection(query);

    const defaultListing = "loading...";
    const defaultPrice = "loading...";
    const defaultUrl = "https://via.placeholder.com/150.jpg";

    // check if data is still being loaded
    if(!loading){
        // make sure to take most recent posts
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
            <h2>Sorting (NOT WORKING FOR NOW)</h2>
            <div className="sortingRow">
                <button onClick={toggleSort}>Oldest first</button>
                <button onClick={toggleSort}>Newset first</button>
            </div>


            {console.log(listings)}
            {!loading ? 
                listingsRow(listings)
                : <h1>Listings Loading...</h1>
            }
        </div>
    )
}

function toggleSort(){
    sortNewestToOldest = !sortNewestToOldest;
}

function getOrderedListings(listings){
    return (sortNewestToOldest ? listings : listings.reverse());
}

function listingsRow(listings){
    return (
        <div className="listingRow">
            {getOrderedListings(listings).map((listing, index) =>{
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
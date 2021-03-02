import React from 'react';

import ReactLogo from './img/logo.svg';

import './Home.css';
import firebase from './firebase';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import {Link} from 'react-router-dom';

const firestore = firebase.firestore();

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
            <h2>Listings in Bath</h2>
            <div className="listingRow1">
                <button>Prod1</button>
                <button>Prod2</button>
                <button>Prod3</button>
                <button>Prod4</button>
            </div>
            
            {!loading ? 
                listingRow(listings)
                : <h1>Listings Loading...</h1>
            }
        </div>
    )
}

function listingRow(listings){
    return (
        <div className="listingRow">
            {listings.map((listing, index) =>{
                return (
                    <div key={index.toString()} className="product">
                        <Link to={{
                            pathname:"/DisplayProduct",
                            state:[{index: index, iD: 'default'}]
                            }}>
                        {/* alt='' with a link to default/missing image needed */}
                        <img src={listing.imgUrl} className='productImage' />
                        </Link>
                        <p className='productTitle' >{listing.name}</p>
                        <p className='productPrice' >Price: £{listing.price}</p>
                    </div>
                )
            })} 
        </div>
    )
}
export default Home;
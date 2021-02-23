import React from 'react';
import ReactLogo from './logo.svg';
import './Home.css';
import firebase from './firebase';
import { useCollectionData } from 'react-firebase-hooks/firestore';

const firestore = firebase.firestore();

function Home(){
    // Getting the listings from the database.
    const listingsRef = firestore.collection('listings');
    const query = listingsRef.orderBy('createdAt'); // ordering by time

    // retrieving them
    const [listings, loading] = useCollectionData(query);

    const defaultListing = "loading...";
    const defaultPrice = "loading...";

    var listing1 = defaultListing, listing2 = defaultListing, listing3 = defaultListing, price1 = defaultPrice, price2 = defaultPrice, price3 = defaultPrice;
    // check if data is still being loaded
    if(!loading){
        // make sure to take most recent posts
        const length = listings.length;
        listing1 = listings[length - 1].name;
        listing2 = listings[length - 2].name;
        listing3 = listings[length - 3].name;

        price1 = listings[length - 1].price;
        price2 = listings[length - 2].price;
        price3 = listings[length - 3].price;
        
    } else{
        console.log("Still loading");
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
            
            <div className="listingRow">
                <div className="product">
                    <img src={ReactLogo} alt='react logo' className='productImage' />
                    <p className='productTitle' >{listing1}</p>
                    <p className='productPrice' >Price: £{price1}</p>
                </div>
                <div className="product">
                    <img src={ReactLogo} alt='react logo' className='productImage' />
                    <p className='productTitle' >{listing2}</p>
                    <p className='productPrice' >Price: £{price2}</p>
                </div>
                <div className="product">
                    <img src={ReactLogo} alt='react logo' className='productImage' />
                    <p className='productTitle' >{listing3}</p>
                    <p className='productPrice' >Price: £{price3}</p>
                </div>
            </div>
        </div>
    )
}

export default Home;
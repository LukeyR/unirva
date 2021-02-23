import React from 'react';
import ReactLogo from './logo.svg';
import './Home.css';
import firebase from './firebase';
import { useCollectionData } from 'react-firebase-hooks/firestore';

const firestore = firebase.firestore();

function Home(){

    const listingsRef = firestore.collection('listings');
    const query = listingsRef.orderBy('createdAt');

    var [listings, loading] = useCollectionData(query);

    const defaultListing = "Example";
    const defaultPrice = "0.00";

    var listing1 = defaultListing, listing2 = defaultListing, listing3 = defaultListing, price1 = defaultPrice, price2 = defaultPrice, price3 = defaultPrice;

    if(!loading){
        listings = listings.reverse();
        listing1 = listings[0].name;
        listing2 = listings[1].name;
        listing3 = listings[2].name;

        price1 = listings[0].price;
        price2 = listings[1].price;
        price3 = listings[2].price;
        
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
import React from 'react';
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
    var id="default";
    // check if data is still being loaded
    if(!loading){
        // make sure to take most recent posts
        const length = listings.length;
        console.log(id);
        listing1 = listings[length - 1].name;
        listing2 = listings[length - 2].name;
        listing3 = listings[length - 3].name;

        price1 = listings[length - 1].price;
        price2 = listings[length - 2].price;
        price3 = listings[length - 3].price;

        if(listings[length - 1].imgUrl != null){
            url1 = listings[length - 1].imgUrl;
        }
        if(listings[length - 2].imgUrl != null){
            url2 = listings[length - 2].imgUrl;
        }
        if(listings[length - 3].imgUrl != null){
            url3 = listings[length - 3].imgUrl;
        }
        
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
                    <Link to={{
                            pathname:"/DisplayProduct",
                            state:[{index: 1, iD: id}]
                        }}>
                        <img src={url1} alt='react logo' className='productImage' />
                    </Link>
                    <p className='productTitle' >{listing1}</p>
                    <p className='productPrice' >Price: £{price1}</p>
                </div>
                <div className="product">
                <Link to={{
                            pathname:"/DisplayProduct",
                            state:[{index: 2}]
                        }}>
                        <img src={url2} alt='react logo' className='productImage' />
                    </Link>
                    <p className='productTitle' >{listing2}</p>
                    <p className='productPrice' >Price: £{price2}</p>
                </div>
                <div className="product">
                <Link to={{
                            pathname:"/DisplayProduct",
                            state:[{index: 3}]
                        }}>
                        <img src={url3} alt='react logo' className='productImage' />
                    </Link>
                    <p className='productTitle' >{listing3}</p>
                    <p className='productPrice' >Price: £{price3}</p>
                </div>
            </div>
        </div>
    )
}

export default Home;
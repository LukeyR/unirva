import React from 'react';
import './Home.css';
import firebase from './firebase';
import { useCollection } from 'react-firebase-hooks/firestore';
import {Link} from 'react-router-dom';

const firestore = firebase.firestore();

function Home(){

    // Getting the listings from the database.
    const listingsRef = firestore.collection('listings');
    const query = listingsRef.orderBy('createdAt', "desc").limit(3); // ordering by time
    var listings = [];
    var docsID = [];
    // retrieving them

    const [listingsBig, loading] = useCollection(query);

    const defaultListing = "loading...";
    const defaultPrice = "loading...";
    const defaultUrl = "https://via.placeholder.com/150.jpg";

    var listing1 = defaultListing, listing2 = defaultListing, listing3 = defaultListing,
        price1 = defaultPrice, price2 = defaultPrice, price3 = defaultPrice,
        url1 = defaultUrl, url2 = defaultUrl, url3 = defaultUrl;
    var id1="default", id2="default", id3="default";
    // check if data is still being loaded
    if(!loading){
        // make sure to take most recent posts
        var index = 0;
        listingsBig.forEach(doc => {
            listings[index] = doc.data();
            docsID[index] = doc.id;
            index++;
        })
        listing1 = listings[0].name;
        listing2 = listings[1].name;
        listing3 = listings[2].name;

        price1 = listings[0].price;
        price2 = listings[1].price;
        price3 = listings[2].price;

        if(listings[0].imgUrl != null){
            url1 = listings[0].imgUrl;
        }
        if(listings[1].imgUrl != null){
            url2 = listings[1].imgUrl;
        }
        if(listings[2].imgUrl != null){
            url3 = listings[2].imgUrl;
        }

        id1=docsID[0];
        id2=docsID[1];
        id3=docsID[2];
        
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
                            state:[{iD: id1}]
                        }}>
                        <img src={url1} alt='react logo' className='productImage' />
                    </Link>
                    <p className='productTitle' >{listing1}</p>
                    <p className='productPrice' >Price: £{price1}</p>
                </div>
                <div className="product">
                <Link to={{
                            pathname:"/DisplayProduct",
                            state:[{iD: id2}]
                        }}>
                        <img src={url2} alt='react logo' className='productImage' />
                    </Link>
                    <p className='productTitle' >{listing2}</p>
                    <p className='productPrice' >Price: £{price2}</p>
                </div>
                <div className="product">
                <Link to={{
                            pathname:"/DisplayProduct",
                            state:[{iD: id3}]
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
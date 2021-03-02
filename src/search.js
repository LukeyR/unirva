import React from 'react';
import { useLocation, useParams, Link } from "react-router-dom";
import './Home.css';
import firebase from './firebase';
import { useCollectionData } from 'react-firebase-hooks/firestore';


const firestore = firebase.firestore();

function Search(){

    var searchTerm = useLocation().pathname.replace('/search=',''); // uses this so can enter dedicated URL - not only search from below
    //var searchTerm = useLocation().state[0].iD; 

    const listingsRef = firestore.collection('listings');
    var query = listingsRef.orderBy('createdAt'); // ordering by time
    var foundResults = false;

    // retrieving them
    const [listings, loading] = useCollectionData(query);

    const defaultListing = "loading...";
    const defaultPrice = "loading...";
    const defaultUrl = "https://via.placeholder.com/150.jpg";

    var listing1 = defaultListing,
        price1 = defaultPrice,
        url1 = defaultUrl;
    var id="default";
    // check if data is still being loaded
    if(!loading){
        // make sure to take most recent posts
        const length = listings.length;

        var result = [];
        var i = 0;
        for (let index = 0; index < length; index++) {
            if (listings[index].name.includes(searchTerm)) {
                result[i] = listings[index];
                i++;
            }
        }
        if (result[0] != null){
            foundResults = true;
            listing1 = result[0].name;
            price1 = result[0].price;
            if(result[0].imgUrl != null){
                url1 = result[0].imgUrl;
            }
        }
        console.log(result)
        console.log(id);
    } else{
        console.log("Still loading");
    }
   
    return(
        <div>
            {foundResults ? (<h1>Search result for "{searchTerm}"</h1> ) : (<h1>Could not find Search Results for "{searchTerm}"</h1>)}
            
            {foundResults ? (
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
            </div>
            ) : (<></>)}
        </div>
    )
}




export default Search;
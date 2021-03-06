import React from 'react';
import { useLocation, Link } from "react-router-dom";
import './Home.css';
import firebase from './firebase';
import { useCollection } from 'react-firebase-hooks/firestore';
import {Box, Grid} from "@material-ui/core";
import HomeListingCard from "./listingCard";

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

    const getListingCard = (listingObj, iD) => {
        let props = {
            listingObj: listingObj,
            iD: iD,
        }

        return (
            <Grid item>
                <HomeListingCard {...props} />
            </Grid>
        )
    }

    return(
        <div>
            {foundResults ? (
                <div>
                    <h1>Search results for '{searchTerm}'</h1>
                    {!loading ?
                        <Box p={2} m={2}>
                            <Grid container justify="flex-start" spacing={4}>
                                {listings.map((listingObj, index) =>
                                    getListingCard(listingObj, docsID[index])
                                )}
                            </Grid>
                        </Box>
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
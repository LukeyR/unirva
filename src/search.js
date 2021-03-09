import React, { useState } from 'react';
import { useLocation, Link } from "react-router-dom";
import './Home.css';
import firebase from './firebase';
import { useCollection } from 'react-firebase-hooks/firestore';
import {Box, Button, ButtonGroup, Grid} from "@material-ui/core";
import HomeListingCard from "./listingCard";

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
                        <ButtonGroup variant="outlined" color="primary" aria-label="contained primary button group">
                            <Button onClick={() => refreshTimeOld()}>Date: Oldest - Newest</Button>
                            <Button onClick={() => refreshTimeNew()}>Date: Newest - Oldest</Button>
                            <Button onClick={() => refreshPriceLow()}>Price: Low - High</Button>
                            <Button onClick={() => refreshPriceHigh()}>Price: High - Low</Button>
                        </ButtonGroup>
                    </div>
                    {!loading ?
                        <Box p={2} m={2}>
                            <Grid container justify="flex-start" spacing={4}>
                                {(showNew || showOld) ?
                                    (showNew ? listings.reverse() : listings).map((listingObj, index) =>
                                    getListingCard(listingObj, docsID[index])
                                )
                                    :
                                    (showLow ? listingsPrice : listingsPrice.reverse()).map((listingObj, index) =>
                                    getListingCard(listingObj, docsID[index]))
                                }
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
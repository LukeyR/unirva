import React, { useState } from 'react';
import './Home.css';
import firebase from './firebase';
import {useCollection} from 'react-firebase-hooks/firestore';
import {Box, Button, ButtonGroup, Grid} from "@material-ui/core";
import HomeListingCard from "./listingCard";


const firestore = firebase.firestore();

var sortNewestToOldest = true;
var listings = [];
var listingsPrice = [];
var docsID = [];

function Home() {

    // Getting the listings from the database.
    const listingsRef = firestore.collection('listings');
    var query = listingsRef.orderBy('createdAt', "desc"); // ordering by time

    const [showNew, setShowNew] = useState(true);
    const [showOld, setShowOld] = useState(false);
    const [showLow, setShowLow] = useState(false);
    const [showHigh, setShowHigh] = useState(false);

    function listingsTimeNew() {
        setShowNew(true);
        setShowOld(false);
        setShowLow(false);
        setShowHigh(false);
    }
    function listingsTimeOld() {
        setShowNew(false);
        setShowOld(true);
        setShowLow(false);
        setShowHigh(false);
    }
    function listingsPriceLow() {
        setShowNew(false);
        setShowOld(false);
        setShowLow(true);
        setShowHigh(false);
    }
    function listingsPriceHigh() {
        setShowNew(false);
        setShowOld(false);
        setShowLow(false);
        setShowHigh(true);
    }


    const [listingsBig, loading] = useCollection(query);

    const defaultListing = "loading...";
    const defaultPrice = "loading...";
    const defaultUrl = "https://via.placeholder.com/150.jpg";

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

    const buttonClicked = (button) => {
        alert(`${button} was clicked`)
    }

    // check if data is still being loaded
    if(!loading){
        var index = 0;
        listingsBig.forEach(doc => {
            listings[index] = doc.data();
            docsID[index] = doc.id;
            index++;
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

        // sorts listings by price
        listingsPrice = listingsPrice.sort((a, b) => (a.price > b.price) ? 1 : -1);

    }

    return (
        <div>
            <div style={{textAlign: "center"}}>
                <h2>Categories</h2>
                    <ButtonGroup variant="outlined" color="primary" aria-label="contained primary button group">
                        <Button onClick={() => buttonClicked("A")}>A</Button>
                        <Button onClick={() => buttonClicked("B")}>B</Button>
                        <Button onClick={() => buttonClicked("C")}>C</Button>
                        <Button onClick={() => buttonClicked("More Categories")}>More Categories</Button>
                    </ButtonGroup>
                <h2>Listings in Bath</h2>
                <h2>Sorting</h2>
                <div className="sortingRow">
                    <ButtonGroup variant="outlined" color="primary" aria-label="contained primary button group">
                        <Button onClick={() => listingsTimeOld()}>Date: Oldest - Newest</Button>
                        <Button onClick={() => listingsTimeNew()}>Date: Newest - Oldest</Button>
                        <Button onClick={() => listingsPriceLow()}>Price: Low - High</Button>
                        <Button onClick={() => listingsPriceHigh()}>Price: High - Low</Button>
                    </ButtonGroup>
                </div>
            </div>


            {!loading ?
                (
                    <Box p={1} m={1}>
                        <Grid container justify="center" spacing={4}>
                            {(showNew || showOld) ?
                                ((showNew ? listings : listings.reverse()).map((listingObj, index) =>
                                    getListingCard(listingObj, docsID[index])
                                ))
                                :
                                ((showLow ? listingsPrice : listingsPrice.reverse()).map((listingObj, index) =>
                                    getListingCard(listingObj, docsID[index])
                                ))
                            }

                        </Grid>
                    </Box>
                ) : <h1>Listings Loading...</h1>
            }
        </div>
    )
}

export default Home;
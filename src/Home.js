import React from 'react';
import './Home.css';
import firebase from './firebase';
import {useCollection} from 'react-firebase-hooks/firestore';
import {Box, Button, ButtonGroup, Grid} from "@material-ui/core";
import HomeListingCard from "./listingCard";


const firestore = firebase.firestore();

var sortNewestToOldest = true;
var listings = [];
var docsID = [];

function Home() {

    // Getting the listings from the database.
    const listingsRef = firestore.collection('listings');
    const query = listingsRef.orderBy('createdAt', "desc"); // ordering by time
    // retrieving them

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
    if (!loading) {
        // make sure to take most recent posts
        var index = 0;
        listingsBig.forEach(doc => {
            listings[index] = doc.data();
            docsID[index] = doc.id;
            index++;
        })

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
                <h2>Sorting (NOT WORKING FOR NOW)</h2>
                <div className="sortingRow">
                    <ButtonGroup variant="outlined" color="primary" aria-label="contained primary button group">
                        <Button onClick={() => buttonClicked("Oldest First")}>Oldest First</Button>
                        <Button onClick={() => buttonClicked("Newest First")}>Newest First</Button>
                    </ButtonGroup>
                </div>
            </div>


            {!loading ?
                (
                    <Box p={1} m={1}>
                        <Grid container justify="center" spacing={4}>
                            {listings.map((listingObj, index) =>
                                getListingCard(listingObj, docsID[index])
                            )}
                        </Grid>
                    </Box>
                ) : <h1>Listings Loading...</h1>
            }
        </div>
    )
}

function toggleSort() {
    sortNewestToOldest = !sortNewestToOldest;
}

function getOrderedListings(listings) {
    return (sortNewestToOldest ? listings : listings.reverse());
}

export default Home;
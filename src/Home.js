import React from 'react';
import './Home.css';
import firebase from './firebase';
import {useCollection} from 'react-firebase-hooks/firestore';
import {Link} from 'react-router-dom';
import {
    Box,
    Card,
    CardActionArea,
    CardActions,
    CardContent,
    CardMedia,
    Divider, Grid, IconButton,
    makeStyles, Paper,
    Typography
} from "@material-ui/core";
import {useAuthState} from "react-firebase-hooks/auth";
import {auth} from "./firebase";
import {Comment, Create} from "@material-ui/icons";
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
                <h1><code>Testing what would work best. </code></h1>
                <h2>Categories</h2>
                <button>A</button>
                <button>B</button>
                <button>C</button>
                <button>More Categories</button>
                <h2>Listings in Bath</h2>
                <h2>Sorting (NOT WORKING FOR NOW)</h2>
                <div className="sortingRow">
                    <button onClick={toggleSort}>Oldest first</button>
                    <button onClick={toggleSort}>Newset first</button>
                </div>
            </div>


            {!loading ?
                (
                    <Box p={2} m={2}>
                        <Grid container justify="flex-start" spacing={4}>
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
import React from "react";
import firebase from "./firebase";
import {useAuthState} from "react-firebase-hooks/auth";
import {auth} from "./firebase";
import {useCollection, useDocumentData} from "react-firebase-hooks/firestore";
import {Box, createMuiTheme, Grid} from "@material-ui/core";
import HomeListingCard from "./listingCard";

const firestore = firebase.firestore()

function GetListingFromID(listingId) {
    console.log(firestore.collection("users").doc(listingId))
    const {name, price, imgUrl, seller, description, likedBy} = firestore.collection("users").doc(listingId).data();

    return (
        {
            name: name,
            price: price,
            imgUrl: imgUrl,
            seller: seller,
            description: description,
            likedBy: likedBy
        }
    )
}

function Favourites() {

    const [user] = useAuthState(auth)

    let userID = null;
    let userDocRef = null;
    if(user) {
        userID = user.uid;
        const usersRef = firestore.collection("users");
        userDocRef = usersRef.doc(userID)
    }

    const [userDoc, loadingUserDoc] = useDocumentData(userDocRef);

    let listingIDs;
    if (!loadingUserDoc && user && userDoc !== undefined) listingIDs = userDoc.likes

    // Getting the listings from the database.
    const listingsRef = firestore.collection('listings');
    const query = listingsRef.where("likedBy", "array-contains", user.uid) // ordering by time

    const [listingsBig, loading] = useCollection(query);

    let index;
    let listings;
    let docsID = [];

    // check if data is still being loaded
    if(!loading && user){
        // make sure to take most recent posts
        index = 0;
        listings = [];
        listingsBig.forEach(doc => {
            var data = doc.data();
            console.log(data.likedBy)
            if(data.likedBy.includes(user.uid)){
                listings[index] = doc.data();
                docsID[index] = doc.id;
                index++;
            }
        })
    }


    return (
            <Box p={1} m={1}>
                <Grid container justify="center" spacing={4}>
                    {!loadingUserDoc && !loading ? listings.map((listingObj, index) =>
                            <Grid item>
                                <HomeListingCard {...{listingObj: listingObj, iD: docsID[index]}} />
                            </Grid>
                        ) : <h1> Loading listings</h1>
                    }
                </Grid>
            </Box>
    )
}

export default Favourites
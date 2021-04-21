import React from "react";
import firebase, {auth} from "./firebase";
import {useAuthState} from "react-firebase-hooks/auth";
import {useCollection} from "react-firebase-hooks/firestore";
import {Box, Grid, Typography} from "@material-ui/core";
import HomeListingCard from "./listingCard";

const firestore = firebase.firestore()

function Favourites() {

    const [user] = useAuthState(auth)


    // Getting the listings from the database.
    const listingsRef = firestore.collection('listings');
    const query = listingsRef.where("likedBy", "array-contains", user.uid) // ordering by time

    const [listingsBig, loading] = useCollection(query);

    let index;
    let listings;
    let docsID = [];

    // check if data is still being loaded
    if (!loading && user) {
        // make sure to take most recent posts
        index = 0;
        listings = [];
        listingsBig.forEach(doc => {
            var data = doc.data();
            if (data.likedBy.includes(user.uid)) {
                listings[index] = doc.data();
                docsID[index] = doc.id;
                index++;
            }
        })
    }


    return (
        <Box p={1} m={1}>
            <Grid container justify="center" spacing={4}>
                {!loading ? (listings.length !== 0 ? listings.map((listingObj, index) =>
                    <Grid item>
                        <HomeListingCard {...{listingObj: listingObj, iD: docsID[index]}} />
                    </Grid>
                )
                    :
                    <Box display="flex" justifyContent="center" alignItems="center" flexDirection="column" style={{marginTop: "50px"}}>
                <img src="https://www.memecreator.org/static/images/memes/4722215.jpg" />
                    <Typography variant="h1" style={{fontSize: "35px"}}>You should go ❤️ some listings</Typography>
                    </Box>) : <h1> Loading listings</h1>
                }
            </Grid>
        </Box>
    )
}

export default Favourites
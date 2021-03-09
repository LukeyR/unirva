import React from 'react';
import './Profile.css';
import firebase from 'firebase/app';
import {useCollection} from 'react-firebase-hooks/firestore';
import {useAuthState} from "react-firebase-hooks/auth";
import {auth} from "./firebase";
import {Link, useHistory} from 'react-router-dom';
import {Avatar, Box, Grid, IconButton} from "@material-ui/core";
import HomeListingCard from "./listingCard";
import {makeStyles} from "@material-ui/styles";

const firestore = firebase.firestore();

// TODO
//  Table of all listings

var listings = [];
var docsID = [];

const useStyles = makeStyles((theme) => ({
    profilePicture: {
        margin: "28px",
        padding: "28px",
        border: "0px solid black",
        width: "185px",
        height: "185px",
        backgroundColor: theme.palette.secondary.main
    }
}))

const Profile = (theme) => {
    const history = useHistory();
    const [user] = useAuthState(auth);
    const classes = useStyles();

    // Getting the listings from the database.
    const listingsRef = firestore.collection('listings');
    const query = listingsRef.orderBy('createdAt', "desc"); // ordering by time
    // retrieving them

    const [listingsBig, loading] = useCollection(query);

    // check if data is still being loaded
    if(!loading){
        // make sure to take most recent posts
        var index = 0;
        listingsBig.forEach(doc => {
            listings[index] = doc.data();
            docsID[index] = doc.id;
            index++;
        })

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
        <div className="container">
            <div className="about">
                {user ?
                    <>
                        <Avatar  className={classes.profilePicture} alt="Profile Image" src={user.photoURL}>
                            {user.displayName ? user.displayName.charAt(0).toUpperCase() : user.email.charAt(0).toUpperCase()}
                        </Avatar>
                        <h1>{user.displayName}</h1>
                        <p>Other information goes here</p>
                    </>
                :
                    history.push("/menu")
                }
            </div>

            <div className="listings">
                <h1>Listings need the "Seller" field to contain the userID of their owner</h1>
                <h2>This so we can display only the listings created by this user</h2>
                <p>Currently displaying all possible listings for now</p>
                {user ?
                    <Box p={1} m={1}>
                        <Grid container justify="center" spacing={4}>
                            {listings.map((listingObj, index) =>
                                getListingCard(listingObj, docsID[index])
                            )}
                        </Grid>
                    </Box>

                    :
                    <p>User has no listings</p>
                }
            </div>
        </div>

    )
}

function getListings(user, listings){
    return(
        <>
        {listings.map((listing, index) =>{
            return(
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
        </>
    )
}

export default Profile;
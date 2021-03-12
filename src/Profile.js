import React from 'react';
import './Profile.css';
import firebase from 'firebase/app';
import {useCollection} from 'react-firebase-hooks/firestore';
import {useCollectionData} from 'react-firebase-hooks/firestore';
import {useAuthState} from "react-firebase-hooks/auth";
import {auth} from "./firebase";
import {Link, useHistory} from 'react-router-dom';
import {Box, Grid} from "@material-ui/core";
import HomeListingCard from "./listingCard";

const firestore = firebase.firestore();

// TODO
//  Table of all listings

var listings = [];
var docsID = [];

function Profile(){
    const history = useHistory();
    const [user] = useAuthState(auth);

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

    const userRef = firestore.collection('users').where("ID", "==", user.uid);
    var [me, uLoading] = useCollectionData(userRef);

    var name, lastname, university, myid;
    if (!uLoading){
        name = me[0].Name;
        lastname = me[0].LastName;
        university = me[0].University;
        myid = me[0].ID;
    }

    // filter lsitings so only my listings appear on profile page
    listings = listings.filter(function(listing) {
        return (listing.seller == myid);
    });

    return(
        <div className="container">
            <div className="about">
                {user ?
                    <>
                        <img className="profilePicture" src={user.photoURL}/>

                        <h1>{name + " " + lastname}</h1>
                        <p>{university}</p>
                    </>
                :
                    history.push("/menu")
                }
            </div>

            <div className="listings">
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


export default Profile;
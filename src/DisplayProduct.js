import React, { useState } from 'react';
import firebase from './firebase';
import { useCollection } from 'react-firebase-hooks/firestore';
import {useAuthState} from "react-firebase-hooks/auth";
import {auth} from "./firebase";
import {Link, useHistory} from 'react-router-dom';
import {Box, Button, Dialog, DialogTitle, GridList, GridListTile, Paper, Typography} from "@material-ui/core";

const firestore = firebase.firestore();

var globalID = null;
var globalUserID = null;
var sellerID = null;
var oldVal = "";
function DisplayProduct(props){
    let id = props.location.state.iD;
    globalID = id;
    const [user] = useAuthState(auth);
    var userID = null;
    var match = false;
    var msg = "Loading";
    var gotoSeller = "Loading";
    if(user != null){
        userID = user.uid;
    }
    globalUserID = userID;

    const history = useHistory();

    // Getting the listings from the database.
    const listingsRef = firestore.collection('listings').doc(id);
    var [document, loading] = useCollection(listingsRef);

    var listingName = "Loading", listingDes = "Loading", listingPrice = "Loading", listingSeller = "Loading";
    var listingUrl = "https://via.placeholder.com/150.jpg";
    var userName = "Loading";
    var myListing = null;
    var path="";
    var userPath="";
    var state = [];
    var stateMyProduct = [];
    var stateMsg = [];
    var sold = false;
    var listingExtraUrls = []

    if(!loading && (myListing = document.data()) !== undefined){
        listingName = myListing.name;
        listingDes = myListing.description;
        listingSeller = myListing.seller;
        listingPrice = myListing.price;
        listingUrl = myListing.imgUrl;
        listingExtraUrls = myListing.allPhotos;
        oldVal = myListing.interestedUsers;
        if(oldVal == null) oldVal = "";
        sold = myListing.sold;
        if(sold == null) sold = "false";
    } else {
        console.log("Still loading");
    }

    var userRef = firestore.collection('users').where("ID", "==", listingSeller);
    var [trueSeller, loadingSeller] = useCollection(userRef);
    var SellerID;
    if(!loadingSeller) {
        trueSeller.forEach(seller => {
            userName = seller.data().Name;
            SellerID = seller.data().ID;
            sellerID = SellerID;
        })
    }


    if(listingSeller == userID) {
        msg = "Edit details";
        gotoSeller = "Goto My Profile"
        match = true;
        path = "/EditProduct"
        userPath = "/Profile"
        stateMyProduct = {
            iDListing: id,
            name: listingName,
            description: listingDes,
            price: listingPrice,
            url: listingUrl,
            extraUrls: listingExtraUrls,
        }
        state = [{
            targetUserID: SellerID,
            currentUserID: userID
        }]
    }
    else {
        msg = "Message Seller"
        gotoSeller = "Goto Seller Profile"
        path = "/ChatRoom";
        stateMyProduct = {
            targetUserName: userName,
            targetUserID: SellerID,
            myUID: userID
        }
        state = {
            targetUserID: SellerID,
            currentUserID: userID
        }
    }

    const updateInterested = () => {
        var newVal = "";
        if(oldVal == null || oldVal == ""){
            newVal = globalUserID;
        }else{
            if(oldVal.includes(globalUserID)){
                if(oldVal.includes("," + globalUserID))var toRemove = "," + globalUserID;
                else var toRemove = globalUserID;
                newVal = oldVal.replace(toRemove, "");
            }
            else{
                newVal = oldVal + "," + globalUserID;
            }
        }

        firestore.collection('listings').doc(globalID).update({
            interestedUsers: newVal
        })
    }

    function SimpleDialog(props) {
        const { onClose, selectedValue, open } = props;

        const handleClose = () => {
            onClose(selectedValue);
        };


        return (
            <Dialog onClose={handleClose} aria-labelledby="simple-dialog-title" open={open}>
                <Box justifyContent="center" m={1} p={1}>
                <img src={listingUrl} alt='react logo' className='productImage' />
                </Box>
            </Dialog>
        );
    }

    const [open, setOpen] = React.useState(false);
    const [selectedValue, setSelectedValue] = React.useState(listingUrl);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = (value) => {
        setOpen(false);
        setSelectedValue(value);
    };

    return (
        <div>
            <h1>{ listingName }</h1>
            <h1> { listingPrice } </h1>
            <Paper><Typography style={{whiteSpace: 'pre-line'}}> { listingDes} </Typography></Paper>
            <h1> { userName } </h1>
            <img src={listingUrl} alt='react logo' className='productImage' />
            {listingExtraUrls !== undefined && listingExtraUrls !== [] ? listingExtraUrls.map(url => <img src={url} alt='react logo' className='productImage' />) : <></>}
            <div>
            <Button
                variant="outlined"
                color="primary"
                onClick={() => {
                    history.push("/product", stateMyProduct)
            }}>{msg}</Button>
        </div>

            <h1><Link to={{
                pathname:userPath,
                state:state
            }}><button>{gotoSeller}</button></Link></h1>
            { globalUserID != sellerID?
                <>{sold == "false" ?
                    <button onClick={updateInterested}>{
                    oldVal.includes(globalUserID)?
                        "Cancel request"
                        :
                        "Request to buy"
                    }</button>
                    :
                    <h1>Sorry, this listing has been sold.</h1>
                }</>
                :
                <></>
            }
        </div>
    )
}

export default DisplayProduct;

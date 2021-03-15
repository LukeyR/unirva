import React, { useState } from 'react';
import './Home.css';
import firebase from './firebase';
import {useCollection} from 'react-firebase-hooks/firestore';
import {
    Box,
    Button,
    ButtonGroup,
    Grid,
    List,
    ListItem,
    ListItemText,
    MenuItem,
    Menu,
    makeStyles, Typography
} from "@material-ui/core";
import UnfoldMoreIcon from '@material-ui/icons/UnfoldMore';
import HomeListingCard from "./listingCard";
import Favourites from "./Favourites";

const useStyles = makeStyles((theme) => (
    {
        list: {
            maxWidth: "300px"
        },
        moreIcon: {
            color: theme.palette.text.primary
        },
        sorting: {
            display: "flex",
            justifyContent: "flex-end",
            marginRight: "30px",
            alignItems: "center",
        }
}));

const firestore = firebase.firestore();

var sortNewestToOldest = true;
var listings = [];
var listingsPrice = [];
var docsID = [];

const options = [
    "Date: Newest - Oldest",
    "Date: Oldest - Newest",
    "Price: High - Low",
    "Price: Low - High",
];


function Home() {
    // Getting the listings from the database.
    const listingsRef = firestore.collection('listings');
    var query = listingsRef.orderBy('createdAt', "desc"); // ordering by time

    const [showNew, setShowNew] = useState(true);
    const [showOld, setShowOld] = useState(false);
    const [showLow, setShowLow] = useState(false);
    const [showHigh, setShowHigh] = useState(false);

    const [anchorEl, setAnchorEl] = useState(null);
    const [selectedIndex, setSelectedIndex] = useState(0);

    const classes = useStyles();

    const handleClickListItem = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuItemClick = (event, index) => {
        setSelectedIndex(index);
        setAnchorEl(null);
        switch (index) {
            case 0:
                listingsTimeNew()
                break;

            case 1:
                listingsTimeOld()
                break;

            case 2:
                listingsPriceHigh()
                break;

            case 3:
                listingsPriceLow()
                break;
            default:
                console.log("Error Occourred: unkown index in Home.js/handleMenuItemClick")

        }

    };

    const handleClose = () => {
        setAnchorEl(null);
    };

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

                        <div className={classes.sorting}>
                        <Typography display="inline" style={{marginRight: "10px"}}>
                            Sort By:
                        </Typography>
                        <Button onClick={handleClickListItem} variant="outlined" color="primary">
                            <Typography>
                                {options[selectedIndex]}
                            </Typography>
                            <UnfoldMoreIcon className={classes.moreIcon}/>
                        </Button>
                        </div>
                        <Menu
                            id="lock-menu"
                            anchorEl={anchorEl}
                            keepMounted
                            open={Boolean(anchorEl)}
                            onClose={handleClose}
                        >
                            {options.map((option, index) => (
                                <MenuItem
                                    key={option}
                                    selected={index === selectedIndex}
                                    onClick={(event) => handleMenuItemClick(event, index)}
                                >
                                    {option}
                                </MenuItem>
                            ))}
                        </Menu>

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
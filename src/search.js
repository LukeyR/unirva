import React, {useState} from 'react';
import {Link, useLocation} from "react-router-dom";
import './Home.css';
import firebase from './firebase';
import {useCollection} from 'react-firebase-hooks/firestore';
import {Box, Button, ButtonGroup, Grid, makeStyles, Menu, MenuItem, Typography} from "@material-ui/core";
import HomeListingCard from "./listingCard";
import UnfoldMoreIcon from "@material-ui/icons/UnfoldMore";

const useStyles = makeStyles((theme) => (
    {
        root: {
            width: "300px",
            margin: theme.spacing(2),
        },
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
        },
        media: {
            height: 200
        },
        title_price: {
            display: "flex",
            justifyContent: "flex-start",
        },
        icons: {
            display: "flex",
            justifyContent: "flex-end",
        },
        icon: {
            margin: "5px",
        },
    }));

const firestore = firebase.firestore();

var listings = [];
var listingsPrice = [];
var docsID = [];

const options = [
    "Date: Newest - Oldest",
    "Date: Oldest - Newest",
    "Price: High - Low",
    "Price: Low - High",
];

function Search() {
    const classes = useStyles();

    var searchTerm = useLocation().pathname.replace('/search=', ''); // uses this so can enter dedicated URL - not only search from navbar
    //var searchTerm = useLocation().state[0].iD; 

    var foundResults = false;
    listings = [];

    const listingsRef = firestore.collection('listings');
    var query = listingsRef.orderBy('createdAt', "desc"); // sort by time - newest

    // retrieving them
    const [listingsBig, loading] = useCollection(query);

    // check if data is still being loaded
    if (!loading) {
        var index = 0;
        listingsBig.forEach(doc => {
            if (doc.data().name.toLowerCase().includes(searchTerm.toLowerCase())) {
                foundResults = true;
                listings[index] = doc.data();
                docsID[index] = doc.id;
                index++;
            }
        })

        // changes string-prices to float-prices. if not parseable, it sets it to 0
        index = 0;
        listings.forEach(doc => {
            doc.price = parseFloat(doc.price);
            if (isNaN(doc.price)) {
                doc.price = 0;
            }
            listingsPrice[index] = doc;
            index++;
        })

        // sorts listings by price
        listingsPrice = listingsPrice.sort((a, b) => (a.price > b.price) ? 1 : -1);

    } else {
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


    const [anchorEl, setAnchorEl] = useState(null);
    const [selectedIndex, setSelectedIndex] = useState(0);

    const handleClose = () => {
        setAnchorEl(null);
    };


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

    return (
        <div>
            {foundResults ? (
                <div>
                    <h1>Search results for '{searchTerm}'</h1>
                    <Box className="sortingRow">
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

                    </Box>
                    {!loading ?
                        <Box p={2} m={2}>
                            <Grid container justify="flex-start" spacing={4}>
                                {(showNew || showOld) ?
                                    (showNew ? listings : listings.reverse()).map((listingObj, index) =>
                                        getListingCard(listingObj, docsID[showNew ? index : docsID.length - 1 - index]))
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

function listingsRow(listings) {
    return (
        <div className="listingRow">
            {listings.map((listing, index) => {
                return (
                    <Link to={{
                        pathname: "/DisplayProduct",
                        state: [{iD: docsID[index]}]
                    }}>
                        <div key={docsID[index].toString()} className="product">
                            <img src={listing.imgUrl} className='productImage'/>
                            <p className='productTitle'>{listing.name}</p>
                            <p className='productPrice'>Price: £{listing.price}</p>
                        </div>
                    </Link>
                )
            })}
        </div>
    )
}

export default Search;
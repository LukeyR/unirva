import React, {useState} from 'react';
import './Home.css';
import firebase from './firebase';
import {useCollection} from 'react-firebase-hooks/firestore';
import {
    Box,
    Button,
    Card,
    CardContent,
    CardMedia,
    Divider,
    Grid,
    makeStyles,
    Menu,
    MenuItem,
    Snackbar,
    Typography
} from "@material-ui/core";
import UnfoldMoreIcon from '@material-ui/icons/UnfoldMore';
import HomeListingCard from "./listingCard";
import Skeleton from '@material-ui/lab/Skeleton';
import brandLogo from "./img/Brandlogo.svg";
import {useLocation} from "react-router-dom";
import {Alert} from "@material-ui/lab";

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

var sortNewestToOldest = true;
var listings = [];
var listingsPrice = [];
var docsID = [];
var docPriceID = [];

const options = [
    "Date: Newest - Oldest",
    "Date: Oldest - Newest",
    "Price: High - Low",
    "Price: Low - High",
];


let categoryOptions = []
const priceOptions = [
    "None",
    "< £10",
    "£10 - £20",
    "£20 - £50",
    "£50 - £100",
    "£100+",
];

const prices = [
    -Infinity, 10, 20, 50, 100, Infinity
]

function Home() {
    // Getting the listings from the database.
    const listingsRef = firestore.collection('listings');
    var query = listingsRef.orderBy('createdAt', "desc"); // ordering by time

    const [showNew, setShowNew] = useState(true);
    const [showOld, setShowOld] = useState(false);
    const [showLow, setShowLow] = useState(false);
    const [showHigh, setShowHigh] = useState(false);

    const [anchorEl, setAnchorEl] = useState(null);
    const [anchorElCategory, setAnchorElCategory] = useState(null);
    const [anchorElPrice, setAnchorElPrice] = useState(null);
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [selectedCategoryIndex, setSelectedCategoryIndex] = useState(0);
    const [selectedPriceIndex, setSelectedPriceIndex] = useState(0);

    const location = useLocation();

    const [successShown, setSuccessShown] = useState(false);
    const [open, setOpen] = useState(!successShown && location.state && location.state.successful);

    const handleClick = () => {
        setOpen(true);
    };

    const handleCloseSnackbar = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setSuccessShown(false)
        if (location.state && location.state.successful) {

            location.state.successful = false
        }
        setOpen(false);
    };


    const classes = useStyles();

    const handleClickListItem = (event) => {
        setAnchorEl(event.currentTarget);
    };


    const handleClickListItemCategory = (event) => {
        setAnchorElCategory(event.currentTarget);
    };


    const handleClickListItemPrice = (event) => {
        setAnchorElPrice(event.currentTarget);
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

    const handleMenuItemClickCategory = (event, index) => {
        setSelectedCategoryIndex(index);
        setAnchorElCategory(null);
    };

    const handleMenuItemClickPrice = (event, index) => {
        setSelectedPriceIndex(index);
        setAnchorElPrice(null);
    };

    const handleClose = () => {
        setAnchorEl(null);
        setAnchorElCategory(null);
        setAnchorElPrice(null);
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

        if (
            (
                categoryOptions[selectedCategoryIndex] === "None"
                ||
                listingObj.categories.includes(categoryOptions[selectedCategoryIndex])
            )
            &&
            (
                selectedPriceIndex === 0
                ||
                (
                    prices[selectedPriceIndex-1] <= listingObj.price
                    &&
                    listingObj.price <= prices[selectedPriceIndex]
                )
            )
        ) {
            return (
                <Grid item>
                    <HomeListingCard key={listingObj.createdAt} {...props} />
                </Grid>
            )
        } else {
            return (<></>)
        }
    }

    const buttonClicked = (button) => {
        alert(`${button} was clicked`)
    }

    // check if data is still being loaded
    if (!loading) {
        listings = []
        var index = 0;
        listings = [];
        listingsBig.forEach(doc => {
            for (const category of doc.data().categories) {
                if (!categoryOptions.includes(category)) {
                    categoryOptions.push(category)
                }
            }
            listings[index] = doc.data();
            categoryOptions.push()
            docsID[index] = doc.id;
            index++;
        })


        // changes string-prices to float-prices. if not parseable, it sets it to 0
        var index = 0;

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

    }

    categoryOptions.sort()
    if (!categoryOptions.includes("None")) {
        categoryOptions.unshift("None")
    } else if (categoryOptions[0] !== "None") {
        categoryOptions = categoryOptions.filter(e => e !== 'None');
        categoryOptions.unshift("None");
    }

    let emptyCards = []

    for (let i = 0; i < 8; ++i) {
        emptyCards.push(<>
            <Card className={classes.root}>
                <CardMedia>
                    <Skeleton animation="wave" variant="rect" className={classes.media}/>
                </CardMedia>
                <CardContent>
                    <div className={classes.title_price}>
                        <Skeleton animation="wave" height={28} width="80%" style={{marginBottom: 6}}/>
                        <Skeleton animation="wave" height={28} width="15%" style={{marginBottom: 6, marginLeft: 40,}}/>

                    </div>
                    <Divider variant="middle"/>
                    <Skeleton animation="wave" height={10} style={{marginBottom: 6, marginTop: 6}}/>
                    <Skeleton animation="wave" height={10}/>
                    <Skeleton animation="wave" height={10} width="65%" style={{marginBottom: 6, marginTop: 6}}/>
                    <div className={classes.icons}>
                        <Skeleton variant="circle" width={40} height={40} className={classes.icon}/>
                        <Skeleton variant="circle" width={40} height={40} className={classes.icon}/>
                    </div>
                </CardContent>
            </Card>
        </>)
    }


    return (
        <div style={{ marginBottom: "100px" }}>
            <Snackbar open={open} autoHideDuration={6000} onClose={handleCloseSnackbar}>
                <Alert onClose={handleCloseSnackbar} severity="success" variant="filled">
                    Your product was successfully submitted!
                </Alert>
            </Snackbar>

            <Box display="flex" alignItems="center" justifyContent="center"
                 style={{marginBottom: "-50px", marginTop: "-50px"}}>
                <img src={brandLogo} alt="brand logo" width={40} height={40} className={classes.media}/>
                <Typography variant="h2" style={{display: "inline", marginLeft: "15px", fontSize: "40px"}}
                            color="textPrimary">
                    unirva
                </Typography>
            </Box>
            {/*<h2>Categories</h2>*/}
            {/*    <ButtonGroup variant="outlined" color="primary" aria-label="contained primary button group">*/}
            {/*        <Button onClick={() => buttonClicked("A")}>A</Button>*/}
            {/*        <Button onClick={() => buttonClicked("B")}>B</Button>*/}
            {/*        <Button onClick={() => buttonClicked("C")}>C</Button>*/}
            {/*        <Button onClick={() => buttonClicked("More Categories")}>More Categories</Button>*/}
            {/*    </ButtonGroup>*/}
            {/*<h2>Listings in Bath</h2>*/}
            {/*<h2>Sorting</h2>*/}

            <Box p={1} m={1} style={{ marginRight: "56px", marginLeft: "56px",}}>
                <Grid container justify="center" spacing={4}>
                    <Grid item xs={12} md={4}>
                <Box display="flex" justifyContent="flex-start" alignItems="center">
                    <Typography display="inline" style={{marginRight: "10px"}}>
                        Filter:
                    </Typography>
                    <Button onClick={handleClickListItemCategory} variant="outlined" color="primary">
                        <Typography>
                            {categoryOptions[selectedCategoryIndex]}
                        </Typography>
                        <UnfoldMoreIcon className={classes.moreIcon}/>
                    </Button>
                </Box>
                    </Grid>
                    <Grid item xs={12} md={4}>
                <Box display="flex" justifyContent="center" alignItems="center">
                    <Typography display="inline" style={{marginRight: "10px"}}>
                        Price Range:
                    </Typography>
                    <Button onClick={handleClickListItemPrice} variant="outlined" color="primary">
                        <Typography>
                            {priceOptions[selectedPriceIndex]}
                        </Typography>
                        <UnfoldMoreIcon className={classes.moreIcon}/>
                    </Button>
                </Box>
                    </Grid>
                    <Grid item xs={12} md={4}>
                <Box display="flex" justifyContent="flex-end" alignItems="center">
                    <Typography display="inline" style={{marginRight: "10px"}}>
                        Sort By:
                    </Typography>
                    <Button onClick={handleClickListItem} variant="outlined" color="primary">
                        <Typography>
                            {options[selectedIndex]}
                        </Typography>
                        <UnfoldMoreIcon className={classes.moreIcon}/>
                    </Button>
                </Box>
                    </Grid>
                </Grid>
                <Menu
                    id="filter-menu"
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
                <Menu
                    id="category-menu"
                    anchorEl={anchorElCategory}
                    keepMounted
                    open={Boolean(anchorElCategory)}
                    onClose={handleClose}
                >
                    {categoryOptions.map((option, index) => (
                        <MenuItem
                            key={option}
                            selected={index === selectedCategoryIndex}
                            onClick={(event) => handleMenuItemClickCategory(event, index)}
                        >
                            {option}
                        </MenuItem>
                    ))}
                </Menu>
                <Menu
                    id="price-menu"
                    anchorEl={anchorElPrice}
                    keepMounted
                    open={Boolean(anchorElPrice)}
                    onClose={handleClose}
                >
                    {priceOptions.map((option, index) => (
                        <MenuItem
                            key={option}
                            selected={index === selectedPriceIndex}
                            onClick={(event) => handleMenuItemClickPrice(event, index)}
                        >
                            {option}
                        </MenuItem>
                    ))}
                </Menu>

            </Box>


            <Box p={1} m={1}>
                <Grid container justify="center" spacing={4}>
                    {!loading ?
                        ((showNew || showOld) ?
                                ((showNew ? listings : listings.reverse()).map((listingObj, index) =>
                                        getListingCard(listingObj, docsID[showNew ? index : docsID.length - 1 - index])
                                ))
                                :
                                ((showLow ? listingsPrice : listingsPrice.reverse()).map((listingObj, index) =>
                                        getListingCard(listingObj, docsID[showLow ? index : docsID.length - 1 - index])
                                ))


                        ) : emptyCards
                    }
                </Grid>
            </Box>
        </div>
    )
}

export default Home;
import React, {useState} from 'react';
import './Profile.css';
import firebase from 'firebase/app';
import {useCollection, useCollectionData, useDocumentData} from 'react-firebase-hooks/firestore';
import {useAuthState} from "react-firebase-hooks/auth";
import {auth} from "./firebase";
import {Link, useHistory, useLocation} from 'react-router-dom';
import {Avatar, Box, Button, Grid} from "@material-ui/core";
import HomeListingCard from "./listingCard";
import {makeStyles} from '@material-ui/styles';

const firestore = firebase.firestore();

// TODO
//  Table of all listings

var listings = [];
var docsID = [];
var profileID = null;
var matchedSeller = false;
var matchedBuyer = false;
var userID = null;
var currentName = null;
var alreadyLeftReviewSeller = false;
var alreadyLeftReviewBuyer = false;

var index = 0;
var offersSel = [];
var offersBuy = []

const useStyles = makeStyles((theme) => ({
    profilePicture: {
        display: "flex",
        justifyContent: "center",
        border: "0px solid black",
        marginTop: "20px",
        marginBottom: "20px",
        width: "185px",
        height: "185px",
        backgroundColor: theme.palette.secondary.main
    }
}))

const Profile = (theme) => {
    const history = useHistory();
    const [user] = useAuthState(auth);
    const classes = useStyles();

    const location = useLocation();
    var currentUserID = null;
    var targetName = null;
    var targetUni = null;
    var targetLastName = null;

    if (location.state) {
        profileID = location.state.targetUserID;
        currentUserID = location.state.currentUserID;
    } else {
        profileID = user.uid;

        targetName = user.displayName;
        targetLastName = "";
    }
    userID = user.uid;
    // Getting the listings from the database.
    const listingsRef = firestore.collection('listings');
    var userOffersSeller = firestore.collection('users/' + profileID + '/AcceptedOffers').where("buyerID", "==", userID);
    var userOffersBuyer = firestore.collection('users/' + userID + '/AcceptedOffers').where("buyerID", "==", profileID);
    var currentUser = firestore.collection('users').where("ID", "==", currentUserID);
    var targetUser = firestore.collection('users').where("ID", "==", profileID);
    var [target, loadingTarget] = useCollectionData(targetUser);
    if (!loadingTarget) {
        if (profileID != user.uid) {
            target.forEach(usr => {
                targetName = usr.Name;
                targetUni = usr.University;
                targetLastName = usr.LastName;
            })
        }
    }

    let userDocRef = null;
    if (user) {
        userID = user.uid;
        const usersRef = firestore.collection("users");
        userDocRef = usersRef.doc(userID)
    }
    const [userDoc, loadingUserDoc] = useDocumentData(userDocRef);

    var [current, loadingUser] = useCollectionData(currentUser);
    if (!loadingUser) {
        current.forEach(usr => {
            currentName = usr.Name;

            if (profileID == user.uid) {
                targetName = usr.Name;
                targetLastName = usr.LastName;
                targetUni = usr.University;
            }
        })
    }
    const query = listingsRef.orderBy('createdAt', "desc"); // ordering by time
    // retrieving them

    var [result1, loadingOffer] = useCollectionData(userOffersSeller);
    var [result2, loadingOfferB] = useCollectionData(userOffersBuyer);
    if (!loadingOffer && result1) {
        offersSel = result1;
    }
    if (!loadingOfferB && result2) {
        offersBuy = result2;
    }
    matchedSeller = CheckMatchSeller(); // if true then seller accepted offer of current user
    matchedBuyer = CheckMatchBuyer();

    const [listingsBig, loading] = useCollection(query);

    // check if data is still being loaded
    if (!loading) {
        // make sure to take most recent posts
        index = 0;
        listings = [];
        listingsBig.forEach(doc => {
            var data = doc.data();
            if (data.seller == profileID) {
                listings[index] = doc.data();
                docsID[index] = doc.id;
                index++;
            }
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

    var displayInfo = userDoc && (userDoc.Name + " " + userDoc.LastName);
    var uni = targetUni;


    return (
        <div className="container">
            <div className="about">
                {user ?
                    <>
                        <Box display="flex" justifyContent="center">
                        <Avatar className={classes.profilePicture} alt="Profile Image" src={userDoc && userDoc.profilePicture}>
                            {targetName ? targetName.charAt(0).toUpperCase() : "?"}
                        </Avatar>
                        </Box>
                        <h1>{displayInfo}</h1>
                        <h1>{uni}</h1>
                        <p>
                            {profileID == user.uid ?
                                <InterestedBuyers/>
                                :
                                <></>}
                            <h1>Review Score</h1>
                            <DisplayReview/>
                            <h1>Leave a review for this seller</h1>
                            {matchedSeller ?
                                <div>
                                    <AddReview option={0}></AddReview>
                                </div>
                                :
                                <div>
                                    {profileID == user.uid ?
                                        <></>
                                        :
                                        <>{alreadyLeftReviewSeller == false ?
                                            <h1>You cannot leave a review unless you make an offer and this user accepts
                                                it.</h1>
                                            :
                                            <h1>You can leave as many reviews as offers you made which were
                                                accepted.</h1>
                                        }
                                        </>
                                    }
                                </div>
                            }
                            <h1>Leave a review for this buyer</h1>
                            {matchedBuyer ?
                                <div>
                                    <AddReview option={1}></AddReview>
                                </div>
                                :
                                <div>
                                    {profileID == user.uid ?
                                        <></>
                                        :
                                        <>{alreadyLeftReviewBuyer == false ?
                                            <h1>You cannot leave a review unless this user makes an offer and you accept
                                                it.</h1>
                                            :
                                            <h1>You can leave as many reviews as offers were made which you
                                                accepted.</h1>
                                        }
                                        </>
                                    }
                                </div>
                            }
                        </p>
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

function editProfile(){
    alert("Button clicked");
}

function CheckMatchSeller()
{
    // Right now we are checing if there is at least one accepted offer with the current user
    // However this means that infinite reviews can be left by that user
    // We want to limit this to one review / sale
    // We can match the number of reviews from userID with the number of accepted Offers where buyerID == userID
    var salesDone = offersSel.length;
    // We need to count how many reviews this user (userID) left for profileID
    var reviewRef = firestore.collection('reviewsForSellers').where("target", "==", profileID).where("senderID", "==", userID);
    var [reviews, loading] = useCollectionData(reviewRef);

    if (salesDone == 0) return false;

    if (!loading) {
        if (reviews.length != 0) alreadyLeftReviewSeller = true;
        return reviews.length != salesDone
    }

    return false;

}

function CheckMatchBuyer()
{
    // Right now we are checing if there is at least one accepted offer with the current user
    // However this means that infinite reviews can be left by that user
    // We want to limit this to one review / sale
    // We can match the number of reviews from userID with the number of accepted Offers where buyerID == userID
    var salesDone = offersBuy.length;
    // We need to count how many reviews this user (userID) left for profileID
    var reviewRef = firestore.collection('reviewsForBuyers').where("target", "==", profileID).where("senderID", "==", userID);
    var [reviews, loading] = useCollectionData(reviewRef);

    if (salesDone == 0) return false;

    if (!loading) {
        if (reviews.length != 0) alreadyLeftReviewBuyer = true;
        return reviews.length != salesDone
    }

    return false;

}

function getListings(user, listings)
{
    return (
        <>
            {index ?
                listings.map((listing, index) => {
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
                })
                :
                <p>User has no listings. Sorry</p>
            }
        </>
    )
}

function InterestedBuyers()
{

    var [myListings, loading] = useCollection(firestore.collection('listings').where("seller", "==", profileID));
    var [users, loading2] = useCollectionData(firestore.collection('users'));
    var myUsers = [];
    if (!loading2) {
        users.forEach(usr => {
            myUsers[usr.ID] = usr.Name;
        })
    }
    var mapping = [];
    if (!loading) {
        myListings.forEach(listing => {
            var potentialBuyers = listing.data().interestedUsers.split(',');
            if (potentialBuyers.length != 0 && !loading2) {
                var buyersName = [];
                potentialBuyers.forEach(buyer => {
                    if (buyer != "") {
                        buyersName.push({
                            name: myUsers[buyer],
                            id: buyer
                        });
                    }
                });
                mapping.push({
                    key: listing.data().name,
                    value: buyersName,
                    listingID: listing.id
                })
            }
        })
    }

    return (
        <div>
            <h1>These are the users interested in your products.</h1>
            <p>
                {mapping && mapping.map(maping => <Buyers key={maping.key} name={maping.key} buyers={maping.value}
                                                          listing={maping}></Buyers>)}
            </p>
        </div>
    )
}

function Buyers(props)
{
    var listingName = props.name;
    var buyers = props.buyers;
    var listingId = props.listing.listingID;


    return (
        <>
            <p>Interested in {listingName}:</p>
            <>{buyers.map(buyer => {

                // When you send an offer (accept it), then all the other users interested should have their offers removed.
                const SendOffer = () => {
                    var userOffers = firestore.collection('users/' + profileID + '/AcceptedOffers');
                    userOffers.add({
                        buyerID: buyer.id,
                        listingID: listingId
                    })
                    // need to remove those still interested in this listing.
                    // need to update the listing as being sold
                    var listingRef = firestore.collection('listings').doc(listingId);
                    var newVal = "";
                    listingRef.update({
                        interestedUsers: newVal,
                        sold: "true"
                    })
                }

                return (
                    <>
                        <><Link to={{
                            pathname: "/Profile",
                            state: {
                                targetUserID: buyer.id,
                                currentUserID: userID
                            }
                        }}>
                            <button>{buyer.name}</button>
                        </Link>: <button onClick={SendOffer}>Accept Offer</button></>
                        <br/>
                    </>
                )
            })}</>
        </>
    )
}


function DisplayReview()
{
    var reviews = [];
    var credibilityScoreBuyer = 0, credibilityScoreSeller = 0;
    const queryBuy = firestore.collection('reviewsForBuyers').where("target", "==", profileID); // leaving reviews for those which buy
    const querySel = firestore.collection('reviewsForSellers').where("target", "==", profileID); // leaving reviews for those which sell
    const [reviewsRefBuyer, loadingB] = useCollection(queryBuy);
    const [reviewsRefSeller, loadingS] = useCollection(querySel);
    var countBuy = [0, 0, 0, 0, 0];
    var countSel = [0, 0, 0, 0, 0];
    var index = 0;
    var editable = [];
    const [reviewDescription, setReviewDescription] = useState('');
    const [stars, setStars] = useState('');

    if (!loadingB && reviewsRefBuyer) {
        reviewsRefBuyer.forEach(doc => {
            reviews[index] = doc.data();
            docsID[index] = doc.id;
            editable[index] = false;
            credibilityScoreBuyer += parseInt(reviews[index].stars);
            countBuy[reviews[index].stars - 1] += 1;
            index++;
        })
    }
    var limit = index // this marks the point where reviews as a buyer end and begin as a seller
    if (!loadingS && reviewsRefSeller) {
        reviewsRefSeller.forEach(doc => {
            reviews[index] = doc.data();
            docsID[index] = doc.id;
            editable[index] = false;
            credibilityScoreSeller += parseInt(reviews[index].stars);
            countSel[reviews[index].stars - 1] += 1;
            index++;
        })
    }
    return (
        <>
            <p>
                {credibilityScoreBuyer + credibilityScoreSeller != 0 ?
                    <>
                        <label>Credibility Score as buyer: {limit != 0 ? credibilityScoreBuyer / limit : 0} |||
                            Credibility Score as
                            seller: {index - limit != 0 ? credibilityScoreSeller / (index - limit) : 0}</label><br/>
                        <label>5 star reviews as buyer: {countBuy[4]} out of {limit} ||| 5 star reviews as
                            seller: {countSel[4]} out of {index - limit}</label><br/>
                        <label>4 star reviews as buyer: {countBuy[3]} out of {limit} ||| 4 star reviews as
                            seller: {countSel[3]} out of {index - limit}</label><br/>
                        <label>3 star reviews as buyer: {countBuy[2]} out of {limit} ||| 3 star reviews as
                            seller: {countSel[2]} out of {index - limit}</label><br/>
                        <label>2 star reviews as buyer: {countBuy[1]} out of {limit} ||| 2 star reviews as
                            seller: {countSel[1]} out of {index - limit}</label><br/>
                        <label>1 star reviews as buyer: {countBuy[0]} out of {limit} ||| 1 star reviews as
                            seller: {countSel[0]} out of {index - limit}</label><br/>
                    </>
                    :
                    <label>There are no reviews for this user.</label>
                }
            </p>
            <p>
                {reviews.map((review, index) => {

                    const editReview = () => {
                        editable[index] = true;
                        var path = "";
                        console.log(index, limit);
                        if (index < limit) path = "reviewsForBuyers";
                        else path = "reviewsForSellers";
                        firestore.collection(path).doc(docsID[index]).update({
                            editable: "true"
                        })
                    }

                    const updateReview = (e) => {
                        e.preventDefault();
                        var path = "";
                        if (index < limit) path = "reviewsForBuyers";
                        else path = "reviewsForSellers";
                        firestore.collection(path).doc(docsID[index]).update({
                            editable: "false",
                            reviewDescr: reviewDescription,
                            stars: stars
                        })
                        setReviewDescription("");
                        setStars("");
                    }

                    return (
                        <div key={docsID[index].toString()} className="review">
                            {index == 0 && credibilityScoreBuyer != 0 ? <h1>Reviews as a buyer</h1> : <></>}
                            {index == limit && credibilityScoreSeller != 0 ? <h1>Reviews as a seller</h1> : <></>}
                            <p className='Review test'>{review.senderID != ""?
                            <Link to={{
                                pathname: "/Profile",
                                state: {
                                    targetUserID: review.senderID,
                                    currentUserID: userID
                                }
                            }}>
                                <button>{review.sender}</button>
                            </Link>
                            :
                            <>Deleted Account</>
                            }:{review.editable == "true" && review.senderID == userID?
                                <>
                                    <form className='reviewForm' onSubmit={updateReview}>
                                        <label>Review text: </label><input type="text" placeholder={review.reviewDescr}
                                                                           value={reviewDescription}
                                                                           onChange={(e) => setReviewDescription(e.target.value)}/>
                                        <label>Stars: </label><input type="number" min="1" max="5"
                                                                     placeholder={review.stars} value={stars}
                                                                     onChange={(e) => setStars(e.target.value)}/>
                                        <button className='button' type="submit">Update review</button>
                                    </form>
                                </>
                                :
                                <>{review.reviewDescr} - {review.stars} stars {
                                    review.senderID == userID ?
                                        <>
                                            <button onClick={editReview}>Edit review</button>
                                        </>
                                        :
                                        <></>
                                }
                                </>
                            }
                            </p>
                        </div>
                    )
                })}
            </p>
        </>
    )
}

function AddReview(option)
{
    var value = option.option;
    var path = "";
    console.log(value);
    if (value == 0) path = "reviewsForSellers";
    else path = "reviewsForBuyers"
    const reviewsRef = firestore.collection(path);
    const [reviewDescription, setReviewDescription] = useState('');
    const [stars, setStars] = useState('');


    // Once a review is added, we should let that user only edit their review, but not leave any more (one review / sale)
    const submitReview = async (e) => {
        e.preventDefault();
        reviewsRef.add({
            reviewDescr: reviewDescription,
            stars: stars,
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            sender: currentName,
            senderID: userID,
            target: profileID,
            editable: "false"
        })
    }

    return (
        <form className='reviewForm' onSubmit={submitReview}>
            <label>Review text: </label><input type="text" value={reviewDescription}
                                               onChange={(e) => setReviewDescription(e.target.value)}/>
            <label>Stars: </label><input type="number" min="1" max="5" value={stars}
                                         onChange={(e) => setStars(e.target.value)}/>
            <button className='button' type="submit">Submit review</button>
        </form>
    );
}

export default Profile;
import React, {useState} from 'react';
import './Profile.css';
import firebase from 'firebase/app';
import {useCollection, useCollectionData} from 'react-firebase-hooks/firestore';
import {useAuthState} from "react-firebase-hooks/auth";
import {auth} from "./firebase";
import {Link, useHistory, useLocation} from 'react-router-dom';

const firestore = firebase.firestore();


var listings = [];
var docsID = [];
var profileID = null;
var matched = false;
var userID = null;
var currentName = null;
var alreadyLeftReview = false;

var index = 0;
var offers = [];

function Profile(){
    const history = useHistory();
    const [user] = useAuthState(auth);
    const location = useLocation();
    var currentUserID = null;
    if(location.state!= null){
        profileID = location.state[0].targetUserID;
        currentUserID = location.state[0].currentUserID;
    }
    else{
        profileID = user.uid;
    }
    userID = user.uid;
    // Getting the listings from the database.
    const listingsRef = firestore.collection('listings');
    var userOffers = firestore.collection('users/' + profileID + '/AcceptedOffers').where("buyerID", "==", userID);
    var currentUser = firestore.collection('users').where("ID", "==", currentUserID);
    var [current, loadingUser] = useCollectionData(currentUser);
    if(!loadingUser){
        current.forEach(usr => {
            currentName = usr.Name;
        })
    }
    const query = listingsRef.orderBy('createdAt', "desc"); // ordering by time
    // retrieving them

    var [result, loadingOffer] = useCollectionData(userOffers);
    if(!loadingOffer){
        offers = result;
    }

    matched = CheckMatch(); // if true then seller accepted offer of current user

    const [listingsBig, loading] = useCollection(query);

    // check if data is still being loaded
    if(!loading){
        // make sure to take most recent posts
        index = 0;
        listings = [];
        listingsBig.forEach(doc => {
            var data = doc.data();
            if(data.seller == profileID){
                listings[index] = doc.data();
                docsID[index] = doc.id;
                index++;
            }
        })
    }

    return(
        <div className="container">
            <div className="about">
                {user ?
                    <>
                        <img className="profilePicture" src={user.photoURL}/>
                        <h1>{user.displayName}</h1>
                        <p> 
                            {profileID == user.uid ?
                            <InterestedBuyers/>
                            :
                            <></>}
                            <h1>Review Score</h1>
                            <DisplayReview/>
                            {matched ?
                            <div>    
                                <h1>Leave a review</h1>
                                <AddReview/>
                            </div>
                            :
                            <div>
                                {alreadyLeftReview == false ?
                                    <h1>You cannot leave a review unless you make an offer and this user accepts it.</h1>
                                    :
                                    <h1>You can leave as many reviews as offers you made which were accepted.</h1>
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
                <h1>Listings need the "Seller" field to contain the userID of their owner</h1>
                <h2>This so we can display only the listings created by this user</h2>
                <p>Currently displaying all possible listings for now</p>
                {user ?
                    getListings(user, listings)
                :
                    <p>User has no listings</p>
                }
            </div>
        </div>

    )
}

function CheckMatch(){
    // Right now we are checing if there is at least one accepted offer with the current user
    // However this means that infinite reviews can be left by that user
    // We want to limit this to one review / sale
    // We can match the number of reviews from userID with the number of accepted Offers where buyerID == userID
    var salesDone = offers.length;
    // We need to count how many reviews this user (userID) left for profileID
    var reviewRef = firestore.collection('reviews').where("target", "==", profileID).where("senderID", "==", userID);
    var [reviews, loading] = useCollectionData(reviewRef);
    
    if(salesDone == 0) return false;
    
    if(!loading){
        if(reviews.length != 0) alreadyLeftReview = true;
        return !reviews.length == salesDone
    } 

    return false;

}

function getListings(user, listings){
    return(
        <>
        {index ?
        listings.map((listing, index) =>{
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
        })
        :
        <p>User has no listings. Sorry</p>
        }
        </>
    )
}

function InterestedBuyers(){

    var [myListings, loading] = useCollection(firestore.collection('listings').where("seller", "==", profileID));
    var [users, loading2] = useCollectionData(firestore.collection('users'));
    var myUsers = [];
    if(!loading2){
        users.forEach(usr => {
            myUsers[usr.ID] = usr.Name;
        })
    }
    var mapping = [];
    if(!loading){
        myListings.forEach(listing => {
            var potentialBuyers = listing.data().interestedUsers.split(',');
            if(potentialBuyers.length != 0 && !loading2){
                var buyersName = [];
                potentialBuyers.forEach(buyer => {
                    if(buyer != ""){
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

    return(
        <div>
            <h1>These are the users interested in your products.</h1>
            <p>
            {mapping && mapping.map(maping => <Buyers key={maping.key} name={maping.key} buyers={maping.value} listing={maping}></Buyers>)}
            </p>
        </div>
    )
}

function Buyers(props){
    var listingName = props.name;
    var buyers = props.buyers;
    var listingId = props.listing.listingID;

    

    return(
        <>
        <p>Interested in {listingName}:</p>
        <>{buyers.map(buyer => {
            
            // When you send an offer (accept it), then all the other users interested should have their offers removed.
            const SendOffer = () =>{
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

            return(
            <>
            <>{buyer.name}: <button onClick={SendOffer}>Accept Offer</button></>
            <br/>
            </>
        )})}</>
        </>
    )
}


function DisplayReview(){
    var reviews = [];
    var credibilityScore = 0;
    const query = firestore.collection('reviews').where("target", "==", profileID);
    const [reviewsRef, loading] = useCollection(query);

    
    if(!loading){
        var index = 0;
        reviewsRef.forEach(doc => {
            reviews[index] = doc.data();
            docsID[index] = doc.id;
            credibilityScore += parseInt(reviews[index].stars);
            index++;
        })
    }
    console.log(credibilityScore);
    return(
        <>
        <p>
            {credibilityScore != 0 ?
                <label>Credibility Score: {credibilityScore/index}</label>
                :
                <label>There are no reviews for this user.</label>
            }
        </p>
        <p>
        {reviews.map((review, index) =>{
            return(
                <div key={docsID[index].toString()} className="review">
                    <p className='Review test' >{review.sender}: {review.reviewDescr} - {review.stars} stars</p>
                </div>
            )
        })}
        </p>
    </>
    )
}

function AddReview(){

    const reviewsRef = firestore.collection('reviews');

    const [reviewDescription, setReviewDescription] = useState('');
    const [stars, setStars] = useState('');


    // Once a review is added, we should let that user only edit their review, but not leave any more (one review / sale)
    const submitReview = async(e) => {
        e.preventDefault();
        reviewsRef.add({
            reviewDescr:reviewDescription,
            stars:stars,
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            sender: currentName,
            senderID: userID,
            target: profileID
        })
    }

    return(
        <form className = 'reviewForm' onSubmit={submitReview}>
            <label>Review text: </label><input type="text" value={reviewDescription} onChange={(e) => setReviewDescription(e.target.value)}/>
            <label>Stars: </label><input type="number" min="0" max="5" value={stars} onChange={(e) => setStars(e.target.value)}/>
            <button className='button' type="submit">Submit review</button>
        </form>
    );
}

export default Profile;
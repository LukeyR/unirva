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
var interestedUsers = null;

var index = 0;

function Profile(){
    const history = useHistory();
    const [user] = useAuthState(auth);
    const location = useLocation();
    console.log(location.state);
    if(location.state!= null){
        profileID = location.state[0].targetUserID;
    }
    else{
        profileID = user.uid;
    }
    // Getting the listings from the database.
    const listingsRef = firestore.collection('listings');
    const query = listingsRef.orderBy('createdAt', "desc"); // ordering by time
    // retrieving them

    console.log(profileID);
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
        console.log(index);
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
                            {matched ?
                            <div>
                                <DisplayReview/>
                                <AddReview/>
                            </div>
                            :
                            <></>}
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

    var [myListings, loading] = useCollectionData(firestore.collection('listings').where("seller", "==", profileID));
    var [users, loading2] = useCollectionData(firestore.collection('users'));
    var myUsers = [];
    if(!loading2){
        users.forEach(usr => {
            myUsers[usr.ID] = usr.Name;
        })
    }
    var mapping = [];
    console.log(myUsers);
    if(!loading){
        myListings.forEach(listing => {
            var potentialBuyers = listing.interestedUsers.split(',');
            if(potentialBuyers.length != 0 && !loading2){
                var buyersName = [];
                potentialBuyers.forEach(buyer => {
                    buyersName.push(myUsers[buyer]);
                });
                console.log(buyersName);
                mapping.push({
                    key: listing.name,
                    value: buyersName
                })
            }
        })
    }

    console.log(mapping);

    return(
        <div>
            <h1>These are the users interested in your products.</h1>
            <p>
            {mapping && mapping.map(maping => <Buyers key={maping.key} name={maping.key} buyers={maping.value}></Buyers>)}
            </p>
        </div>
    )
}

function Buyers(props){
    var listingName = props.name;
    var buyers = props.buyers;
    return(
        <>
        <p>Interested in {listingName}:</p>
        <>{buyers.map(buyer => {return(
            <>
            <>{buyer}: <button>Accept Offer</button></>
            <br/>
            </>
        )})}</>
        </>
    )
}

function DisplayReview(){
    var reviews = [];
    var credibilityScore = 0;
    const query = firestore.collection('reviews');
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
    return(
        <>
        <p>
            <label>Credibility Score: {credibilityScore/index}</label>
        </p>
        <p>
        {reviews.map((review, index) =>{
            return(
                <div key={docsID[index].toString()} className="review">
                    <p className='Review test' >Review: {review.reviewDescr}</p>
                    <p className='Stars' >Stars:{review.stars}</p>
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


    const submitReview = async(e) => {
        e.preventDefault();
        reviewsRef.add({
            reviewDescr:reviewDescription,
            stars:stars,
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
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
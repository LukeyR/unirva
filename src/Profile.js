import React, {useState} from 'react';
import './Profile.css';
import firebase from 'firebase/app';
import {useCollection} from 'react-firebase-hooks/firestore';
import {useAuthState} from "react-firebase-hooks/auth";
import {auth} from "./firebase";
import {Link, useHistory} from 'react-router-dom';

const firestore = firebase.firestore();


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

    return(
        <div className="container">
            <div className="about">
                {user ?
                    <>
                        <img className="profilePicture" src={user.photoURL}/>
                        <h1>{user.displayName}</h1>
                        <p>
                            <DisplayReview/>
                            <AddReview/>
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
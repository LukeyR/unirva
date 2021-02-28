import React, {useState} from 'react';
import firebase from './firebase';
import { storage, auth } from './firebase';
import './Product.css';
import {useAuthState} from "react-firebase-hooks/auth";

//Tried to make it nicer

const firestore = firebase.firestore(); // accessing the firestore (database)


// main structure of the Product page
/**
 * Note for the <section> bit. Here we can use a structure which based on the request (view or upload)
 * displays the requested section. For example, if a user wants to upload a new product, then this will be the displayed section.
 * If a user wants to view a product, then we can make a new function preview which displays that product.
 */
function Product() {
    return(
        <div className='Product'>
            <h1>This is the Product's page</h1>
            <>So far let's focus on uploading new products and making sure these are stored in the database.</>
            <br/>
            <>Then we can focus on viewing each product.</>

            <h1>Elements of a product</h1>
            <>These should be: photo, name, description, price</>

            <h1 className='product-info'>Product Information</h1>
            <section>
                <Upload/>
            </section>

        </div>
    );
}

/**
 * Mainly this is a form where the user inputs the details of their product
 * Inpired from the chat room tutorial I sent on WhatsApp
 * Tbh, I am not entirely sure what all the lines do, but it seems to work.
 */
function Upload(){
    const listingsRef = firestore.collection('listings'); // reference to the listings collection

    // the fields of a listing
    const [nameVal, setFormValue] = useState('');
    const [descriptionVal, setFormValue2] = useState('');
    const [priceVal, setFormValue3] = useState('');
    const [sellerVal, setFormValue4] = useState('');
    const [image, setImage] = useState(null);
    const [url, setUrl] = useState('');
    const [user] = useAuthState(auth);

    const handleChange = e => {
        if (e.target.files[0]){
            setImage(e.target.files[0]);
        }
    }

    const uploadImg = () => {
        const uploadImg = storage.ref('images/' + image.name).put(image);

        uploadImg.on("state_changed", snapshot => {}, error => {console.log(error);},
            () => {storage.ref('images').child(image.name).getDownloadURL().then(url => {
                console.log("url: ", url);
                setUrl(url);
            });});
    }

    const sendListing = async(e) => {
        console.log("+++" + user.uid)
        e.preventDefault();

        await listingsRef.add({
            name:nameVal,
            description:descriptionVal,
            price:priceVal,
            imgUrl:url,
            seller:(user ? user.uid : sellerVal),
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        });
        console.log("product submitted")
        
        // dunno what this does but I assume it resets the text fields
        setFormValue('');
        setFormValue2('');
        setFormValue3('');
        setFormValue4('');
        setImage(null);
        setUrl('');

        //Should redirect back to home page
        window.location.href = "";
    }

    // the main form
    return(
        <form className = 'form' onSubmit={sendListing}>
            <label className='label1'>Name: </label><input className="input" type="text" value={nameVal} onChange={(e) => setFormValue(e.target.value)}/>
            <label className='label2'>Price: </label><input className="input" type="text" value={priceVal} onChange={(e) => setFormValue3(e.target.value)}/>
            <label className='label3'>Seller: </label><input className="input" type="text" value={sellerVal} onChange={(e) => setFormValue4(e.target.value)}/>
            <label className='label1'>Description: </label><textarea className="description" placeholder="Describe your product here" value={descriptionVal} onChange={(e) => setFormValue2(e.target.value)}/>
            <label className='label1'>Image Upload</label><input className="fileInput" type="file" onChange={handleChange}/>
            <button className='fileUploadButton' type="button" onClick={uploadImg}>Upload Image</button>
            <img src={url} alt='react logo' className='productImage' />
            <button className='button' type="submit">Post Listing</button>
        </form>
    );
}


export default Product;
import React, {useState} from 'react';
import firebase from './firebase';
import { storage, auth } from './firebase';
import './Product.css';
import {useAuthState} from "react-firebase-hooks/auth";
import {useHistory} from "react-router-dom";

//Tried to make it nicer

const firestore = firebase.firestore(); // accessing the firestore (database)


// main structure of the Product page
/**
 * Note for the <section> bit. Here we can use a structure which based on the request (view or upload)
 * displays the requested section. For example, if a user wants to upload a new product, then this will be the displayed section.
 * If a user wants to view a product, then we can make a new function preview which displays that product.
 */
function Product() {
    const history = useHistory();
    const [user] = useAuthState(auth);

    if (!user) {
        console.log("here")
        history.push("./menu")
    }

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
    //const [sellerVal, setFormValue4] = useState('');
    const [image, setImage] = useState(null);
    const [user] = useAuthState(auth);

    function handleChange() {
        const preview = document.querySelector('img');
        const file = document.querySelector('input[type=file]').files[0]
        const reader = new FileReader();

        reader.addEventListener('load', function (){
            preview.src = reader.result;
        }, false);

        if (file && file.type.match('image.*')) {
            reader.readAsDataURL(file)
            setImage(file);
        }else{
            alert('Please only upload images');
        }
    }

    // generates random alphanumeric file name of length 25
    const generateFileName = () => {
        let fileName = '';
        let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let charactersLength = characters.length;
        for(let i=0; i<25; i++){
            fileName+=characters.charAt(Math.floor(Math.random()*charactersLength));
        }
        return fileName;
    }

    //gets the file extension from the image name
    const getFileExtension = () => {
        let fileExtension = '';
        for(let i=image.name.length; i>0; i--){
            if(image.name.charAt(i) === '.'){
                fileExtension = image.name.charAt(i) + fileExtension;
                break;
            }else{
                fileExtension = image.name.charAt(i) + fileExtension;
            }
        }
        return fileExtension;
    }

    //submits form by getting file name, uploading image, getting url and then submitting listing
    const submitForm = async(e) => {

        e.preventDefault();

        let fileName = generateFileName();

        let fileExtension = getFileExtension();

        const uploadImg = storage.ref('images/' + fileName + fileExtension).put(image);

        uploadImg.on("state_changed", snapshot => {}, error => {console.log(error);},
            () => {storage.ref('images').child(fileName + fileExtension).getDownloadURL().then(url => {
                console.log("url: ", url);

                listingsRef.add({
                    name:nameVal,
                    description:descriptionVal,
                    price:priceVal,
                    imgUrl:url,
                    seller:user.uid,
                    createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                    likedBy: [user.uid],
                    interestedUsers: ""
                }).then(() => {
                    console.log('product submitted. redirecting...');
                    window.location.href = "/";
                });

            });});
    }

    // the main form
    return(
        <form className = 'form' onSubmit={submitForm}>
            <label className='label1'>Name: </label><input className="input" type="text" value={nameVal} onChange={(e) => setFormValue(e.target.value)}/>
            <label className='label2'>Price: </label><input className="input" type="number" value={priceVal} onChange={(e) => setFormValue3(e.target.value)}/>
            <label className='label1'>Description: </label><textarea className="description" placeholder="Describe your product here" value={descriptionVal} onChange={(e) => setFormValue2(e.target.value)}/>
            <label className='label1'>Image Upload</label><input className="fileInput" type="file" onChange={handleChange}/>
            <button className='button' type="submit">Post Listing</button>
            <img src='' alt='' className='productImage' />
        </form>
    );
}


export default Product;
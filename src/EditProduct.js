import React, {useState} from 'react';
import firebase from './firebase';
import { storage} from './firebase';
import { useCollection } from 'react-firebase-hooks/firestore';
import { useLocation } from 'react-router-dom';

const firestore = firebase.firestore();

function EditProduct(){
    let state = useLocation().state[0];
    let id = state.iDListing;
    let listingName = state.name;
    let listingDes = state.description;
    let listingPrice = state.price;
    let listingUrl = state.url;

    const listingsRef = firestore.collection('listings').doc(id);


    const [nameVal, setFormValue] = useState(listingName);
    const [descriptionVal, setFormValue2] = useState(listingDes);
    const [priceVal, setFormValue3] = useState(listingPrice);
    const [image, setImage] = useState(null);
    const [url, setUrl] = useState(listingUrl);


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

    const updateListing = async(e) => {
        e.preventDefault();

        await listingsRef.update({
            name:nameVal,
            description:descriptionVal,
            price:priceVal,
            imgUrl:url
        });
        console.log("product submitted")
        
        // dunno what this does but I assume it resets the text fields
        setFormValue('');
        setFormValue2('');
        setFormValue3('');
        setImage(null);
        setUrl('');

        //Should redirect back to home page
        window.location.href = "/";
    }

    const deleteListing = async(e) => {
        await listingsRef.delete();
        window.location.href = "/";
    }

    return(
        <form className = 'form' onSubmit={updateListing}>
            <label className='label1'>Name: </label><input className="input" type="text" value={nameVal} onChange={(e) => setFormValue(e.target.value)}/>
            <label className='label2'>Price: </label><input className="input" type="text" value={priceVal} onChange={(e) => setFormValue3(e.target.value)}/>
            <label className='label1'>Description: </label><textarea className="description" placeholder="Describe your product here" value={descriptionVal} onChange={(e) => setFormValue2(e.target.value)}/>
            <label className='label1'>Image Upload</label><input className="fileInput" type="file" onChange={handleChange}/>
            <button className='fileUploadButton' type="button" onClick={uploadImg}>Upload Image</button>
            <img src={url} alt='react logo' className='productImage' />
            <button className='button' type="submit">Update Listing</button>
            <button onClick={deleteListing}>Delete Listing</button>
        </form>
    )
}

export default EditProduct;
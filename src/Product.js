import React, {useState} from 'react';
import firebase, {auth, storage} from './firebase';
import './Product.css';
import {useAuthState} from "react-firebase-hooks/auth";
import {useHistory} from "react-router-dom";
import {
    Box,
    Button,
    FormControl,
    Grid,
    InputAdornment,
    InputLabel,
    OutlinedInput,
    SvgIcon,
    TextField
} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";
import uploadVec from "./img/uploadTemplate.svg";

//Tried to make it nicer

const firestore = firebase.firestore(); // accessing the firestore (database)

function UploadTemplate() {
    return (
        <SvgIcon>
            <uploadVec/>
        </SvgIcon>
    )
}

const useStyles = makeStyles((theme) => ({
    container: {
        margin: "30px",
    },
    media: {

        display: 'flex',
        justifyContent: 'center',
        objectFit: "cover",
    },
}));

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

    return (
        <Upload/>
    );
}


let index = 0
const max_index = 7

/**
 * Mainly this is a form where the user inputs the details of their product
 * Inpired from the chat room tutorial I sent on WhatsApp
 * Tbh, I am not entirely sure what all the lines do, but it seems to work.
 */
function Upload() {
    const listingsRef = firestore.collection('listings'); // reference to the listings collection

    // the fields of a listing
    const [user] = useAuthState(auth);
    const [values, setValues] = useState({
        name: "",
        price: "",
        images: [],
        description: "",
    })
    const [emptyValues, setEmptyValues] = useState({
        name: false,
        price: false,
        images: false,
        description: false,
    })
    index = 0

    const [uploading, setUploading] = useState(false)

    const handleChange = (prop) => (event) => {
        setValues({...values, [prop]: event.target.value});
    }

    const classes = useStyles();
    const history = useHistory();


    function handleChangeImage() {
        const preview = document.getElementById(`image_output_${index}`)
        const file = document.querySelector('input[type=file]').files[0]
        const reader = new FileReader();


        reader.addEventListener('load', function () {
            preview.src = reader.result;
        }, false);

        if (file && file.type.match('image.*')) {
            reader.readAsDataURL(file)
            values.images.push(file);
        } else {
            alert('Please only upload images');
        }

        index += 1
    }

    // generates random alphanumeric file name of length 25
    const generateFileName = () => {
        let fileName = '';
        let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let charactersLength = characters.length;
        for (let i = 0; i < 25; i++) {
            fileName += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return fileName;
    }

    //gets the file extension from the image name
    const getFileExtension = (image) => {
        let fileExtension = '';
        for (let i = image.name.length; i > 0; i--) {
            if (image.name.charAt(i) === '.') {
                fileExtension = image.name.charAt(i) + fileExtension;
                break;
            } else {
                fileExtension = image.name.charAt(i) + fileExtension;
            }
        }
        return fileExtension;
    }

    //submits form by getting file name, uploading image, getting url and then submitting listing
    const submitForm = async (e) => {
        let returnEarly = false;
        if (values.name === "") {
            setEmptyValues(prevState => ({...prevState, name: true}))
            returnEarly = true;
        } else {
            setEmptyValues(prevState => ({...prevState, name: false}))
        }
        if (values.price === "") {
            setEmptyValues(prevState => ({...prevState, price: true}))
            returnEarly = true;
        } else {
            setEmptyValues(prevState => ({...prevState, price: false}))
        }
        if (values.description === "") {
            setEmptyValues(prevState => ({...prevState, description: true}))
            returnEarly = true;
        } else {
            setEmptyValues(prevState => ({...prevState, description: false}))
        }


        if (returnEarly) {
            return;
        }

        setUploading(true)

        async function uploadImage(image, firstImage, lastImage) {

            let fileName = generateFileName();

            let fileExtension = getFileExtension(image);

             const uploadImg =  storage.ref('images/' + fileName + fileExtension).put(image);
            await uploadImg.on("state_changed", snapshot => {
                }, error => {
                    console.log(error);
                },
                () => {
                    storage.ref('images').child(fileName + fileExtension).getDownloadURL().then(url => {

                        if (lastImage) {
                            imageUrls.push(url)
                            console.log(imageUrls)
                            console.log(primaryUrl)
                            listingsRef.add({
                                name: values.name,
                                description: values.description,
                                price: values.price,
                                imgUrl: primaryUrl,
                                seller: user.uid,
                                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                                likedBy: [user.uid],
                                interestedUsers: "",
                                allPhotos: imageUrls
                            }).then(() => {
                                console.log('product submitted. redirecting...');
                                history.push("/")
                            });
                        } else if (firstImage) {
                            primaryUrl = url
                        } else {
                            imageUrls.push(url)
                        }
                    });
                });
        }


        let primaryUrl = null;
        let imageUrls = []

        let counter = 0
        for (const image of values.images) {
            console.log(image)
            if (values.images.length === 1) {
                uploadImage(image, true, false)
            }
            else if (counter === 0) {
                uploadImage(image, true, false)

            } else if (counter === values.images.length - 1) {
                uploadImage(image, false, true)

            } else {
                uploadImage(image, false, false)

            }
            counter += 1
        }

    }

    // const UploadButton = () => {
    //     const [uploadUrl, setUploadUrl] = useState(null);
    //
    //     useItemStartListener(item => {
    //         console.log(`item ${item.id} started uploading. file name ${item.file.name}`)
    //     })
    //
    //     useItemFinishListener(item => {
    //         console.log(`item ${item.id} finished. response = ${item.uploadResponse}`)
    //     })
    // }

    // the main form
    return (
        // <form className = 'form' onSubmit={submitForm}>
        //     <label className='label1'>Name: </label><input className="input" type="text" value={nameVal} onChange={(e) => setFormValue(e.target.value)}/>
        //     <label className='label2'>Price: </label><input className="input" type="number" value={priceVal} onChange={(e) => setFormValue3(e.target.value)}/>
        //     <label className='label1'>Description: </label><textarea className="description" placeholder="Describe your product here" value={descriptionVal} onChange={(e) => setFormValue2(e.target.value)}/>
        //     <label className='label1'>Image Upload</label><input className="fileInput" type="file" onChange={handleChange}/>
        //     <button className='button' type="submit">Post Listing</button>
        //
        // </form>
        <>
            <Box
                p={1} m={1}
                className={classes.container}
            >
                <Grid container
                      spacing={3}
                >
                    <Grid item xs={12} sm={9}>
                        <TextField

                            error={emptyValues.name}
                            fullWidth
                            required
                            value={values.name}
                            id="Product-Name"
                            label="Product Name"
                            variant="outlined"
                            color="primary"
                            helperText="Enter a descriptive title for you product. Try using key words."
                            className={classes.name}
                            onChange={handleChange("name")}
                        />
                    </Grid>
                    <Grid item xs={12} sm={3}>
                        <FormControl fullWidth className={classes.margin} variant="outlined"
                                     error={emptyValues.price}>
                            <InputLabel htmlFor="standard-adornment-amount">Price</InputLabel>
                            <OutlinedInput
                                id="standard-adornment-amount"
                                value={values.price}
                                type="number"
                                startAdornment={<InputAdornment position="start">£</InputAdornment>}
                                labelWidth={37}
                                onChange={handleChange("price")}
                            />
                        </FormControl>
                    </Grid>
                    <Grid container
                          spacing={2}
                          direction="row"
                          alignItems="center"
                          justify="center"
                          item
                          xs={12} md={3} lg={2}
                    >
                        <Grid item>
                            <Box textAlign="center" alignItems="center"
                                 p={1} m={1}>
                                <Button
                                    id="upload_button"
                                    variant="outlined"
                                    component="label"
                                    color="primary"
                                    style={{margin: "auto"}}
                                >
                                    <input
                                        id="upload-photo"
                                        name="upload-photo"
                                        type="file"
                                        hidden
                                        onChange={handleChangeImage}
                                    />
                                    Upload Image
                                </Button>
                            </Box>

                        </Grid>
                    </Grid>
                    <Grid container
                          direction="row"
                          alignItems="center"
                          justify="space-evenly"
                          item
                          xs={12} md={9} lg={10}
                    >
                        <Grid item>
                            <img id="image_output_0" src={uploadVec} alt="brand logo" width={175} height={175}
                                 className={classes.media}/>
                        </Grid>
                        <Grid item>
                            <img id="image_output_1" src={uploadVec} alt="brand logo" width={175} height={175}
                                 className={classes.media}/>
                        </Grid>
                        <Grid item>
                            <img id="image_output_2" src={uploadVec} alt="brand logo" width={175} height={175}
                                 className={classes.media}/>
                        </Grid>
                        <Grid item>
                            <img id="image_output_3" src={uploadVec} alt="brand logo" width={175} height={175}
                                 className={classes.media}/>
                        </Grid>
                        <Grid item>
                            <img id="image_output_4" src={uploadVec} alt="brand logo" width={175} height={175}
                                 className={classes.media}/>
                        </Grid>
                        <Grid item>
                            <img id="image_output_5" src={uploadVec} alt="brand logo" width={175} height={175}
                                 className={classes.media}/>
                        </Grid>
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            required
                            multiline
                            error={emptyValues.description}
                            value={values.description}
                            rows={3}
                            rowsMax={13}
                            id="Product-Description"
                            label="Product Description"
                            variant="outlined"
                            color="primary"
                            helperText="Enter a good description for your product"
                            className={classes.name}
                            onChange={handleChange("description")}
                        />
                    </Grid>
                    <Grid container
                          spacing={0}
                          direction="row"
                          alignItems="center"
                          justify="center"
                          item
                          xs={12}
                    >
                        <Button onClick={() => {
                            submitForm().then()
                        }}
                                disabled={uploading}
                                variant="outlined"
                                color="primary">
                            {uploading ? "uploading" : "upload"}
                        </Button>
                    </Grid>
                </Grid>
            </Box>
        </>
    )

}


export default Product;
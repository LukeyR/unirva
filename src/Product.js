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
    LinearProgress,
    OutlinedInput,
    Paper,
    SvgIcon,
    TextField
} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";
import uploadVec from "./img/uploadTemplate.svg";
import {CheckOutlined, ClearOutlined, DeleteOutlined, PublishOutlined, Update} from "@material-ui/icons";
import red from '@material-ui/core/colors/red';

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
    noButton: {
        color: theme.palette.action.disabled,
        borderColor: theme.palette.action.disabled,
    },
    yesButton: {
        color: red[200],
        borderColor: red[200],
    },
}));

// main structure of the Product page
/**
 * Note for the <section> bit. Here we can use a structure which based on the request (view or upload)
 * displays the requested section. For example, if a user wants to upload a new product, then this will be the displayed section.
 * If a user wants to view a product, then we can make a new function preview which displays that product.
 */
function Product(props) {
    const history = useHistory();
    const [user] = useAuthState(auth);


    if (!user) {
        console.log("here")
        history.push("./menu")
    }

    return (
        <Upload {...props}/>
    );
}


let index = 0
let startIndex = 0
const max_index = 7

/**
 * Mainly this is a form where the user inputs the details of their product
 * Inpired from the chat room tutorial I sent on WhatsApp
 * Tbh, I am not entirely sure what all the lines do, but it seems to work.
 */
function Upload(props) {
    const editing = props.location.state !== undefined
    const name = editing ? props.location.state.name : "";
    const price = editing ? props.location.state.price : "";
    const url = editing ? [props.location.state.url] : [];
    const extraPhotos = editing ? props.location.state.extraUrls : [];
    const description = editing ? props.location.state.description : "";
    const id = editing ? props.location.state.iDListing : "";
    const listingsRef = firestore.collection('listings'); // reference to the listings collection

    // the fields of a listing
    const [user] = useAuthState(auth);
    const [values, setValues] = useState({
        name: name,
        price: price,
        images: url.concat(extraPhotos),
        description: description,
    })
    const [emptyValues, setEmptyValues] = useState({
        name: false,
        price: false,
        images: false,
        description: false,
    })
    const [startIndex, setStartIndex] = useState(values.images.length)
    index = values.images.length


    const [uploading, setUploading] = useState(false)
    const [disableUpload, setDisableUpload] = useState(index > 5)
    const [areYouSure, setAreYouSure] = useState(false)
    const [loadingBar, setLoadingBar] = useState("0")

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
        setDisableUpload(index > 5)
        console.log("image uploaded locally")
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

        setLoadingBar("100")

        setUploading(true)

        async function uploadImage(image, firstImage, lastImage) {

            let fileName = generateFileName();

            let fileExtension = getFileExtension(image);

            let storageRef = storage.ref('images/' + fileName + fileExtension);

            return new Promise(function (resolve, reject) {
                    const uploadImg = storageRef.put(image);

                uploadImg.on("state_changed",
                    (snapshot) => {
                        console.log("uploading")
                    }, (error) => {
                        return reject(error)
                    },
                    () => {
                        return resolve(uploadImg)
                    }
                    );
                }).then(function (uploadImg) {
                console.log(uploadImg)
                uploadImg.ref.getDownloadURL().then(url => {

                    if (firstImage && lastImage) {
                        console.log("last image uploading: " + url)
                        listingsRef.add({
                            name: values.name,
                            description: values.description,
                            price: values.price,
                            imgUrl: url,
                            seller: user.uid,
                            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                            likedBy: [user.uid],
                            interestedUsers: "",
                            allPhotos: imageUrls
                        }).then(() => {
                            history.push("/", {successful: true})
                            return('product submitted. redirecting...');
                        });
                    } else if (lastImage) {
                        console.log("last image uploading: " + url)
                        imageUrls.push(url)
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
                            history.push("/", {successful: true})
                            return('product submitted. redirecting...');
                        });
                    } else if (firstImage) {
                        console.log("first image uploaded: " + url)
                        primaryUrl = url;
                        return('product submitted.');
                    } else {
                        console.log("next image uploading: " + url)
                        imageUrls.push(url)
                        return('product submitted.');
                    }
                });
                }

            )


        }


        async function updateListing(image, firstImage, lastImage, noImage) {
            const editingListingsRef = firestore.collection('listings').doc(id);

            if (noImage) {
                await editingListingsRef.update({
                    name: values.name,
                    description: values.description,
                    price: values.price,
                })
                console.log("listing updated")
                history.push("/")
                return;
            }

            let fileName = generateFileName();

            let fileExtension = getFileExtension(image);

            const uploadImg = storage.ref('images/' + fileName + fileExtension).put(image);
            await uploadImg.on("state_changed", snapshot => {
                }, error => {
                    console.log(error);
                },
                () => {
                    storage.ref('images').child(fileName + fileExtension).getDownloadURL().then(url => {

                        if (lastImage) {
                            imageUrls.push(url)
                            editingListingsRef.update({
                                name: values.name,
                                description: values.description,
                                price: values.price,
                                allPhotos: imageUrls
                            }).then(() => {
                                console.log('product submitted. redirecting...');
                                history.push("/", {successful: true})
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

        if (editing) {
            if (index === startIndex) {
                updateListing(null, false, false, true)
            } else {
                imageUrls = values.images.slice(1, startIndex)
                for (let i = startIndex; i < index; ++i) {
                    if (i === index - 1) { // Last photo to upload
                        updateListing(values.images[i], false, true, false)
                    } else {
                        updateListing(values.images[i], false, false, false)
                    }
                }
            }
        } else {

            let counter = 0
            for (const image of values.images) {
                if (values.images.length === 1) {
                    console.log("only image")
                    await uploadImage(image, true, true)
                } else if (counter === 0) {
                    console.log("first image")
                    await uploadImage(image, true, false)

                } else if (counter === values.images.length - 1) {
                    console.log("last image")
                    await uploadImage(image, false, true)

                } else {
                    console.log("middle image")
                    await uploadImage(image, false, false)

                }
                counter += 1
            }
        }

    }

    console.log(values.description)

    const getImageName = (url) => {
        let baseUrl = 'https://firebasestorage.googleapis.com/v0/b/ipproject-27ae8.appspot.com/o/images%2F';
        let imageName = url.replace(baseUrl, '');
        let indexOfEnd = imageName.indexOf('?');
        imageName = imageName.substring(0, indexOfEnd);
        console.log(imageName)
        return imageName
    }

    async function deleteListing() {
        for (const image of values.images) {
            const imageName = getImageName(image)
            await storage.ref("images").child(imageName).delete()
        }
        await listingsRef.doc(id).delete().then(() => {
            history.push("/")
        })
    }

    let printImages = []

    for (let i = 0; i < 6; ++i) {
        printImages.push(
            <Grid item>
                <img id={`image_output_${i}`}
                     src={typeof values.images[i] === "object" && values.images[i] !== null ? document.getElementById(`image_output_${i}`).src
                         : (values.images[i] !== undefined ? values.images[i] : uploadVec)
                     } alt="brand logo" width={175} height={175}
                     className={classes.media}/>
            </Grid>
        )
    }


    // the mai form
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
                <Paper>
                    <Box p={3}>
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
                                <FormControl fullWidth required className={classes.margin} variant="outlined"
                                             error={emptyValues.price}>
                                    <InputLabel htmlFor="standard-adornment-amount">Price</InputLabel>
                                    <OutlinedInput
                                        id="standard-adornment-amount"
                                        value={values.price}
                                        type="number"
                                        startAdornment={<InputAdornment position="start">£</InputAdornment>}
                                        labelWidth={50}
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
                                    <Box textAlign="center" alignItems="center">
                                        <Button
                                            disabled={disableUpload}
                                            startIcon={<PublishOutlined/>}
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
                                  spacing={1}
                                  direction="row"
                                  alignItems="center"
                                  justify="space-evenly"
                                  item
                                  xs={12} md={9} lg={10}
                            >
                                {printImages}

                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    required
                                    multiline
                                    error={emptyValues.description}
                                    value={values.description}
                                    rows={5}
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
                            <LinearProgress style={{width: `${loadingBar}%`}} color="secondary"/>


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
                                        startIcon={<Update/>}
                                        variant="outlined"
                                        color="primary">
                                    {editing ? (uploading ? "updating" : "update") : (uploading ? "uploading" : "upload")}
                                </Button>
                            </Grid><Grid container
                                         spacing={0}
                                         direction="row"
                                         alignItems="center"
                                         justify="center"
                                         item
                                         xs={12}

                        >
                            {areYouSure ? (
                                <>
                                    <Box m={1}>
                                        <Button onClick={() => {
                                            setAreYouSure(false)
                                        }}
                                                startIcon={<ClearOutlined/>}
                                                variant="outlined"
                                                className={classes.noButton}>
                                            No
                                        </Button>
                                    </Box>
                                    <Box m={1}>
                                        <Button onClick={() => {
                                            deleteListing().then()
                                        }}
                                                startIcon={<CheckOutlined/>}
                                                variant="outlined"
                                                color="primary">

                                            Yes
                                        </Button>
                                    </Box>
                                </>) : (editing ? <Button onClick={() => {
                                setAreYouSure(true)
                            }}
                                                          startIcon={<DeleteOutlined/>}
                                                          variant="outlined"
                                                          className={classes.yesButton}>
                                Delete
                            </Button> : <></>)}
                        </Grid>
                        </Grid>
                    </Box>
                </Paper>
            </Box>
        </>
    )

}


export default Product;
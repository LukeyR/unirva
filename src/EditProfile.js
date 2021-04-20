import React, {useState} from 'react';
import {Avatar, Box, Button, CardContent, Grid, Paper, TextField} from "@material-ui/core";
import {useStyles} from "./authentication/Menu";
import BrandLogo from "./BrandLogo";
import {Autocomplete} from "@material-ui/lab";
import firebaseConfig, {auth, storage} from "./firebase";
import firebase from "firebase";
import {Redirect} from "react-router-dom";
import { useAuthState } from 'react-firebase-hooks/auth';
import {useCollectionData, useCollection} from 'react-firebase-hooks/firestore';
import {useHistory} from "react-router-dom";
import { FirstPageRounded, FormatLineSpacing } from '@material-ui/icons';

const firestore = firebase.firestore();

function EditProfile() {

    const history = useHistory();
    const classes = useStyles()

    const [emptyValues, setEmptyValues] = useState({
        firstName: false,
        lastName: false,
        email: false,
        university: false,
    })

    const [user] = useAuthState(auth);
    var first="", last="", mail=user.email, uni="", url = "", pp="";
    var id = user.uid;
    var [userData, loading] = useCollectionData(firestore.collection("users").where("ID", "==", id));
    var chattingWith = [];
    if(!loading){
        first = userData[0].Name;
        last = userData[0].LastName;
        mail = user.email;
        uni = userData[0].University;
        url = userData[0].photoURL;
        chattingWith = userData[0].chattingWith;
        pp = userData[0].profilePicture
    }

    const [values, setValues] = useState({
        firstName: first,
        lastName: last,
        email: mail,
        university: uni,
    })

    const handleChange = (prop) => (event) => {
        setValues({...values, [prop]: event.target.value});
    }

    const handleChangeUni = (prop) => (event) => {
        setValues({...values, [prop]: event.target.innerHTML});
    }

    const getImageName = (url) => {
        let baseUrl = 'https://firebasestorage.googleapis.com/v0/b/ipproject-27ae8.appspot.com/o/images%2F';
        let imageName = url.replace(baseUrl, '');
        let indexOfEnd = imageName.indexOf('?');
        imageName = imageName.substring(0, indexOfEnd);
        return imageName
    }

    const [currentUser, setCurrentUser] = useState(null);
    var [listings, loading2] = useCollection(firestore.collection("listings").where("seller","==",id));
    var [reviews1, loading3] = useCollection(firestore.collection("reviewsForBuyers").where("senderID","==",id));
    var [reviews2, loading4] = useCollection(firestore.collection("reviewsForSellers").where("senderID","==",id));
    var [msg, loading5] = useCollection(firestore.collection("users/" + id + "/chats"));
    const handleDelete = async () => {
        // Should first delete all that has to do with this user ID
        // First delete their listings + images
        if(!loading2 && listings){
            listings.forEach(listing => {
                var imgName = getImageName(listing.data().imgUrl);
                let storageRef = storage.ref('images').child(imgName);
                storageRef.delete();
                firestore.collection("listings").doc(listing.id).delete();
            });
        }
        // in reviews for buyers and sellers (replace sellerID with "" where sellerID == user.id)
        if(!loading3 && reviews1){
            reviews1.forEach(review => {
                let revRef = firestore.collection("reviewsForBuyers").doc(review.id);
                revRef.update({
                    senderID: ""
                })
            })
        }
        if(!loading4 && reviews2){
            reviews2.forEach(review => {
                let revRef = firestore.collection("reviewsForSellers").doc(review.id);
                revRef.update({
                    senderID: ""
                })
            })
        }
        // delete the chats with all the other users
        if(!loading5 && chattingWith){
            chattingWith.forEach(usr => {
                firestore.collection("users/" + usr + "/chats").where("SenderID","==",id).get().then(snapshot => {
                    snapshot.forEach(doc => {
                        doc.ref.delete();
                    })
                })
                firestore.collection("users/" + usr + "/chats").where("ReceiverID","==",id).get().then(snapshot => {
                    snapshot.forEach(doc => {
                        doc.ref.delete();
                    })
                })
                firestore.collection("users").where("ID","==",usr).get().then(snapshot => {
                    snapshot.forEach(doc => {
                        var oldVal = doc.data().chattingWith;
                        var index = oldVal.indexOf(id)
                        oldVal.splice(index, 1);
                        doc.ref.update({
                            chattingWith: oldVal
                        }) 
                    })
                })
            })
            // deleting my chats
            msg && msg.forEach(message => {
                message.ref.delete();
            })
        }
        // delete my profile
        firestore.collection("users").doc(user.uid).delete();
        user.delete().then(history.push("/menu"));
    };

    return (
        <div>
        {loading ?
        <h1>Loading data</h1>
        :
        <Box display="flex" justifyContent="center" alignItems="center" style={{margin: 30}}>
            <Grid container variant="contained">
                <Paper style={{margin: "auto"}}> {/*Need outline as we remove border in css*/}
                    <Box p={3}>
                        <Avatar src={pp} className={classes.profilePicture} alt="Profile Image">
                            {first ? first.charAt(0).toUpperCase() : "?"}
                        </Avatar>
                        <Grid container spacing={3}>
                            <Grid item xs={6}>
                                <TextField
                                    error={emptyValues.firstName}
                                    fullWidth
                                    required
                                    value={first}
                                    id="First-Name"
                                    label="First Name"
                                    variant="outlined"
                                    color="primary"
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField
                                    error={emptyValues.lastName}
                                    fullWidth
                                    required
                                    value={last}
                                    id="Last-Name"
                                    label="Last Name"
                                    variant="outlined"
                                    color="primary"
                                />
                            </Grid>
                        </Grid>
                        <TextField
                            error={emptyValues.email}
                            fullWidth
                            required
                            value={values.email}
                            id="Email"
                            label="Academic Email Address"
                            variant="outlined"
                            color="primary"
                            style={{marginTop: 10}}
                        />
                        <TextField
                            fullWidth
                            required
                            value={uni}
                            id="University"
                            label="University"
                            variant="outlined"
                            color="primary"
                            style={{marginTop: 10}}
                        />
                        <Button variant="outlined" color="primary"
                                style={{marginTop: 10}}
                                onClick={() => {
                                    handleDelete()
                                }}
                        >
                            Delete Profile
                        </Button>
                        <Button variant="outlined" color="primary"
                                style={{marginTop: 10}}
                                onClick={() => {
                                    history.push("/ResetPassword");
                                }}
                        >
                            Reset Password
                        </Button>
                    </Box>
                </Paper>
            </Grid>
        </Box>
        }
    </div>
    )
}

export default EditProfile;
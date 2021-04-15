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
    var first="", last="", mail=user.email, uni="", url = "";
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
        if(!loading2){
            listings.forEach(listing => {
                var imgName = getImageName(listing.data().imgUrl);
                let storageRef = storage.ref('images').child(imgName);
                storageRef.delete();
                firestore.collection("listings").doc(listing.id).delete();
            });
        }
        // in reviews for buyers and sellers (replace sellerID with "" where sellerID == user.id)
        if(!loading3){
            reviews1.forEach(review => {
                let revRef = firestore.collection("reviewsForBuyers").doc(review.id);
                revRef.update({
                    senderID: ""
                })
            })
        }
        if(!loading4){
            reviews2.forEach(review => {
                let revRef = firestore.collection("reviewsForSellers").doc(review.id);
                revRef.update({
                    senderID: ""
                })
            })
        }
        // delete the chats with all the other users
        if(!loading5){
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
            msg.forEach(message => {
                message.ref.delete();
            })
        // delete my profile
        firestore.collection("users").where("ID","==", id).get().then(snapshot => {
            snapshot.forEach(doc => {
                doc.ref.delete();
            })
            user.delete().then(history.push("./"));
        })
        }
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
                    <CardContent className={classes.cardActions}>
                        <Avatar className={classes.profilePicture} alt="Profile Image" src={url}>
                            {first ? first.charAt(0).toUpperCase() : "?"}
                        </Avatar>
                    </CardContent>
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

const unis = [
    {name: "Anglia Ruskin University",},
    {name: "Arts University Bournemouth",},
    {name: "Aston University",},
    {name: "Bath Spa University",},
    {name: "Birkbeck College",},
    {name: "Birmingham City University",},
    {name: "Bishop Grosseteste University",},
    {name: "Bournemouth University",},
    {name: "Brunel University",},
    {name: "Buckinghamshire New University",},
    {name: "Canterbury Christ Church University",},
    {name: "Central School of Speech and Drama",},
    {name: "City University",},
    {name: "College of St Mark & St John",},
    {name: "Conservatoire for Dance and Drama",},
    {name: "Courtauld Institute of Art",},
    {name: "Coventry University",},
    {name: "Cranfield University",},
    {name: "Cumbria Institute of the Arts",},
    {name: "Dartington College of Arts",},
    {name: "De Montfort University",},
    {name: "Edge Hill University",},
    {name: "Falmouth University",},
    {name: "Goldsmiths College, University of London",},
    {name: "Guildhall School of Music and Drama",},
    {name: "Harper Adams University",},
    {name: "Imperial College of Science, Technology and Medicine",},
    {name: "Institute of Cancer Research",},
    {name: "Kent Institute of Art & Design",},
    {name: "King's College London",},
    {name: "Kingston University",},
    {name: "Leeds Arts University",},
    {name: "Leeds Beckett University",},
    {name: "Leeds College of Music",},
    {name: "Leeds Trinity University",},
    {name: "Liverpool Hope University",},
    {name: "Liverpool Institute of Performing Arts",},
    {name: "Liverpool John Moores University",},
    {name: "London Business School",},
    {name: "London Metropolitan University",},
    {name: "London School of Economics and Political Science",},
    {name: "London School of Hygiene & Tropical Medicine",},
    {name: "London South Bank University",},
    {name: "Loughborough University",},
    {name: "Middlesex University",},
    {name: "Newman University, Birmingham",},
    {name: "Norwich University of the Arts",},
    {name: "Oxford Brookes University",},
    {name: "Plymouth College of Art",},
    {name: "Queen Mary and Westfield College",},
    {name: "Ravensbourne",},
    {name: "Roehampton University",},
    {name: "Rose Bruford College",},
    {name: "Royal Academy of Music",},
    {name: "Royal Agricultural University",},
    {name: "Royal College of Art",},
    {name: "Royal College of Music",},
    {name: "Royal Holloway and Bedford New College",},
    {name: "Royal Northern College of Music",},
    {name: "School of Oriental and African Studies",},
    {name: "Sheffield Hallam University",},
    {name: "Southampton Solent University",},
    {name: "St George's Hospital Medical School",},
    {name: "St Martin's College",},
    {name: "St Mary's University, Twickenham",},
    {name: "Staffordshire University",},
    {name: "Teesside University",},
    {name: "The Manchester Metropolitan University",},
    {name: "The Nottingham Trent University",},
    {name: "The Open University",},
    {name: "The Royal Veterinary College",},
    {name: "The School of Pharmacy",},
    {name: "Trinity Laban",},
    {name: "University College Birmingham",},
    {name: "University College London",},
    {name: "University for the Creative Arts",},
    {name: "University of Bath",},
    {name: "University of Bedfordshire",},
    {name: "University of Birmingham",},
    {name: "University of Bolton",},
    {name: "University of Bradford",},
    {name: "University of Brighton",},
    {name: "University of Bristol",},
    {name: "University of Buckingham",},
    {name: "University of Cambridge",},
    {name: "University of Central Lancashire",},
    {name: "University of Chester",},
    {name: "University of Chichester",},
    {name: "University of Cumbria",},
    {name: "University of Derby",},
    {name: "University of Durham",},
    {name: "University of East Anglia",},
    {name: "University of East London",},
    {name: "University of Essex",},
    {name: "University of Exeter",},
    {name: "University of Gloucestershire",},
    {name: "University of Greenwich",},
    {name: "University of Hertfordshire",},
    {name: "University of Huddersfield",},
    {name: "University of Hull",},
    {name: "University of Keele",},
    {name: "University of Kent",},
    {name: "University of Lancaster",},
    {name: "University of Leeds",},
    {name: "University of Leicester",},
    {name: "University of Lincoln",},
    {name: "University of Liverpool",},
    {name: "University of London",},
    {name: "University of Manchester",},
    {name: "University of Manchester",},
    {name: "University of Newcastle Upon Tyne",},
    {name: "University of North London",},
    {name: "University of Northampton",},
    {name: "University of Northumbria At Newcastle",},
    {name: "University of Nottingham",},
    {name: "University of Oxford",},
    {name: "University of Plymouth",},
    {name: "University of Portsmouth",},
    {name: "University of Reading",},
    {name: "University of Salford",},
    {name: "University of Sheffield",},
    {name: "University of Southampton",},
    {name: "University of Suffolk",},
    {name: "University of Sunderland",},
    {name: "University of Surrey",},
    {name: "University of Sussex",},
    {name: "University of the Arts London",},
    {name: "University of the Arts London",},
    {name: "University of the West of England, Bristol",},
    {name: "University of Warwick",},
    {name: "University of West London",},
    {name: "University of Westminster",},
    {name: "University of Winchester",},
    {name: "University of Wolverhampton",},
    {name: "University of Worcester",},
    {name: "University of York",},
    {name: "Writtle University College",},
    {name: "York St John University",},
]

export default EditProfile;
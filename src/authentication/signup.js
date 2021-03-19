import React, {useState} from 'react';
import {Box, Button, Card, CardContent, Grid, Paper, TextField} from "@material-ui/core";
import {useStyles} from "./Menu";
import BrandLogo from "../BrandLogo";
import {Autocomplete} from "@material-ui/lab";
import firebaseConfig, {auth} from "../firebase";
import firebase from "firebase";
import {Redirect} from "react-router-dom";

function Signup() {
    const classes = useStyles()

    const [emptyValues, setEmptyValues] = useState({
        firstName: false,
        lastName: false,
        email: false,
        password: false,
        passwordConfirm: false,
        university: false,
    })

    const [values, setValues] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        passwordConfirm: "",
        university: "",
    })

    const handleChange = (prop) => (event) => {
        setValues({...values, [prop]: event.target.value});
    }

    const handleChangeUni = (prop) => (event) => {
        setValues({...values, [prop]: event.target.innerHTML});
    }

    const [currentUser, setCurrentUser] = useState(null);
    const handleSubmit = async () => {

        try {
            if((values.email.includes(".ac")||values.email.includes(".edu"))){
                if(values.password===values.passwordConfirm){
                    const new_user = await firebaseConfig.auth().createUserWithEmailAndPassword(values.email, values.password);
                    await auth.currentUser.updateProfile({displayName: values.firstName + " " + values.lastName})
                    var userid = auth.currentUser.uid;
                    var db = firebase.firestore();
                    db.collection('users').doc(userid).set({
                        ID: userid,
                        Name: values.firstName,
                        LastName: values.lastName,
                        University: values.university,
                        chatsNo: 0
                    });
                    if(new_user.user != null){
                        new_user.user.sendEmailVerification();
                        alert("Verification email sent.");
                    }
                    else{
                        alert('user null');
                    }
                    setCurrentUser(true);
                }
                else{
                    console.log(values.password);
                    console.log(values.passwordConfirm);
                    throw 'Passwords do not match';
                }
            }
            else{
                throw 'Email is not a university email!';
            }
        } catch (error) {
            alert(error);
        }
    };
    if (currentUser) {
        return <Redirect to="/Profile" />;
    }

    return (
        <Box display="flex" justifyContent="center" alignItems="center" style={{margin: 30}}>
            <Grid container variant="contained">
                <Paper style={{margin: "auto"}}> {/*Need outline as we remove border in css*/}
                <Box p={3}>
                    <CardContent className={classes.cardActions}>
                        <BrandLogo/>
                    </CardContent>

                    <Grid container spacing={3}>
                        <Grid item xs={6}>
                            <TextField
                                error={emptyValues.firstName}
                                fullWidth
                                required
                                value={values.firstName}
                                id="First-Name"
                                label="First Name"
                                variant="outlined"
                                color="primary"
                                onChange={handleChange("firstName")}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                error={emptyValues.lastName}
                                fullWidth
                                required
                                value={values.lastName}
                                id="Last-Name"
                                label="Last Name"
                                variant="outlined"
                                color="primary"
                                onChange={handleChange("lastName")}
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
                        onChange={handleChange("email")}
                    />
                    <TextField
                        error={emptyValues.password}
                        fullWidth
                        required
                        value={values.password}
                        type="password"
                        id="Password"
                        label="Password"
                        variant="outlined"
                        color="primary"
                        style={{marginTop: 10}}
                        onChange={handleChange("password")}
                    />
                    <TextField
                        error={emptyValues.passwordConfirm}
                        fullWidth
                        required
                        type="password"
                        value={values.passwordConfirm}
                        id="Password-Confirm"
                        label="Re-enter Password"
                        variant="outlined"
                        color="primary"
                        style={{marginTop: 10}}
                        onChange={handleChange("passwordConfirm")}
                    />
                    <Autocomplete
                        id="University"
                        options={unis}
                        getOptionLabel={(option) => option.name}
                        style={{ marginTop: 10 }}
                        renderInput={(params) =>
                            <TextField {...params} label="University" variant="outlined"
                                       required
                                       error={emptyValues.passwordConfirm}
                                       value={values.university}
                                       onChange={handleChange("university")}/>}
                        onChange={handleChangeUni("university")}

                    />
                    <Button variant="outlined" color="primary"
                            style={{ marginTop: 10 }}
                            onClick={() => {
                       handleSubmit()}}
                    >
                        Register
                    </Button>
                </Box>
                </Paper>
            </Grid>
        </Box>
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

export default Signup;
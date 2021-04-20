import React, {useState} from 'react';
import {
    Avatar,
    Box,
    Button,
    Checkbox,
    FormControlLabel,
    Grid,
    Paper,
    TextField,
    Tooltip,
    Typography
} from "@material-ui/core";
import {useStyles} from "./Menu";
import {Autocomplete} from "@material-ui/lab";
import firebaseConfig, {auth, storage} from "../firebase";
import firebase from "firebase";
import {Redirect} from "react-router-dom";
import brandLogo from "../img/Brandlogo.svg";
import Zoom from '@material-ui/core/Zoom';

function Signup() {
    const classes = useStyles()

    const [emptyValues, setEmptyValues] = useState({
        firstName: false,
        lastName: false,
        email: false,
        password: false,
        passwordConfirm: false,
        university: false,
        privacyPolicy: false,
    })

    const [values, setValues] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        passwordConfirm: "",
        university: "",
        privacyPolicy: false,
    })

    const [pp, setPP] = useState(null)
    const [ppFile, setPPFile] = useState("")
    let ppUrl = "";

    const handleChange = (prop) => (event) => {
        setValues({...values, [prop]: event.target.value});
        setEmptyValues({...emptyValues, [prop]: false});
    }
    const handleChangeCheckbox = (prop) => (event) => {
        setValues({...values, [prop]: event.target.checked});
        setEmptyValues({...emptyValues, [prop]: false});
    }

    const handleChangeUni = (prop) => (event) => {
        setValues({...values, [prop]: event.target.innerHTML});
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

    async function uploadImage(image, firstImage, lastImage) {

        let fileName = generateFileName();

        let fileExtension = getFileExtension(image);

        let storageRef = storage.ref('profilePictures/' + fileName + fileExtension);

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
        }).then(async function (uploadImg) {
                console.log(uploadImg)
                await uploadImg.ref.getDownloadURL().then(url => {
                    ppUrl = url
                });
            }
        )


    }

    const [currentUser, setCurrentUser] = useState(null);
    const handleSubmit = async () => {

        let anyEmpty = false;

        for (let i in values) {
            if (values[i] === false || values[i] === "") {
                setEmptyValues(prevState => ({...prevState, [i]: true}))
                anyEmpty=true
            }
        }

        console.log(anyEmpty)
        if (anyEmpty) return;

        try {
            if ((values.email.includes(".ac") || values.email.includes(".edu") || values.email.includes("drept.unibuc.ro")
                    || values.email.includes("utcluj.didatec.ro"))) {
                if (values.password === values.passwordConfirm) {
                    const new_user = await firebaseConfig.auth().createUserWithEmailAndPassword(values.email, values.password);
                    await auth.currentUser.updateProfile({displayName: values.firstName + " " + values.lastName})
                    if (pp != null) {
                        await uploadImage(pp, true, true)
                    }
                    const userid = auth.currentUser.uid;
                    const db = firebase.firestore();
                    await db.collection('users').doc(userid).set({
                        ID: userid,
                        Name: values.firstName,
                        LastName: values.lastName,
                        University: values.university,
                        chatsNo: 0,
                        profilePicture: ppUrl,
                    });
                    if (new_user.user != null) {
                        await new_user.user.sendEmailVerification();
                        alert("Verification email sent.");
                    } else {
                        alert('user null');
                    }
                    setCurrentUser(true);
                } else {
                    console.log(values.password);
                    console.log(values.passwordConfirm);
                    throw 'Passwords do not match';
                }
            } else {
                throw 'Email is not a university email!';
            }
        } catch (error) {
            alert(error);
        }

        firebaseConfig.auth().signOut();

    };

    if(currentUser){
        return <Redirect to="/menu"></Redirect>
    }

    function handleChangeImage() {
        const preview = document.getElementById(`profilePicture`)
        const file = document.querySelector('input[type=file]').files[0]
        console.log(preview, file)
        const reader = new FileReader();

        reader.addEventListener('load', function () {
            setPPFile(reader.result);
        }, false);

        if (file && file.type.match('image.*')) {
            reader.readAsDataURL(file)
            setPP(file)
        } else {
            alert('Please only upload images');
        }
    }

    return (
        <Box display="flex" justifyContent="center" alignItems="center" style={{margin: 30}}>
            <Grid container variant="contained">
                <Paper style={{margin: "auto"}}> {/*Need outline as we remove border in css*/}
                    <Box p={3}>
                        <Box display={"flex"} justifyContent={"center"}>
                            <img src={brandLogo} alt="brand logo" width={40} height={40}/>
                            <Typography variant="h2" style={{fontSize: "35px", marginLeft: "10px"}}>
                                unirva
                            </Typography>
                        </Box>


                        <Box style={{margin: "auto", marginBottom: "10px"}}>
                            <Box display="flex" textAlign="center" alignItems="center" flexDirection={"column"}>
                                <Button
                                    id="upload_button"
                                    variant="text"
                                    component="label"
                                >
                                    <input
                                        id="upload-photo"
                                        name="upload-photo"
                                        type="file"
                                        hidden
                                        onChange={() => {
                                            handleChangeImage()
                                        }}
                                    />
                                    <Box display="flex" textAlign="center" alignItems="center" flexDirection={"column"}>
                                    <Avatar alt="brand logo" className={classes.uploadImage} id="profilePicture"
                                            src={ppFile} style={{display: "inline-block"}}/>
                                    <Typography variant={"body2"} style={{
                                        marginTop: "-32px",
                                        marginBottom: "15px",
                                        zIndex: 5,
                                        color: "#fafafa",
                                        display: "inline-block"
                                    }}>
                                        Edit
                                    </Typography>
                                    </Box>
                                </Button>
                            </Box>
                        </Box>

                        <Grid container spacing={2}>
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
                            style={{marginTop: 10}}
                            renderInput={(params) =>
                                <TextField {...params} label="University" variant="outlined"
                                           required
                                           error={emptyValues.university}
                                           value={values.university}
                                           onChange={handleChange("university")}/>}
                            onChange={handleChangeUni("university")}

                        />
                        <Box justifyContent="center" alignItems="center" style={{marginTop: 10}}>
                        <Button variant="outlined" color="primary"
                                onClick={() => {
                                    handleSubmit()
                                }}
                        >
                            Register
                        </Button>
                            <FormControlLabel
                                control={<Checkbox color={"primary"} checked={values.privacyPolicy} onChange={handleChangeCheckbox("privacyPolicy")} />}
                                label={
                                    <>
                                        <Typography style={{display: "inLine", marginRight: "4px"}} color={emptyValues.privacyPolicy ? "error" : "textSecondary" }>
                                            I agree with the
                                        </Typography>
                                        <Tooltip TransitionComponent={Zoom} title={"By checking the box you agree to our terms and conditions regarding personal data collection in accord to the General Data Protection Act. Our team will need your university email account and name. This data will be stored in order to ensure a safe environment for our users when interacting with each other. This data will not be publicly made anywhere else. Other users will have access (be able to see on the platform) your name but nothing else. The email will be available only to us. Please note that if you have any concerns regarding the data collected about yourself, or if you wish to see all data which has been collected about yourself, you can email us at pap36@bath.ac.uk . If you decide to delete your profile, all the data about you will be deleted, but you can also request this personally by mailing us at the above address. Finally, we will delete all data stored about you after the 30th of April 2021 (30.04.2021), unless you specifically ask us to by emailing the above address."}  style={{display: "inLine", textDecoration: 'underline'}}>
                                            <Typography color={emptyValues.privacyPolicy ? "error" : "textSecondary" } >
                                                 privacy policy
                                            </Typography>
                                        </Tooltip>
                                        <Typography style={{display: "inLine", marginLeft: "4px"}} color={emptyValues.privacyPolicy ? "error" : "textSecondary" }>
                                            *
                                        </Typography>
                                    </>
                                }
                                style={{marginLeft: "10px"}}
                                labelPlacement="end"
                                />
                        </Box>
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
    {name: "Faculty of Law - University of Bucharest"},
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
    {name: "Technical University of Cluj-Napoca"},
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
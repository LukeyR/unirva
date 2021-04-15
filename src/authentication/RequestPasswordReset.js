import React, {useContext, useState} from 'react';
import {Box, Button, CardContent, Grid, Paper, TextField} from "@material-ui/core";
import {useStyles} from "./Menu";
import BrandLogo from "../BrandLogo";
import firebaseConfig from "../firebase";
import {useHistory} from "react-router-dom";
import {AuthContext} from "../Auth";
import firebase from "../firebase";

function Signup() {
    const history = useHistory();
    const classes = useStyles()

    const [emptyValues, setEmptyValues] = useState({
        firstName: false,
        lastName: false,
        email: false,
        password: false,
        newPassword: false,
        newPasswordConfirm: false,
    })

    const {currentUser} = useContext(AuthContext);

    const [values, setValues] = useState({
        email: currentUser ? currentUser.email : "",
        password: "",
        newPassword: "",
        newPasswordConfirm: "",
    })

    const handleChange = (prop) => (event) => {
        setValues({...values, [prop]: event.target.value});
    }

    const handleChangeUni = (prop) => (event) => {
        setValues({...values, [prop]: event.target.innerHTML});
    }

    const handleSubmitUnkownUser = () => {

        try {
            firebaseConfig.auth().sendPasswordResetEmail(
                values.email)
                .then(function () {
                    alert("If an account with this email exists, an email has been sent to " + values.email + " to request a reset of your password.\n" +
                        "It may take a few minutes to arrive. Remember to check your spam folder.")
                    history.push("/login")
                })
                .catch(function (error) {
                    console.log(error)
                });
        } catch (error) {
            alert(error);
        }
    };

    const handleSubmitKnownUser = async () => {
        if (values.newPassword !== values.newPasswordConfirm) {
            setEmptyValues({...emptyValues, newPassword: true, newPasswordConfirm: true})
            return
        }
        try {
            const cred = firebase.auth.EmailAuthProvider.credential(
                values.email,
                values.password
            );
            await currentUser.reauthenticateWithCredential(cred)

            await currentUser.updatePassword(values.newPassword).then(function () {
                alert("Your password has been successfully reset")
                history.push("/login")
            })
        } catch (error) {
            alert(error);
        }
    };


    return (
        <Box display="flex" justifyContent="center" alignItems="center" style={{margin: 30}}>
            <Grid container variant="contained">
                <Paper className={classes.root}> {/*Need outline as we remove border in css*/}
                    <Box p={3}>
                        <CardContent className={classes.cardActions}>
                            <BrandLogo/>
                        </CardContent>
                        {currentUser ?
                            <>
                                <TextField
                                    error={emptyValues.password}
                                    fullWidth
                                    required
                                    type="password"
                                    value={values.password}
                                    id="Current Password"
                                    label="Current Password"
                                    variant="outlined"
                                    color="primary"
                                    style={{marginTop: 10}}
                                    onChange={handleChange("password")}
                                />
                                <TextField
                                    error={emptyValues.newPassword}
                                    fullWidth
                                    required
                                    type="password"
                                    value={values.newPassword}
                                    id="New Password"
                                    label="New Password"
                                    variant="outlined"
                                    color="primary"
                                    style={{marginTop: 10}}
                                    onChange={handleChange("newPassword")}
                                />
                                <TextField
                                    error={emptyValues.newPasswordConfirm}
                                    fullWidth
                                    required
                                    type="password"
                                    value={values.newPasswordConfirm}
                                    id="Confirm-New-Password"
                                    label="Confirm New Password"
                                    variant="outlined"
                                    color="primary"
                                    style={{marginTop: 10}}
                                    onChange={handleChange("newPasswordConfirm")}
                                />
                                <Box display={"flex"} alignItems="center" justifyContent={"space-between"}
                                     style={{marginTop: 10}}>
                                    <Button variant="outlined" color="primary"
                                            onClick={() => {
                                                handleSubmitKnownUser()
                                            }}
                                    >
                                        Reset password
                                    </Button>
                                </Box>
                            </>
                            :
                            <>
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
                                <Box display={"flex"} alignItems="center" justifyContent={"space-between"}
                                     style={{marginTop: 10}}>
                                    <Button variant="outlined" color="primary"
                                            onClick={() => {
                                                handleSubmitUnkownUser()
                                            }}
                                    >
                                        Request password reset
                                    </Button>
                                </Box>
                            </>}
                    </Box>
                </Paper>
            </Grid>
        </Box>
    )
}

export default Signup;
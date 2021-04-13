import React, {useContext, useState} from 'react';
import {Box, Button, CardContent, Grid, Paper, TextField, Typography} from "@material-ui/core";
import {useStyles} from "./Menu";
import BrandLogo from "../BrandLogo";
import firebaseConfig from "../firebase";
import {useHistory} from "react-router-dom";
import {AuthContext} from "../Auth";

function Signup() {
    const history = useHistory();
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

    const handleSubmit = () => {

        try {
            firebaseConfig.auth().sendPasswordResetEmail(
                values.email)
                .then(function() {
                    alert("If an account with this email exists, an email has been sent to " + values.email + " to request a reset of your password.\n" +
                        "It may take a few minutes to arrive. Remember to check your spam folder.")
                    history.push("/login")
                })
                .catch(function(error) {
                    console.log(error)
                });
        } catch (error) {
            alert(error);
        }
    };
    const {currentUser} = useContext(AuthContext);
    if (currentUser) {
        history.push("./")
    }

    return (
        <Box display="flex" justifyContent="center" alignItems="center" style={{margin: 30}}>
            <Grid container variant="contained">
                <Paper className={classes.root}> {/*Need outline as we remove border in css*/}
                    <Box p={3}>
                        <CardContent className={classes.cardActions}>
                            <BrandLogo/>
                        </CardContent>
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
                        <Box display={"flex"} alignItems="center" justifyContent={"space-between"} style={{marginTop: 10}}>
                        <Button variant="outlined" color="primary"
                                onClick={() => {
                                    handleSubmit()
                                }}
                        >
                            Request password reset
                        </Button>
                        </Box>
                    </Box>
                </Paper>
            </Grid>
        </Box>
    )
}

export default Signup;
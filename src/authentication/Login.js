import React, {useContext, useState} from 'react';
import {Box, Button, CardContent, Grid, Paper, TextField, Typography} from "@material-ui/core";
import {useStyles} from "./Menu";
import BrandLogo from "../BrandLogo";
import firebaseConfig, {auth} from "../firebase";
import {useHistory} from "react-router-dom";
import {AuthContext} from "../Auth";
import {useAuthState} from "react-firebase-hooks/auth";

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
            firebaseConfig.auth().signInWithEmailAndPassword(values.email, values.password);
        } catch (error) {
            alert(error);
        }
    };
    const {currentUser} = useContext(AuthContext);
    if (currentUser) {
        if(currentUser.emailVerified) history.push("./");
        else{
            firebaseConfig.auth().signOut();
        }
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
                        <Box display={"flex"} alignItems="center" justifyContent={"space-between"} style={{marginTop: 10}}>
                        <Button variant="outlined" color="primary"
                                onClick={() => {
                                    handleSubmit()
                                }}
                        >
                            Log in
                        </Button>
                            <Box justifyContent={"flex-end"}>

                                <Typography variant="body2" color="textSecondary" onClick={() => {
                                    history.push("/signup")
                                }}
                                            className={classes.forgotPassword}>
                                    Create an account
                                </Typography>
                            <Typography variant="body2" color="textSecondary" onClick={() => {
                                history.push("/ResetPassword")
                            }}
                            className={classes.forgotPassword}>
                                Forgot your password?
                            </Typography>
                            </Box>
                        </Box>
                    </Box>
                </Paper>
            </Grid>
        </Box>
    )
}

export default Signup;
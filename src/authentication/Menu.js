import React from 'react';
import "./Menu.css";
import {Grid} from "@material-ui/core"
import Content from "./MenuContent.jsx";
import {makeStyles} from "@material-ui/styles";

export const useStyles = makeStyles((theme) => ({
    root: {
        backgroundColor: 'transparent',
        width: 500,
        margin: 'auto',
        border: 0,
        boxShadow: 0,
    },
    profilePicture: {
        display: "flex",
        border: "0px solid black",
        marginBottom: "25px",
        width: "75px",
        height: "75px",
        '&:hover': {
            cursor: "pointer",
        }
    },
    div: {
        margin: 0,
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
    },
    uploadImage: {
        display: 'flex',
        justifyContent: 'center',
        width: "120px",
        height: "120px",
        margin: "auto",
    },
    cardActions: {
        justifyContent: 'center',
        direction: "column",
    },
    appleLogo: {},
    googleButton: {
        width: 125,
        marginBottom: 5,
    },
    button: {
        boxShadow: "0 2px 3px #00000029",
        borderRadius: "10px",
        width: 200,
    },
    media: {
        margin: 'auto',
    },
    brandName: {
        margin: 'auto',
        color: theme.palette.text.secondary,
    },
    typography: {
        textAlign: "center",
        marginBottom: -10,
    },
    forgotPassword: {
        '&:hover': {
            cursor: "pointer",
            textDecoration: "underline",
        }
    }
}));

function Menu() {
    const classes = useStyles();

    return (
        <div>
            <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap"/>
            <Grid item container display="flex" justifyContent="center">
                <Content/>
            </Grid>
        </div>

        /*<div>
            <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap" />

            <div className='logIn'>
                <img src={brandLogo} alt="Brand Logo" />
                <div className='button' onClick={() => loginOnClick("Log In")}><p>Log In</p></div>
                <p>or sign in with:</p>
                <div className='buttonExternalService' onClick={() => loginOnClick("Google")} >
                    <p>Google</p>
                    <img src={googleLogo} alt="Google logo"/>
                </div>
                <div className='buttonExternalService' onClick={() => loginOnClick("Apple")} ><p>Apple</p></div>
                <div className='button' onClick={() => loginOnClick("Register")}><p>Register</p></div>
            </div>
        </div>*/
    )
}

export default Menu;
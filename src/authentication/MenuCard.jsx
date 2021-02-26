import React from "react";
import {makeStyles} from "@material-ui/styles";
import {
    Button,
    ButtonGroup,
    Card,
    CardActions,
    CardContent,
    CardMedia,
    Typography,
    SvgIcon,
} from "@material-ui/core";
import brandLogo from "../img/Brandlogo.svg";
import {ReactComponent as GoogleLogo} from "../img/google_g_logo.svg";
import {ReactComponent as AppleLogo} from "../img/Apple_logo_black.svg";
import "./Menu.css"

function loginOnClick(location) {
    alert(`${location} redirect here`)
}

const useStyles = makeStyles({
    root: {
        width: 300,
        margin: 'auto',
        border: 0,
        boxShadow: 0,
    },
    cardActions: {
        justifyContent: 'center',
        direction: "column",
    },
    appleLogo: {

    },
    googleButton: {
      width: 125,
      marginBottom: 5,
    },
    button: {
        width: 200,
    },
    media: {
        height: 250,
    },
    typography: {
        textAlign: "center",
        marginBottom: -10,
    },
});

function googleIcon() {
    return (
        <SvgIcon>
            <GoogleLogo/>
        </SvgIcon>
    )
}

function appleIcon() {
    return (
        <SvgIcon>
            <AppleLogo style={{ fontSize: "small" }}/>
        </SvgIcon>
    )
}

const MenuCard = () => {
    const classes = useStyles();

    return (
        <Card className={classes.root} variant="outlined">
            <CardContent>
                <CardMedia className={classes.media} image={brandLogo} title="Brand Logo"/>
            </CardContent>
            <CardActions className={classes.cardActions}>
                <ButtonGroup>
                    <Button onClick={() => {loginOnClick("Log in")}} className={classes.button} style={{marginBottom: -12.5}}>
                        Log In
                    </Button>
                </ButtonGroup>
            </CardActions>
            <CardContent>
                <Typography className={classes.typography}>
                    or sign in with:
                </Typography>
            </CardContent>
            <CardActions className={classes.cardActions}>
                <ButtonGroup>
                    <Button startIcon={googleIcon()} onClick={() => {loginOnClick("Google")}} aria-label="Sign in with google" className={classes.googleButton}>
                        Google
                    </Button>
                </ButtonGroup>
            </CardActions>
            {/*<CardActions className={classes.cardActions}>*/}
            {/*    <ButtonGroup>*/}
            {/*        <Button onClick={() => {loginOnClick("Apple")}} className={classes.button} style={{width: 125}} >*/}
            {/*            Apple*/}
            {/*        </Button>*/}
            {/*    </ButtonGroup>*/}
            {/*</CardActions>*/}
            <CardContent>
                <Typography className={classes.typography} style={{marginTop: 10}}>
                    New User?
                </Typography>
            </CardContent>
            <CardActions className={classes.cardActions}>
                <ButtonGroup>
                    <Button startIcon={appleIcon()} onClick={() => {loginOnClick("Register")}} className={classes.button} >
                        Register
                    </Button>
                </ButtonGroup>
            </CardActions>
        </Card>
    )
};

export default MenuCard;
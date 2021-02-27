import React from 'react';
import {AppBar, IconButton, Toolbar, Typography} from "@material-ui/core";
import AccountCircleTwoToneIcon from '@material-ui/icons/AccountCircleTwoTone';
import HomeIcon from '@material-ui/icons/Home';
import {makeStyles} from "@material-ui/styles";
import {useAuthState} from "react-firebase-hooks/auth";
import {auth} from "../firebase";
import {Link} from "react-router-dom";
import { useHistory } from 'react-router-dom';


const profilePictureSize = "35"

const useStyles = makeStyles( () => ({
    typography: {
        flex: 1,
        justifyContent: "left",
        alignContent: "left",
    },
    circle: {
        borderRadius: "50%",
        height: {profilePictureSize},
        width: {profilePictureSize},
        overflow: "hidden",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
    },
    link: {
        textDecoration: "none",
    },
}));

const Header = () => {
    const [user] = useAuthState(auth);
    const classes = useStyles();
    const history = useHistory();

    return (
        <AppBar position="static" elevation={0}>
            <Toolbar>
                <IconButton aria-label="Go to profile" onClick={() => {history.push("/")}}>
                    <HomeIcon style={{fill: "white"}}/>
                </IconButton>
                <Typography className={classes.typography}>
                    brand name
                </Typography>
                    {user ? (
                        <Link className={classes.link} to="/menu">
                        <div className={classes.circle}>
                            <img  src={user.photoURL} alt="profile-pict ure" width={profilePictureSize} height={profilePictureSize} />
                        </div>
                        </Link>)
                        : (
                            <IconButton aria-label="Go to profile" onClick={() => {history.push("/menu")}}>
                            <AccountCircleTwoToneIcon />
                                </IconButton>
                            )}
            </Toolbar>
        </AppBar>
    )
}

export default Header;
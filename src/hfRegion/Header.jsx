import React from 'react';
import {AppBar, fade, Grid, IconButton, Input, InputAdornment, InputBase, Toolbar, Typography} from "@material-ui/core";
import AccountCircleTwoToneIcon from '@material-ui/icons/AccountCircleTwoTone';
import HomeIcon from '@material-ui/icons/Home';
import SearchIcon from '@material-ui/icons/Search';
import {makeStyles, Theme} from "@material-ui/core/styles";
import {useAuthState} from "react-firebase-hooks/auth";
import {auth} from "../firebase";
import {Link} from "react-router-dom";
import { useHistory } from 'react-router-dom';
import {AccountCircle} from "@material-ui/icons";


const profilePictureSize = "35"

const useStyles = makeStyles( (theme) => ({
    root: {
        flexGrow: 1,
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
    search: {
        flexGrow: 1,
        position: 'relative',
        borderRadius: theme.shape.borderRadius,
        backgroundColor: fade(theme.palette.common.white, 0.15),
        '&:hover': {
            backgroundColor: fade(theme.palette.common.white, 0.25),
        },
        marginTop: theme.spacing(0.75),
        marginLeft: theme.spacing(2),
        marginRight: theme.spacing(2),
        [theme.breakpoints.up('sm')]: {
            marginLeft: theme.spacing(3),
            width: 'auto',
        },
        width: '100%',
    },
    searchIcon: {
        padding: theme.spacing(0, 2),
        height: '100%',
        position: 'absolute',
        pointerEvents: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    homeIcon: {
    },
    profileIcon: {
    },
    inputRoot: {
        color: 'inherit',
    },
    inputInput: {
        padding: theme.spacing(1, 1, 1, 0),
        // vertical padding + font size from searchIcon
        paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
        transition: theme.transitions.create('width'),
        width: '100%',
    },
}));

function search(searchTerm){
    alert(`${searchTerm} was searched.`)

}

const Header = () => {
    const [user] = useAuthState(auth);
    const classes = useStyles();
    const history = useHistory();

    const onChange = (event) => {
        console.log(event.target.value);
    };

    const onKeyPress = (event) => {
        console.log(`Pressed keyCode ${event.key}`);
        if (event.key === 'Enter') {
            search(event.target.value)
        }
    }

    return (
        <div className={classes.root}>
            <AppBar position="static" elevation={0}>
                <Toolbar>
                    <Grid
                        justify="space-between" // Add it here :)
                        container
                        spacing={2}
                    >
                        <Grid item xs={1}>
                    <IconButton aria-label="Go to profile" onClick={() => {history.push("/")}} className={classes.homeIcon}>
                        <HomeIcon style={{fill: "white"}}/>
                    </IconButton>
                        </Grid>

                        <Grid item xs={10}>
                    <div className={classes.search}>
                        <div className={classes.searchIcon}>
                            <SearchIcon />
                        </div>
                        <InputBase
                            fullWidth={true}
                            placeholder="Search…"
                            classes={{
                                root: classes.inputRoot,
                                input: classes.inputInput,
                            }}
                            inputProps={{ 'aria-label': 'search' }}
                            onKeyPress={onKeyPress}
                            onChange={onChange}
                        />
                    </div>
                        </Grid>

                    <Grid item xs={1}>
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
                    </Grid>
                    </Grid>
                </Toolbar>
            </AppBar>
        </div>
    )
}

export default Header;
import React from 'react';
import {AppBar, fade, Grid, IconButton, InputBase, Toolbar} from "@material-ui/core";
import AccountCircleTwoToneIcon from '@material-ui/icons/AccountCircleTwoTone';
import HomeIcon from '@material-ui/icons/Home';
import SearchIcon from '@material-ui/icons/Search';
import {makeStyles} from "@material-ui/core/styles";
import {useAuthState} from "react-firebase-hooks/auth";
import {auth} from "../firebase";
import {useHistory} from "react-router-dom";
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';


const profilePictureSize = "35px"

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    circle: {
        borderRadius: "50%",
        height: "35px",
        width: "35px",
        overflow: "hidden",
        justifyContent: "center",
        alignItems: "center",
    },
    link: {},
    search: {
        flexGrow: 1,
        maxWidth: "50%",
        position: 'relative',
        borderRadius: theme.shape.borderRadius,
        backgroundColor: fade(theme.palette.common.white, 0.15),
        '&:hover': {
            backgroundColor: fade(theme.palette.common.white, 0.25),
        },
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
    homeIcon: {},
    profileIcon: {
        margin: 0,
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
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

function search(searchTerm) {
    alert(`${searchTerm} was searched.`)

}

const Header = () => {
    const [user] = useAuthState(auth);
    const classes = useStyles();
    const history = useHistory();
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);


    const handleMenu = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClick = (pageURL) => {
        history.push(pageURL)
        setAnchorEl(null)
    };

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
                        container
                        spacing={0}
                        alignItems="center"
                        align="center"
                    >
                        <Grid item xs={1}
                              container
                              alignItems="flex-start">
                            <IconButton aria-label="Go to profile" onClick={() => {
                                history.push("/")
                            }}>
                                <HomeIcon style={{fill: "white"}}/>
                            </IconButton>
                        </Grid>

                        <Grid item xs={10}>
                            <div>
                                <div className={classes.search}>
                                    <div className={classes.searchIcon}>
                                        <SearchIcon/>
                                    </div>
                                    <InputBase
                                        fullWidth={true}
                                        placeholder="Search…"
                                        classes={{
                                            root: classes.inputRoot,
                                            input: classes.inputInput,
                                        }}
                                        style={{
                                            justifyContent: "center",
                                            alignItems: "center",
                                        }}

                                        inputProps={{'aria-label': 'search'}}
                                        onKeyPress={onKeyPress}
                                        onChange={onChange}
                                    />
                                </div>
                            </div>

                        </Grid>

                        <Grid item xs={1}
                              container
                              direction="row"
                              alignItems="flex-end"
                              justify="center">
                            {user ? (
                                    <IconButton className={classes.circle}
                                                onClick={
                                                    handleMenu
                                                }
                                    >
                                        <img src={user.photoURL}
                                             alt="profile-pict ure"
                                             width={profilePictureSize}
                                             height={profilePictureSize}
                                        />
                                    </IconButton>
                                )
                                : (
                                    <IconButton className={classes.homeIcon}
                                                aria-label="Go to profile"
                                                onClick={() => {
                                                    history.push("/menu")
                                                }}
                                    >
                                        <AccountCircleTwoToneIcon/>
                                    </IconButton>
                                )}
                            <Menu
                                id="menu-appbar"
                                anchorEl={anchorEl}
                                anchorOrigin={{
                                    vertical: 'top',
                                    horizontal: 'right',
                                }}
                                keepMounted
                                transformOrigin={{
                                    vertical: 'top',
                                    horizontal: 'right',
                                }}
                                open={open}
                                onClose={() => {setAnchorEl(null)}}
                            >
                                <MenuItem onClick={() => handleMenuClick("/Profile")}>Profile</MenuItem>
                                <MenuItem onClick={() => handleMenuClick("/Logout")}>Sign Out</MenuItem>
                            </Menu>
                        </Grid>
                    </Grid>
                </Toolbar>
            </AppBar>
        </div>
    )
}

export default Header;
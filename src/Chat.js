import React, {useState} from 'react';
import './App.css';
import firebase, {auth} from "./firebase";
import {useAuthState} from "react-firebase-hooks/auth";
import {useCollection, useCollectionData} from "react-firebase-hooks/firestore";
import {makeStyles} from "@material-ui/styles";
import {Avatar, Badge, Box, Divider, fade, Grid, IconButton, InputBase, Paper, Typography} from "@material-ui/core";
import {MailOutline} from "@material-ui/icons";
import SearchIcon from "@material-ui/icons/Search";
import deepOrange from "@material-ui/core/colors/deepOrange";
import pink from "@material-ui/core/colors/pink"
import blue from "@material-ui/core/colors/blue"
import red from "@material-ui/core/colors/red"
import green from "@material-ui/core/colors/green"
import yellow from "@material-ui/core/colors/yellow"
import {useHistory} from "react-router-dom";

// TODO
//  (still present after pauls update at 2:33 UK)
//  Catch when user is not logged
//  Fix bug when user is not signed in with google

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    profilePicture: {
        display: "flex",
        justifyContent: "center",
        margin: "10px",
        padding: "10px",
        border: "0px solid black",
        width: "50px",
        height: "50px",
        '&:hover': {
            cursor: "pointer",
        }
    },
    sorting: {
        marginLeft: "30px",
        display: "flex",
        justifyContent: "space-between",
        marginRight: "30px",
        alignItems: "center",
    },
    searchBox: {
        display: "flex",
        justifyContent: "flex-end",
        marginRight: "30px",
        alignItems: "center",
    },
    search: {
        flexGrow: 1,
        maxWidth: "100%",
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
    textBox: {
        '&:hover': {
            cursor: "pointer",
        }
    }
}))

const firestore = firebase.firestore();
var userID = null;

function ProfileCard(props) {
    const classes = useStyles();
    const history = useHistory();
    const colours = [deepOrange[500], pink[400], blue[300], red[500], green[500], yellow[500]];

    function randomChoice(arr) {
        return arr[Math.floor(arr.length * Math.random())];
    }

    const avatarColour = randomChoice(colours);


    function redirect(path, state) {
        history.push(path, state)
    }


    return (
        <Grid item xs={12} sm={6} md={4} lg={3}>
            <Paper>
                <Box p={1}>
                    <Grid container>
                        <Grid item xs={3}>
                            <Avatar className={classes.profilePicture} alt="Profile Image"
                                    style={{backgroundColor: `${avatarColour}`}} onClick={() => {
                                redirect("/profile", {
                                    targetUserID: props.targetUserID,
                                    currentUserID: props.myUid
                                })
                            }}>
                                {props.name ? props.name.charAt(0) : "N"}
                            </Avatar>
                        </Grid>
                        <Grid container item xs={7} className={classes.textBox} onClick={() => {
                            redirect("/chatroom", {
                                targetUserID: props.targetUserID,
                                currentUserID: props.myUid,
                                myUID: userID
                            })
                        }}>
                            <Grid item xs={12}>
                                <Typography variant="h5" style={{fontSize: "24px"}} display="block">
                                    {props.name.charAt(0).toUpperCase() + props.name.substr(1)}
                                </Typography>
                            </Grid>
                            <Grid item xs={12}>
                                <Typography variant="body2" style={{fontSize: "18px"}} color="textSecondary"
                                            display="block">
                                    {props.unread}
                                </Typography>
                            </Grid>
                        </Grid>
                        <Grid container item xs={2} className={classes.textBox} onClick={() => {
                            redirect("/chatroom", {
                                targetUserID: props.targetUserID,
                                currentUserID: props.myUid,
                                myUID: userID
                            })
                        }}>
                            <Box display="flex" alignItems="center" justifyContent="flex-end">
                                <Badge badgeContent={props.unseenCount} color="secondary">
                                    <IconButton>
                                        <MailOutline style={{fontSize: "38px",}}/>
                                    </IconButton>
                                </Badge>
                            </Box>
                        </Grid>
                    </Grid>
                </Box>
            </Paper>
        </Grid>
    )
}

function Chat() {

    const classes = useStyles();
    const [user] = useAuthState(auth);
    const [searchTerm, setSearchTerm] = useState("")

    var results = [];
    var numberOfResults = 0;

    if (user != null) userID = user.uid;

    const userRef = firestore.collection('users').where('ID', "==", userID);
    const unseenMessagesRef = firestore.collection('users/' + userID + "/chats").where('seen', "==", "false");

    var [unseenMessages, loadingMes] = useCollectionData(unseenMessagesRef);

    var [me, loading] = useCollectionData(userRef);
    var myChats = "Loading";
    const [searchVal, setSearch] = useState("");
    if (!loading) myChats = me[0].chatsNo;
    var unseen = 0;

    if (!loadingMes) {
        unseen = unseenMessages.length;
    }

    const [users, loadingUsers] = useCollection(firestore.collection('users'));

    const editSearchTerm = (e) => {
        setSearch(e.target.value);
    }


    // Searching for a user
    const search = () => {
        results = [];
        numberOfResults = 0;
        if (!loadingUsers) {
            users.forEach(usr => {
                let name = usr.data().Name;
                if (name.toLowerCase().includes(searchVal.toLowerCase()) && usr.id != user.uid) {
                    var count = 0
                    unseenMessages.forEach(msg => {
                        if (msg.SenderID == usr.data().ID) count++;
                    })
                    results[numberOfResults] = [{name: usr.data().Name, id: usr.data().ID, unseenMes: count}];
                    numberOfResults++;
                }
            })
        } else {}
        return results;
    }


    return (
        <div className={classes.root}>
            {/*<h1>Chat</h1>*/}
            {/*<p>Right, let's get going!</p>*/}
            {/*<h1>You have {myChats} chats open.</h1>*/}
            {/*<h1>You have {unseen} unseen messages.</h1>*/}
            <Box m={3} stlye={{marginBottom: "-30px"}}>
                <Typography variant="h2">
                    Your Chats
                </Typography>
            </Box>
            <Divider variant="middle" style={{marginBottom: "20px"}}/>
            <Box className="sortingRow">
                <div className={classes.sorting}>
                    <Typography variant="subtitle1" display="inline"
                                stlye={{marginLeft: "20px", justifyContent: "flex-start",}}>
                        {unseen} unseen messages
                    </Typography>
                    <Box className={classes.searchBox}>
                        <Typography display="inline" style={{marginRight: "10px"}}>
                            Filter:
                        </Typography>
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
                                onChange={editSearchTerm}
                            />
                        </div>
                    </Box>
                </div>
            </Box>
            <ResultContainer names={search()}/>
        </div>
    )
}

function ResultContainer(names) {
    return (
        <Box p={3}>
            <Grid container spacing={3}>
                {names.names.map(name => <Name name={name}/>)}
            </Grid>
        </Box>
    )
}

function Name(name) {
    var unread = "No new messages"
    return (

        <ProfileCard {...{
            name: name.name[0].name,
            unseenCount: name.name[0].unseenMes,
            unread: unread,
            targetUserID: name.name[0].id,
            myUid: userID,

        }} />
    )
}

export default Chat;
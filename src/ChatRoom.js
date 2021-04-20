import React, {useEffect, useRef, useState} from 'react';
import firebase, {auth} from './firebase';
import {useCollection} from 'react-firebase-hooks/firestore';
import './ChatRoom.css';
import {
    Avatar,
    Box,
    Divider,
    fade,
    Grid,
    IconButton,
    InputBase,
    makeStyles,
    Paper,
    Typography
} from "@material-ui/core";
import deepOrange from "@material-ui/core/colors/deepOrange";
import pink from "@material-ui/core/colors/pink";
import blue from "@material-ui/core/colors/blue";
import red from "@material-ui/core/colors/red";
import green from "@material-ui/core/colors/green";
import yellow from "@material-ui/core/colors/yellow";
import {useHistory} from "react-router-dom";
import Skeleton from "@material-ui/lab/Skeleton";
import SearchIcon from "@material-ui/icons/Search";
import {Send} from "@material-ui/icons";

const firestore = firebase.firestore();
var myID, target, targetID, senderIDDB, receiverIDDB, targetName, interestedProduct, pp;
var oldText = "";

var chatWindow = document.getElementById("chat-window");

const useStyles = makeStyles((theme) => ({
    table: {
        minWidth: 650,
    },
    headBG: {
        backgroundColor: '#e0e0e0'
    },
    borderRight500: {
        borderRight: '1px solid #e0e0e0'
    },
    messageArea: {
        height: '65vh',
        overflowY: 'auto'
    },
    profilePicture: {
        display: "flex",
        justifyContent: "center",
        margin: "10px",
        border: "0px solid black",
        width: "50px",
        height: "50px",
        '&:hover': {
            cursor: "pointer",
        }
    },
    miniTriangleYou: {
        width: 0,
        height: 0,
        borderBottom: `5px solid ${theme.palette.secondary.main}`,
        borderRight: "5px solid transparent",
    },
    miniTriangleThem: {
        width: 0,
        height: 0,
        color: theme.palette.background.paper2,
        borderBottom: `5px solid ${theme.palette.background.paper2}`,
        borderLeft: "5px solid transparent",
    },
    bubbleYou: {
        maxWidth: "750px",
        backgroundColor: theme.palette.secondary.main,
        border: `0.5px solid ${theme.palette.secondary.main}`,
        padding: "10px",
    },
    bubbleThem: {
        maxWidth: "750px",
        backgroundColor: theme.palette.background.paper2,
        border: `0.5px solid ${theme.palette.background.paper2}`,
        padding: "10px",
    },
    profileBox: {
        '&:hover': {
            cursor: "pointer",
        }
    },
    chatWindow: {
        maxHeight: "69vh",
        overflow: 'auto',
    },
    input: {
        marginLeft: theme.spacing(1),
        flex: 1,
        border: "0.5px solid black",
    },
    iconButton: {
        padding: 10,
    },
    search: {
        width: '100%',
        height: "39px",
        borderRadius: "66px",
        backgroundColor: fade(theme.palette.common.white, 0.15),
        '&:hover': {
            backgroundColor: fade(theme.palette.common.white, 0.25),
        },
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
    sendButton: {
        width: "31px",
        height: "31px",
        borderRadius: "50%",
        marginRight: "6px",
        backgroundColor: theme.palette.primary.main,
}
}));

function ChatRoom(props) {
    myID = props.location.state.myUID;
    target = props.location.state.targetUserName;
    targetID = props.location.state.targetUserID;
    interestedProduct = props.location.state.interestedProduct
    var [me, loading] = useCollection(firestore.collection('users').where("ID", "==", myID));
    var chatNo;

    chatWindow = document.getElementById("chat-window");
    if (chatWindow) {
        chatWindow.scrollBottom = chatWindow.scrollHeight;
    }

    const colours = [deepOrange[500], pink[400], blue[300], red[500], green[500], yellow[500]];

    function randomChoice(arr) {
        return arr[Math.floor(arr.length * Math.random())];
    }

    const avatarColour = randomChoice(colours);

    const classes = useStyles();
    const history = useHistory();

    if (!loading) {
        firestore.collection("users").doc(myID).update({
            chattingWith: firebase.firestore.FieldValue.arrayUnion(targetID),
        })
        firestore.collection("users").doc(targetID).update({
            chattingWith: firebase.firestore.FieldValue.arrayUnion(myID),
        })
        me.forEach(me => {
            chatNo = me.data().chatsNo;
            if (chatNo == 0) {
                chatNo += 1; // we create our first chat
            }
            senderIDDB = me.id;
        })
    }


    // need to get an instance of the user, for this I need the ID though, not their name
    var [receiver, loadingRe] = useCollection(firestore.collection('users').where("ID", "==", targetID));

    if (!loadingRe) {
        receiver.forEach(receiver => {
            receiverIDDB = receiver.id;
            targetName = receiver.data().Name;
            pp = receiver.data().profilePicture
        })
    }

    return (
        <>
           <Box p={3}>
               <Paper style={{paddingBottom: "10px"}}>
                   <Grid container spacing={1} className={classes.profileBox} onClick={() => {
                       history.push("/profile", {
                           targetUserID: targetID,
                           currentUserID: myID
                       })
                   }}>

                           <Box display="flex" alignItems="center" >
                           <Box>
                           <Avatar src={pp} className={classes.profilePicture} alt="Profile Image"
                                   style={{backgroundColor: `${avatarColour}`}}>
                               {targetName ? targetName.charAt(0) : "?"}
                           </Avatar>
                           </Box>
                           <Box>
                           <Grid item xs={12}>
                               <Typography variant="h5" style={{fontSize: "24px"}} display="block">
                                   {targetName ? targetName.charAt(0).toUpperCase() + targetName.substr(1) : "Username not found"}
                               </Typography>
                           </Grid>
                           <Grid item xs={12}>
                               <Typography variant="body2" style={{fontSize: "18px"}} color="textSecondary"
                                           display="block">
                                   Click to view user's profile
                               </Typography>
                           </Grid>
                           </Box>
                           </Box>
                   </Grid>
                   <Divider variant="middle" style={{marginTop: "10px"}}/>
                   <Box display="flex" className={classes.chatWindow}>
                       <Chatroom/>
                   </Box>
                   <Divider variant="middle" style={{marginTop: "10px"}}/>
                   <MessageBox interestedProduct={interestedProduct}/>
               </Paper>
           </Box>
        </>
    )

}

function Chatroom() {
    const classes = useStyles();
    const dummy = useRef();

    const messagesRef1 = firestore.collection('users/' + senderIDDB + "/chats"); // me
    const messagesRef2 = firestore.collection('users/' + receiverIDDB + "/chats"); // the other person

    var [messages1, loading] = useCollection(messagesRef1.where("SenderID", "==", targetID)); // I receive message
    var [messages2, loading2] = useCollection(messagesRef1.where("ReceiverID", "==", targetID)); // I send message

    var messages = [];
    var count = 0;
    if (!loading && !loading2) {
        messages1.forEach(msg => {
            messages[count] = msg.data();
            // console.log(msg.data());
            var msgID = msg.id;
            firestore.collection('users/' + senderIDDB + "/chats").doc(msgID).update({
                seen: "true"
            })
            count++;
        })

        messages2.forEach(msg => {
            messages[count] = msg.data();
            //msg.seen = "true";
            count++;
        })

        messages.sort((a, b) => (a.createdAt > b.createdAt) ? 1 : -1);
    }

    const [msgVal, setMsgVal] = useState("");

    function divideMessages(messageList) {
        let out = []
        let temp = []
        for (let message of messageList) {
            if (temp.length === 0 || temp[temp.length - 1].SenderID === message.SenderID) {
                temp.push(message);
            } else {
                out.push(temp);
                temp = [message]
            }
        }
        out.push(temp);
        return out
    }

    
    useEffect(() => {
        dummy.current?.scrollIntoView({behavior: "smooth"});
    });

    const messagesDivided = divideMessages(messages);

    function handleMsgClump(clump) {
        let out = []
        for (const [index, msg] of clump.entries()) {
            if (clump.length === 1) {
                out.push(<ChatMessage key={msg.createdAt} message={msg} createdAt={msg.createdAt} lastMessage={true}
                                      firstMessage={true}/>)
            } else if (index === 0) {
                out.push(<ChatMessage key={msg.createdAt} message={msg} createdAt={msg.createdAt} lastMessage={false}
                                      firstMessage={true}/>)
            } else if (index === clump.length - 1) {
                out.push(<ChatMessage key={msg.createdAt} message={msg} createdAt={msg.createdAt} lastMessage={true}
                                      firstMessage={false}/>)
            } else {
                out.push(<ChatMessage key={msg.createdAt} message={msg} createdAt={msg.createdAt} lastMessage={false}
                                      firstMessage={false}/>)
            }
        }
        return out
    }



    // console.log(messages)
    // console.log(messagesDivided)


    // const messagesEndRef = useRef(null)
    //
    // useEffect(() => {
    //     messagesEndRef.current.scrollIntoView({
    //         behavior: 'smooth',
    //         block: 'end',
    //         inline: 'nearest'
    //     });
    // });

    return (
            <Box p={1} style={{width: "100%"}}>
                {messages && messagesDivided.map(msgs => handleMsgClump(msgs).map(msg => msg))}
                <div ref={dummy}/>
            </Box>
        )
}

function MessageBox(props) {
    const classes = useStyles();

    const [message, setMessage] = useState("");
    const [templateLoaded, setTemplateLoaded] = useState(false);

    const messagesRef1 = firestore.collection('users/' + senderIDDB + "/chats"); // me
    const messagesRef2 = firestore.collection('users/' + receiverIDDB + "/chats"); // the other person

    const sendMessage = async (e) => {

        if (message !== "") {

            const {uid, photoURL} = auth.currentUser;

            await messagesRef1.add({
                msg: message,
                SenderID: uid,
                ReceiverID: targetID,
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                seen: "true"
            })
                .then((docRef) => {
                    console.log("Document written");
                })
                .catch((error) => {
                    console.error("Error adding document: ", error);
                });

            await messagesRef2.add({
                msg: message,
                SenderID: uid,
                ReceiverID: targetID,
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                seen: "false"
            })
                .then((docRef) => {
                    console.log("Document written");
                })
                .catch((error) => {
                    console.error("Error adding document: ", error);
                });

            setMessage("");

            if (chatWindow) {
                chatWindow.scrollTop = chatWindow.scrollHeight;
                //dummy.scrollIntoView({behavior: "smooth"});
            }
        }


    }

    const onKeyPress = (event) => {
        // console.log(`Pressed keyCode ${event.key}`);
        if (event.key === 'Enter') {
            sendMessage()
        }
    }

    const handleChange = (event) => {
        setMessage(event.target.value);
    }

    if (props.interestedProduct && message === "" && !templateLoaded) {
        setMessage("Hi, im interested in: " + props.interestedProduct + ". Is it still available");
        setTemplateLoaded(true);
    }

    return (
        <Box p={1} style={{marginBottom: "-8px"}} display="flex">

            <Box className={classes.search} display="flex" justifyContent="flex-end" alignItems="center">
                <InputBase fullWidth style={{marginLeft: "15px", marginRight: "2px"}}
                           placeholder="Type A Message"
                           value={message}
                           onChange={handleChange}
                           onKeyPress={onKeyPress}
                />
                            {/*<input type="text" value={msgVal} onChange={(e) => setMsgVal(e.target.value)}></input>*/}


                        <Box className={classes.sendButton} display="flex" justifyContent="center" alignItems="center">
                            <IconButton onClick={() => {sendMessage()}}>
                                <Send style={{fontSize: "18px"}} />
                            </IconButton>
                </Box>
            </Box>

        </Box>
    )
}

function ChatMessage(props) {
    const {msg, SenderID} = props.message;
    const classes = useStyles();
    const [showTime, setShowTime] = useState(false)

    let date = new Date(1970, 0, 1);

    if (props.createdAt) {
        date.setSeconds(props.createdAt.seconds);
    }

    let shortDate = date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear().toString().substr(2) + " " + date.getHours() + ":" + date.getMinutes()

    // console.log(msg + shortDate)

    //console.log(myID)
    //var text = "";
    //var result = "";
    //if(SenderID == myID) {text = "You"}
    //else{

    //   text = targetName;
    //}
    //console.log(text, oldText);
    //if(text == oldText && oldText != "") result = "";
    //else {
    //  result = text + ":";
    //  oldText = text;
    //}
    //const messageClass = uid === auth.currentUser.uid ? 'sent' : 'received';

    return (
        <div>
            {SenderID === myID ?
                <>
                    <Box display="flex" justifyContent="flex-end" >
                        <Box className={classes.bubbleYou} style={{
                            borderRadius: `10px ${props.firstMessage ? "10px" : "0"} 0 10px`,
                            marginTop: `${props.firstMessage ? "15px" : "2px"}`,
                            marginRight: `${props.lastMessage ? "0px" : "5px"}`,}
                        } onClick={() => {setShowTime(!showTime)}}
                        >
                            <Typography variant="body1" color="textPrimary">{msg}</Typography>
                        </Box>
                        <Box display="flex" alignItems="flex-end" onClick={() => {setShowTime(!showTime)}}>
                            {props.lastMessage ? <Box className={classes.miniTriangleYou}
                            /> : <></>}
                        </Box>
                    </Box>
                    {showTime ? <Box display="flex" justifyContent="flex-end">
                        <Typography variant="body2">
                            {shortDate}
                        </Typography>
                    </Box> : ""}
                </>
                :
                <>
                    <Box display="flex" justifyContent="flex-start" >
                        <Box display="flex" alignItems="flex-end" onClick={() => {setShowTime(!showTime)}}>
                            {props.lastMessage ?
                                <Box className={classes.miniTriangleThem}
                            /> : <></>}
                        </Box>
                        <Box>
                            <Box display="flex" flexWrap="wrap" className={classes.bubbleThem} style={{
                                borderRadius: `${props.firstMessage ? "10px" : "0"} 10px 10px 0`,
                                marginTop: `${props.firstMessage ? "15px" : "2px"}`,
                                marginLeft: `${props.lastMessage ? "0px" : "5px"}`,
                            }} onClick={() => {setShowTime(!showTime)}}
                            >
                                <Typography variant="body1" color="textPrimary">{msg}</Typography>
                            </Box>

                        </Box>
                    </Box>

                    {showTime ? <Box display="flex" justifyContent="flex-start">
                        <Typography variant="body2">
                            {shortDate}
                        </Typography>
                    </Box> : ""}
                </>
            }
        </div>
    )
}


export default ChatRoom;
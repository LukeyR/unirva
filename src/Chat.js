import React, {useState} from 'react';
import './App.css';
import firebase from "./firebase";
import {useAuthState} from "react-firebase-hooks/auth";
import {auth} from "./firebase";
import {useCollectionData, useCollection} from "react-firebase-hooks/firestore";
import { Link } from "react-router-dom";

// TODO
//  (still present after pauls update at 2:33 UK)
//  Catch when user is not logged
//  Fix bug when user is not signed in with google

const firestore = firebase.firestore();
var userID = null;

function Chat(){
    const [user] = useAuthState(auth);

    var results = [];
    var numberOfResults = 0;

    if(user != null) userID = user.uid;

    const userRef = firestore.collection('users').where('ID', "==", userID);
    const unseenMessagesRef = firestore.collection('users/' + userID + "/chats").where('seen', "==", "false");

    var [unseenMessages, loadingMes] = useCollectionData(unseenMessagesRef);

    var [me, loading] = useCollectionData(userRef);
    var myChats = "Loading";
    const [searchVal, setSearch] = useState("");
    if(!loading) myChats = me[0].chatsNo;
    var unseen = 0;

    if(!loadingMes){
        unseen = unseenMessages.length;
    }

    const [users, loadingUsers] = useCollection(firestore.collection('users'));

    const editSearchTerm = (e) => {
        setSearch(e.target.value);
    }


    // Searching for a user
    const search = () =>{
        results = [];
        numberOfResults = 0;
        if(!loadingUsers){
            users.forEach(usr => {
                let name = usr.data().Name;
                if(name.includes(searchVal) && name != me[0].Name){
                    var count = 0
                    unseenMessages.forEach(msg => {
                        if(msg.SenderID == usr.data().ID) count++;
                    })
                    results[numberOfResults] = [{name: usr.data().Name, id: usr.data().ID, unseenMes:count}];
                    numberOfResults++;
                }
            })
        } else console.log("Still loading");
        return results;
    }

    return(
        <div className='App-d'>
            <h1>Chat</h1>
            <p>Right, let's get going!</p>
            <h1>You have {myChats} chats open.</h1>
            <h1>You have {unseen} unseen messages.</h1>
            <input type="text" placeholder="Search" value={searchVal} onChange={editSearchTerm}/>
            <ResultContainer names={search()}/>
        </div>
    )
}

function ResultContainer(names){
    return(
        <div>
            {names.names.map(name => <Name name={name}></Name>)}
        </div>
    ) 
}

function Name(name){
    var unread = "No new messages"
    return(
        <div>
            <Link to={{
                pathname: "/ChatRoom",
                state: [{
                    targetUserID: name.name[0].id,
                    targetUserName: name.name[0].name,
                    myUID: userID
                }]
            }}><button>{name.name[0].name}</button></Link> {name.name[0].unseenMes} : {unread}
        </div>
    )
}

export default Chat;
import React, {useState, useRef} from 'react';
import firebase, { auth } from './firebase';
import { useCollection, useCollectionData } from 'react-firebase-hooks/firestore';
import { useLocation } from 'react-router-dom';
import './ChatRoom.css';

const firestore = firebase.firestore();
var myID, target, targetID, senderIDDB, receiverIDDB;

function ChatRoom(){
    myID = useLocation().state[0].myUID;
    target = useLocation().state[0].targetUserName;
    targetID = useLocation().state[0].targetUserID;
    var [me, loading] = useCollection(firestore.collection('users').where("ID", "==", myID));
    var chatNo;

    if(!loading){
        me.forEach(me => {
            chatNo = me.data().chatsNo;
            if(chatNo == 0){
                chatNo += 1; // we create our first chat
            }
            senderIDDB = me.id;
        })
    } 

    // need to get an instance of the user, for this I need the ID though, not their name
    var [receiver, loadingRe] = useCollection(firestore.collection('users').where("ID", "==", targetID));

    if(!loadingRe){
        receiver.forEach(receiver => {
            receiverIDDB = receiver.id;
        })
    }

    return(
        <div>
            <h1>Hello again.</h1>
            <h1>We found the following: {target}</h1>
            <h1>Time to finally create the chat with {target} and get into chatting! Yay.</h1>
            <section>
                <Chatroom/>
            </section>
        </div>
    )

}

function Chatroom(){
    const dummy = useRef();
    const messagesRef1 = firestore.collection('users/' + senderIDDB + "/chats");
    const messagesRef2 = firestore.collection('users/' + receiverIDDB + "/chats");
    
    var [messages1, loading] = useCollectionData(messagesRef1.where("SenderID", "==", targetID));
    var [messages2, loading2] = useCollectionData(messagesRef1.where("ReceiverID", "==", targetID));

    var messages = [];
    var count = 0;
    if(!loading && !loading2){
        messages1.forEach(msg => {
            messages[count] = msg;
            count++;
        })

        messages2.forEach(msg => {
            messages[count] = msg;
            count++;
        })

        messages.sort((a, b) => (a.createdAt > b.createdAt) ? 1 : -1);
    }

    const [msgVal, setMsgVal] = useState("");

    const sendMessage = async(e) => {
        e.preventDefault();

        const {uid, photoURL} = auth.currentUser;

        await messagesRef1.add({
            msg: msgVal,
            SenderID: uid,
            ReceiverID: targetID,
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
        })

        await messagesRef2.add({
            msg: msgVal,
            SenderID: uid,
            ReceiverID: targetID,
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
        })

        setMsgVal('');
        dummy.current.scrollIntoView({behaviour: 'smooth'});
    }

    return (
        <>
            <main>
                {messages && messages.map(msg => <ChatMessage key={msg.createdAt} message={msg}/>)}
                <span ref={dummy}></span>
            </main>
            <form onSubmit={sendMessage}>
                <input type="text" value={msgVal} onChange={(e) => setMsgVal(e.target.value)}></input>
                <button type="submit">Send</button>
            </form>
        </>
    )
}

function ChatMessage(props){
    console.log(props);
    const {msg, SenderID} = props.message;
    var text = "";
    if(SenderID == myID) text = "Me";
    else text = "Seller";
    console.log(text);
  
    //const messageClass = uid === auth.currentUser.uid ? 'sent' : 'received';
  
    return (
      <div>
        <h1>{text}</h1>
        <p>{msg}</p>
      </div>
    )

}


export default ChatRoom;
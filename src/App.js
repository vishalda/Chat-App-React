import React, {useEffect, useRef, useState} from 'react';
import './App.css';

import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';

import {useAuthState} from 'react-firebase-hooks/auth';
import {useCollectionData} from 'react-firebase-hooks/firestore';

firebase.initializeApp({
  apiKey: "AIzaSyB3mTGN8n54C7L282b1MBN8UKsKB8vifV8",
    authDomain: "chat-app-react-bc939.firebaseapp.com",
    databaseURL: "https://chat-app-react-bc939.firebaseio.com",
    projectId: "chat-app-react-bc939",
    storageBucket: "chat-app-react-bc939.appspot.com",
    messagingSenderId: "604614219137",
    appId: "1:604614219137:web:7575c0f58ff7be60cd0480",
    measurementId: "G-1FLS09Q6ZW"
})

const auth = firebase.auth();
const firestore = firebase.firestore();

function App() {

  const [user] = useAuthState(auth);

  return (
    <div className="App">
      <header className="App-header">
        <h1>⚛️🔥💬</h1>
        <SignOut />
      </header>
      <section>
        {user ? <ChatRoom />:<SignIn />}
      </section>
    </div>
  );
}

function SignIn(){
  const signInWithGoogle = ()=>{
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider)
  }
  return(
    <button onClick={signInWithGoogle}>Sign in with Google</button>
  )
}
function SignOut(){
  return auth.currentUser && (
    <button onClick={()=>auth.signOut()}>Sign out</button>
  ) 
}
function ChatRoom(){
  const messageRef = firestore.collection('messages');
  const query = messageRef.orderBy('createdAt').limitToLast(25);
  const [messages] = useCollectionData(query,{idField:'id'});

  const [formValue, setFormValue] = useState('');

  const sendMessage = async (e) => {
    e.preventDefault();
    const {uid} = auth.currentUser;

    await messageRef.add({
      text:formValue,
      createdAt:firebase.firestore.FieldValue.serverTimestamp(),
      uid,
    })
    setFormValue('');
  }

  const dummy = useRef();
  useEffect(()=>{
    dummy.current.scrollIntoView({behaviour:'smooth'});
  },[messages])

  return(
    <>
      <main>
        {messages && messages.map(msg => <ChatMessage key={msg.id} message={msg} />)}
        <span ref={dummy}></span>
      </main>
      <form onSubmit={sendMessage}>
        <input value={formValue} onChange={(e) => setFormValue(e.target.value)} placeholder = "say something nice" />
        <button type="submit" disabled={!formValue}>Send</button>
      </form>
    </>
  )
}
function ChatMessage(props){
  const {text, uid} = props.message;

  const messageClass = uid === auth.currentUser.uid ? 'sent' : 'recieve';

  return (
    <div className={`message ${messageClass}`} > 
      <p>{text}</p>
    </div>
  )
}

export default App;

import React, {useEffect, useRef, useState} from 'react';
import './App.css';

import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';

import {useAuthState} from 'react-firebase-hooks/auth';
import {useCollectionData} from 'react-firebase-hooks/firestore';

firebase.initializeApp({
  //your config
})

const auth = firebase.auth();
const firestore = firebase.firestore();

function App() {

  const [user] = useAuthState(auth);

  return (
    <div className="App">
      <header className="App-header">
        <h1>⚛️🔥💬</h1>
        <Signout />
      </header>
      <section>
        {user ? <ChartRoom />:<SignIn />}
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
function ChartRoom(){
  const messageRef = firestore.collection('messages');
  const query = messageRef.orderBy('createdAt').limitToLast(25);
  const [messages] = useCollectionData(query,{idField:'id'});

  return(
    <main>
      {messages && messages.map(msg => <ChatMessage key={msg.id} message={msg} />)}
    </main>
  )
}
function ChatMessage(props){
  const [text, uid, imageURL] = props.message;

  const messageClass = uid === auth.currentUser.uid ? 'sent' : 'recieve';

  return (
    <div className={`message ${messageClass}`} > 
      <img src={imageURL} />
      <p>{text}</p>
    </div>
  )
}

export default App;

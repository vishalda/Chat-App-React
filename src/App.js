import React, {useEffect, useRef, useState} from 'react';
import './App.css';
// import { Picker } from 'emoji-mart'

import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';

import {useAuthState} from 'react-firebase-hooks/auth';
import {useCollectionData} from 'react-firebase-hooks/firestore';
import './ApiKey'


const auth = firebase.auth();
const firestore = firebase.firestore();

function App() {

  const [user] = useAuthState(auth);

  return (
    <div className="App">
      <header className="App-header">
        <h1>⚛️</h1>
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
    const {uid, photoURL} = auth.currentUser;

    await messageRef.add({
      text:formValue,
      createdAt:firebase.firestore.FieldValue.serverTimestamp(),
      uid,
      photoURL
    })
    setFormValue('');
  }

  // const addEmoji = e =>{
  //   let emoji = e.native;
  //   setFormValue({
  //     text: formValue+emoji
  //   });
  // };
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
      {/* <span>
        <Picker onSelect={addEmoji} />
      </span> */}
    </>
  )
}
function ChatMessage(props){
  const {text, uid, photoURL} = props.message;

  const messageClass = uid === auth.currentUser.uid ? 'sent' : 'received';

  return (
    <div className={`message ${messageClass}`} > 
      <img alt="User-Image" src={photoURL} />
      <p>{text}</p>
    </div>
  )
}

export default App;

import React from 'react';
import { useEffect, useState } from "react";
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import AuthNavigator from "./src/routes/AuthNavigator";
import { NavigationContainer } from '@react-navigation/native';
import MainNavigator from './src/routes/MainNavigator';
import {getAuth, onAuthState, onAuthStateChanged} from 'firebase/auth'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { doc, updateDoc, collection } from "firebase/firestore";
import { db } from './config/firebase';

const App = ()=> {

  const [isLogged, setIsLogged]=useState("")


  useEffect(()=>{
    const auth = getAuth();
      const unregister = onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/firebase.User
        setIsLogged(user)
        const uid = user.uid;
        //console.log(user)

            const updateStatus = doc(db, "users", uid);
            updateDoc(updateStatus, {
              status : "online"
            });
        // ...
      } else {
        setIsLogged("")
      }
      });
  
      return ()=>{
        unregister()
      }

  },[])
      


//we can use this also

// const getData = async() =>{
//   try{
//     const user =await AsyncStorage.getItem("keepuser");
//     setIsLogged(user)
//     console.log(user)
//   } catch (error){
//       console.log('error in fetching user')
//   }
// }

// useEffect(()=>{
//   getData()
// }, [])

  return (
    <NavigationContainer>
       <StatusBar style='dark'/>
      {isLogged? <MainNavigator/> : <AuthNavigator/>}
    </NavigationContainer>

  );
}

export default App

import { createStackNavigator } from '@react-navigation/stack'
import React, { Component, useEffect, useState } from 'react'
import { Text, View } from 'react-native'
import HomeScreen from '../views/nav/HomeScreen'
import Chatscreen from '../views/nav/ChatScreen'
import { MaterialIcons } from '@expo/vector-icons'; 
import {getAuth, onAuthState, onAuthStateChanged, signOut} from 'firebase/auth'
import { useNavigation } from '@react-navigation/native';
import { doc, updateDoc, collection, serverTimestamp,onSnapshot } from "firebase/firestore";
import { db } from '../../config/firebase'
import AsyncStorage from '@react-native-async-storage/async-storage'

const Stack= createStackNavigator()


const BottomNavigator=()=> {
    const[userid, setUserid]=useState('');
    const[liveData, setLiveData]=useState('')
 
    useEffect(()=>{
        const auth = getAuth();
        onAuthStateChanged(auth, (user) => {
            if (user) {
                // User is signed in, see docs for a list of available properties
                // https://firebase.google.com/docs/reference/js/firebase.User
                const uid = user.uid;
                setUserid(uid)
                // ...
            } else {
                // User is signed out
                // ...
            }
        });
    
    })
    

    const auth = getAuth();
    return (
      <Stack.Navigator initialRouteName='HomeScreen'>
            <Stack.Screen
                name="HomeScreen" 
                //component={HomeScreen} 
                //options={{headerShown: false}}
                options={{
                    headerRight:()=><MaterialIcons 
                                        name="logout" 
                                        size={24} 
                                        color="black" 
                                        onPress={()=>{
                                                const auth = getAuth();
                                                const updateStatus = doc(db, "users", userid);
                                                updateDoc(updateStatus, {
                                                status : "offline"
                                                }).then(()=>{
                                                    signOut(auth)
                                                }) 
                                                }}
                                        style={{marginRight:'12%'}}
                                    />,
                    title:"Chats"
                }}
            >
                {props => <HomeScreen {...props} auth={auth}/>}
            </Stack.Screen>

            <Stack.Screen
                name="ChatScreen" 
                //component={Chatscreen} 
                //options={{headerShown: false}}
                options={({route})=>(
                                        onSnapshot(doc(db, "users", route.params.uid), (doc) => {
                                        setLiveData(doc.data().status)
                                        }),
                                        {title:<View>
                                                    <Text>{route.params.name}</Text>
                                                    <Text style={{color:'red'}}>{liveData}</Text>
                                                </View> 
                                        }
                                    )
                        }
                    >
                {props => <Chatscreen {...props} auth={auth}/>}
            </Stack.Screen>
      </Stack.Navigator>
    )
}

export default BottomNavigator
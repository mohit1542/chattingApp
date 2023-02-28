import React, { Component, useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { db } from "../../../config/firebase";
//import { doc, Firestore, getDoc, getFirestore } from "firebase/firestore";
import { collection, query, where, getDocs, onSnapshot } from "firebase/firestore";


const HomeScreen = ({ auth, navigation }) => {
  // console.log(auth.currentUser.uid)
  const [userss, setUserss] = useState(null);

  const getUsers = () => {
    
    const q =  query(collection(db, "users"));
    const getRealTimeInfo = onSnapshot(q, (querySnapshot) => {
      const userData = [];
      querySnapshot.forEach((doc) => {

        const currUid = auth.currentUser.uid;

        if (doc.data().uid != currUid) {
          userData.push(doc.data());
          setUserss(userData);
        }

      });
    });

    return ()=>{
      getRealTimeInfo()
    }
    //console.log(userss)
  };

  useEffect(() => {
    getUsers();
  }, []);


 

  const RenderCard = ({ item }) => {
    return (
      <TouchableOpacity onPress={()=>navigation.navigate('ChatScreen', {name:item.email, uid:item.uid, 
                                      status:typeof(item.status) == "string"? item.status : item.status.toDate().toString()})}>
        <View style={styles.mycard}>
          <View>
            <Text style={styles.text}>{item.email}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={userss}
        renderItem={({ item }) => <RenderCard item={item} />}
        keyExtractor={(item) => item.uid}
      />
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    // alignItems: "center",
    // justifyContent: "center",
  },
  mycard: {
    flexDirection: "row",
    backgroundColor: "#bbbb",
    margin: 3,
    padding: 15,
    borderBottomWidth: 2,
    borderBottomColor: "black",
    borderRadius: 10,
  },
  text: {
    fontSize: 18,
    marginLeft: 15,
  },
});

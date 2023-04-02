import React, { Component, useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  Image,
  TouchableWithoutFeedback
} from "react-native";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { db } from "../../../config/firebase";
//import { doc, Firestore, getDoc, getFirestore } from "firebase/firestore";
import { collection, query, where, getDocs, onSnapshot } from "firebase/firestore";
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import { Searchbar, IconButton , Avatar} from "react-native-paper";

const HomeScreen = ({ auth, navigation }) => {
  // console.log(auth.currentUser.uid)
  const [userss, setUserss] = useState(null);
  const [curruser, setCurruser] = useState('');
  const [filteredData, setFilteredData] = useState('');
  const [search, setSearch] = useState('')

  const getUsers = () => {

    const q = query(collection(db, "users"));
    const getRealTimeInfo = onSnapshot(q, (querySnapshot) => {
      const userData = [];
      querySnapshot.forEach((doc) => {

        const currUid = auth.currentUser.uid;

        if (doc.data().uid != currUid) {
          userData.push(doc.data());
          setUserss(userData);
          setFilteredData(userData)
        } else {
          setCurruser(doc.data())
        }

      });
    });

    return () => {
      getRealTimeInfo()
    }
  };

  useEffect(() => {
    getUsers();
  }, []);


  //search user name
  const searchFilter = (text) => {
    if (text) {
      const newData = userss.filter((item) => {
        const itemData = item.name ? item.name.toUpperCase()
          : ''.toUpperCase();

        const textData = text.toUpperCase();
        return itemData.indexOf(textData) > -1;
      });
      setFilteredData(newData)
      //console.log(newData)
      setSearch(text)
      //console.log(search)
    } else {
      setFilteredData(userss)
      setSearch(text)
    }
  }


  const RenderCard = ({ item }) => {
    return (
      <TouchableOpacity onPress={() => navigation.navigate('ChatScreen', {
        name: item.email, uid: item.uid,
        status: typeof (item.status) == "string" ? item.status : item.status.toDate().toString()
      })}>
        <View style={styles.mycard}>

        
        { item.image ? (<Avatar.Image size={35} source={{ uri:item.image}} />
        ):(
        <Avatar.Image size={35} source={require('../../../assets/userprofile.png')} /> 
        )}
        


          <View style={{}}>
            <Text style={styles.text}>{item.name}</Text>
          </View>

        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>

      <View style={{ flexDirection: 'row' }}>
        <Text style={styles.greet}>Hello {curruser.name}</Text>
        <Image style={{ height: 30, width: 30, marginLeft: 8 }} source={require('../../../assets/wave.png')} />
      </View>

      <Searchbar
        placeholder="Search"
        onChangeText={(text)=>searchFilter(text)}
        value={filteredData}
        //inputMode={'search'}
        placeholderTextColor={'grey'}
        cursorColor={'skyblue'}
        style={styles.searchbar}
        // clearIcon={() => (
        //       <IconButton
        //         icon={'close'}
        //         iconColor="red"
        //         size={24}
        //       />
        // )}
      />

      <FlatList
        data={filteredData}
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
  greet: {
    fontWeight: 'bold',
    fontSize: 25,
    marginBottom: '4%',
    marginLeft: '3%',
  },
  mycard: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "white",
    margin: 3,
    padding: 15,
    borderWidth: 0.2,
    borderBottomColor: "grey",
    borderRadius: 15,
  },
  text: {
    fontSize: 18,
    marginLeft: 15,
    fontWeight:'bold'
  },
  searchbar: {
    backgroundColor: '#f8f8fa',
    borderRadius: 15,
    width: '94%',
    marginLeft: '3%',
    marginBottom: '5%',
  }
});

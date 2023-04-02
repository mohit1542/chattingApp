import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  RefreshControl,
  ScrollView
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import * as ImagePicker from 'expo-image-picker';
import { getStorage , ref, uploadBytes, uploadString, uploadBytesResumable, getDownloadURL} from "firebase/storage";
import { doc, updateDoc, getDoc} from "firebase/firestore";
import { db } from "../../../config/firebase";
import { getAuth, updateProfile, signOut} from "firebase/auth";
import { MaterialIcons } from '@expo/vector-icons';

const ProfileScreen = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [Loading, setLoading] = useState(false);
  const [fetchImage, setFetchImage] = useState(null);
  const [refresh, setRefresh] = useState(false)
  //const [image, setImage] =useState(null);


  const navigation = useNavigation();

  const auth = getAuth();

  //profle photo
  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.5,
      //base64:true
    });
    //console.log( result.assets[0].uri)

      const storage =getStorage();
      const storageRef = ref(storage, `/userprofile/${Date.now()}`);

  const img = await fetch(result.assets[0].uri);
  const bytes = await img.blob();
  const uploadTask = uploadBytesResumable(storageRef, bytes);

   uploadTask.on('state_changed',
   (snapshot) => {
      const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      //console.log('Upload is ' + progress + '% done');
      if(progress==100){
        Alert.alert('Image uploaded')
      }
    },
    (error)=>{
      console.log('error in uploading image', error)
    },
    ()=>{
      getDownloadURL(uploadTask.snapshot.ref).then(async(downloadURL) => {
        //console.log('File available at', downloadURL);
        
        //user uid
        await updateDoc(doc(db, "users", auth.currentUser.uid),{
          image: downloadURL
        })
      });
    }
    );

    }

    //user Logout
    const doUserLogOut=()=>{

      const updateStatus = doc(db, "users", auth.currentUser.uid);
      updateDoc(updateStatus, {
      status : "offline"
      }).then(()=>{
          signOut(auth)
      }) 
    
  }

    //fetch user data
    const getData = async()=>{
      try{
        const docRef = doc(db, "users", auth.currentUser.uid);
        await getDoc(docRef)
        .then((response)=>{
          setUsername(response.data().name);
          setFetchImage(response.data().image)
        })
      }
      catch(error){
        Alert.alert("somthing wrong, user data not fetched")
      } finally{
        setRefresh(false)
      }
}

useEffect(()=>{
  getData()
},[])

const onRefresh = () => {
  setRefresh(true);
  getData()
}

  return (
    <View style={styles.container}>
      <ScrollView
        style={{ flex: 0.925 }}
        refreshControl={
          <RefreshControl refreshing={refresh} onRefresh={onRefresh} />
        }
      >
        <View style={styles.profilePictureContainer}>
          <TouchableOpacity onPress={pickImage}>
            {fetchImage ? (
              fetchImage && <Image source={{ uri :fetchImage}} style={styles.profilePhoto} />
            ) : (
              <View style={styles.profilePhotoPlaceholder}>
                <Text style={styles.profilePhotoPlaceholderText}>
                  Tap to select profile photo
                </Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

      {/* User Info */}
        <View style={styles.userInfoContainer}>
          <Text style={styles.userName}>{username}</Text>
          <Text style={styles.userEmail}>{auth.currentUser.email}</Text>
        </View>

        {/* Logout Button */}
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={() => doUserLogOut()}
        >
          <Text style={styles.logoutButtonText}>Logout</Text>
          <MaterialIcons name="logout" size={24} color="#fff" />
        </TouchableOpacity>
        </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#f9f9f9",
    paddingVertical: 30,
  },
  profilePictureContainer: {
    borderRadius: 75,
    overflow: 'hidden',
    borderWidth: 5,
    borderColor: "grey",
    marginBottom: 20,
    marginTop: '5%'
  },
  userInfoContainer: {
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#d9d9d9",
    marginBottom: 20,
  },
  userName: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#000",
  },
  userEmail: {
    fontSize: 16,
    color: "#000",
  },
  logoutButton: {
    backgroundColor: "#000",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  logoutButtonText: {
    color: "#fff",
    fontSize: 16,
    marginRight: 10,
  },
  profilePhoto: {
    width: 200,
    height: 200,
    borderRadius: 100,
  },
  profilePhotoPlaceholder: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: "#d9d9d9",
    justifyContent: "center",
    alignItems: "center",
  },
  profilePhotoPlaceholderText: {
    color: "#fff",
    fontSize: 18,
  },
});

export default ProfileScreen;

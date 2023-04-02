import React, { Component, useState } from 'react'
import { 
    Text, 
    View, 
    StyleSheet,
    TouchableOpacity,
    TextInput,
    StatusBar,
    Alert
} from 'react-native'
import { LinearGradient } from 'expo-linear-gradient';
import Feather from 'react-native-vector-icons/Feather'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import * as Animatable from 'react-native-animatable'
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { db } from '../../../config/firebase';
import { addDoc, collection, doc, setDoc} from "firebase/firestore"; 
import { useNavigation } from '@react-navigation/native';

const RegistrationScreen =()=>{

    const [data, setData] = React.useState({
        name:'',
        email:'',
        password:'',
        confirm_password:'',
        check_NameInput:false,
        check_textInputChange:false,
        secureTextEntry:true,
        confirm_secureTextEntry:true
    })

    const navigation=useNavigation();


    const textName = (val) => {
        if(val.length !=0){
        setData({
            ...data,
            name: val,
            check_NameInput:true
        })
    } else {
        setData({
            ...data,
            name: val,
            check_NameInput: false
        })
    }
    }

    const textInputChange = (val) => {
        if(val.length != 0){
            setData({
                ...data,
                email: val,
                check_textInputChange: true
            })
        } else {
            setData({
                ...data,
                email: val,
                check_textInputChange: false
            })
        }
    }

    const handlePasswordChange = (val) => {
        setData({
            ...data,
            password: val
        })
    }

    const handleConfirmPasswordChange = (val) => {
        setData({
            ...data,
            confirm_password: val
        })
    }

    const UpdateSecureTextEntry = () => {
    setData({
        ...data,
        secureTextEntry: !data.secureTextEntry
    })
    }

    const UpdateConfirmSecureTextEntry = () => {
        setData({
            ...data,
            confirm_secureTextEntry: !data.confirm_secureTextEntry
        })
        }


        const registerUser=async()=>{

            // Check if any field is empty
            if (!data.email.trim() || !data.password.trim()) {
                // Display an alert if any field is empty
                Alert.alert(
                'Error',
                'Please fill out all fields.',
                );
                return false;
            }

            const auth = getAuth();
           
        
            createUserWithEmailAndPassword(auth, data.email, data.password)
            .then(async(userCredential)=>{
                
                //navigation.navigate('MainNavigator')
                const user = userCredential.user;
                //console.log(user.email)
                try {
                     await setDoc(doc(db, "users", user.uid), {
                        email : user.email,
                        uid : user.uid,
                        status : "online",
                        name: data.name
                      });
                      //console.log("registered");
                      console.log("Document written with ID: ", user.uid);
                } catch (error) {
                    console.error("Error adding document: ", error);
                }
            })
            .catch((error)=>{
                console.log("something wrong", error)
            })
        
        }


    return (
      <View style={styles.container}>
            <StatusBar backgroundColor={'#009387'} barStyle='light-content' />
        <View style={styles.header}>
            <Text style={styles.text_header}>Register Now!</Text>
        </View>

        <Animatable.View 
        animation={'fadeInUpBig'}
        style={styles.footer}
        >
            <Text style={styles.text_footer}>Name</Text>
            <View style={styles.action}>
                <TextInput
                    placeholder='Your Name'
                    style={[styles.textInput, {paddingLeft:0}]}
                    onChangeText={(val)=> textName(val)}
                />
                {data.check_NameInput ?
                <Animatable.View
                    animation="bounceIn"
                >
                    <Feather
                        name="check-circle"
                        color="green"
                        size={20}
                    />
                </Animatable.View>
                :null}
            </View>

            <Text style={[styles.text_footer,{marginTop:25}]}>Email</Text>
            <View style={styles.action}>
                <FontAwesome
                    name='user-o'
                    color='#05395a'
                    size={20}
                />
                <TextInput
                    placeholder='Your Email'
                    style={styles.textInput}
                    autoCapitalize='none'
                    onChangeText={(val)=> textInputChange(val)}
                />
                {data.check_textInputChange ?
                <Animatable.View
                    animation="bounceIn"
                >
                    <Feather
                        name="check-circle"
                        color="green"
                        size={20}
                    />
                </Animatable.View>
                :null}
            </View>

            <Text style={[styles.text_footer, {marginTop:25}]}>Password</Text>
            <View style={styles.action}>
                <FontAwesome
                    name='lock'
                    color='#05395a'
                    size={20}
                />
                <TextInput
                    placeholder='Your Password'
                    secureTextEntry={data.secureTextEntry ? true : false}
                    style={styles.textInput}
                    autoCapitalize='none'
                    onChangeText={(val)=> handlePasswordChange(val)}
                />
                <TouchableOpacity
                 onPress={UpdateSecureTextEntry}
                >
                    {data.secureTextEntry ?
                    <Feather
                        name="eye-off"
                        color="grey"
                        size={20}
                    />
                    :
                    <Feather
                        name="eye"
                        color="grey"
                        size={20}
                    />
                    }
                </TouchableOpacity>
            </View>

            <Text style={[styles.text_footer, {marginTop:25}]}>Confirm Password</Text>
            <View style={styles.action}>
                <FontAwesome
                    name='lock'
                    color='#05395a'
                    size={20}
                />
                <TextInput
                    placeholder='Confirm Your Password'
                    secureTextEntry={data.confirm_secureTextEntry ? true : false}
                    style={styles.textInput}
                    autoCapitalize='none'
                    onChangeText={(val)=> handleConfirmPasswordChange(val)}
                />
                <TouchableOpacity
                 onPress={UpdateConfirmSecureTextEntry}
                >
                    {data.confirm_secureTextEntry?
                    <Feather
                        name="eye-off"
                        color="grey"
                        size={20}
                    />
                    :
                    <Feather
                        name="eye"
                        color="grey"
                        size={20}
                    />
                    }
                </TouchableOpacity>
                
            </View>

            <View style={styles.button}>
                <TouchableOpacity style={{width:'100%', height:50}} onPress={()=>registerUser()} >
                    <LinearGradient
                        colors={['#08d4c4', '#01ab9d']}
                        style={styles.signIn}
                    >
                        <Text style={[styles.textSign,{color:'#fff'}]}>Sign Up</Text>
                    </LinearGradient>
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={()=> navigation.goBack()}
                    style={[styles.signIn,{borderColor:'#009387', borderWidth:1, marginTop:15}]}
                >
                    <Text style={[styles.textSign,{color:'#009387'}]}>Sign In</Text>
                </TouchableOpacity>
            </View>

        </Animatable.View>

      </View>
    )
}

export default RegistrationScreen


const styles =StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:'#009387'
    },
    header: {
        flex:1,
        justifyContent:'flex-end',
        paddingHorizontal:20,
        paddingBottom:30,
    },
    footer: {
        flex:3,
        backgroundColor:'#fff',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        paddingVertical: 30,
        paddingHorizontal: 20,
    },
    text_header:{
        color:'#fff',
        fontWeight:'bold',
        fontSize:30
    },
    text_footer:{
        color:'grey',
        fontSize:18,
    },
    action:{
        flexDirection:'row',
        marginTop:10,
        borderBottomWidth:1,
        borderBottomColor:'#f2f2f2',
        paddingBottom:5,
    },
    textInput:{
        flex:1,
        color:'#05375a',
        marginTop:-5,
        paddingLeft:10,
        width:'90%',
    },
    button:{
        alignItems:'center',
        marginTop:50
    },
    signIn:{
        width:'100%',
        height:50,
        justifyContent:'center',
        alignItems:'center',
        borderRadius:10,
    },
    textSign:{
        fontWeight:'bold',
        fontSize:18
    }
})
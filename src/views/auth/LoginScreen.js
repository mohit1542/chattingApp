import React, { Component, useState } from 'react'
import { 
    Text, 
    View, 
    Button,
     Dimensions, 
     StyleSheet,
     Image,
     TouchableOpacity,
     Platform,
     TextInput,
     StatusBar
} from 'react-native'
import { LinearGradient } from 'expo-linear-gradient';
import Feather from 'react-native-vector-icons/Feather'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import * as Animatable from 'react-native-animatable'
import {getAuth, signInWithEmailAndPassword,onAuthState, onAuthStateChanged, signOut} from 'firebase/auth'

const LoginScreen =({navigation})=>{

    const [data, setData] = React.useState({
        email:'',
        password:'',
        check_textInputChange:false,
        secureTextEntry:true
    })
    
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

    const UpdateSecureTextEntry = () => {
    setData({
        ...data,
        secureTextEntry: !data.secureTextEntry
    })
    }

//login user
    const loginUser=()=>{

        const auth = getAuth();
        signInWithEmailAndPassword(auth, data.email, data.password)
        .then((userCredential) => {
        // Signed in 
        //const user = userCredential.user;
        //await AsyncStorage.setItem("keepuser", data.email)
        
        //console.log("looged in successfully")
        //navigation.navigate('MainNavigator')
        // ...
        })
        .catch((error) => {
        console.log("somthing wrong (not logged in", error)
        });
    }

    return (
      <View style={styles.container}>
            <StatusBar backgroundColor={'#009387'} barStyle='light-content' />
        <View style={styles.header}>
            <Text style={styles.text_header}>Welcome!</Text>
        </View>

        <Animatable.View 
        animation={'fadeInUpBig'}
        style={styles.footer}
        >
            <Text style={styles.text_footer}>Email</Text>
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

            <Text style={[styles.text_footer, {marginTop:30}]}>Password</Text>
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

            <View style={styles.button}>
                <TouchableOpacity style={{width:'100%', height:50}} onPress={()=>loginUser()} >
                    <LinearGradient
                        colors={['#08d4c4', '#01ab9d']}
                        style={styles.signIn}
                    >
                        <Text style={[styles.textSign,{color:'#fff'}]}>Sign In</Text>
                    </LinearGradient>
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={()=> navigation.navigate('Register')}
                    style={[styles.signIn,{borderColor:'#009387', borderWidth:1, marginTop:15}]}
                >
                    <Text style={[styles.textSign,{color:'#009387'}]}>Sign Up</Text>
                </TouchableOpacity>
            </View>

        </Animatable.View>

      </View>
    )
}

export default LoginScreen


const styles =StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:'#009387'
    },
    header: {
        flex:1,
        justifyContent:'flex-end',
        paddingHorizontal:20,
        paddingBottom:30
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
        flexlex:1,
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
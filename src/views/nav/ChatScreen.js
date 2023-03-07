import React, { Component, useState , useEffect} from 'react'
import { StyleSheet,Text, View, Image} from 'react-native'
import { Bubble, GiftedChat, InputToolbar, Send } from 'react-native-gifted-chat'
import { getDocs, collection, setDoc, doc, serverTimestamp, onSnapshot, query, orderBy} from "firebase/firestore";
import { db } from '../../../config/firebase';
import colors from '../../constants/colors';
import { Ionicons } from '@expo/vector-icons'; 


const Chatscreen=({auth, route})=> {

  const[livestatus, setLivestatus] =useState('');
  const [messages, setMessages] = useState([]);
  const {uid} =route.params;

  const getallMessages=()=>{
    const docid = uid > auth.currentUser.uid ? auth.currentUser.uid + "-" + uid : uid + "-" + auth.currentUser.uid
     const messageRef = query(collection(db, 'chatrooms', docid, 'messages'), orderBy('createdAt', 'desc'));

     const getRealTimeData =onSnapshot(messageRef, (querySnapshot) => {
            const msg= querySnapshot.docs.map((docu) => {
              //console.log(doc.id, " => ", doc.data());
              const data = docu.data()

              if(data.createdAt){
                    return{
                      ...docu.data(),
                      createdAt:docu.data().createdAt.toDate(),
                    }
              } else {
                    return{
                    ...docu.data(),
                    createdAt: new Date()
                    }
                }

            });
            setMessages(msg)
            
      }, (error)=>{
          console.log(error)
      });

      return()=>{
        getRealTimeData()
      }
   
    
  }

  useEffect(() => {
    getallMessages()    
}, [])


  const onSend = async(messageArray) => {
      const msg = messageArray[0]
      const mymsg={
        ...msg,
        sentBy:auth.currentUser.uid,
        sentTo:uid,
        createdAt:new Date()
      }
      setMessages(previousMessages => GiftedChat.append(previousMessages,mymsg))
      const docid = uid > auth.currentUser.uid ? auth.currentUser.uid + "-" + uid : uid + "-" + auth.currentUser.uid

    //create a document reference with an auto-generated ID
    //here different id generated on each message
    const newMessageRef = doc(collection(db, "chatrooms", docid, 'messages'));

    await setDoc(newMessageRef,{
      ...mymsg,
      createdAt:serverTimestamp()
    })

  }


  return (
<View style={{flex:1, backgroundColor:'white'}}>
    <GiftedChat
      messages={messages}
      onSend={messages => onSend(messages)}
      user={{
        _id: auth.currentUser.uid,
      }}
      renderBubble={props=>{
        return(
          <Bubble
          {...props}
          wrapperStyle={{
            right:{
              backgroundColor:colors.GREEN
            },
            // left:{
            //   backgroundColor:colors.BLUE
            // }
          }}
          
          />
        )
      }}

      renderInputToolbar={(props)=>{
        return (
                    <InputToolbar {...props} containerStyle={{borderTopWidth:1, borderTopColor:'black', }} />
              )
      }}


      renderSend={(props) =>{
        return (
            <Send
                {...props}
            >
                <View style={{marginRight: 10, marginBottom: 5}}>
                  <Ionicons name="send" size={24} color="black" />
                </View>
            </Send>
        );
    }
  }
    />

    </View>


   
  )
}

export default Chatscreen


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from '../views/auth/LoginScreen';
import RegistrationScreen from '../views/auth/RegisterScreen';
import SplashScreen from '../views/nav/SplashScreen';
import MainNavigator from './MainNavigator';

const Stack = createStackNavigator()

const AuthNavigator= ()=> {
  return (
    <Stack.Navigator initialRouteName='Splash'>

        <Stack.Screen
          name="Splash"
          component={SplashScreen} 
          options={{headerShown: false}}
        />

        <Stack.Screen
          name='Login'
          component={LoginScreen}
          options={{headerShown:false}}
        />

        <Stack.Screen
          name="Register" 
          component={RegistrationScreen} 
          options={{headerShown: false}}
        />

        <Stack.Screen
            name="MainNavigator" 
            component={MainNavigator} 
            options={{headerShown: false}}
        />

    </Stack.Navigator>
  );
}



export default AuthNavigator
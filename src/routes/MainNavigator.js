import { createStackNavigator } from '@react-navigation/stack'
import React, { Component } from 'react'
import { Text, View } from 'react-native'
import AuthNavigator from './AuthNavigator'
import BottomNavigator from './BottomNavigator'


const Stack= createStackNavigator()

function MainNavigator() {
    return (
      <Stack.Navigator initialRouteName='BottomNavigator'>
            <Stack.Screen
                name="BottomNavigator" 
                component={BottomNavigator} 
                options={{headerShown: false}}
            />

            <Stack.Screen
                name="AuthNavigator" 
                component={AuthNavigator} 
                options={{headerShown: false}}
            />
      </Stack.Navigator>
    )
}

export default MainNavigator

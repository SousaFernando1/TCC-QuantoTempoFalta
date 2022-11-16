
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Search from './Pages/Search'
import Map from './Pages/Map'
import PerfilMotorista from './Pages/PerfilMotorista'
import LoginMotorista from './Pages/LoginMotorista'

export default function App() {

  const Stack = createStackNavigator();

  return (
  
      <NavigationContainer>
        
          <Stack.Navigator>
           
            <Stack.Screen name="Search" component={Search} options={{
                headerShown: false
              }}/>
            <Stack.Screen name="Map" component={Map} options={{
              headerStyle: {
                backgroundColor: '#FFCE21',
                shadowRadius: 0,
                shadowColor: 'transparent',
                elevation: 0,
                shadowOpacity: 0,
              },
              headerTintColor: 'white',
              title : "",

            }}/>
             <Stack.Screen name="LoginMotorista" component={LoginMotorista} options={{
                headerShown: false
              }}/>
            <Stack.Screen name="PerfilMotorista" component={PerfilMotorista} options={{
                headerShown: false
              }}/>
          </Stack.Navigator>
      </NavigationContainer>
  
    );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
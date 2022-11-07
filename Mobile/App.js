
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Search from './Pages/Search'
import Map from './Pages/Map'

import { color } from 'react-native-reanimated';

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
                backgroundColor: '#2AC28B',
                shadowRadius: 0,
                shadowColor: 'transparent',
                elevation: 0,
                shadowOpacity: 0,
              },
              headerTintColor: 'white',
              title : "",

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
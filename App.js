
import { StyleSheet} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import LoginComponent from './components/LoginComponent';
import HomeComponent from './components/HomeComponent';
import RegisterComponent from './components/RegisterComponent';

const Stack = createNativeStackNavigator()

function MyStack() {
  return(
    <Stack.Navigator initialRouteName="Register">
        <Stack.Screen  name='Login' component={LoginComponent} options={{title: 'Welcome'}}/>
        <Stack.Screen  name='Register' component={RegisterComponent} options={{title: 'Register'}}/>
        <Stack.Screen  name='Home' component={HomeComponent} options={{title: 'Home'}}/>

    </Stack.Navigator>
  );
  
}

export default function App() {
  return (
    <NavigationContainer>
        <MyStack/>
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


import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginComponent from './screens/LoginScreen';
import HomeComponent from './screens/HomeScreen';
import RegisterComponent from './screens/RegisterScreen';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList, DrawerItem } from '@react-navigation/drawer';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { Button, Text, View} from 'react-native';
import ProfileComponent from './screens/ProfileScreen';



const Stack = createNativeStackNavigator()
const Drawerr = createDrawerNavigator();



const MyDrawer = ({ navigation }) => {
  const handleLogout = async () => {
    await AsyncStorage.removeItem('token');
    navigation.replace('Login');
  };
  return (
    <Drawerr.Navigator 
    // drawerContent={
    //   () =>
    //     <Drawer.CollapsedItem
    //       focusedIcon="inbox"
    //       unfocusedIcon="inbox-outline"
    //       label="Inbox"
    //     />
    // }
    >
      {/* screenOptions={{swipeEnabled: true, headerShown: true }} */}
      
      {/* <Drawer.Screen name='Register' component={RegisterComponent} options={{
        title: 'Register',
        headerShown: true,
        headerLeft: false,
      }}
      />  */}
      <Drawerr.Screen name='Home' component={HomeComponent} options={ { 
        // title: 'Register',
        headerShown: true,
        headerRight: () => (
          <Button
            onPress={handleLogout}
            title="Logout"
            color="green"
          />
        ),
       
         }} />
         <Drawerr.Screen name='Profile' component={ProfileComponent} options={{
        // title: 'Login',
        headerShown: true,

      }}  />
    </Drawerr.Navigator>
  );
}

function MyStack() {
  return (
    <Stack.Navigator initialRouteName="Register">
      <Stack.Screen name="Home" component={MyDrawer} options={{ headerShown: false }} />
      <Stack.Screen name='Login' component={LoginComponent} options={{ title: 'Welcome' }} />
      <Stack.Screen name='Register' component={RegisterComponent} options={{ title: 'Register' }} />
      {/* <Stack.Screen  name='Home' component={HomeComponent} options={{title: 'Home', headerShown: false }}/> */}

    </Stack.Navigator>
  );

}

export default function App() {
  return (
    <NavigationContainer>
      <MyStack />
      {/* <MyDrawer /> */}
    </NavigationContainer>
  );
}



import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import LoginComponent from './screens/LoginScreen'
import HomeUserComponent from './screens/HomeScreen'
import RegisterComponent from './screens/RegisterScreen'
import { createDrawerNavigator } from '@react-navigation/drawer'
import AsyncStorage from '@react-native-async-storage/async-storage'
import FontAwesome from '@expo/vector-icons/FontAwesome'

import { Button, StyleSheet, Dimensions } from 'react-native'
import ProfileComponent from './screens/ProfileScreen'
import AdminHomeScreen from './screens/AdminHomeScreen'
import CustomDrawer from './components/CustomDrawer'
import { Ionicons } from '@expo/vector-icons'
import ApplicationsReadyScreen from './screens/ApplicationsReadyScreen'
import { View } from 'react-native'

const Stack = createNativeStackNavigator()
const Drawerr = createDrawerNavigator()

const MyDrawer = ({ navigation }) => {
  const handleLogout = async () => {
    await AsyncStorage.removeItem('token')
    navigation.replace('Login')
  }

  return (
    <Drawerr.Navigator>
      <Drawerr.Screen
        name="Home"
        component={HomeUserComponent}
        options={{
          // title: 'Register',
          headerShown: true,
          headerRight: () => (
            <Button onPress={handleLogout} title="Logout" color="green" />
          ),
        }}
      />
      <Drawerr.Screen
        name="Profile"
        component={ProfileComponent}
        options={{
          // title: 'Login',
          headerShown: true,
        }}
      />
    </Drawerr.Navigator>
  )
}

const MyDrawerAdmin = ({ navigation }) => {
  const screenHeight = Dimensions.get('window').height

  const handleLogout = async () => {
    await AsyncStorage.removeItem('token')
    navigation.replace('Login')
  }
  return (
    <Drawerr.Navigator
      screenOptions={{ drawerLabelStyle: { marginLeft: -25 } }}
      // drawerContent={(props) => (
      //   <DrawerContentScrollView {...props}>
      //     <DrawerItemList {...props} />
      //     <View
      //       style={{ padding: 20, borderTopWidth: 1, borderTopColor: '#ccc' }}
      //     >
      //       <DrawerItem label="Logout" onPress={handleLogout} />
      //     </View>
      //   </DrawerContentScrollView>
      // )}
      drawerContent={(props) => <CustomDrawer {...props} />}
    >
      {/* <Drawer.Screen name='Register' component={RegisterComponent} options={{
        title: 'Register',
        headerShown: true,
        headerLeft: false,
      }}
      />  */}
      <Drawerr.Screen
        name="Home"
        component={AdminHomeScreen}
        options={{
          // title: 'Register',
          headerShown: true,
          headerRight: () => (
            <Button onPress={handleLogout} title="Logout" color="purple" />

          ),
          drawerIcon: ({ color }) => (
            <Ionicons name="home-outline" size={22} color={color} />
          ),
        }}
      />

      <Drawerr.Screen
        name="Applications Ready"
        component={ApplicationsReadyScreen}
        options={{
          // title: 'Register',
          headerShown: true,
          // headerRight: () => (
          //   <Button onPress={handleLogout} title="Logout" color="purple" />
          // ),
          drawerIcon: ({ color }) => (
            <Ionicons name="checkmark-circle-outline" size={22} color={color} />
          ),
        }}
      />
    </Drawerr.Navigator>
  )
}

function MyStack() {
  return (
    <Stack.Navigator initialRouteName="Register">
      <Stack.Screen
        name="Home"
        component={MyDrawer}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Login"
        component={LoginComponent}
        options={{ title: 'Welcome' }}
      />
      <Stack.Screen
        name="Register"
        component={RegisterComponent}
        options={{ title: 'Register' }}
      />
      <Stack.Screen
        name="AdminHome"
        component={MyDrawerAdmin}
        options={{ headerShown: false }}
      />

      {/* <Stack.Screen  name='Home' component={HomeComponent} options={{title: 'Home', headerShown: false }}/> */}
    </Stack.Navigator>
  )
}

export default function App() {
  return (
    <NavigationContainer>
      <MyStack />
      {/* <MyDrawer /> */}
    </NavigationContainer>
  )
}

const styles = StyleSheet.create({
  logoutSection: {
    marginBottom: 2000, // Ajusta el espacio al fondo
  },
  logoutButton: {
    backgroundColor: 'red',
  },
})

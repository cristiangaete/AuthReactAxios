import React, { useState } from 'react'
import {
  View,
  TextInput,
  Button,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Text,
} from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { jwtDecode } from 'jwt-decode'

const LoginComponent = ({ navigation }) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')

  const handleLogin = async () => {
    try {
      // const response = await fetch('http://localhost:3000/api/auth/login', {
      const response = await fetch('http://192.168.1.104:3000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })
      const data = await response.json()
    //   console.log('data Login: ', data)

      const token = data.token
      await AsyncStorage.setItem('token', token)
      const decodedToken = jwtDecode(token)
      console.log("decodedToken: ",decodedToken.role)

      if (decodedToken.role === 'admin') {
        console.log("entramos al admin")
        navigation.replace('AdminHome')
  
      }
      else{
        navigation.replace('Home');
      }
      // if (data !== 'Unauthorized') {
      //   await AsyncStorage.setItem('token', token)
      //   // console.log('vamos home')
      //   navigation.replace('AdminHome')
      //   // navigation.navigate('Home');
      // } else {
      //   setMessage('Invalid credentials')
      // }
    } catch (error) {
      setMessage('Invalid credentials')
      console.log(error)
    }
  }

  const navigateToRegister = () => {
    navigation.replace('Register')
  }

  return (
    <ScrollView style={Styles.container}>
      <View style={Styles.inputGroup}>
        <TextInput
          displayType="text"
          placeholder="Email User"
          value={email}
          onChangeText={(value) => setEmail(value)}
        />
      </View>
      <View style={Styles.inputGroup}>
        <TextInput
          placeholder="Password"
          value={password}
          onChangeText={(value) => setPassword(value)}
          secureTextEntry
        />
      </View>

      <View>
        <Button title="Login" onPress={handleLogin} />
      </View>

      <TouchableOpacity
        onPress={navigateToRegister}
        style={Styles.registerLink}
      >
        <Text style={Styles.registerText}> Create an account </Text>
      </TouchableOpacity>
    </ScrollView>
  )
}
const Styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 35,
  },
  inputGroup: {
    flex: 1,
    padding: 0,
    marginBottom: 15,
    borderBottomWidth: 1,
  },
  registerLink: {
    marginTop: 20,
    alignItems: 'center',
  },
  registerText: {
    color: 'blue',
  },
})
export default LoginComponent

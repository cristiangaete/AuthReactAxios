import React, { useEffect, useState, useCallback, useMemo, useRef } from 'react'
import {
  Button,
  Text,
  View,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  StatusBar,
  SafeAreaView,
  ScrollView,
  Box,
  TouchableWithoutFeedback,
} from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { jwtDecode } from 'jwt-decode'

const ProfileComponent = () => {
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')

  const fetchUserProfile = async () => {
    try {
      const token = await AsyncStorage.getItem('token')
      // console.log('token: ', token)
      // const decodedToken = jwtDecode(token)
      // console.log(decodedToken)
      // setEmail(decodedToken)

      // console.log('EMAIL: ', email)

      // const response = await fetch('http://localhost:3000/api/subjects', {
      const response = await fetch(
        'http://192.168.1.104:3000/api/auth/profile',
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          mode: 'cors',
          cache: 'default',
        }
      )
      // console.log(token)
      // console.log('response: ', response)
      const dataFetch = await response.json()

      // console.log('DATAFETCH_>>>:', dataFetch)
      setName(dataFetch.name)
      setEmail(dataFetch.email)

      // console.log("user------->", user.userEmail)
    } catch (err) {
      console.log('Error al obtener datos del usuario', err)
    }
  }

  const handleUpdateUser = () => {
    console.log('update user')
  }

  useEffect(() => {
    fetchUserProfile()
  }, [])

  return (
    <SafeAreaView style={Styles.container}>
      <View style={Styles.inputGroup}>
        <Text style={Styles.title}>Profile</Text>
      </View>
      <View style={Styles.inputGroup}>
        <Text style={Styles.titleText}>Name: {name}</Text>
      </View>
      <View style={Styles.inputGroup}>
        <Text style={Styles.titleText}>Email: {email}</Text>
      </View>
      <View>
        <Button title="Update User" onPress={handleUpdateUser} />
      </View>
    </SafeAreaView>
  )
}

const Styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 35,
  },
  inputGroup: {
    // flex: 1,
    padding: 0,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'left',
  },
  titleText: {
    fontSize: 15,
    marginBottom: 15,
    textAlign: 'left',
  },
})

export default ProfileComponent

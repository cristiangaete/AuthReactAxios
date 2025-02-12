import React, { useEffect, useState, useCallback, useRef } from 'react'
import { FAB, Button, Icon, Card } from '@rneui/themed'
import {
  // Button,
  Text,
  View,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  SafeAreaView,
  TextInput,
  Dimensions,
  Modal,
  TouchableOpacity,
  Image,
} from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { jwtDecode } from 'jwt-decode'

export default function ApplicationsReadyScreen() {
  const [data, setData] = useState([])
  const [email, setEmail] = useState('')

  const fetchUserData = async () => {
    try {
      const token = await AsyncStorage.getItem('token')
      //   console.log('token: ', token)
      const decodedToken = jwtDecode(token)
      //   console.log(decodedToken)
      setEmail(decodedToken)

      // const response = await fetch('http://localhost:3000/api/subjects', {
      const response = await fetch('http://192.168.1.104:3000/api/subjects', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        mode: 'cors',
        cache: 'default',
      })
      console.log(token)

      // console.log("response: ", response)
      const dataFetch = await response.json()
      // setLoading(false)
      console.log(dataFetch.length)
      console.log("readyScreen:", dataFetch)

      // console.log("user------->", user.userEmail)
      setData(dataFetch)
      console.log(data)
    } catch (err) {
      console.log('Error al obtener datos del usuario', err)
    }
  }

  useEffect(() => {
      fetchUserData()
    }, [])
  return (
    <>
      <SafeAreaView style={{ flex: 1, padding: 10 }}>
        <Text>Applications Ready</Text>
      </SafeAreaView>
    </>
  )
}


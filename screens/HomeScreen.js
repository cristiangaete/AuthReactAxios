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
  TextInput,
} from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { jwtDecode } from 'jwt-decode'
import { FAB } from 'react-native-paper'
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import Header from '../components/Header'
import * as ImagePicker from 'expo-image-picker'
import ButtonComponent from '../components/ButtonComponent'
import ImageViewer from '../components/ImageViewer'

function HomeComponent({ navigation }) {
  const [data, setData] = useState([])
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(true)
  const [active, setActive] = useState('')
  const [photo, setPhoto] = useState('')
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')
  const [isOpen, setIsOpen] = useState(true)
  const [selectedImage, setSelectedImage] = useState(null)
  const bottomSheetRef = useRef(BottomSheet)
  const insets = useSafeAreaInsets()

  const snapPoints = ['80%']

  const handleSnapPress = useCallback((index) => {
    bottomSheetRef.current?.snapToIndex(index)
    setIsOpen(true)
  }, [])

  const fetchUserData = async () => {
    try {
      const token = await AsyncStorage.getItem('token')
      //   console.log('token: ', token)
      const decodedToken = jwtDecode(token)
      //   console.log(decodedToken)
      setEmail(decodedToken)

      //   console.log('EMAIL: ', email)

      // const response = await fetch('http://localhost:3000/api/subjects', {
      const response = await fetch('http://192.168.1.97:3000/api/subjects', {
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
      setLoading(false)
      console.log(dataFetch.length)
      // console.log("user------->", user.userEmail)
      setData(dataFetch)
    } catch (err) {
      console.log('Error al obtener datos del usuario', err)
    }
  }

  const handleSubmit = async () => {
    if (subject === '' || message === '') {
      console.log('NO, ', photo, subject, message)
      alert('Field Empty')
      return
    }
    try {
      const token = await AsyncStorage.getItem('token')
      console.log('token: ', token)
      //   const decodedToken = jwtDecode(token)
      //   console.log(decodedToken)
      //   setEmail(decodedToken)

      console.log('photo: ', photo)
      console.log('subject: ', typeof subject)
      console.log('message: ', typeof message)

      // const response = await fetch('http://localhost:3000/api/subjects', {
      const response = await fetch('http://192.168.1.97:3000/api/subjects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ photo, subject, message }),
        mode: 'cors',
        cache: 'default',
      })

      fetchUserData()
      setPhoto('')
      setSubject('')
      setMessage('')
      setSelectedImage('')
    } catch (err) {
      console.log('Error al obtener datos del usuario', err)
    }
  }

  const pickImageAsync = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      quality: 1,
      base64: false,
    })

    if (!result.canceled) {
      // console.log(result.assets[0].uri);
      setSelectedImage(result.assets[0].uri)
      const uri = result.assets[0].uri
      return setPhoto(uri.split('ImagePicker/')[1])
    } else {
      alert('You did not select any image.')
    }
  }

  useEffect(() => {
    fetchUserData()
  }, [])

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    )
  }

  const handleLogout = async () => {
    await AsyncStorage.removeItem('token')
    navigation.replace('Login')
  }

  return (
    <SafeAreaView
      style={
        styles.container
        // {

        // marginTop: StatusBar.currentHeight
        // }
      }
    >
      {/* <View> */}
      {/* <Header title={"Home"}/> */}
      {/* </View> */}

      {email ? <Text>Welcome, {email.email}</Text> : <Text>Cargando...</Text>}
      {/* <View>
                <Button title="Logout" onPress={handleLogout} />
            </View> */}
      {/* <ScrollView> */}
      <View>
        <FlatList
          contentContainerStyle={{ paddingBottom: 50 }}
          data={data} // Pasamos los datos a la lista
          keyExtractor={(item) => item.id.toString()} // Asignamos una clave única para cada elemento
          renderItem={({ item }) => (
            //  {console.log("item: ____", item.photo)}
            <View style={styles.item}>
              <Text style={styles.title}>Title: {item.message}</Text>
              <Text style={styles.title}>Image: {item.photo}</Text>
              <Text style={styles.title}>Subject: {item.subject}</Text>
              <Text style={styles.title}>Time: {item.timeSubject}</Text>
            </View>
          )}
        />
      </View>
      {/* </ScrollView> */}
      {/* <ScrollView >
                {data.map((item) => (
                    <View style={styles.item}>
                    <Text style={styles.title}>{item.message}</Text>
                    <Text style={styles.title}>{item.photo}</Text>
                    <Text style={styles.title}>{item.subject}</Text>
                    <Text style={styles.title}>{item.timeSubject}</Text>
                    </View>
                ))}
            </ScrollView> */}

      <View>
        <FAB
          icon="plus"
          style={styles.fab}
          onPress={() => handleSnapPress(0)}
        />
      </View>

      <BottomSheet
        ref={bottomSheetRef}
        snapPoints={snapPoints}
        enablePanDownToClose={true}
        index={-1}
        // onClose={() => setIsOpen(false)}
        // onPress={handleClose}
      >
        <BottomSheetView style={styles.container}>
          {/* <Text>Awesome 🎉</Text> */}
          {/* <View style={styles.inputGroup}>
            <TextInput
              displayType="text"
              placeholder="Attached image"
              value={photo}
              onChangeText={(value) => setPhoto(value)}
            />
          </View> */}
          <View>
            <ButtonComponent
              theme="primary"
              label="Choose a photo"
              onPress={pickImageAsync}
            />
          </View>
          <View style={styles.inputGroup}>
            <TextInput
              displayType="text"
              placeholder="Subject"
              value={subject}
              onChangeText={(value) => setSubject(value)}
            />
          </View>
          <View style={styles.inputGroup}>
            <TextInput
              displayType="text"
              placeholder="Message"
              value={message}
              onChangeText={(value) => setMessage(value)}
            />
          </View>
          <View>
            <Button title="Send subjects" onPress={handleSubmit} />
          </View>

          <View style={styles.imageContainer}>
            <ImageViewer
              placeholderImageSource={"PlaceholderImage"}
              selectedImage={selectedImage}
            />
          </View>
        </BottomSheetView>
      </BottomSheet>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  item: {
    backgroundColor: '#1e272e',
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
  },
  title: {
    fontSize: 32,
    color: 'white',
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fab: {
    flex: 1,
    flexDirection: 'row',
    position: 'absolute',
    bottom: 10,
    alignSelf: 'flex-end',
    justifyContent: 'space-between',
    // backgroundColor: "transparent",
    borderWidth: 0.5,
    borderRadius: 20,
  },
  contentContainer: {
    flex: 1,
    alignItems: 'center',
  },
  inputGroup: {
    // flex: 1,
    padding: 10,
    marginBottom: 15,
    borderBottomWidth: 1,
  },
  imageContainer: {
    flex:1, 
    paddingTop: 10
  },
})

export default HomeComponent

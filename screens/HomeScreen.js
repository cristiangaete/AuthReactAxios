import React, { useEffect, useState, useCallback, useRef } from 'react'
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
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import * as ImagePicker from 'expo-image-picker'
import ButtonComponent from '../components/ButtonComponent'
import ImageViewer from '../components/ImageViewer'
import { FAB, Button, Icon, Card } from '@rneui/themed'


function HomeUserComponent({ navigation }) {
  const [data, setData] = useState([])
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(true)
  const [active, setActive] = useState('')
  const [photoName, setPhotoName] = useState('')
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')
  const [isOpen, setIsOpen] = useState(true)
  const [selectedImage, setSelectedImage] = useState(null)
  const [image, setImage] = useState(null)
  const bottomSheetRef = useRef(BottomSheet)
  const insets = useSafeAreaInsets()
  const screenHeight = Dimensions.get('window').height

  const [visible, setIsVisible] = useState(false)

  const [isModalVisible, setModalVisible] = useState(false)
  const [imageModal, setImageModal] = useState(null)

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
      console.log('screenHeight: ', screenHeight)

      // console.log("response: ", response)
      const dataFetch = await response.json()
      setLoading(false)
      console.log(dataFetch.length)
      console.log(dataFetch)

      // console.log("user------->", user.userEmail)
      setData(dataFetch)
    } catch (err) {
      console.log('Error al obtener datos del usuario', err)
    }
  }

  const handleSubmit = async () => {
    if (subject === '' || message === '') {
      console.log('NO, ', photoName, subject, message)
      alert('Field Empty')
      return
    }

    try {
      const token = await AsyncStorage.getItem('token')
      console.log('token: ', token)
      //   const decodedToken = jwtDecode(token)
      //   console.log(decodedToken)

      const data = new FormData()
      console.log(image)
      data.append('photoName', photoName)
      data.append('subject', subject)
      data.append('message', message)
      data.append('file', {
        name: image.fileName,
        uri: image.uri,
        type: image.mimeType,
      })
      Object.values(data).forEach((value, key) => {
        console.log(key, value)
      })

      // const response = await fetch('http://localhost:3000/api/subjects', {
      const response = await fetch('http://192.168.1.104:3000/api/subjects', {
        method: 'POST',
        headers: {
          // 'Content-Type': 'application/json',
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
        // body: (data,{photoName, subject, message }),
        body: data,
        mode: 'cors',
        cache: 'default',
      })

      const result = await response.json()
      console.log('Respuesta del servidor:', result)

      fetchUserData()
      setPhotoName('')
      setSubject('')
      setMessage('')
      setSelectedImage('')
    } catch (err) {
      console.log(err)
    }
  }

  const handleDelete = async (id) => {
    try {
      const token = await AsyncStorage.getItem('token')
      console.log('token: ', token)

      // const response = await fetch('http://localhost:3000/api/subjects', {
      await fetch(`http://192.168.1.104:3000/api/subjects/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        mode: 'cors',
        cache: 'default',
      })

      fetchUserData()
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
      console.log('fileee -->: ', result.assets[0])
      setSelectedImage(result.assets[0].uri)
      setImage(result.assets[0])
      setPhotoName(result.assets[0].fileName)
      // setPhotoName(uri.split('ImagePicker/')[1])
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

  const toggleModal = (imageUrl) => {
    // setModalVisible(!isModalVisible)
    console.log(imageUrl)
    setImageModal(imageUrl)
    setModalVisible(true)
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
      {email ? <Text>Welcome, {email.email}</Text> : <Text>Cargando...</Text>}
      <View>
        <FlatList
          contentContainerStyle={{ minHeight: screenHeight }}
          data={data} // Pasamos los datos a la lista
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            //  {console.log("item: ____", item.photo)}
            // <View style={styles.item}>
            <View>
              <Card>
                <Card.Title>Title: {item.subject}</Card.Title>
                <Card.Divider />
                <TouchableOpacity
                  key={item.id}
                  onPress={() => toggleModal(item.imageUser)}
                >
                  <Card.Image
                    style={{ padding: 0 }}
                    source={{
                      uri: item.imageUser,
                    }}
                  />
                </TouchableOpacity>
                <Modal
                  visible={isModalVisible}
                  transparent={true}
                  onRequestClose={toggleModal}
                >
                  <View style={styles.modalContainer}>
                    {/* Imagen en pantalla completa */}
                    {imageModal && (
                      <Image
                        source={{ uri: imageModal }}
                        style={styles.fullImage}
                        resizeMode="contain"
                      />
                    
                    )}

                    {/* Botón de cerrar */}

                    <TouchableOpacity
                      onPress={() => setModalVisible(false)}
                      style={styles.closeButton}
                    >
                      <Text style={styles.closeButtonText}>Close</Text>
                    </TouchableOpacity>
                  </View>
                </Modal>

                <Text style={{ marginBottom: 10 }}>
                  Photo Name: {item.photoName}
                </Text>
                <Text style={{ marginBottom: 10 }}>
                  Message: {item.message}
                </Text>
                <Text style={{ marginBottom: 10 }}>
                  Time: {item.timeSubject}
                </Text>
                <Card.Divider />
                <View style={{flex: 1, justifyContent: 'flex-start', alignItems: 'flex-start',flexDirection: 'row',}}>
                <Icon
                  name="delete"
                  color="black"
                  onPress={() => handleDelete(item.id)}
                />
                </View>
              </Card>
            </View>
          )}
        />
      </View>

          {/* BOTON DE ABRIR EL MODAL PARA CARGAR IMAGENES */}
      <View>
        <FAB
          onPress={() => handleSnapPress(0)}
          placement="right"
          icon={{ name: 'add', color: 'white' }}
          color="#517fa4"
        />
      </View>
        
          {/* ACA SE ABRE EL MODAL PARA CARGAR IMAGENES */}
        
      <BottomSheet
        ref={bottomSheetRef}
        snapPoints={snapPoints}
        enablePanDownToClose={true}
        index={-1}
        // onClose={() => setIsOpen(false)}
        // onPress={handleClose}
      >
        <BottomSheetView style={styles.container}>
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
              placeholderImageSource={'PlaceholderImage'}
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
    flex: 1,
    paddingTop: 10,
  },
  fullImage: {
    width: '100%',
    height: '80%',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.9)', // Fondo oscuro semitransparente
  },
  closeButton: {
    position: 'absolute',
    bottom: 50,
    alignSelf: 'center',
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 5,
  },
  closeButtonText: {
    color: 'black',
    fontSize: 16,
  },
})

export default HomeUserComponent

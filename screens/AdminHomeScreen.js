import React, { useEffect, useState, useCallback, useMemo, useRef } from 'react'
import {
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
  Dimensions,
  Modal,
  TouchableOpacity,
  Image,
} from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { jwtDecode } from 'jwt-decode'
import { Button, Icon, Card, CheckBox } from '@rneui/themed'
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet'
import ButtonComponent from '../components/ButtonComponent'
import ImageViewer from '../components/ImageViewer'



export default function AdminHomeScreen() {
  const screenHeight = Dimensions.get('window').height
  const [data, setData] = useState([])
  const [isModalVisible, setModalVisible] = useState(false)
  const [imageModal, setImageModal] = useState(null)
  const [email, setEmail] = useState('')

  const snapPoints = ['80%']
  const bottomSheetRef = useRef(BottomSheet)


  const [checked, setChecked] = useState(!false)
  const toggleCheckbox = () => setChecked(!checked)
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')
const [selectedImage, setSelectedImage] = useState(null)
const [isOpen, setIsOpen] = useState(true)





  const fetchUserData = async () => {
    try {
      const token = await AsyncStorage.getItem('token')
      const decodedToken = jwtDecode(token)
      console.log(decodedToken)
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
      //   console.log('screenHeight: ', screenHeight)

      // console.log("response: ", response)
      const dataFetch = await response.json()
      //   setLoading(false)
      console.log(dataFetch.length)
      console.log(dataFetch)

      // console.log("user------->", user.userEmail)
      setData(dataFetch)
    } catch (err) {
      console.log('Error al obtener datos del usuario', err)
    }
  }
  const toggleModal = (imageUrl) => {
    // setModalVisible(!isModalVisible)
    console.log(imageUrl)
    setImageModal(imageUrl)
    setModalVisible(true)
  }


  const toggleChecked = (id) => {
    const updatedItems = data.map((item) => {
      if (item.id === id) {
        return { ...item, isResolved: !item.isResolved }
      }
      return item
    })
    console.log(updatedItems)
    console.log(checked)
    setData(updatedItems)
    handleSnapPress(0);

  
  }
  const handleSnapPress = useCallback((index) => {
    bottomSheetRef.current?.snapToIndex(index)
    setIsOpen(true)
  }, [])

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

  return (
    <SafeAreaView
      style={
        styles.container
        // {

        // marginTop: StatusBar.currentHeight
        // }
      }
    >
      {email ? (
        <Text>Welcome panel admin, {email.email} </Text>
      ) : (
        <Text>Cargando...</Text>
      )}

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
                <Card.Title>{item.subject}</Card.Title>
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
                  User Name: {item.userEmail}
                </Text>
                <Text style={{ marginBottom: 10 }}>
                  Message: {item.message}
                </Text>
                <Text style={{ marginBottom: 10 }}>
                  Time: {item.timeSubject}
                </Text>
                <Card.Divider />
                {/* <Icon
                  style={{
                    flexDirection: 'row',
                  }}
                  name="delete"
                  color="black"
                  onPress={() => handleDelete(item.id)}
                /> */}
               
                  <CheckBox
                    checked={item.isResolved}
                    onPress={() => toggleChecked(item.id)}
                    // onPress={() => handlePress(item.id)}
                    iconType="material-community"
                    checkedIcon="checkbox-outline"
                    uncheckedIcon={'checkbox-blank-outline'}
                    size={22}
                    right={true}
                    value={checked}
                  onValueChange={setChecked}
                  />

                  {/* <Button
                    title="Update request"
                    onPress={() => handleSnapPress(0)}
                    buttonStyle={{
                      backgroundColor: 'rgba(90, 154, 230, 1)',
                      borderWidth: 2,
                      borderColor: 'white',
                      borderRadius: 30,
                    }}
                    containerStyle={{
                      width: 100,
                      marginHorizontal: 50,
                      marginVertical: 10,
                    }}
                    titleStyle={{ fontWeight: 'bold' }}
                  /> */}
                
              </Card>
            </View>
          )}
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
            <Button title="Send subjects" onPress />
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

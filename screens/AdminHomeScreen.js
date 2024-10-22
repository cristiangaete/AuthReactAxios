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
import { FAB, Icon, Card, CheckBox } from '@rneui/themed'

export default function AdminHomeScreen() {
  const screenHeight = Dimensions.get('window').height
  const [data, setData] = useState([])
  const [isModalVisible, setModalVisible] = useState(false)
  const [imageModal, setImageModal] = useState(null)
  const [email, setEmail] = useState('')



  const [checked, setChecked] = useState(false)
  const toggleCheckbox = () => setChecked(!checked)

  const fetchUserData = async () => {
    try {
      const token = await AsyncStorage.getItem('token')
      const decodedToken = jwtDecode(token)
      console.log(decodedToken)
        setEmail(decodedToken)

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
    setData(updatedItems)
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
    {email ? <Text>Welcome panel admin, {email.email} </Text> : <Text>Cargando...</Text>}

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
                  onPress={() => toggleModal(item.path)}
                >
                  <Card.Image
                    style={{ padding: 0 }}
                    source={{
                      uri: item.path,
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
                  iconType="material-community"
                  checkedIcon="checkbox-outline"
                  uncheckedIcon={'checkbox-blank-outline'}
                  size={22}
                  right={true}
                />
              </Card>
            </View>
          )}
        />
      </View>
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

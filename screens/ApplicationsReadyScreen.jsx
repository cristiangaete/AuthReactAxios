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
import { ScrollView } from 'react-native-gesture-handler'

export default function ApplicationsReadyScreen() {
  const [data, setData] = useState([])
  const [email, setEmail] = useState('')
  const screenHeight = Dimensions.get('window').height
  const [isModalVisible, setModalVisible] = useState(false)
  const [imageModal, setImageModal] = useState(null)

  const fetchUserData = async () => {
    try {
      const token = await AsyncStorage.getItem('token')
      //   console.log('token: ', token)
      const decodedToken = jwtDecode(token)
      //   console.log(decodedToken)
      setEmail(decodedToken)

      // const response = await fetch('http://localhost:3000/api/subjects', {
      const response = await fetch(
        'http://192.168.1.104:3000/api/subjects/ready',
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
      console.log(token)

      // console.log("response: ", response)
      const dataFetch = await response.json()
      // setLoading(false)
      console.log(dataFetch.length)
      console.log('readyScreen:', dataFetch)

      // console.log("user------->", user.userEmail)
      console.log(data)
      setData(dataFetch)
    } catch (err) {
      console.log('Error al obtener datos del usuario', err)
    }
  }
  useEffect(() => {
    fetchUserData()
  }, [])

  const toggleModal = (imageUrl) => {
    // setModalVisible(!isModalVisible)
    console.log(imageUrl)
    setImageModal(imageUrl)
    setModalVisible(true)
  }

  

  return (
    <>
      <SafeAreaView style={{ flex: 1, padding: 10 }}>
        <View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={true}
            directionalLockEnabled={true}
            alwaysBounceVertical={false}
          >
            <FlatList
              contentContainerStyle={{ alignSelf: 'flex-start' }}
              //  numColumns={Math.ceil(data.length / 2)}
              showsVerticalScrollIndicator={false}
              showsHorizontalScrollIndicator={false}
              // horizontal={true}
              // numColumns={2}
              // contentContainerStyle={{ minHeight: screenHeight }}
              data={data} // Pasamos los datos a la lista
              // set number of columns
              // columnWrapperStyle={{
              //   row: {
              //     flex: 1,
              //     justifyContent: 'space-around',
              //   },
              // }}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                //  {console.log("item: ____", item.photo)}
                // <View style={styles.item}>

                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-around',
                  }}
                >
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
                      Message: {item.message}
                    </Text>
                    <Text style={{ marginBottom: 10 }}>
                      Time: {item.timeSubject}
                    </Text>
                  </Card>

                  <Card style={{ flex: 1 }}>
                    <Card.Title>Title: {item.subject}</Card.Title>
                    <Card.Divider />
                    <TouchableOpacity
                      key={item.id}
                      onPress={() => toggleModal(item.imageAdmin)}
                    >
                      <Card.Image
                        style={{ padding: 0 }}
                        source={{
                          uri: item.imageAdmin,
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
                      Admin Name: {item.adminName}
                    </Text>
                    <Text style={{ marginBottom: 10 }}>
                      Message Admin: {item.messageAdmin}
                    </Text>
                    <Text style={{ marginBottom: 10 }}>
                      Time: {item.createdAtAdmin}
                    </Text>
                    <Text style={{ marginBottom: 10 }}>
                      Is Resolved: {String(item.isResolved)}
                    </Text>
                  </Card>
                </View>
              )}
            />
          </ScrollView>
        </View>
      </SafeAreaView>
    </>
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

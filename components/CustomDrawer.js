import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
} from '@react-navigation/drawer'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { Ionicons } from '@expo/vector-icons'

export default function CustomDrawer (props){
  const handleLogout = async () => {
    await AsyncStorage.removeItem('token')
    props.navigation.replace('Login')
  }
  return (
    <View style={{ flex: 1 }}>
      <DrawerContentScrollView {...props}>
        <DrawerItemList {...props} />
        {/* <View style={{ padding: 2, borderTopWidth: 1, borderTopColor: '#ccc' }}>
          <DrawerItem label="Logout" onPress={handleLogout} />
        </View> */}
      </DrawerContentScrollView>
      <View style={{ padding: 2, borderTopWidth: 1, borderTopColor: '#ccc' }}>
        <TouchableOpacity
          onPress={handleLogout}
          style={{ paddingVertical: 15 }}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Ionicons name="exit-outline" size={22} />
            <Text style={{ fontSize: 15, marginLeft: 5 }}> Logout</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  )
}



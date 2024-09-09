import React, { useEffect, useState } from 'react';
import { Button, Text, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

function HomeComponent({ navigation }) {

    const [user, setUser] = useState(null);

     
        const fetchUserData = async () => {
           
            
            try {
                const token = await AsyncStorage.getItem('token');
                console.log("token: ", token)
                const response = await fetch('http://localhost:8080/user/1', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                      },
                      mode: 'cors',
                    cache: 'default'
                });
                console.log(token)
                console.log("response: ", response)
                const data = await response.json();
                setUser(data);
   
            } catch (err) {
                console.log('Error al obtener datos del usuario', err);
                
            }
        }
        useEffect(() => {
        fetchUserData()
    }, [])


    const handleLogout = async () => {
        await AsyncStorage.removeItem('token');
        navigation.replace('Login');
    };

    return (
        <View>
            {user ? <Text>Bienvenido, {user.name}</Text> : <Text>Cargando...</Text>}
            <Button title=" Logout" onPress={handleLogout} />
        </View>
    )
}

export default HomeComponent
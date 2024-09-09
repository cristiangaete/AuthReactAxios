import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, TouchableOpacity, ScrollView, Text } from "react-native-web";
import AsyncStorage from '@react-native-async-storage/async-storage';

const RegisterComponent = ({ navigation }) => {

    const [firstname, setFirstName] = useState('');
    const [lastname, setLastName] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');

    

    const navigateToLogin = () => {
        navigation.navigate('Login');}

        const handleRegister = async () => {

            try {
                const response = await fetch('http://localhost:8080/auth/register', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({firstname, lastname, username, password}),
                });
                const data = await response.json();
                console.log("data: ", data)
    
                // const token = data.token;
                // console.log("token: ", token)
                // await AsyncStorage.setItem('token', token);
                navigation.replace('Login');
    
                // if (data !== 'Invalid credentials') {
                //     await AsyncStorage.setItem('token', token);
                //     console.log('vamos home')
                // }else{
                //     setMessage('Invalid credentials');
    
                // }
            } catch (error) {
                // setMessage('Invalid credentials');
                console.log(error)
            }
    
    
        }

    return (
        <ScrollView style={Styles.container}>
            <View style={Styles.input}>
                <TextInput placeholder="Insert Firstname" value={firstname} onChangeText={(value) => setFirstName(value)}></TextInput>
            </View>
            <View style={Styles.input}>
                <TextInput placeholder="Insert Lastname" value={lastname} onChangeText={(value) => setLastName(value)}></TextInput>
            </View>
            <View style={Styles.input}>
                <TextInput  placeholder="Insert name User" value={username} onChangeText={(value) => setUsername(value)}></TextInput>
            </View>
            <View style={Styles.input}>
                <TextInput placeholder="Password" value={password} onChangeText={(value) => setPassword(value)} secureTextEntry></TextInput>
            </View>

            <View>
                <Button title="Register" 
                onPress={handleRegister} 
                />
            </View>

            <TouchableOpacity 
            onPress={navigateToLogin} 
            style={Styles.loginLink}>
                <Text style={Styles.loginText}> ¿Already registered? </Text>
            </TouchableOpacity>
        </ScrollView>
    )
}

const Styles = StyleSheet.create({
    container:{
        flex: 1,
        padding: 20,
    },
    title: {
      fontSize: 24,
      marginBottom: 20,
      textAlign: 'center',
    },
    input: {
        flex:1,
        padding:0,
        marginBottom:15,
        borderBottomWidth:1
    },
    loginLink: {
      marginTop: 20,
      alignItems: 'center',
    },
    loginText: {
      color: 'blue',
    },
  });
  

export default RegisterComponent
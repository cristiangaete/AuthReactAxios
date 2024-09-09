import { View, TextInput, Button, ScrollView, StyleSheet} from "react-native-web";
import React, { useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LoginComponent = ({ navigation }) => {

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');


    const handleLogin = async () => {

        try {
            const response = await fetch('http://localhost:8080/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });
            const data = await response.json();
            // console.log("data: ", data)

            const token = data.token;
            // console.log("token: ", token)
            await AsyncStorage.setItem('token', token);
            navigation.replace('Home');

            // if (data !== 'Invalid credentials') {
            //     await AsyncStorage.setItem('token', token);
            //     console.log('vamos home')
            // }else{
            //     setMessage('Invalid credentials');

            // }
        } catch (error) {
            setMessage('Invalid credentials');
        }


    }


    return (
        <ScrollView style ={Styles.container}>
            <View style={Styles.inputGroup}>
                <TextInput displayType="text" placeholder="Name User" value={username} onChangeText={(value) => setUsername(value)}></TextInput>
            </View>
            <View style={Styles.inputGroup}>
                <TextInput placeholder="Password" value={password} onChangeText={(value) => setPassword(value) } secureTextEntry></TextInput>
            </View>

            <View>
                <Button title="Login" onPress={handleLogin} />
            </View>
        </ScrollView>
    )
}
const Styles = StyleSheet.create({
    container:{
        flex:1,
        padding:35
    },
    inputGroup:{
        flex:1,
        padding:0,
        marginBottom:15,
        borderBottomWidth:1

    }
})
export default LoginComponent;
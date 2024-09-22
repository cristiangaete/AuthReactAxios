import React from 'react'
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { useNavigation } from '@react-navigation/native'

const Header = ({ title, onPress }) => {
    const navigation = useNavigation();
    return (
        <View styles={styles.container}>
            <View>
                <TouchableOpacity 
                onPress={()=>navigation.toggleDrawer()}
                style={styles.iconContainer}>
                    <Image
                        ressizeMode='contain'
                        style={styles.icon}

                    />
                </TouchableOpacity>
            </View>
            <Text style={{
                marginLeft: 12,
                fontSize: 17,
                fontWeight: "bold",

            }}
            >{title}</Text>
            <TouchableOpacity style={styles.iconContainer}>
                    <Image
                        ressizeMode='contain'
                        style={styles.icon}

                    />
                </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginTop: 20,
        marginHorizontal: 16
    },
    iconContainer: {
        height: 45,
        width: 45,
        borderRadius: 999,
        alignItems: "center",
        justifyContent: "center"
    }
})

export default Header
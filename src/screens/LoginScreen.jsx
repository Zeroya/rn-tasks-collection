import React, { useState } from 'react'
import { View, TextInput, StyleSheet, TouchableOpacity, Text, Alert } from 'react-native'

const LoginScreen = ({ navigation }) => {
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');

    const onLoginPressed = () => {
      if (!name.trim() && !password.trim()) {
        Alert.alert("Please enter username and password") 
      } else if (!name.trim() && password.trim()) {
        Alert.alert("Please enter username ")
      } else if (name.trim() && !password.trim()) {
        Alert.alert("Please enter password ")
      } else {
        setName('');
        setPassword('');
        navigation.navigate('User');
      }
    }

  return (
    <View style={styles.login}>
      <TextInput placeholder={"Enter the user Name"} onChangeText={(name) => setName(name)} value={name} style={styles.login__input} />
      <TextInput placeholder={"Enter the password"} onChangeText={(password) => setPassword(password)} value={password} style={styles.login__input} />
      <View style={styles.button__container}>
        <TouchableOpacity style={styles.button__form} onPress={onLoginPressed}>
          <Text>Login</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

export default LoginScreen

const styles = StyleSheet.create({
  login: {
    width:"100%",
    height:"100%",
    justifyContent:"center",
    alignItems:"center",
    backgroundColor:"rgba(65, 237, 17, 0.08)",
  },
  login__input: {
    height:35,
    width:"70%",
    borderBottomWidth:2,
    borderBottomColor:"rgba(65, 237, 17, 1)",
    marginTop:"2%"
  },
  button__container:{
    marginTop:"10%",
    width:"80%",
  },
  button__form:{
    borderWidth:1,
    height:30,
    width:'60%',
    justifyContent:"center",
    alignItems:"center",
    borderRadius:40,
    backgroundColor:"rgba(65, 237, 17, 1)",
    alignSelf:"center"
  },
});
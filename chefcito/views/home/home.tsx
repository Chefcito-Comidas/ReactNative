import { StatusBar } from 'expo-status-bar';
import { Button, StyleSheet, Text, View } from 'react-native';
import ImageCarrousel from '../../components/ImageCarrousel/ImageCarrousel';
import { useEffect, useState } from 'react';
import { signOut } from '../../api/googleAuth';
import { GetUser } from '../../hooks/getUser.hook';
const mcdonaldsImage = require("../../assets/images/mcdonalds.jpg")
const burgerKing = require("../../assets/images/burgerKing.jpg")
const mostaza = require("../../assets/images/mostaza.jpg")
const wendys = require("../../assets/images/wendys.jpg")
export default function Home() {
  const {
    user
  } = GetUser()

  useEffect(()=>{
    console.log(user)
  },[user])

  const signout = async () =>{
    await signOut()
  }

  return (
    <View style={styles.container}>
      {/* <ImageCarrousel data={[
        {
          id:'1',
          image:mcdonaldsImage,
        },
        {
          id:'2',
          image:burgerKing,
        },
        {
          id:'3',
          image:mostaza,
        },
        {
          id:'4',
          image:wendys,
        },
        {
          id:'5',
          image:mcdonaldsImage,
        },
      ]}
      /> */}
      <Button onPress={()=>signout()} title='sing out'></Button>
      {user&&<Text>{user?.email}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

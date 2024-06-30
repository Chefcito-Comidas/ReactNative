import { StatusBar } from 'expo-status-bar';
import { Button, StyleSheet, Text, View } from 'react-native';
import { useAppSelector } from '../../redux/hooks/hook';
import { useEffect } from 'react';
import { signOut } from '../../api/googleAuth';
import { GetUser } from '../../hooks/getUser.hook';
export default function Profile() {
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

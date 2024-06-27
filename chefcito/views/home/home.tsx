import { StatusBar } from 'expo-status-bar';
import { Button, StyleSheet, Text, View } from 'react-native';
import ImageCarrousel from '../../components/ImageCarrousel/ImageCarrousel';
import { useAppDispatch, } from '../../redux/hooks/hook';
import { login } from '../../redux/reducer/user';
import { useEffect, useState } from 'react';
import auth from '@react-native-firebase/auth';
import { createUserPassword, loginUserPassword } from '../../api/googleAuth';
import { LogInForm } from '../../utils/components/login/login';
import { SignInForm } from '../../utils/components/signIn/signIn';
const mcdonaldsImage = require("../../assets/images/mcdonalds.jpg")
const burgerKing = require("../../assets/images/burgerKing.jpg")
const mostaza = require("../../assets/images/mostaza.jpg")
const wendys = require("../../assets/images/wendys.jpg")
export default function Home() {
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState(null);
  const dispatch = useAppDispatch()
  const onAuthStateChanged  = (user) => {
    setUser(user);
    if (initializing) {
      setInitializing(false);
      // dispatch(login(user))
    }
    console.log('user',user)
  }

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; // unsubscribe on unmount
  }, []);

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
      <LogInForm/>
      {/* <SignInForm/> */}
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

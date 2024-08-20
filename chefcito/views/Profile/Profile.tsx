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
            {user && (
              <View style={styles.card}>
                <Text style={styles.label}>Nombre:</Text>
                <Text style={styles.info}>Santiago Marinaro</Text>
                <Text style={styles.label}>Correo:</Text>
                <Text style={styles.info}>{user?.email}</Text>
              </View>
            )}
            <Button onPress={() => signout()} title="Sign Out" color="#ff6347" />
          </View>
        );
      };

      const styles = StyleSheet.create({
        container: {
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: '#f0f0f0',
          padding: 20,
        },
        card: {
          backgroundColor: '#fff',
          borderRadius: 10,
          padding: 20,
          width: '100%',
          maxWidth: 400,
          marginBottom: 20,
          shadowColor: '#000',
          shadowOpacity: 0.1,
          shadowOffset: { width: 0, height: 5 },
          shadowRadius: 10,
          elevation: 3,
        },
        label: {
          fontSize: 16,
          fontWeight: 'bold',
          color: '#333',
          marginBottom: 5,
        },
        info: {
          fontSize: 18,
          color: '#666',
          marginBottom: 15,
        },
        button: {
          borderRadius: 10,
          backgroundColor: '#ff6347',
          paddingVertical: 10,
          paddingHorizontal: 20,
        },
      });
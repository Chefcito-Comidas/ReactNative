import { StatusBar } from 'expo-status-bar';
import { Button, StyleSheet, Text, View } from 'react-native';
import { useAppSelector } from '../../redux/hooks/hook';
import { useEffect } from 'react';

export default function Restaurant({route, navigation}) {
    const {restaurant} = route.params;
    useEffect(()=>{
        console.log(restaurant)
    },[restaurant])

    return (
    <View style={styles.container}>
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

import { StatusBar } from 'expo-status-bar';
import { Button, StyleSheet, Text, View } from 'react-native';
import { useAppDispatch, useAppSelector } from '../../redux/hooks/hook';
import { decrement, increment } from '../../redux/reducer/counter';

export default function Home() {
  const dispatch = useAppDispatch()
  const count = useAppSelector((state) => state.counter.value)

  return (
    <View style={styles.container}>
      <Text>Home Screen</Text>
      <Text>{count}</Text>
      <Button title='increment' onPress={()=>{
        dispatch(increment())
      }} />
      <Button title='decrement' onPress={()=>{
        dispatch(decrement())
      }} />
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

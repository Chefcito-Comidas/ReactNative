import { StatusBar } from 'expo-status-bar';
import { Button, StyleSheet, Text, View } from 'react-native';
import { useAppSelector } from '../../redux/hooks/hook';

export default function Settings() {
  const count = useAppSelector((state) => state.counter.value)
  return (
    <View style={styles.container}>
      <Text>Details</Text>
      <Text>{count}</Text>
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

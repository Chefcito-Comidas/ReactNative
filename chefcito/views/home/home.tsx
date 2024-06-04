import { StatusBar } from 'expo-status-bar';
import { Button, StyleSheet, Text, View } from 'react-native';
import ImageCarrousel from '../../components/ImageCarrousel/ImageCarrousel';
const mcdonaldsImage = require("../../assets/images/mcdonalds.jpg")
const burgerKing = require("../../assets/images/burgerKing.jpg")
const mostaza = require("../../assets/images/mostaza.jpg")
const wendys = require("../../assets/images/wendys.jpg")

export default function Home() {

  return (
    <View style={styles.container}>
      <ImageCarrousel data={[
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
      />
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

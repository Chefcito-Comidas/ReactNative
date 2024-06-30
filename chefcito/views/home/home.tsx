import { StyleSheet, Text, View } from 'react-native';
import RestaurantList from '../../components/RestaurantList/RestaurantList';
import {WendysImage} from "../../models/Restauran.model"
const wendys = require("../../assets/images/wendys.jpg")

export default function Home({navigation}) {
  return (
    <View style={styles.container}>
      <RestaurantList data={[
        {
          id:'10',
          image:WendysImage,
          location:{
            lat:35,
            lon:35,
            street:"Unicenter"
          },
          name:'wendys'
        }
      ]} navigation={navigation} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding:8
  },
});

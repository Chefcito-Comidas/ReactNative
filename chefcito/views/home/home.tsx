import { StyleSheet, Text, View,Pressable } from 'react-native';
import RestaurantList from '../../components/RestaurantList/RestaurantList';
import {WendysImage} from "../../models/Restauran.model"
import Ionicons from '@expo/vector-icons/Ionicons';
const wendys = require("../../assets/images/wendys.jpg")

export default function Home({navigation}) {
  return (
    <View style={styles.container}>
      <Pressable style={styles.searchBar}>
        <Ionicons name={'search'} size={16}  />
        <Text style={styles.searchText}>Buscar</Text>
      </Pressable>
      <RestaurantList data={[
        {
          id:'10',
          image:WendysImage,
          location:"https://maps.app.goo.gl/c9524XNaxyTpeoXY8",
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
  searchBar:{
    borderColor:'gray',
    borderWidth:2,
    borderRadius:8,
    width:'100%',
    paddingStart:8,
    display:'flex',
    flexDirection:'row',
    alignItems:'center'
  },
  searchText:{
    fontSize:18,
    marginStart:4
  }
});

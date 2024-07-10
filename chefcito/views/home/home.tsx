import { StyleSheet, Text, View,Pressable } from 'react-native';
import RestaurantList from '../../components/RestaurantList/RestaurantList';
import {Restaurant, WendysImage} from "../../models/Restauran.model"
import Ionicons from '@expo/vector-icons/Ionicons';
import { useEffect, useState } from 'react';
import {getRestaurant} from "../../api/Restaurant.API"
import { GetUser } from '../../hooks/getUser.hook';
import Loader from '../../components/Loader/Loader';

export default function Home({navigation}) {

  const [restaurants,setRestaurants] = useState<Restaurant[]>([])
  const {user,initializing} = GetUser()
  const [loading,setLoading] = useState(false)
  const getRestaurantData = async () => {
    try {
      setLoading(true)
      const restaurantList = await getRestaurant(user)
      setLoading(false)
      setRestaurants(restaurantList)
    } catch {
      setLoading(false)
    }
    
  }
  useEffect(()=>{
    if(!initializing) getRestaurantData()
  },[user,initializing])
  return (
    <View style={styles.container}>
      {loading&&<Loader />}
      <Pressable style={styles.searchBar}>
        <Ionicons name={'search'} size={16}  />
        <Text style={styles.searchText}>Buscar</Text>
      </Pressable>
      {restaurants.length>0&&<RestaurantList data={restaurants} navigation={navigation} />}
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

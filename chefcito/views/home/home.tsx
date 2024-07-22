import { StyleSheet, Text, View,Pressable } from 'react-native';
import RestaurantList from '../../components/RestaurantList/RestaurantList';
import {Restaurant, WendysImage} from "../../models/Restauran.model"
import Ionicons from '@expo/vector-icons/Ionicons';
import { useEffect, useState } from 'react';
import {getRestaurant,getRestaurantById} from "../../api/Restaurant.API"
import {GetReservations,GetReservationProps} from "../../api/bookings"
import { GetUser } from '../../hooks/getUser.hook';
import Loader from '../../components/Loader/Loader';
import { Reservation } from '../../models/Reservations.model';
import moment from 'moment';
import ReservetionHorizontalList from '../../components/ReservationsHorizontalList/ReservetionHorizontalList';

export default function Home({navigation}) {

  const [restaurants,setRestaurants] = useState<Restaurant[]>([])
  const [reservations,setReservations] = useState<Reservation[]>([])
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

  const getReservation = async () =>{
    try {
      const props = new GetReservationProps()
      props.start = 0;
      props.limit = 20;
      props.status = "Accepted"
      // props.from_time = moment().toISOString()
      // props.to_time = moment().add(1,"months").toISOString()
      const reservation = await GetReservations(props,user)
      for (const item of reservation) {
        const rest = await getRestaurantById(user,item.venue)
        item.restaurant = rest[0];
        item.restaurant.image = WendysImage
      }
      // console.log('reservation',reservation)
      setReservations(reservation)
    } catch (err) {
      console.log("get reservation error",err)
    }
  }

  useEffect(()=>{
    if(!initializing) {
      getRestaurantData()
      getReservation()
    }
  },[user,initializing])

  return (
    <View style={styles.container}>
      {loading&&<Loader />}
      <Pressable style={styles.searchBar}>
        <Ionicons name={'search'} size={16}  />
        <Text style={styles.searchText}>Buscar</Text>
      </Pressable>
      {restaurants.length>0&&<RestaurantList data={restaurants} navigation={navigation} />}
      {reservations.length>0&&
      <View>
        <Text style={styles.ReservationTitle}>Reservas</Text>
        <ReservetionHorizontalList data={reservations} />
      </View>
      }
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding:8
  },
  ReservationTitle:{
    marginTop:8,
    fontSize:18
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

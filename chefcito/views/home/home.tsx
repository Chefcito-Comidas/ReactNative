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
import { COLORS } from '../../utils/constants';

export default function Home({navigation}) {

  const [restaurants,setRestaurants] = useState<Restaurant[]>([
    // {
    //   id:'',
    //   name:'Wendys',
    //   location:'asdfaadfsf',
    //   logo:`data:image/jpg;base64,${WendysImage}`,
    //   pictures:[],
    //   slots:[],
    //   capacity:100,
    //   status:{status:'Abierto'},
    // }
  ])
  const [reservations,setReservations] = useState<Reservation[]>([
    // {
    //   id:'',
    //   user:'Santiago',
    //   venue:'Wendys',
    //   time:'',
    //   people:10,
    //   status:{status:'Aceptado'},
    //   restaurant:{
    //     id:'',
    //     name:'Wendys',
    //     location:'asdfaadfsf',
    //     logo:`data:image/jpg;base64,${WendysImage}`,
    //     pictures:[],
    //     slots:[],
    //     capacity:100,
    //     status:{status:'Accepted'},
    //   },
    // }
  ])
  const {user,initializing} = GetUser()
  const [loading,setLoading] = useState(false)

  useEffect(()=>{
    const unsubscribe = navigation.addListener('focus', (e) => {
      if(!initializing) {
        getRestaurantData()
        getReservation()
      }
    });
    return unsubscribe
  },[])

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
      const reservation = await GetReservations(props,user)
      for (const item of reservation.result) {
        const rest = await getRestaurantById(user,item.venue)
        item.restaurant = rest[0];
      }
      setReservations(reservation.result)
    } catch (err) {
      console.log("get reservation error",err)
    }
  }

  const goToReservationData = (reservation:Reservation) =>{
    navigation.navigate('HomeReservation', {
      reservation:reservation
    });
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
        <Ionicons name={'search'} size={16} style={{color:COLORS.white}}  />
        <Text style={styles.searchText}>Buscar</Text>
      </Pressable>
      {restaurants.length>0&&<RestaurantList data={restaurants} navigation={navigation} />}
      {reservations.length>0&&
      <View>
        <Text style={styles.ReservationTitle}>Reservas</Text>
        <ReservetionHorizontalList data={reservations} goToReservationData={goToReservationData} />
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
    borderColor:COLORS.silver,
    backgroundColor:COLORS.blue,
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
    marginStart:4,
    color:COLORS.white
  }
});

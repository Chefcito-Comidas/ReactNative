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
    //   logo:"gs://chefcito-comidas.appspot.com/santiago.marinaro+1@gmail.com/1723323114751",
    //   pictures:[
    //     "gs://chefcito-comidas.appspot.com/santiago.marinaro+1@gmail.com/secondaryImage/0/1723323114752",
    //     "gs://chefcito-comidas.appspot.com/santiago.marinaro+1@gmail.com/secondaryImage/1/1723323114752"
    //   ],
    //   slots:[
    //     "2024-08-15T18:00:00.014Z",
    //     "2024-08-15T18:30:00.014Z",
    //     "2024-08-15T19:00:00.014Z",
    //     "2024-08-15T19:30:00.014Z",
    //     "2024-08-15T20:00:00.014Z",
    //     "2024-08-15T20:30:00.014Z",
    //     "2024-08-15T21:00:00.014Z",
    //     "2024-08-15T21:30:00.014Z",
    //     "2024-08-15T22:00:00.014Z",
    //     "2024-08-15T22:30:00.014Z"
    //   ],
    //   capacity:100,
    //   status:{status:'Abierto'},
    //   vacations:[],
    //   characteristics:["Hamburguesas", "Minutas"],
    //   reservationLeadTime:10
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
      getRestaurantData()
      getReservation()
    });
    return unsubscribe
  },[])

  const getRestaurantData = async () => {
    if(initializing) {
      setTimeout(() => {
        getRestaurantData()
      }, 100);
    } else {
      try {
        setLoading(true)
        const restaurantList = await getRestaurant(user)
        console.log("restaurantList",restaurantList)
        setLoading(false)
        setRestaurants(restaurantList.result)
      } catch {
        setLoading(false)
      }
    }
    
  }

  const getReservation = async () =>{
    if(initializing) {
      setTimeout(() => {
        getRestaurantData()
      }, 100);
    } else {
      try {
        const props = new GetReservationProps()
        props.start = 0;
        props.limit = 20;
        props.status = "Accepted"
        const reservation = await GetReservations(props,user)
        for (const item of reservation.result) {
          const rest = await getRestaurantById(user,item.venue)
          item.restaurant = rest.result[0];
        }
        setReservations(reservation.result)
      } catch (err) {
        console.log("get reservation error",err)
      }
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
        <Ionicons name={'search'} size={16} style={{color:COLORS.gray}}  />
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
    backgroundColor: COLORS.secondaryBlue,
    padding: 16,
  },
  ReservationTitle: {
    marginTop: 16,
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.white,
  },
  searchBar: {
    borderColor: '#ddd',
    backgroundColor: '#f0f0f0',
    borderWidth: 1,
    borderRadius: 10,
    width: '100%',
    paddingVertical: 8,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 5 },
    shadowRadius: 10,
    elevation: 3,
  },
  searchText: {
    fontSize: 18,
    marginStart: 8,
    color: COLORS.darkGray,
    flex: 1,
  },
});


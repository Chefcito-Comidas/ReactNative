import { GetReservationProps, GetReservations } from 'api/bookings';
import { getRestaurantById } from '../../api/Restaurant.API';
import { GetUser } from '../../hooks/getUser.hook';
import { WendysImage } from '../../models/Restauran.model';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, View,Pressable } from 'react-native';
import { Reservation } from '../../models/Reservations.model';
import Loader from '../../components/Loader/Loader';
import Ionicons from '@expo/vector-icons/Ionicons';
import ReservationHorizontalList from '../../components/ReservationHorizontalList/ReservationHorizontalList';

export default function History({navigation}) {
    const {user,initializing} = GetUser()
    const [reservations,setReservations] = useState<Reservation[]>([])
    const [loading,setLoading] = useState(false)

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
            // item.restaurant.logo = WendysImage
          }
          // console.log('reservation',reservation)
          setReservations(reservation)
        } catch (err) {
          console.log("get reservation error",err)
        }
    }
    
    useEffect(()=>{
    if(!initializing) {
        getReservation()
    }
    },[user,initializing])

    return(
        <View style={styles.container}>
            {loading&&<Loader />}
            <Pressable style={styles.searchBar}>
                <Ionicons name={'search'} size={16}  />
                <Text style={styles.searchText}>Buscar</Text>
            </Pressable>
            {reservations.length>0&&<ReservationHorizontalList data={reservations}/>}
        </View>
    )
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
    },
  });
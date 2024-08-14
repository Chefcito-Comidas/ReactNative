import { GetReservationProps, GetReservations } from '../../api/bookings';
import { getRestaurantById } from '../../api/Restaurant.API';
import { GetUser } from '../../hooks/getUser.hook';
import { WendysImage } from '../../models/Restauran.model';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, View,Pressable } from 'react-native';
import { Reservation } from '../../models/Reservations.model';
import Loader from '../../components/Loader/Loader';
import Ionicons from '@expo/vector-icons/Ionicons';
import ReservationVerticalList from '../../components/ReservationVerticalList/ReservationVerticalList';
import { COLORS } from '../../utils/constants';

export default function History({navigation}) {
    const {user,initializing} = GetUser()
    const [reservations,setReservations] = useState<Reservation[]>([])
    const [loading,setLoading] = useState(false)

    const getReservation = async () =>{
        try {
          const props = new GetReservationProps()
          props.start = 0;
          props.limit = 20;
          const reservation = await GetReservations(props,user)
          for (const item of reservation) {
            const rest = await getRestaurantById(user,item.venue)
            item.restaurant = rest[0];
          }
          setReservations(reservation)
        } catch (err) {
          console.log("get reservation error",err)
        }
    }

    const goToReservationData = (reservation:Reservation) =>{
      navigation.navigate('HistoryReservation', {
        reservation:reservation
      });
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
                <Ionicons name={'search'} size={16} color={COLORS.white}  />
                <Text style={styles.searchText}>Buscar</Text>
            </Pressable>
            {reservations.length>0&&<ReservationVerticalList data={reservations} goToReservationData={goToReservationData} />}
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
      color:COLORS.white,
    },
  });
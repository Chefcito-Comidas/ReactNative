import { SafeAreaView, View, Image,Pressable, StyleSheet,Text,ScrollView,Button,Platform, Linking } from 'react-native';
import { useState } from 'react';
import {GetUser} from "../../hooks/getUser.hook";
import Loader from '../../components/Loader/Loader';
import { Reservation } from '../../models/Reservations.model';
import {CancelBooking} from "../../api/bookings";
import { ConfirmationModal } from '../../components/ConfirmationModal/ComfirmationModal';
import { COLORS } from '../../utils/constants';
type routeParam = {
    reservation:Reservation
}
export default function ReservationData({route,navigation}) {
    const [show,setShow] = useState(false)

    const {
        user,
    } = GetUser()
    const {reservation}:routeParam = route.params;
    const [loading,setLoading] = useState(false)

    const openMaps = () => {
        const fullAddress = reservation.restaurant.location.split("@").length>0?reservation.restaurant.location.split("@")[1]:reservation.restaurant.location
        const url = Platform.select({
          ios: `maps:0,0?q=${fullAddress}`,
          android: `geo:0,0?q=${fullAddress}`,
        })
        
        Linking.openURL(url)
    }

    const onAccept = async () =>{
        setShow(false)
        try {
            setLoading(true)
            const result = await CancelBooking(reservation,user)
            setLoading(false)
        } catch (err) {
            console.log("Error al cancelar")
            setLoading(false)
        }
    }

    const onCancel = () =>{
        setShow(false)
    }


    return (
        <SafeAreaView style={styles.container}>
            <ScrollView centerContent={true}>
                {loading&&<Loader />}
                <Image source={{uri:reservation.restaurant.logo}} style={styles.MainImage}/>
                <View style={styles.InfoContainer}>
                    <Text style={styles.Name}>{reservation.restaurant.name}</Text>
                </View>
                <View style={styles.ReservationInfoContainer}>
                  <Text style={styles.displayText}>Personas: {reservation.people}</Text>
                  <Text style={styles.displayText}>Hora: {reservation.time}</Text>
                </View>
                <View>
                    <Pressable onPress={openMaps} style={styles.mapButton}><Text style={styles.Location}>Abrir ubicacion en el mapa</Text></Pressable>
                </View>
                
                {(reservation.status.status==="Uncomfirmed"||reservation.status.status==="Accepted")&&<View style={styles.ButtonContainer}>
                    <Pressable style={styles.reservationButton} 
                    onPress={()=>{
                      navigation.navigate('EditReservation',{
                        screen: 'EditReservationPeople',
                        params: {
                          restaurant:reservation.restaurant,
                          id:reservation.id,
                          date:reservation.time,
                          home:route.name==='HomeReservation'
                        },
                      })
                    }}>
                      <Text style={styles.ButtonText}>Editar Reserva</Text>
                    </Pressable>

                </View>}
                {(reservation.status.status==="Uncomfirmed"||reservation.status.status==="Accepted")&&<View style={styles.ButtonContainer}>
                    <Pressable style={styles.reservationButton} onPress={()=>setShow(true)}><Text style={styles.ButtonText}>Cancelar Reserva</Text></Pressable>
                </View>}
                <ConfirmationModal 
                show={show}
                title='Cancelar Reserva'
                subtitle='Va a cancelar la reserva, ¿Esta seguro?'
                onAccept={onAccept}
                onCancel={onCancel}
                />
            </ScrollView>
        </SafeAreaView>
    );

}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: COLORS.secondaryBlue,
      paddingHorizontal:8
    },
    MainImage: {
      width:'100%',
      height:150,
    },
    Name:{
      fontSize:25,
      fontWeight:'700',
      textAlign:'center',
      color:COLORS.white
    },
    Location:{
      textAlign:'center',
      color:COLORS.white,
    },
    InfoContainer:{
    },
    ReservationInfoContainer:{
    },
    Image:{
      height:300,
    },
    ButtonContainer:{
      marginTop:12
    },
    mapButton:{
      borderColor:COLORS.silver,
      color:COLORS.white,
      backgroundColor:COLORS.blue,
      borderWidth:2,
      borderRadius:8,
      paddingStart:8,
      textAlign:'center'
    },
    imageCarrousel:{
      height:150,
      marginVertical:8
    },
    reservationButton:{
      backgroundColor:COLORS.blue,
      width:200,
      alignSelf:'center',
      padding:4,
      borderRadius:15,
      borderColor:COLORS.silver,
      borderWidth:2,
    },
    ButtonText:{
      textAlign:'center',
      color:COLORS.white,
      fontSize:18
    },
    displayText:{
      marginBottom:4,
      textAlign:'center',
      color:COLORS.white,
      fontSize:16,
      fontWeight:'400'
    }
  });
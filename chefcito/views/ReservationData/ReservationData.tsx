import { SafeAreaView, View, Image,Pressable, StyleSheet,Text,ScrollView,Button,Platform, Linking } from 'react-native';
import { useState } from 'react';
import {GetUser} from "../../hooks/getUser.hook";
import Loader from '../../components/Loader/Loader';
import moment from 'moment';
import { Reservation } from '../../models/Reservations.model';
import {CancelBooking} from "../../api/bookings";
import { ConfirmationModal } from '../../components/ConfirmationModal/ComfirmationModal';
import EditBooking from '../../components/EditBooking/EditBooking';
import { NewBookingModel } from '../../models/NewBooking.model';
import {EditBooking as EditBookingPut} from "../../api/bookings"
type routeParam = {
    reservation:Reservation
}
export default function ReservationData({route,navigation}) {
    const [show,setShow] = useState(false)

    const {
        user,
    } = GetUser()
    const {reservation}:routeParam = route.params;
    const [showNewBooking,setShowNewBooking] = useState(false)
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

    const cancel = () =>{
        setShowNewBooking(false)
    }

    const accept = async (value:NewBookingModel) =>{
        setShowNewBooking(false)
        const data = {...reservation}
        data.time = value.time
        data.people = value.people
        try {
            setLoading(true)
            const result = await EditBookingPut(data,user)
            setLoading(false)
            if(result){
            console.log('reserva editada',result)
            }
        } catch(err) {
            setLoading(false)
            console.log("error",err)
        } 
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
                        <Text>Personas: {reservation.people}</Text>
                        <Text>Hora: {reservation.time}</Text>
                </View>
                <View>
                    <Pressable onPress={openMaps} style={styles.mapButton}><Text style={styles.Location}>Abrir ubicacion en el mapa</Text></Pressable>
                </View>
                
                {(reservation.status.status==="Uncomfirmed"||reservation.status.status==="Accepted")&&<View style={styles.ButtonContainer}>
                    <Button title='Editar Reserva' onPress={()=>setShowNewBooking(true)} />
                </View>}
                {(reservation.status.status==="Uncomfirmed"||reservation.status.status==="Accepted")&&<View style={styles.ButtonContainer}>
                    <Button title='Cancelar Reserva' onPress={()=>setShowNewBooking(true)} />
                </View>}
                <ConfirmationModal 
                show={show}
                title='Cancelar Reserva'
                subtitle='Va a cancelar la reserva, ¿Esta seguro?'
                onAccept={onAccept}
                onCancel={onCancel}
                />
              <EditBooking show={showNewBooking} booking={reservation} cancel={cancel} accept={accept} slots={reservation.restaurant.slots.map((item)=>moment(item).format("HH:mm"))} />
            </ScrollView>
        </SafeAreaView>
    );

}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      paddingHorizontal:8
    },
    MainImage: {
      width:'100%',
      height:150,
    },
    Name:{
      fontSize:25,
      fontWeight:'700',
      textAlign:'center'
    },
    Location:{
      textAlign:'center'
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
      borderRadius:8,
      borderWidth:2,
      borderColor:'gray',
      marginTop:8
    },
    imageCarrousel:{
      height:150,
      marginVertical:8
    }
  });
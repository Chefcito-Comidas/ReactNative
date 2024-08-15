import { Restaurant } from "../../../models/Restauran.model";
import { useState } from "react";
import { StyleSheet, View,Pressable, Text } from 'react-native';
import { COLORS } from "../../../utils/constants";
import moment from "moment";
import { NewBookingPost } from "../../../models/NewBooking.model";
import { PostBooking,EditBooking } from "../../../api/bookings";
import { GetUser } from "../../../hooks/getUser.hook";
import { Reservation } from "models/Reservations.model";
import Loader from "../../../components/Loader/Loader";

type routeParam = {
    restaurant:Restaurant;
    people:string;
    date:string;
    time:string;
    id:string;
}

export default function ReservationConfirmation({route,navigation}) {
    const [loading,setLoading] = useState(false)
    const {
        user,
    } = GetUser()
    const {restaurant,people,date,time,id}:routeParam = route.params;

    const cancel = () => {
        navigation.goBack();
    }

    const onAccept = async () => {
        const dateData = moment(date)
        const hour = time.split(':')[0]
        const minute = time.split(':')[1]
        dateData.set('hour', parseInt(hour)); 
        dateData.set('minute', parseInt(minute)); 
        dateData.set('second', 0);
        
        if(route.name==="NewReservationConfirmation") {
            const booking:NewBookingPost ={
                people:parseInt(people),
                venue:restaurant.id,
                time:dateData.toISOString(false)
            }
            try {
                setLoading(true)
                const result = await PostBooking(booking,user)
                setLoading(false)
                if(result){
                    console.log('reserva creada',result)
                }
                navigation.navigate('Restaurante', {
                    restaurant,
                })
            } catch(err) {
                setLoading(false)
                console.log("error",err)
            }
            
        } else {
            const booking:Reservation = {
                id:id,
                people:parseInt(people),
                venue:restaurant.id,
                time:dateData.toISOString(false)
            }
            try {
                setLoading(true)
                const result = await EditBooking(booking,user)
                setLoading(false)
                if(result){
                    console.log('reserva editada',result)
                }
                // navigation.navigate('Restaurante', {
                //     restaurant,
                // })
            } catch(err) {
                setLoading(false)
                console.log("error",err)
            } 
        }
    }
    return (
        <View style={styles.container}>
            {loading&&<Loader />}
            <Text style={styles.title}>Son estos Datos Correctos</Text>
            <View style={styles.display}>
                <Text style={styles.infoText}>Lugar: {restaurant?.name}</Text>
                <Text style={styles.infoText}>Personas: {people}</Text>
                <Text style={styles.infoText}>Fecha: {moment(date).format('DD/MM/yyyy')}</Text>
                <Text style={styles.infoText}>Horario: {time}</Text>
            </View>
            <View style={styles.buttonContainer}>
                <Pressable
                style={[styles.button, styles.buttonClose]}
                onPress={() => cancel()}>
                    <Text style={styles.textStyle}>Atras</Text>
                </Pressable>
                <Pressable
                disabled={!user}
                style={[styles.button,styles.buttonAccpet]}
                onPress={() => onAccept()}>
                    <Text style={styles.textStyle}>Confirmar</Text>
                </Pressable>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      padding:8,
    },
    display:{
        marginVertical:'auto',
        marginHorizontal:'auto'
    },
    title:{
        fontSize:32,
        fontWeight:'600',
        color:COLORS.blue,
        textAlign:'center',
        marginBottom:8,
    },
    infoText:{
        color:COLORS.blue,
        fontSize:18,
        fontWeight:'500'
    },
    buttonContainer:{
        flex:1,
        flexDirection:'row',
        maxHeight:50,
        justifyContent:'center',
        marginTop:'auto'
    },
    button: {
        borderRadius: 15,
        padding: 10,
        elevation: 2,
        marginBottom:8,
        backgroundColor: '#2196F3',
        width:100
    },
    buttonClose: {
        backgroundColor: 'red',
    },
    buttonAccpet: {
        marginLeft:4,
        backgroundColor:'green'
    },
    buttonAccpetDisabled:{
        backgroundColor:'lightgreen',
        marginLeft:4,
    },
    textStyle: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
        fontSize:16,
    },
});
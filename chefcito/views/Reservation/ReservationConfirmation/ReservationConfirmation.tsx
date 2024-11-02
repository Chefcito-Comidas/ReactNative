import { Restaurant } from "../../../models/Restauran.model";
import { useEffect, useState } from "react";
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
    id?:string;
    home?:boolean;
}

export default function ReservationConfirmation({route,navigation}) {
    const [loading,setLoading] = useState(false)
    const {
        user,
    } = GetUser()
    const {restaurant,people,date,time,id,home}:routeParam = route.params;

    const cancel = () => {
        navigation.goBack();
    }

    useEffect(()=>{
        console.log(route)
    },[])

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
                time:dateData.toISOString()
            }
            console.log('Dato de nueva reserva',booking)
            try {
                setLoading(true)
                const result = await PostBooking(booking,user)
                setLoading(false)
                if(result){
                    alert('Reserva creada con exito!')
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
                time:dateData.toISOString()
            }
            try {
                setLoading(true)
                const result = await EditBooking(booking,user)
                setLoading(false)
                if(result){
                    console.log('reserva editada',result)
                }
                if(home) {
                    navigation.navigate('Home', {
                    })
                } else {
                    navigation.navigate('History', {
                    })
                }
                
            } catch(err) {
                setLoading(false)
                console.log("error",err)
            } 
        }
    }
    return (
        <View style={styles.container}>
            {loading&&<Loader />}
            <Text style={styles.title}>Confirme los datos</Text>
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
                    <Text style={styles.cancelButtonText}>Atras</Text>
                </Pressable>
                <Pressable
                disabled={!user}
                style={[styles.button,styles.buttonAccept]}
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
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: COLORS.white,
        padding: 20,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: COLORS.black,
        textAlign: 'center',
        marginBottom: 20,
    },
    display: {
        backgroundColor: COLORS.blancopaco,
        borderRadius: 10,
        padding: 20,
        width: '100%',
        maxWidth: 400,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 5 },
        shadowRadius: 10,
        elevation: 3,
    },
    infoText: {
        fontSize: 18,
        color:COLORS.dataExtra,
        marginBottom: 15,
    },
    buttonContainer: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginHorizontal: 20,
    },
    button: {
            borderRadius: 30,
            padding: 16,
            width: '45%',
            alignItems: 'center',
            elevation: 5,
        },
        buttonClose: {
            backgroundColor: COLORS.decline,
        },
        buttonAccept: {
            backgroundColor: COLORS.accept,
        },
        textStyle: {
            color: COLORS.white,
            fontWeight: 'bold',
            fontSize: 16,
        },
        cancelButtonText: {
            color: COLORS.white,
            fontWeight: 'bold',
            fontSize: 16,
        },
});
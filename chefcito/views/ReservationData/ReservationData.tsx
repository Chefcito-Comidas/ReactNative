import { SafeAreaView, View, Image,Pressable, StyleSheet,Text,ScrollView,Button,Platform, Linking } from 'react-native';
import { useState } from 'react';
import {GetUser} from "../../hooks/getUser.hook";
import Loader from '../../components/Loader/Loader';
import { Reservation } from '../../models/Reservations.model';
import {CancelBooking} from "../../api/bookings";
import { ConfirmationModal } from '../../components/ConfirmationModal/ComfirmationModal';
import { COLORS } from '../../utils/constants';
import BarCodeScannerComponent from '../../components/BarCodeScanner/BarCodeScanner';
import moment from 'moment';

type routeParam = {
    reservation:Reservation
}
export default function ReservationData({route,navigation}) {
    const [show,setShow] = useState(false)
    const [showQrScanner,setShowQrScanner] = useState(false)

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

    const confirmReservation = (id:string) => {
        setShowQrScanner(false)
        const timeDiff = moment().diff(moment(reservation.time),'hours')
        if(id===reservation.venue&&timeDiff<12){
            console.log("confirmar reserva")
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
                <View style={styles.display}>
                                <Text style={styles.infoText}>Lugar: {reservation.restaurant.name}</Text>
                                <Text style={styles.infoText}>Personas: {reservation.people}</Text>
                                <Text style={styles.infoText}>Horario: {reservation.time}</Text>
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
                {(reservation.status.status==="Uncomfirmed"||reservation.status.status==="Accepted")&&<View style={styles.ButtonContainer}>
                    <Pressable style={styles.reservationButton} onPress={()=>setShowQrScanner(true)}><Text style={styles.ButtonText}>Confirmar Reserva</Text></Pressable>
                </View>}

                <BarCodeScannerComponent cancel={()=>{setShowQrScanner(false)}} show={showQrScanner} accept={confirmReservation} />
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
        paddingHorizontal: 16,
        paddingVertical: 24,
    },
    MainImage: {
        width: '100%',
        height: 200,
        borderRadius: 12,
        marginBottom: 20,
    },
    Name: {
        fontSize: 28,
        fontWeight: 'bold',
        textAlign: 'center',
        color: COLORS.white,
        marginBottom: 12,
    },
    Location: {
        textAlign: 'center',
        color: COLORS.white,
        fontSize: 16,
        marginVertical: 12,
    },
    InfoContainer: {
        marginBottom: 20,
        paddingHorizontal: 16,
    },
    display: {
            backgroundColor: COLORS.pastelblanco,
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
    ButtonContainer: {
        marginTop: 20,
        alignItems: 'center',
    },
    mapButton: {
        borderColor: COLORS.silver,
        backgroundColor: COLORS.blue,
        borderWidth: 2,
        borderRadius: 8,
        paddingVertical: 12,
        paddingHorizontal: 16,
        textAlign: 'center',
        marginVertical: 12,
    },
    reservationButton: {
        backgroundColor: COLORS.blue,
        paddingVertical: 14,
        paddingHorizontal: 20,
        borderRadius: 12,
        borderColor: COLORS.silver,
        borderWidth: 2,
        marginBottom: 12,
        width: '80%',
        alignItems: 'center',
    },
    ButtonText: {
        textAlign: 'center',
        color: COLORS.white,
        fontSize: 18,
        fontWeight: '600',
    },
    displayText: {
        marginBottom: 8,
        textAlign: 'center',
        color: COLORS.white,
        fontSize: 16,
        fontWeight: '500',
    },
});
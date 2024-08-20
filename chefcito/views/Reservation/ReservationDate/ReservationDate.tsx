import { Restaurant } from "../../../models/Restauran.model";
import { useState } from "react";
import { StyleSheet, View,Pressable, Text } from 'react-native';
import { COLORS } from "../../../utils/constants";
import moment from 'moment';
import CalendarPicker from "react-native-calendar-picker";
type routeParam = {
    restaurant:Restaurant;
    people:string;
}
export default function ReservationDate({route,navigation}) {
    const [date,setDate] = useState('')
    const {restaurant,people}:routeParam = route.params;

    const cancel = () => {
        navigation.goBack();
    }

    const onAccept = () => {
        navigation.navigate('NewReservationTime', {
            people:people,
            restaurant,
            date
        })
    }
    const IsValid = () => {
        return date !==''
    }
    const onChange = (data) => {
        setDate(data)
    };
    return (
        <View style={styles.container}>
            <Text style={styles.title}>¿Que día Vienen a {restaurant?.name}?</Text>
            <View>
                <CalendarPicker 
                onDateChange={onChange} 
                minDate={moment().add(restaurant.reservationLeadTime,'days').toDate()}
                maxDate={moment().add(restaurant.reservationLeadTime,'days').add(1,'month').toDate()}
                months={[
                    "Enero",
                    "Febrero",
                    "Marzo",
                    "Abril",
                    "Mayo",
                    "Junio",
                    "Julio",
                    "Agosto",
                    "Septiembre",
                    "Octubre",
                    "Noviembre",
                    "Diciembre"
                ]}
                previousTitle="Anterior"
                nextTitle="Próximo"
                previousTitleStyle={{color:COLORS.white}}
                nextTitleStyle={{color:COLORS.white}}
                textStyle={{color:COLORS.white}}
                />
            </View>
            <View style={styles.buttonContainer}>
                <Pressable
                style={[styles.button, styles.buttonClose]}
                onPress={() => cancel()}>
                    <Text style={styles.cancelButtonText}>Atras</Text>
                </Pressable>
                <Pressable
                disabled={!IsValid()}
                style={[styles.button,!IsValid()?styles.buttonAccpetDisabled:styles.buttonAccpet]}
                onPress={() => onAccept()}>
                    <Text style={styles.textStyle}>Siguiente</Text>
                </Pressable>
            </View>
        </View>
    )
}


const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: COLORS.secondaryBlue,
      padding:8
    },
    input: {
        height: 40,
        margin: 12,
        borderWidth: 2,
        padding: 10,
        borderRadius:10,
        borderColor:COLORS.white,
        textAlign:'center',
        color:COLORS.white,
        fontSize:16,
        fontWeight:'500',
        marginVertical:'auto'
    },
    title:{
        fontSize:32,
        fontWeight:'600',
        color:COLORS.white,
        textAlign:'center',
        marginBottom:8,
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
        backgroundColor:COLORS.white,
        borderColor:COLORS.blue,
        borderWidth:2,
    },
    buttonAccpet: {
        marginLeft:4,
        backgroundColor:COLORS.blue,
        borderColor:COLORS.white,
        borderWidth:2,
    },
    buttonAccpetDisabled:{
        backgroundColor:COLORS.secondaryBlue
    },
    textStyle: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
        fontSize:16,
    },
    cancelButtonText:{
        color:COLORS.blue,
        fontWeight: 'bold',
        textAlign: 'center',
        fontSize:16,
    }
});
import { Restaurant } from "../../../models/Restauran.model";
import { useState } from "react";
import { StyleSheet, View,Pressable, Text } from 'react-native';
import { COLORS } from "../../../utils/constants";
import { Select } from "../../../components/Select/Select";
import moment from "moment";
type routeParam = {
    restaurant:Restaurant;
    people:string;
    date:string;
    id?:string;
    home?:boolean;

}
export default function ReservationTime({route,navigation}) {

    const [time,settime] = useState('')
    const {restaurant,people,date,id,home}:routeParam = route.params;

    const cancel = () => {
        navigation.goBack();
    }

    const onAccept = () => {
        if(route.name==="NewReservationTime") {
            navigation.navigate('NewReservationConfirmation', {
                people:people,
                restaurant,
                date,
                time, 
            })
        } else {
            navigation.navigate('EditReservationConfirmation', {
                people:people,
                restaurant,
                time, 
                date,
                id,
                home,
            })
        }
    }
    const IsValid = () => {
        return time !==''
    }
    const onChange = (data) => {
        console.log(data)
        settime(data)
    };
    return (
        <View style={styles.container}>
            <Text style={styles.title}>¿A Que Hora Llegan a {restaurant?.name}?</Text>
            <View style={styles.input}>
                <Select onValueChange={onChange} items={restaurant.slots.map((item)=>{
                    return {
                        label:moment(item).format('HH:mm'),
                        value:moment(item).format('HH:mm'),
                    }
                })} placeHolder='Elegir Horario' 
                customStyles={{
                    item:{
                        fontSize:20,
                        fontWeight:'600',
                        color:COLORS.blue,
                    },
                    placeHolder:{
                        fontSize:20,
                        fontWeight:'600',
                        color:COLORS.white,
                    },
                }}
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
        flex: 1,
        textAlign:'center',
        alignItems:'center',
        marginTop:100
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
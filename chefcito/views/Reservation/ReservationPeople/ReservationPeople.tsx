import { useEffect, useState } from "react"
import { StyleSheet, View,Pressable, Text,TextInput } from 'react-native';
import { COLORS } from "../../../utils/constants";
import { Restaurant } from "../../../models/Restauran.model";

type routeParam = {
    restaurant:Restaurant;
    date?:string;
    id?:string;
    home?:boolean;
}
export default function ReservationPeople({route, navigation}) {
    const [people,setPeople] = useState('1')
    const {restaurant,date,id,home}:routeParam = route?.params;
    useEffect(()=>{
        console.log('route',route?.params?.restaurant)
    },[])
    const cancel = () => {
        navigation.goBack();
    }

    const onAccept = () => {
        if(route.name==="NewReservationPeople") {
            navigation.navigate('NewReservationDate', {
                people:people,
                restaurant
            })
        } else {
            navigation.navigate('EditReservationTime', {
                people:people,
                restaurant,
                date,
                id,
                home,
            })
        }
    }

    const IsValid = () => {
        return people !== '' && parseInt(people)
    }
    return (
        <View style={styles.container}>
            <Text style={styles.title}>¿Cuantas Personas Vienen a {restaurant?.name}?</Text>
            <TextInput
            style={styles.input}
            onChangeText={(value)=>{
                setPeople(value)
            }}
            value={people}
            placeholder="Cantidad de Personas"
            keyboardType="numeric"
            />
            <View style={styles.buttonContainer}>
                <Pressable
                style={[styles.button, styles.buttonClose]}
                onPress={() => cancel()}>
                    <Text style={styles.textStyle}>Atras</Text>
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
      backgroundColor: '#fff',
      padding:8
    },
    input: {
        height: 40,
        margin: 12,
        borderWidth: 2,
        padding: 10,
        borderRadius:10,
        borderColor:COLORS.blue,
        textAlign:'center',
        color:COLORS.blue,
        fontSize:16,
        fontWeight:'500',
        marginVertical:'auto'
    },
    title:{
        fontSize:32,
        fontWeight:'600',
        color:COLORS.blue,
        textAlign:'center',
        marginBottom:8,
    },
    buttonContainer:{
        flex:1,
        flexDirection:'row',
        maxHeight:50,
        justifyContent:'center'
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
        backgroundColor:'lightasdagreen'
    },
    textStyle: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
        fontSize:16,
    },
});
import { Modal, StyleSheet, Text, Pressable, View,TextInput} from 'react-native';
import {NewBookingModel} from "../../models/NewBooking.model"
import { useState } from 'react';
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment';
import { Select } from '../../components/Select/Select';
import { Reservation } from '../../models/Reservations.model';
type EditBookingProps = {
    cancel:()=>void;
    accept:(value:NewBookingModel)=>void;
    show:boolean;
    slots:string[];
    booking:Reservation;
}
export default function EditBooking({cancel,accept,show,slots,booking}:EditBookingProps) {
    const [slot,setSlot] = useState('');
    const [people,setPeople] = useState(booking.people.toString())

    const IsValid = ():boolean => {
        const amount = parseInt(people)
        return !isNaN(amount)
    } 
    const onAccept = () => {
        const dateData = moment(booking.time)
        console.log('slot',slot)
        const hour = slot.split(':')[0]
        const minute = slot.split(':')[1]
        dateData.set('hour', parseInt(hour)); 
        dateData.set('minute', parseInt(minute)); 
        dateData.set('second', 0);
        if(IsValid()) {
            const booking:NewBookingModel = {
                people:parseInt(people),
                time:dateData.utc(true).toISOString(false)
            }
            accept(booking)
        }
    }
    return(
        <Modal transparent={true} animationType="slide" visible={show} onRequestClose={()=>cancel()}>
            <View style={styles.centeredView}>
                <View style={styles.modalView}>
                    <Text style={styles.title}>Crear Reserva</Text>
                    <TextInput
                    style={styles.input}
                    onChangeText={(value)=>{
                        setPeople(value)
                    }}
                    value={people}
                    placeholder="Cantidad de Personas"
                    keyboardType="numeric"
                    />
                    <Select onValueChange={setSlot} items={slots.map((item)=>{
                        return {
                            label:item,
                            value:item,
                        }
                    })} placeHolder='Elegir Horario' defaultValue={moment(booking.time).format("HH:mm")} />
                    <View style={styles.buttonContainer}>
                        <Pressable
                        disabled={!IsValid()}
                        style={[styles.button, styles.buttonClose,styles.buttonAccpet]}
                        onPress={() => onAccept()}>
                            <Text style={styles.textStyle}>Aceptar</Text>
                        </Pressable>
                        <Pressable
                        style={[styles.button, styles.buttonClose]}
                        onPress={() => cancel()}>
                            <Text style={styles.textStyle}>Cancelar</Text>
                        </Pressable>
                    </View>
                    
                </View>
            </View>
        </Modal>
    )
}

const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 22,
    },
    title:{
        fontSize:32,
        fontWeight:'600'
    },
    modalView: {
        margin: 20,
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 35,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    button: {
        borderRadius: 20,
        padding: 10,
        elevation: 2,
        marginBottom:8,
        backgroundColor: '#2196F3',
    },
    buttonClose: {
        backgroundColor: 'red',
    },
    buttonAccpet: {
        marginRight:4,
        backgroundColor:'green'
    },
    textStyle: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    modalText: {
        marginBottom: 15,
        textAlign: 'center',
    },
    input: {
        height: 40,
        margin: 12,
        borderWidth: 1,
        padding: 10,
    },
    buttonContainer:{
        flex:1,
        flexDirection:'row',
        maxHeight:45
    }
})
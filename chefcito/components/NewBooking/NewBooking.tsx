import { Modal, StyleSheet, Text, Pressable, View,TextInput} from 'react-native';
import {NewBookingModel} from "../../models/NewBooking.model"
import { useState } from 'react';
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment';
import { Select } from '../../components/Select/Select';
type NewBookingProps = {
    cancel:()=>void;
    accept:(value:NewBookingModel)=>void;
    show:boolean
}
export default function NewBooking({cancel,accept,show}:NewBookingProps) {
    const [date,setDate] = useState(new Date())
    const [time,setTime] = useState(new Date())
    const [slot,setSlot] = useState('');
    const [people,setPeople] = useState('1')
    const [showDatePicker, setShow] = useState(false);
    const [showTimePicker, setShowTimePicker] = useState(false);

    const onChange = (event, selectedDate) => {
        const currentDate = selectedDate;
        setDate(currentDate);
        setShow(false)
    };
    const onChangeTime = (value) => {
        console.log('onChangeTime',value)
    };
    const IsValid = ():boolean => {
        const amount = parseInt(people)
        return !isNaN(amount)
    } 
    const onAccept = () => {
        const timeData = moment(time)
        const dateData = moment(date)
        setShowTimePicker(false)
        setShow(false)
        console.log('slot',slot)
        dateData.set('hour', timeData.hour()); 
        dateData.set('minute', timeData.minute()); 
        dateData.set('second', timeData.second());
        const amount = parseInt(people)
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
                    <Pressable
                    style={[styles.button]}
                    onPress={() => setShow(true)}>
                        <Text style={styles.textStyle}>Elegir Fecha</Text>
                    </Pressable>
                    {/* <Pressable
                    style={[styles.button]}
                    onPress={() => setShowTimePicker(true)}>
                        <Text style={styles.textStyle}>Elegir Horario</Text>
                    </Pressable> */}
                    <Select onValueChange={setSlot} items={[
                        {label:'11:00',value:'11:00'},
                        {label:'12:00',value:'12:00'},
                        {label:'13:00',value:'13:00'},
                        {label:'14:00',value:'14:00'},
                        {label:'15:00',value:'15:00'},
                        {label:'16:00',value:'16:00'},
                    ]} placeHolder='Elegir Horario' />
                    {showDatePicker&&<DateTimePicker
                    value={date}
                    mode={'date'}
                    is24Hour={true}
                    onChange={onChange}
                    minimumDate={moment().toDate()}
                    maximumDate={moment().add(1,"month").toDate()}
                    />}
                    {/* {showTimePicker&&<DateTimePicker
                    value={time}
                    mode={'time'}
                    is24Hour={true}
                    onChange={onChangeTime}
                    />} */}
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
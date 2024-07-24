import moment from 'moment';
import { Reservation } from '../../models/Reservations.model';
import { SafeAreaView, View, FlatList,Image, Text,Pressable } from 'react-native';
import { useState } from 'react';
import { ConfirmationModal } from '../ConfirmationModal/ComfirmationModal';
import {CancelBooking} from "../../api/bookings"
import { GetUser } from '../../hooks/getUser.hook';

interface ReservetionHorizontalListProps {
    data:Reservation[],
    reload:()=>void,
}

const ReservetionHorizontalList = ({data,reload}:ReservetionHorizontalListProps) =>{
    const [show,setShow] = useState(false)
    const [currentId,setCurrentId] = useState<Reservation>(null)
    const {user} = GetUser()

    const onAccept = async () =>{
        setShow(false)
        try {
            const result = await CancelBooking(currentId,user)
        } catch (err) {
            console.log("Error al cancelar")
        }
        setCurrentId(null)
        reload()
    }

    const onCancel = () =>{
        setShow(false)
        setCurrentId(null)
    }

    const ReservationItem = (item:Reservation) =>{
        return (
          <Pressable style={{
                borderRadius: 5,
                backgroundColor:'transparent',
                marginHorizontal:12,
                padding:10,
                flex:1,
                flexDirection:'row'
            }}
            onPress={()=>{
                setCurrentId(item)
                setShow(true)
            }}
            >
                <View>
                    <Image source={{uri:`data:image/jpeg;base64,${item?.restaurant?.logo}`}} style={{height:70,width:70}} />
                </View>
                <View>
                    <Text>{item?.restaurant?.name}</Text>
                    <Text>Fecha: {moment(item.time).format('DD/MM/yyyy')}</Text>
                    <Text>Personas: {item.people}</Text>
                </View>
          </Pressable>
    
        )
    }

    return (
        <SafeAreaView style={{paddingTop: 8,overflow:'scroll'}}>
            <View
            style={{height:'auto'}}
            >
                <FlatList
                data={data}
                horizontal
                pagingEnabled={true}
                showsHorizontalScrollIndicator={false}
                renderItem={({item}) => ReservationItem(item)}
                keyExtractor={item => item.id}
                />
            </View>
            <ConfirmationModal 
            show={show}
            title='Cancelar Reserva'
            subtitle='Va a cancelar la reserva, ¿Esta seguro?'
            onAccept={onAccept}
            onCancel={onCancel}
            />
        </SafeAreaView>
    );
}

export default ReservetionHorizontalList
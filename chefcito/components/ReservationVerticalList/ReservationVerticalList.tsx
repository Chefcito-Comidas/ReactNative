import { SafeAreaView, View, FlatList,Image,Pressable, StyleSheet,Text } from 'react-native';
import {WendysImage} from "../../models/Restauran.model"
import { Reservation } from '../../models/Reservations.model';
import moment from 'moment';
import { useState } from 'react';
import { ConfirmationModal } from '../ConfirmationModal/ComfirmationModal';
import {CancelBooking} from "../../api/bookings"
import { GetUser } from '../../hooks/getUser.hook';

interface ReservationVerticalListProps {
    data:Reservation[],
    reload:()=>void,
}
const ReservationVerticalList = ({data,reload}:ReservationVerticalListProps) =>{

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
    
    const _renderItem = (item:Reservation) =>{
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
                <Text>Estado: {item.status.status}</Text>
            </View>
          </Pressable>
        )
    }

    return (
        <SafeAreaView style={styles.container}>
            <View
            style={styles.ListContainer}
            >
                <FlatList
                data={data}
                pagingEnabled={true}
                showsHorizontalScrollIndicator={false}
                renderItem={(item) => _renderItem(item.item)}
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

const styles = StyleSheet.create({
    container: {
      paddingTop: 8,
      overflow:'scroll'
    },
    ListContainer:{
        height:'auto'
    },
    Pressable:{
        borderRadius: 5,
        backgroundColor:'gray',
        padding:10, 
        marginVertical:4
    },
    RestaurantView:{
        flex:1,
        flexDirection:'row',
    },
    IconImage:{
        height:100,
        width:100
    },
    InfoContainer:{
        marginStart:10
    },
    Name:{
        fontSize:24,
    },
    Location:{
        fontSize: 16
    }
  });

export default ReservationVerticalList
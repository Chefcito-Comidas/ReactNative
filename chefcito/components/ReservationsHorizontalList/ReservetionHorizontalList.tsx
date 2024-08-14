import moment from 'moment';
import { Reservation } from '../../models/Reservations.model';
import { SafeAreaView, View, FlatList,Image, Text,Pressable } from 'react-native';
import { COLORS } from '../../utils/constants';

interface ReservetionHorizontalListProps {
    data:Reservation[],
    goToReservationData:(reservation:Reservation)=>void,
}

const ReservetionHorizontalList = ({data,goToReservationData}:ReservetionHorizontalListProps) =>{

    const ReservationItem = (item:Reservation) =>{
        return (
          <Pressable style={{
                borderRadius: 5,
                backgroundColor:COLORS.blue,
                borderColor:COLORS.white,
                marginHorizontal:12,
                padding:10,
                flex:1,
                flexDirection:'row'
            }}
            onPress={()=>{
                goToReservationData(item)
            }}
            >
                <View>
                    <Image source={{uri:`data:image/jpeg;base64,${item?.restaurant?.logo}`}} style={{height:70,width:70}} />
                </View>
                <View>
                    <Text style={{color:COLORS.silver}}>{item?.restaurant?.name}</Text>
                    <Text style={{color:COLORS.silver}}>Fecha: {moment(item.time).format('DD/MM/yyyy')}</Text>
                    <Text style={{color:COLORS.silver}}>Personas: {item.people}</Text>
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
        </SafeAreaView>
    );
}

export default ReservetionHorizontalList
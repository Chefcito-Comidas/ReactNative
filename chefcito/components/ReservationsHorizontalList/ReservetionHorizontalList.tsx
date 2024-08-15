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
                    <Image source={{uri:`${item?.restaurant?.logo}`}} style={{height:70,width:70,borderRadius:15}} />
                </View>
                <View style={{marginLeft:8}}>
                    <Text style={{color:COLORS.white}}>{item?.restaurant?.name}</Text>
                    <Text style={{color:COLORS.white}}>Fecha: {moment(item.time).format('DD/MM/yyyy')}</Text>
                    <Text style={{color:COLORS.white}}>Personas: {item.people}</Text>
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
import moment from 'moment';
import { Reservation } from '../../models/Reservations.model';
import { SafeAreaView, View, FlatList,Image, Text } from 'react-native';


interface ReservetionHorizontalListProps {
    data:Reservation[]
}

const ReservetionHorizontalList = ({data}:ReservetionHorizontalListProps) =>{
    const ReservationItem = (item:Reservation) =>{
        return (
          <View style={{
                borderRadius: 5,
                backgroundColor:'transparent',
                marginHorizontal:12,
                padding:10,
                flex:1,
                flexDirection:'row'
            }}
            >
                <View>
                    <Image source={{uri:`data:image/jpeg;base64,${item?.restaurant?.image}`}} style={{height:70,width:70}} />
                </View>
                <View>
                    <Text>{item?.restaurant?.name}</Text>
                    <Text>Fecha: {moment(item.time).format('DD/MM/yyyy')}</Text>
                    <Text>Personas: {item.people}</Text>
                </View>
          </View>
    
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
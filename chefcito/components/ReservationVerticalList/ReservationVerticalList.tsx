import { SafeAreaView, View, FlatList,Image,Pressable, StyleSheet,Text } from 'react-native';
import { Reservation } from '../../models/Reservations.model';
import moment from 'moment';
import { COLORS } from '../../utils/constants';

interface ReservationVerticalListProps {
    data:Reservation[],
    goToReservationData:(reservation:Reservation)=>void,
}
const ReservationVerticalList = ({data,goToReservationData}:ReservationVerticalListProps) =>{
    
    const _renderItem = (item:Reservation) =>{
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
                <Text style={{color:COLORS.white}}>Estado: {item.status.status}</Text>
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
        width:100,
        borderRadius:15,
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
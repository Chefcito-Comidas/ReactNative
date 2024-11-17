import moment from 'moment';
import { Reservation } from '../../models/Reservations.model';
import { SafeAreaView, View, FlatList,Image, Text,Pressable, StyleSheet} from 'react-native';
import { COLORS } from '../../utils/constants';
import { useState, useEffect } from 'react';
import * as Font from 'expo-font';

interface ReservetionHorizontalListProps {
    data:Reservation[],
    goToReservationData:(reservation:Reservation)=>void,
}

const ReservetionHorizontalList = ({data,goToReservationData}:ReservetionHorizontalListProps) =>{

    const [fontsLoaded, setFontsLoaded] = useState(false); // Estado para verificar si la fuente está cargada

  useEffect(() => {
    const loadFonts = async () => {
      await Font.loadAsync({
        'Montserrat': require('../../assets/fonts/Montserrat-VariableFont_wght.ttf'),
      });
      setFontsLoaded(true);
    };

    loadFonts();
  }, []);
    const ReservationItem = (item:Reservation) =>{
        return (
          <Pressable style={{
                borderRadius: 5,
                backgroundColor:COLORS.reservaHorizontal,
                borderColor:COLORS.azulClaro,
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
                    <Text style={styles.Name}>{item?.restaurant?.name}</Text>
                    <Text style={styles.ExtraData}>Fecha: {moment(item.time).format('DD/MM/yyyy')}</Text>
                    <Text style={styles.ExtraData}>Personas: {item.people}</Text>
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

const styles = StyleSheet.create({
    Name: {
      fontFamily: 'Montserrat 600',
      fontSize: 18,
      fontWeight: '600',
      color: COLORS.black,
    },
    ExtraData: {
     fontFamily: 'Montserrat',
      fontSize: 16,
      color: COLORS.dataExtra,
      marginTop: 4,
    },
  });

export default ReservetionHorizontalList
import { Restaurant } from '../../models/Restauran.model';
import { SafeAreaView, View, FlatList,Image,Pressable, StyleSheet,Text } from 'react-native';
import {WendysImage} from "../../models/Restauran.model"
import { COLORS } from '../../utils/constants';
interface RestaurantListProps {
    data:Restaurant[],
    navigation
}
const RestaurantList = ({data,navigation}:RestaurantListProps) =>{
    const goToRestaurantPage = (item:Restaurant) => {
        navigation.navigate('Restaurante', {
            restaurant:item
        });
    }

    const _renderItem = (item:Restaurant) =>{
        return (
        <Pressable style={styles.Pressable} onPress={()=>goToRestaurantPage(item)}>
            <View style={styles.RestaurantView}>
                <Image source={{uri:item.logo}} style={styles.IconImage}/>
                <View style={styles.InfoContainer}>
                    <Text style={styles.Name}>{item.name}</Text>
                    <Text style={styles.ExtraData}>Capacidad: {item.capacity}</Text>
                    <Text style={styles.ExtraData}>Estado: {item.status.status}</Text>
                    {/* <Text style={styles.Location}>{item.location}</Text> */}
                </View>
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
        borderRadius: 15,
        backgroundColor:COLORS.secondaryBlue,
        padding:10, 
        marginVertical:4,
        borderColor:COLORS.blue,
        borderWidth:4,
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
        marginStart:10,
    },
    Name:{
        fontSize:24,
        color:COLORS.white,
    },
    ExtraData:{
        fontSize: 16,
        color:COLORS.white,
    }
  });

export default RestaurantList
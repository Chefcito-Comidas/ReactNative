import { Restaurant } from '../../models/Restauran.model';
import { SafeAreaView, View, FlatList,Image,Pressable, StyleSheet,Text } from 'react-native';
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
                <Image source={{uri:`data:image/jpeg;base64,${item.image}`}} style={styles.IconImage}/>
                <View style={styles.InfoContainer}>
                    <Text style={styles.Name}>{item.name}</Text>
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
        borderRadius: 5,
        backgroundColor:'gray',
        padding:10, 
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

export default RestaurantList
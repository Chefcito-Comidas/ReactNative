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

    const _renderItem = (item: Restaurant) => {
        return (
          <Pressable style={styles.Pressable} onPress={() => goToRestaurantPage(item)}>
            <View style={styles.RestaurantView}>
              <Image source={{ uri: item.logo }} style={styles.IconImage} />
              <View style={styles.InfoContainer}>
                <Text style={styles.Name}>{item.name}</Text>
                <Text style={styles.ExtraData}>{item.characteristics.join(", ")}</Text>
                <Text style={styles.ExtraData}>Disponible</Text>
                {/*<Text style={styles.ExtraData}>Estado: {item.status.status}</Text>*/}
              </View>
            </View>
          </Pressable>
        );
      };

      return (
        <SafeAreaView style={styles.container}>
          <View style={styles.ListContainer}>
            <FlatList
              data={data}
              pagingEnabled={true}
              showsHorizontalScrollIndicator={false}
              renderItem={(item) => _renderItem(item.item)}
              keyExtractor={(item) => item.id.toString()}
            />
          </View>
        </SafeAreaView>
      );
    };

    const styles = StyleSheet.create({
            container: {
                 flex: 1,
                 backgroundColor: COLORS.lightGray,
                 padding: 16,
               },
               ListContainer: {
                 height: 'auto',
               },
               Pressable: {
                 borderRadius: 20,
                 backgroundColor: '#f0f0f0',
                 padding: 20,
                 marginVertical: 12,
                 borderColor: '#e0e0e0',
                 borderWidth: 1,
                 shadowColor: '#aaa',
                 shadowOpacity: 0.2,
                 shadowOffset: { width: 0, height: 5 },
                 shadowRadius: 10,
                 elevation: 4,
               },
               RestaurantView: {
                 flex: 1,
                 flexDirection: 'row',
                 alignItems: 'center',
               },
               IconImage: {
                 height: 90,
                 width: 90,
                 borderRadius: 10,
               },
               InfoContainer: {
                 marginLeft: 16,
                 flex: 1,
               },
               Name: {
                 fontSize: 18,
                 fontWeight: '600',
                 color: COLORS.darkGray,
               },
               ExtraData: {
                 fontSize: 16,
                 color: COLORS.gray,
                 marginTop: 4,
               },
             });

    export default RestaurantList;
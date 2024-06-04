import { SafeAreaView, View, FlatList,Image } from 'react-native';

interface ImageCarrouselProps {
    data:any[]
}
const ImageCarrousel = ({data}:ImageCarrouselProps) =>{
    const _renderItem = ({item}) =>{
        return (
          <View style={{
                borderRadius: 5,
                backgroundColor:'transparent',
                marginHorizontal:12,
                padding:10,
            }}
            >
                <Image source={item.image} style={{height:150}} />
          </View>

        )
    }

    return (
        <SafeAreaView style={{flex: 1, paddingTop: 8,overflow:'scroll'}}>
            <View
            style={{height:'auto'}}
            >
                <FlatList
                data={data}
                horizontal
                pagingEnabled={true}
                showsHorizontalScrollIndicator={false}
                renderItem={({item}) => _renderItem({item})}
                keyExtractor={item => item.id}
                />
            </View>
            
        </SafeAreaView>
    );
}

export default ImageCarrousel
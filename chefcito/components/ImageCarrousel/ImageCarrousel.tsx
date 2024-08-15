import { SafeAreaView, View, FlatList,Image } from 'react-native';

interface ImageCarrouselProps {
    data:{image:string,id:any}[]
}
const ImageCarrousel = ({data}:ImageCarrouselProps) =>{
    const _renderItem = (image) =>{
        return (
          <View style={{
                borderRadius: 5,
                marginHorizontal:12,
                padding:10,
            }}
            >
                <Image source={{uri:image}} style={{height:150,width:250}} />
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
                renderItem={({item}) => _renderItem(item.image)}
                keyExtractor={item => item.id}
                />
            </View>
            
        </SafeAreaView>
    );
}

export default ImageCarrousel
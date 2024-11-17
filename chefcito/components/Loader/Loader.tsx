import { View,ActivityIndicator,StyleSheet } from "react-native"

const Loader = () => {
    return (
        <View style={styles.Container} >
            <ActivityIndicator size={300} />
        </View>
    )
}

const styles = StyleSheet.create({
    Container:{
        position:'absolute',
        height:'100%',
        width:'110%',
        backgroundColor:'rgba(158, 158, 158, 0.7)',
        zIndex:11,
        flex:1,
        justifyContent:'center',
        alignItems:'center',
    }
})

export default Loader
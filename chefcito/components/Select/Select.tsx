import { useState } from 'react';
import { Modal, StyleSheet, Text, Pressable, FlatList,SafeAreaView, ScrollView,View} from 'react-native';

type Items = {
    label:string;
    value:string;
}
type SelectProps = {
    onValueChange:(value:string)=>void;
    items:Items[];
    placeHolder:string;
    defaultValue?:string;
}

export const Select = ({onValueChange,items,placeHolder,defaultValue=''}:SelectProps) => {
    const [show,setShow] = useState(false)
    const [value,setvalue] = useState(defaultValue)
    const renderItem = ({item}) => {
        return (
            <Pressable style={styles.flatListStyle} onPress={()=>{
                onValueChange(item.value)
                setvalue(item.value)
                setShow(false)
            }}>
                <Text>{item.label}</Text>
            </Pressable>
        )
    }
    return(
        <>
            <Pressable onPress={()=>setShow(true)} style={styles.placeHolder}>
                <Text>{placeHolder}: {value}</Text>
            </Pressable>
            <Modal transparent={true} animationType="fade" visible={show} onRequestClose={()=>{}}>
                <View style={styles.modal}>
                    <FlatList scrollEnabled contentContainerStyle={{flex:1,justifyContent:'center'}} data={items} renderItem={renderItem} />
                </View>
            </Modal>
        </>
        
    )
}

const styles = StyleSheet.create({
    placeHolder:{
        width:'auto',
        marginBottom:4
    },
    modal:{
        flex:1,
        alignItems:'center',
        backgroundColor:'#00000099',
        alignContent:'center'
    },
    flatListStyle:{
        backgroundColor:'white',
        paddingHorizontal:40,
        paddingVertical:4,
    }
})
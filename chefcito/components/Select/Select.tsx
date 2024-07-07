import { useState } from 'react';
import { Modal, StyleSheet, Text, Pressable, FlatList,SafeAreaView, ScrollView,} from 'react-native';

type Items = {
    label:string;
    value:string;
}
type SelectProps = {
    onValueChange:(value:string)=>void;
    items:Items[];
    placeHolder:string;
}

export const Select = ({onValueChange,items,placeHolder}:SelectProps) => {
    const [show,setShow] = useState(false)
    const [value,setvalue] = useState('')
    const renderItem = ({item}) => {
        return (
            <Pressable onPress={()=>{
                onValueChange(item.value)
                setvalue(item.value)
            }}>
                <Text>{item.label}</Text>
            </Pressable>
        )
    }
    return(
        <>
            <Pressable onPress={()=>setShow(true)} style={styles.placeHolder}>
                {value?<Text>{placeHolder}</Text>:<Text>{value}</Text>}
            </Pressable>
            <Modal transparent={true} animationType="slide" visible={show} onRequestClose={()=>{}}>
                <FlatList scrollEnabled data={items} renderItem={renderItem} />
            </Modal>
        </>
        
    )
}

const styles = StyleSheet.create({
    placeHolder:{
        width:100,
        height:70
    }
})
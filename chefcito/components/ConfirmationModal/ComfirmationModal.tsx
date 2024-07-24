import { Modal,View,StyleSheet,Text,Pressable } from "react-native";

type ConfirmationModalProps = {
    onAccept:()=>void;
    onCancel:()=>void;
    show:boolean;
    title:string;
    subtitle:string;
}

export const ConfirmationModal = ({onAccept,onCancel,show,title,subtitle}:ConfirmationModalProps) => {
    return(
        <Modal transparent={true} animationType="fade" visible={show} onRequestClose={()=>{}}>
            <View style={styles.modal}>
                <Text style={styles.title}>{title}</Text>
                <Text style={styles.subTitle}>{subtitle}</Text>
                <View style={styles.buttonContainer}>
                    <Pressable style={styles.accept} onPress={onAccept}>Aceptar</Pressable>
                    <Pressable style={styles.cancel} onPress={onCancel}>Cancelar</Pressable>
                </View>
            </View>
        </Modal>
    )
}

const styles = StyleSheet.create({
    modal:{
        flex:1,
        alignItems:'center',
        backgroundColor:'#00000099',
        alignContent:'center'
    },
    buttonContainer:{
        flex:1,
        flexDirection:'row',
    },
    title:{
        fontSize:20,
        fontWeight:'700'
    },
    subTitle:{
        fontSize:16,
        marginVertical:8
    },
    accept:{
        backgroundColor:'green',
        marginRight:2,
        borderRadius:12,
    },
    cancel:{
        backgroundColor:'red',
        marginLeft:2,
        borderRadius:12,
    },
})
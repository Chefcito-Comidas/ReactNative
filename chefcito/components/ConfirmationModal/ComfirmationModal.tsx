import { Modal,View,StyleSheet,Text,Pressable } from "react-native";
import { COLORS } from "../../utils/constants";

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
                <View style={styles.subModal}>
                    <Text style={styles.title}>{title}</Text>
                    <Text style={styles.subTitle}>{subtitle}</Text>
                    <View style={styles.buttonContainer}>
                        <Pressable style={styles.accept} onPress={onAccept}><Text style={styles.buttonText}>Aceptar</Text></Pressable>
                        <Pressable style={styles.cancel} onPress={onCancel}><Text style={styles.cancelButtonText}>Cancelar</Text></Pressable>
                    </View>
                </View>
            </View>
        </Modal>
    )
}

const styles = StyleSheet.create({
    modal:{
        flex:1,
        backgroundColor:'#00000099'
    },
    subModal:{
        alignItems:'center',
        backgroundColor:COLORS.secondaryBlue,
        alignContent:'center',
        marginVertical:'auto',
        height:110
    },
    buttonContainer:{
        flex:1,
        flexDirection:'row',
    },
    title:{
        fontSize:20,
        fontWeight:'700',
        color:COLORS.white,
    },
    subTitle:{
        fontSize:16,
        marginVertical:8,
        color:COLORS.white,
    },
    accept:{
        backgroundColor:COLORS.blue,
        borderColor:COLORS.white,
        borderWidth:2,
        marginRight:2,
        borderRadius:12,
        width:100,
        height:30,
    },
    cancel:{
        backgroundColor:COLORS.white,
        borderColor:COLORS.blue,
        borderWidth:2,
        marginLeft:2,
        borderRadius:12,
        height:30,
        width:100,
    },
    buttonText:{
        color:COLORS.white,
        fontSize:18,
        textAlign:'center',
    },
    cancelButtonText:{
        color:COLORS.blue,
        fontSize:18,
        textAlign:'center',
    }
})
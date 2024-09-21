import { StatusBar } from 'expo-status-bar';
import { Button, StyleSheet, Text, View, Modal, TextInput, Pressable } from 'react-native';
import { useAppSelector } from '../../redux/hooks/hook';
import { useEffect, useState } from 'react';
import { signOut } from '../../api/googleAuth';
import { GetUser } from '../../hooks/getUser.hook';
import { COLORS } from '../../utils/constants';

export default function Profile() {
  const { user } = GetUser();
  
  const [modalVisible, setModalVisible] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone_number || '');

  useEffect(() => {
    console.log(user);
  }, [user]);

  const signout = async () => {
    await signOut();
  };

  const saveChanges = () => {
    // Aquí manejarías el guardado de cambios
    // En un caso real, enviarías estos datos actualizados al backend
    setModalVisible(false);
  };

  return (
    <View style={styles.container}>
      {user && (
        <View style={styles.card}>
          <Text style={styles.label}>Nombre:</Text>
          <Text style={styles.info}>{user?.name}</Text>
          <Text style={styles.label}>Correo:</Text>
          <Text style={styles.info}>{user?.email}</Text>
          <Text style={styles.label}>Teléfono:</Text>
          <Text style={styles.info}>{user?.phone_number}</Text>
        </View>
      )}
      
      <View style={styles.buttonRow}>
        <Button onPress={() => setModalVisible(true)} title="Editar Perfil" color="#87CEEB" />
        <Button onPress={() => signout()} title="Cerrar Sesion" color="#ff6347" />
      </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}>
        <View style={styles.modalView}>
          <Text style={styles.modalTitle}>Editar Perfil</Text>
          <TextInput 
            style={styles.input} 
            placeholder="Nombre" 
            value={name} 
            onChangeText={setName} 
          />
          <TextInput 
            style={styles.input} 
            placeholder="Correo" 
            value={email} 
            onChangeText={setEmail} 
          />
          <TextInput 
            style={styles.input} 
            placeholder="Teléfono" 
            value={phone} 
            onChangeText={setPhone}
            keyboardType="phone-pad"
          />
          <View style={styles.modalButtonRow}>
            <Pressable
              style={[styles.button, styles.buttonClose]}
              onPress={() => setModalVisible(!modalVisible)}>
              <Text style={styles.textStyle}>Cancelar</Text>
            </Pressable>
            <Pressable
              style={[styles.button, styles.buttonSave]}
              onPress={saveChanges}>
              <Text style={styles.textStyle}>Guardar</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    padding: 20,
  },
  card: {
    backgroundColor: COLORS.blancopaco,
    borderRadius: 10,
    padding: 20,
    width: '100%',
    maxWidth: 400,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 5 },
    shadowRadius: 10,
    elevation: 3,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  info: {
    fontSize: 18,
    color: '#666',
    marginBottom: 15,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '70%',
    marginBottom: 20,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
    width: 250,
    borderRadius: 5,
    borderColor: '#ccc',
  },
  modalButtonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  button: {
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  buttonClose: {
    backgroundColor: '#ff6347',
  },
  buttonSave: {
    backgroundColor: '#4682b4',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

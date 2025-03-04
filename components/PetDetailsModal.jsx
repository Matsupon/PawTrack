import React, { useState, useEffect } from 'react';
import { View, Text, Modal, TextInput, Pressable, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';

const PetDetailsModal = ({ visible, pet, onClose, onSave }) => {
  const [status, setStatus] = useState('available');
  const [adopterName, setAdopterName] = useState('');
  const [adopterContact, setAdopterContact] = useState('');

  useEffect(() => {
    if (pet) {
      setStatus(pet.status);
      setAdopterName(pet.adopterInfo?.name || '');
      setAdopterContact(pet.adopterInfo?.contact || '');
    }
  }, [pet]);

  const handleSave = () => {
    const adopterInfo = status === 'adopted' ? {
      name: adopterName,
      contact: adopterContact
    } : undefined;
    
    onSave(status, adopterInfo);
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text style={styles.modalTitle}>Update Pet Status</Text>
          
          <Text style={styles.label}>Current Status:</Text>
          <Picker
            selectedValue={status}
            onValueChange={(itemValue) => setStatus(itemValue)}
            style={styles.picker}
          >
            <Picker.Item label="Available" value="available" />
            <Picker.Item label="Pending" value="pending" />
            <Picker.Item label="Adopted" value="adopted" />
          </Picker>

          {status === 'adopted' && (
            <>
              <TextInput
                style={styles.input}
                placeholder="Adopter Name"
                value={adopterName}
                onChangeText={setAdopterName}
              />
              <TextInput
                style={styles.input}
                placeholder="Adopter Contact"
                value={adopterContact}
                onChangeText={setAdopterContact}
                keyboardType="phone-pad"
              />
            </>
          )}

          <View style={styles.buttonContainer}>
            <Pressable style={[styles.button, styles.cancelButton]} onPress={onClose}>
              <Text style={styles.buttonText}>Cancel</Text>
            </Pressable>
            <Pressable style={[styles.button, styles.saveButton]} onPress={handleSave}>
              <Text style={styles.buttonText}>Save</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)'
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 25,
    width: '80%'
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center'
  },
  label: {
    marginBottom: 8,
    fontWeight: '500'
  },
  picker: {
    height: 50,
    width: '100%',
    marginBottom: 15
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 12,
    padding: 8,
    borderRadius: 4
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15
  },
  button: {
    borderRadius: 5,
    padding: 10,
    minWidth: 100,
    alignItems: 'center'
  },
  cancelButton: {
    backgroundColor: '#ff4444'
  },
  saveButton: {
    backgroundColor: '#4CAF50'
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold'
  }
});

export default PetDetailsModal;
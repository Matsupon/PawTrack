import React, { useState } from 'react';
import { View, Text, Modal, StyleSheet, TextInput, TouchableOpacity, Image } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

export default function ReservedModal({ visible, onClose, onSave }) {
  const [reserverInfo, setReserverInfo] = useState({
    name: '',
    contact: '',
    address: '',
    imageUri: null
  });

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setReserverInfo({ ...reserverInfo, imageUri: result.assets[0].uri });
    }
  };

  const handleSave = () => {
    if (!reserverInfo.name || !reserverInfo.contact || !reserverInfo.address) {
      alert('Please fill in all required fields');
      return;
    }
    onSave(reserverInfo);
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.title}>Reserver Information</Text>
          
          <TouchableOpacity style={styles.imagePickerButton} onPress={pickImage}>
            {reserverInfo.imageUri ? (
              <Image source={{ uri: reserverInfo.imageUri }} style={styles.previewImage} />
            ) : (
              <FontAwesome name="camera" size={24} color="#3F3E3F" />
            )}
            <Text style={styles.imagePickerText}>
              {reserverInfo.imageUri ? 'Change Photo' : 'Add Photo'}
            </Text>
          </TouchableOpacity>

          <TextInput
            style={styles.input}
            placeholder="Name"
            value={reserverInfo.name}
            onChangeText={(text) => setReserverInfo({ ...reserverInfo, name: text })}
          />

          <TextInput
            style={styles.input}
            placeholder="Contact Number"
            value={reserverInfo.contact}
            onChangeText={(text) => setReserverInfo({ ...reserverInfo, contact: text })}
            keyboardType="phone-pad"
          />

          <TextInput
            style={[styles.input, styles.addressInput]}
            placeholder="Address"
            value={reserverInfo.address}
            onChangeText={(text) => setReserverInfo({ ...reserverInfo, address: text })}
            multiline
            numberOfLines={3}
          />

          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
              <Text style={styles.saveButtonText}>Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    width: '90%',
    maxWidth: 400,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#3F3E3F',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
  },
  addressInput: {
    height: 100,
    textAlignVertical: 'top',
  },
  imagePickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: '#E5E5E5',
    borderRadius: 8,
    marginBottom: 16,
  },
  imagePickerText: {
    marginLeft: 8,
    fontSize: 16,
    color: '#3F3E3F',
  },
  previewImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  cancelButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
    marginRight: 8,
  },
  saveButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#E2E02D',
    marginLeft: 8,
  },
  cancelButtonText: {
    color: '#3F3E3F',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  saveButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
  },
}); 
import React, { useState } from 'react';
import { View, Text, Modal, StyleSheet, TextInput, TouchableOpacity, Image } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

export default function AdoptedModal({ visible, onClose, onSave }) {
  const [adopter, setAdopter] = useState({
    name: '',
    contact: '',
    imageUri: '',
  });

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setAdopter({ ...adopter, imageUri: result.assets[0].uri });
    }
  };

  const handleSave = () => {
    if (!adopter.name || !adopter.contact) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }
    onSave(adopter);
    onClose();
  };

  return (
    <Modal visible={visible} transparent={true} animationType="slide">
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.header}>
            <Text style={styles.title}>Adopter Information</Text>
            <TouchableOpacity onPress={onClose}>
              <FontAwesome name="close" size={24} color="#3F3E3F" />
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
            {adopter.imageUri ? (
              <Image source={{ uri: adopter.imageUri }} style={styles.adopterImage} />
            ) : (
              <FontAwesome name="user-circle" size={80} color="#E5E5E5" />
            )}
          </TouchableOpacity>

          <TextInput
            style={styles.input}
            placeholder="Adopter Name *"
            value={adopter.name}
            onChangeText={(text) => setAdopter({ ...adopter, name: text })}
          />

          <TextInput
            style={styles.input}
            placeholder="Contact Information *"
            value={adopter.contact}
            onChangeText={(text) => setAdopter({ ...adopter, contact: text })}
          />

          <View style={styles.buttonContainer}>
            <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={onClose}>
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button, styles.saveButton]} onPress={handleSave}>
              <Text style={styles.buttonText}>Save</Text>
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
    borderRadius: 20,
    padding: 20,
    width: '90%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#3F3E3F',
  },
  imagePicker: {
    alignSelf: 'center',
    marginBottom: 20,
  },
  adopterImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    fontSize: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  button: {
    flex: 1,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  cancelButton: {
    backgroundColor: '#E5E5E5',
  },
  saveButton: {
    backgroundColor: '#81CBF9',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
}); 
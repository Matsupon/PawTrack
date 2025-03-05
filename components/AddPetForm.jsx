import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Switch, Image, Modal } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { usePets } from '../app/PetContext';
import { FontAwesome } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

export default function AddPetForm({ onClose, onSubmit }) {
  const { addPet } = usePets();
  const [petData, setPetData] = useState({
    name: '',
    species: '',
    breed: '',
    gender: '',
    age: '',
    weight: '',
    healthStatus: '',
    vaccinated: false,
    neutered: false,
    description: '',
    imageUri: '',
    adoptionStatus: 'Available',
  });
  const [showStatusPicker, setShowStatusPicker] = useState(false);
  const [showSpeciesPicker, setShowSpeciesPicker] = useState(false);

  const adoptionStatuses = ['Available', 'Reserved', 'Adopted'];
  const speciesOptions = ['Cat', 'Dog'];

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setPetData({ ...petData, imageUri: result.assets[0].uri });
    }
  };

  const handleSubmit = () => {
    addPet(petData);
    onSubmit(petData);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onClose}>
          <FontAwesome name="close" size={24} color="#3F3E3F" />
        </TouchableOpacity>
        <Text style={styles.title}>Add New Pet</Text>
      </View>

      <ScrollView style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder="Pet Name"
          value={petData.name}
          onChangeText={(text) => setPetData({ ...petData, name: text })}
        />

        <TouchableOpacity 
          style={styles.selector} 
          onPress={() => setShowSpeciesPicker(true)}
        >
          <Text style={styles.selectorLabel}>Species</Text>
          <View style={styles.selectorValueContainer}>
            <Text style={styles.selectorValue}>
              {petData.species || 'Select Species'}
            </Text>
            <FontAwesome name="chevron-down" size={14} color="#666" />
          </View>
        </TouchableOpacity>

        <Modal
          visible={showSpeciesPicker}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setShowSpeciesPicker(false)}
        >
          <TouchableOpacity 
            style={styles.modalOverlay}
            activeOpacity={1}
            onPress={() => setShowSpeciesPicker(false)}
          >
            <View style={styles.modalContent}>
              {speciesOptions.map((species) => (
                <TouchableOpacity
                  key={species}
                  style={styles.option}
                  onPress={() => {
                    setPetData({ ...petData, species: species });
                    setShowSpeciesPicker(false);
                  }}
                >
                  <Text style={[
                    styles.optionText,
                    petData.species === species && styles.selectedOptionText
                  ]}>
                    {species}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </TouchableOpacity>
        </Modal>

        <TextInput
          style={styles.input}
          placeholder="Breed"
          value={petData.breed}
          onChangeText={(text) => setPetData({ ...petData, breed: text })}
        />
        <TextInput
          style={styles.input}
          placeholder="Gender (Male/Female)"
          value={petData.gender}
          onChangeText={(text) => setPetData({ ...petData, gender: text })}
        />
        <TextInput
          style={styles.input}
          placeholder="Age"
          value={petData.age}
          onChangeText={(text) => setPetData({ ...petData, age: text })}
        />
        <TextInput
          style={styles.input}
          placeholder="Weight (in kg)"
          value={petData.weight} 
          onChangeText={(text) => setPetData({ ...petData, weight: text })}
        />
        <TextInput
          style={styles.input}
          placeholder="Health Status"
          value={petData.healthStatus}
          onChangeText={(text) => setPetData({ ...petData, healthStatus: text })}
        />

        <TouchableOpacity 
          style={styles.selector} 
          onPress={() => setShowStatusPicker(true)}
        >
          <Text style={styles.selectorLabel}>Adoption Status</Text>
          <View style={styles.selectorValueContainer}>
            <Text style={styles.selectorValue}>{petData.adoptionStatus}</Text>
            <FontAwesome name="chevron-down" size={14} color="#666" />
          </View>
        </TouchableOpacity>

        <Modal
          visible={showStatusPicker}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setShowStatusPicker(false)}
        >
          <TouchableOpacity 
            style={styles.modalOverlay}
            activeOpacity={1}
            onPress={() => setShowStatusPicker(false)}
          >
            <View style={styles.modalContent}>
              {adoptionStatuses.map((status) => (
                <TouchableOpacity
                  key={status}
                  style={styles.statusOption}
                  onPress={() => {
                    setPetData({ ...petData, adoptionStatus: status });
                    setShowStatusPicker(false);
                  }}
                >
                  <Text style={[
                    styles.statusOptionText,
                    petData.adoptionStatus === status && styles.selectedStatusText
                  ]}>
                    {status}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </TouchableOpacity>
        </Modal>

        <View style={styles.switchContainer}>
          <Text style={styles.switchLabel}>Vaccinated</Text>
          <Switch
            value={petData.vaccinated}
            onValueChange={(value) => setPetData({ ...petData, vaccinated: value })}
            trackColor={{ false: '#767577', true: '#FFB08C' }}
          />
        </View>

        <View style={styles.switchContainer}>
          <Text style={styles.switchLabel}>Neutered</Text>
          <Switch
            value={petData.neutered}
            onValueChange={(value) => setPetData({ ...petData, neutered: value })}
            trackColor={{ false: '#767577', true: '#FFB08C' }}
          />
        </View>

        <TouchableOpacity style={styles.imagePickerButton} onPress={pickImage}>
          <FontAwesome name="camera" size={24} color="#3F3E3F" />
          <Text style={styles.imagePickerText}>Add Pet Photo</Text>
        </TouchableOpacity>

        {petData.imageUri ? (
          <Image source={{ uri: petData.imageUri }} style={styles.previewImage} />
        ) : null}

        <TextInput
          style={[styles.input, styles.descriptionInput]}
          placeholder="Description"
          value={petData.description}
          multiline
          numberOfLines={4}
          onChangeText={(text) => setPetData({ ...petData, description: text })}
        />
        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>Add Pet</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#3F3E3F',
    marginLeft: 20,
  },
  form: {
    flex: 1,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
  },
  submitButton: {
    backgroundColor: '#FFB08C',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  descriptionInput: {
    height: 100,
    textAlignVertical: 'top',
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
    marginBottom: 16,
  },
  switchLabel: {
    fontSize: 16,
    color: '#3F3E3F',
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
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginBottom: 16,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 8,
    marginBottom: 16,
  },
  pickerLabel: {
    fontSize: 14,
    color: '#666',
    paddingHorizontal: 12,
    paddingTop: 8,
  },
  picker: {
    height: 50,
  },
  selector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  selectorLabel: {
    fontSize: 16,
    color: '#3F3E3F',
  },
  selectorValueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  selectorValue: {
    fontSize: 16,
    color: '#666',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    width: '80%',
    maxWidth: 300,
  },
  statusOption: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  statusOptionText: {
    fontSize: 16,
    color: '#3F3E3F',
  },
  selectedStatusText: {
    color: '#FFB08C',
    fontWeight: 'bold',
  },
  option: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  optionText: {
    fontSize: 16,
    color: '#3F3E3F',
  },
  selectedOptionText: {
    color: '#FFB08C',
    fontWeight: 'bold',
  },
}); 
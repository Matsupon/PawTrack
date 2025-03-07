import React, { useState, useEffect } from 'react';
import { View, Text, Modal, StyleSheet, ScrollView, TextInput, 
         TouchableOpacity, Switch, Image } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { usePets } from '../app/PetContext';
import * as ImagePicker from 'expo-image-picker';
import AdoptedModal from './AdoptedModal';
import { useRouter } from 'expo-router';

export default function EditPetModal({ visible, pet, onClose }) {
  const { updatePet } = usePets();
  const router = useRouter();
  const [petData, setPetData] = useState({
    ...pet
  });
  const [showStatusPicker, setShowStatusPicker] = useState(false);
  const [showAdoptedModal, setShowAdoptedModal] = useState(false);
  const adoptionStatuses = ['Available', 'Reserved', 'Adopted'];
  const [previousStatus, setPreviousStatus] = useState(pet?.adoptionStatus);

  // Reset petData when pet changes
  useEffect(() => {
    if (pet) {
      setPetData({...pet});
      setPreviousStatus(pet.adoptionStatus);
    }
  }, [pet]);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [89, 111],
      quality: 1,
    });

    if (!result.canceled) {
      setPetData({ ...petData, imageUri: result.assets[0].uri });
    }
  };

  const handleSubmit = async () => {
    // Update the pet in the context
    await updatePet(petData);
    
    // Check if status changed to Adopted
    const becameAdopted = previousStatus !== 'Adopted' && petData.adoptionStatus === 'Adopted';
    
    // If the pet became adopted, close everything and navigate to adoptions tab
    if (becameAdopted) {
      onClose();
      setTimeout(() => {
        router.replace('/(tabs)/adoptions');
      }, 300);
    } else {
      // Otherwise, just close the edit modal but keep details modal open
      onClose(petData);
    }
  };

  const handleStatusChange = async (status) => {
    if (status === 'Adopted') {
      setShowAdoptedModal(true);
    } else {
      const updatedPet = {
        ...petData,
        adoptionStatus: status,
        adopterInfo: null,
        adoptionDate: null
      };
      setPetData(updatedPet);
    }
    setShowStatusPicker(false);
  };

  const handleAdopterSave = async (adopterInfo) => {
    const updatedPet = {
      ...petData,
      adoptionStatus: 'Adopted',
      adopterInfo,
      adoptionDate: new Date().toISOString()
    };
    setPetData(updatedPet);
    setShowAdoptedModal(false);
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      onRequestClose={() => onClose()}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => onClose()}>
            <FontAwesome name="close" size={24} color="#3F3E3F" />
          </TouchableOpacity>
          <Text style={styles.title}>Edit Pet Details</Text>
        </View>

        <ScrollView style={styles.form}>
          <TextInput
            style={styles.input}
            placeholder="Pet Name"
            value={petData.name}
            onChangeText={(text) => setPetData({ ...petData, name: text })}
          />

          <TextInput
            style={styles.input}
            placeholder="Breed"
            value={petData.breed}
            onChangeText={(text) => setPetData({ ...petData, breed: text })}
          />

          <TextInput
            style={styles.input}
            placeholder="Gender"
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
              <Text style={[
                styles.selectorValue,
                petData.adoptionStatus === 'Available' && styles.statusAvailable,
                petData.adoptionStatus === 'Adopted' && styles.statusAdopted,
                petData.adoptionStatus === 'Reserved' && styles.statusReserved,
              ]}>
                {petData.adoptionStatus}
              </Text>
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
                    onPress={() => handleStatusChange(status)}
                  >
                    <Text style={[
                      styles.statusOptionText,
                      petData.adoptionStatus === status && styles.selectedStatusText,
                      status === 'Available' && styles.statusAvailable,
                      status === 'Adopted' && styles.statusAdopted,
                      status === 'Reserved' && styles.statusReserved,
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
              trackColor={{ false: '#767577', true: '#A8D5E5' }}
            />
          </View>

          <View style={styles.switchContainer}>
            <Text style={styles.switchLabel}>Neutered</Text>
            <Switch
              value={petData.neutered}
              onValueChange={(value) => setPetData({ ...petData, neutered: value })}
              trackColor={{ false: '#767577', true: '#A8D5E5' }}
            />
          </View>

          <TouchableOpacity style={styles.imagePickerButton} onPress={pickImage}>
            <FontAwesome name="camera" size={24} color="#3F3E3F" />
            <Text style={styles.imagePickerText}>Change Pet Photo</Text>
          </TouchableOpacity>

          {petData.imageUri && (
            <Image source={{ uri: petData.imageUri }} style={styles.previewImage} />
          )}

          <TextInput
            style={[styles.input, styles.descriptionInput]}
            placeholder="Description"
            value={petData.description}
            multiline
            numberOfLines={4}
            onChangeText={(text) => setPetData({ ...petData, description: text })}
          />

          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
            <Text style={styles.submitButtonText}>Save Changes</Text>
          </TouchableOpacity>
        </ScrollView>

        <AdoptedModal
          visible={showAdoptedModal}
          onClose={() => setShowAdoptedModal(false)}
          onSave={handleAdopterSave}
        />
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    paddingTop: 40,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e5e5',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#3F3E3F',
    marginLeft: 20,
  },
  form: {
    flex: 1,
    padding: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
    width: 89,
    height: 111,
    borderRadius: 8,
    alignSelf: 'center',
    marginBottom: 16,
  },
  descriptionInput: {
    height: 100,
    textAlignVertical: 'top',
  },
  submitButton: {
    backgroundColor: '#81CBF9',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 40,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
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
    fontWeight: '500',
    marginRight: 8,
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
    fontWeight: 'bold',
  },
  statusAvailable: {
    color: '#64D2A4',
  },
  statusAdopted: {
    color: '#EF8888',
  },
  statusReserved: {
    color: '#E2E02D',
  },
}); 
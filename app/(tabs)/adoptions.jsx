import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, FlatList, Image, TouchableOpacity, Modal, TextInput } from 'react-native';
import { usePets } from '../PetContext';
import PetDetailsModal from '../../components/PetDetailsModal';
import { useRouter } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

export default function AdoptionsScreen() {
  const { pets, updatePet } = usePets();
  const adoptedPets = pets.filter(pet => pet.adoptionStatus === 'Adopted');
  const [selectedPet, setSelectedPet] = useState(null);
  const [isPetDetailsModalVisible, setIsPetDetailsModalVisible] = useState(false);
  const [isAdopterEditModalVisible, setIsAdopterEditModalVisible] = useState(false);
  const [adopterData, setAdopterData] = useState({ name: '', contact: '', imageUri: '' });
  const router = useRouter();
 
  useEffect(() => {
    console.log("Pets updated in adoptions screen");
  }, [pets]);

  const handlePetPress = (pet) => {
    setSelectedPet(pet);
    setIsPetDetailsModalVisible(true);
  };

  const handleAdopterPress = (pet) => {
    setSelectedPet(pet); 
    if (pet.adopterInfo) {
      setAdopterData({
        name: pet.adopterInfo.name || '',
        contact: pet.adopterInfo.contact || '',
        imageUri: pet.adopterInfo.imageUri || ''
      });
    }
    setIsAdopterEditModalVisible(true);
  };

  const pickAdopterImage = async () => { 
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (status !== 'granted') {
      alert('Sorry, we need camera roll permissions to make this work!');
      return;
    }
 
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1], 
      quality: 1,
    });

    if (!result.canceled) { 
      setAdopterData({ ...adopterData, imageUri: result.assets[0].uri });
    }
  };

  const handleSaveAdopterInfo = async () => {
    if (!selectedPet) return;

    try { 
      const updatedPet = {
        ...selectedPet,
        adopterInfo: adopterData
      };
 
      await updatePet(updatedPet);
       
      setIsAdopterEditModalVisible(false);
    } catch (error) {
      console.error("Error updating adopter info:", error);
    }
  };

  const handleModalClose = (statusChanged = false) => {
    setIsPetDetailsModalVisible(false);
    setSelectedPet(null);
     
    if (statusChanged) {
      console.log("Status changed, navigating to home");
      setTimeout(() => {
        router.replace('/(tabs)/index');
      }, 300);  
    }
  };

  const renderAdoptionItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.adoptionCard}
      onPress={() => handlePetPress(item)}
    >
      {/* Pet Image */}
      {item.imageUri ? (
        <Image source={{ uri: item.imageUri }} style={styles.petImage} />
      ) : (
        <View style={[styles.petImage, styles.placeholder]} />
      )}

      {/* Center Content */}
      <View style={styles.textContainer}>
        <Text style={styles.petName}>{item.name}</Text>
        {item.adopterInfo && (
          <>
            <Text style={styles.adopterName}>{item.adopterInfo.name}</Text>
            <Text style={styles.contactInfo}>{item.adopterInfo.contact}</Text>
          </>
        )}
        <Text style={styles.adoptionDate}>
          {item.adoptionDate ? new Date(item.adoptionDate).toLocaleDateString() : 'No adoption date'}
        </Text>
      </View>

      {/* Adopter Image - Make it touchable to edit adopter info */}
      <TouchableOpacity onPress={() => handleAdopterPress(item)}>
        {item.adopterInfo?.imageUri ? (
          <View style={styles.adopterImageContainer}>
            <Image source={{ uri: item.adopterInfo.imageUri }} style={styles.adopterImage} />
            <View style={styles.editBadge}>
              <FontAwesome name="pencil" size={10} color="#fff" />
            </View>
          </View>
        ) : (
          <View style={[styles.adopterImage, styles.placeholder, styles.adopterImageContainer]}>
            <FontAwesome name="user" size={20} color="#C7C7C7" />
            <View style={styles.editBadge}>
              <FontAwesome name="pencil" size={10} color="#fff" />
            </View>
          </View>
        )}
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>Adoption History</Text>
         
        <View style={styles.statsContainer}>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>{adoptedPets.length}</Text>
            <Text style={styles.statLabel}>Total Adopted Pets</Text>
          </View>
        </View>
        
        {adoptedPets.length === 0 ? (
          <View style={styles.emptyContainer}>
            <FontAwesome name="paw" size={50} color="#E5E5E5" />
            <Text style={styles.emptyText}>No adoption history yet</Text>
          </View>
        ) : (
          <FlatList
            data={adoptedPets}
            renderItem={renderAdoptionItem}
            keyExtractor={item => item.id}
            contentContainerStyle={styles.list}
          />
        )}

        <PetDetailsModal 
          visible={isPetDetailsModalVisible}
          pet={selectedPet}
          onClose={handleModalClose}
          fromAdoptionHistory={true}
        />

        {/* Adopter Edit Modal */}
        <Modal
          visible={isAdopterEditModalVisible}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setIsAdopterEditModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Edit Adopter Information</Text>
                <TouchableOpacity 
                  style={styles.closeButton}
                  onPress={() => setIsAdopterEditModalVisible(false)}
                >
                  <FontAwesome name="close" size={20} color="#3F3E3F" />
                </TouchableOpacity>
              </View>

              <View style={styles.formContainer}> 
                <View style={styles.imagePickerContainer}>
                  <TouchableOpacity 
                    style={styles.imagePicker} 
                    onPress={pickAdopterImage}
                  >
                    {adopterData.imageUri ? (
                      <Image 
                        source={{ uri: adopterData.imageUri }} 
                        style={styles.adopterPreviewImage} 
                      />
                    ) : (
                      <View style={styles.adopterPlaceholder}>
                        <FontAwesome name="user" size={40} color="#C7C7C7" />
                      </View>
                    )}
                    <View style={styles.cameraIconContainer}>
                      <FontAwesome name="camera" size={16} color="#fff" />
                    </View>
                  </TouchableOpacity>
                  <Text style={styles.imagePickerText}>Tap to change photo</Text>
                </View>

                <Text style={styles.inputLabel}>Adopter Name</Text>
                <TextInput
                  style={styles.input}
                  value={adopterData.name}
                  onChangeText={(text) => setAdopterData({...adopterData, name: text})}
                  placeholder="Enter adopter's name"
                />

                <Text style={styles.inputLabel}>Contact Information</Text>
                <TextInput
                  style={styles.input}
                  value={adopterData.contact}
                  onChangeText={(text) => setAdopterData({...adopterData, contact: text})}
                  placeholder="Enter contact information"
                  keyboardType="phone-pad"
                />

                <TouchableOpacity 
                  style={styles.saveButton}
                  onPress={handleSaveAdopterInfo}
                >
                  <Text style={styles.saveButtonText}>Save Changes</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#3F3E3F',
    textAlign: 'center',
    marginVertical: 20,
  },
  statsContainer: {
    marginBottom: 20,
    alignItems: 'center',
  },
  statBox: {
    backgroundColor: '#F8F8F8', 
    borderRadius: 12,
    padding: 15,
    width: '80%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FF8C94',  
    marginRight: 10,
  },
  statLabel: {
    fontSize: 16,
    color: '#3F3E3F',
  },
  statIcon: {
    marginLeft: 10,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 50,
  },
  emptyText: {
    fontSize: 18,
    color: '#838383',
    marginTop: 15,
  },
  list: {
    paddingBottom: 20,
  },
  adoptionCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 15,
    marginBottom: 15,
    elevation: 2,
    shadowColor: '#353566',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 30,
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  petImage: {
    width: 70,
    height: 70,
    borderRadius: 35,
    marginRight: 15,
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  petName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#3F3E3F',
    marginBottom: 4,
  },
  adopterName: {
    fontSize: 16,
    color: '#3F3E3F',
    marginBottom: 2,
  },
  contactInfo: {
    fontSize: 14,
    color: '#838383',
    marginBottom: 4,
  },
  adoptionDate: {
    fontSize: 14,
    color: '#FF8C94',
    fontStyle: 'italic',
  },
  adopterImageContainer: {
    position: 'relative',
  },
  adopterImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginLeft: 10,
  },
  editBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#81CBF9',
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#fff',
  },
  placeholder: {
    backgroundColor: '#E5E5E5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '85%',
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    paddingBottom: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#3F3E3F',
  },
  closeButton: {
    padding: 5,
  },
  formContainer: {
    marginBottom: 10,
  },
  
  // Image picker styles
  imagePickerContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  imagePicker: {
    position: 'relative',
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  adopterPreviewImage: {
    width: '100%',
    height: '100%',
  },
  adopterPlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: '#F8F8F8',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cameraIconContainer: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#81CBF9',
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  imagePickerText: {
    fontSize: 14,
    color: '#81CBF9',
    marginBottom: 10,
  },
  
  inputLabel: {
    fontSize: 14,
    color: '#838383',
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
    fontSize: 16,
  },
  saveButton: {
    backgroundColor: '#81CBF9',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
}); 
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, SafeAreaView, Modal } from 'react-native';
import { usePets } from '../PetContext';
import { FontAwesome } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import AddPetForm from '../../components/AddPetForm';
import PetDetailsModal from '../../components/PetDetailsModal';

export default function PetsScreen() {
  const { pets } = usePets();
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [isAddPetModalVisible, setIsAddPetModalVisible] = useState(false);
  const [selectedPet, setSelectedPet] = useState(null);
  const [isPetDetailsModalVisible, setIsPetDetailsModalVisible] = useState(false);
  const router = useRouter();

  const filteredPets = pets.filter(pet => {
    if (selectedFilter === 'all') return true;
    return pet.species.toLowerCase() === selectedFilter;
  });

  const handlePetPress = (pet) => {
    setSelectedPet(pet);
    setIsPetDetailsModalVisible(true);
  };

  const PetCard = ({ pet }) => (
    <TouchableOpacity 
      style={styles.petCard}
      onPress={() => handlePetPress(pet)}
    >
      <Image
        source={{ uri: pet.imageUri }}
        style={styles.petImage}
      />
      <View style={styles.petInfo}>
        <Text style={styles.petName}>{pet.name}</Text>
        <Text style={styles.petDetail}>Gender: {pet.gender}</Text>
        <Text style={styles.petDetail}>Breed: {pet.breed}</Text>
        <Text style={styles.petDetail}>Age: {pet.age}</Text>
        <Text style={styles.petDescription}>"{pet.description}"</Text>
        <View style={styles.statusContainer}>
          <Text style={[
            styles.statusText,
            pet.adoptionStatus === 'Available' && styles.statusAvailable,
            pet.adoptionStatus === 'Adopted' && styles.statusAdopted,
            pet.adoptionStatus === 'Reserved' && styles.statusReserved,
          ]}>
            {pet.adoptionStatus}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>Pet List</Text>
        
        <View style={styles.filterContainer}>
          <TouchableOpacity 
            style={[
              styles.filterButton,
              selectedFilter === 'cat' && styles.filterButtonActive
            ]}
            onPress={() => setSelectedFilter('cat')}
          >
            <Image 
              source={require('../../assets/images/cat-icon.png')} 
              style={styles.filterIcon}
            />
            <Text style={styles.filterText}>Cats</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[
              styles.filterButton,
              selectedFilter === 'dog' && styles.filterButtonActive
            ]}
            onPress={() => setSelectedFilter('dog')}
          >
            <Image 
              source={require('../../assets/images/dog-icon.png')} 
              style={styles.filterIcon}
            />
            <Text style={styles.filterText}>Dogs</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.petList}>
          {filteredPets.map(pet => (
            <PetCard key={pet.id} pet={pet} />
          ))}
        </ScrollView>

        <TouchableOpacity 
          style={styles.floatingButton}
          onPress={() => setIsAddPetModalVisible(true)}
        >
          <FontAwesome name="plus" size={24} color="#fff" />
        </TouchableOpacity>

        <Modal
          visible={isAddPetModalVisible}
          animationType="slide"
          onRequestClose={() => setIsAddPetModalVisible(false)}
        >
          <AddPetForm 
            onClose={() => setIsAddPetModalVisible(false)}
            onSubmit={(newPet) => {
              setIsAddPetModalVisible(false);
            }}
          />
        </Modal>

        <PetDetailsModal 
          visible={isPetDetailsModalVisible}
          pet={selectedPet}
          onClose={() => {
            setIsPetDetailsModalVisible(false);
            setSelectedPet(null);
          }}
        />
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
    paddingTop: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#3F3E3F',
    textAlign: 'center',
    marginVertical: 20,
  },
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 48,
    marginBottom: 20,
  },
  filterButton: {
    width: 101,
    height: 36,
    backgroundColor: '#fff',
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    shadowColor: '#3D356B',
    shadowOffset: { width: 0, height: 12.52 },
    shadowOpacity: 0.065,
    shadowRadius: 11.65,
    elevation: 2,
  },
  filterButtonActive: {
    backgroundColor: '#FFCBB4',
  },
  filterIcon: {
    width: 24,
    height: 24,
  },
  filterText: {
    fontSize: 16,
    color: '#3F3E3F',
  },
  petList: {
    flex: 1,
  },
  petCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 15,
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#353566',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 30,
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  petImage: {
    width: 89,
    height: 111,
    borderRadius: 8,
    marginRight: 12,
  },
  petInfo: {
    flex: 1,
    paddingVertical: 4,
  },
  petName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#3F3E3F',
    marginBottom: 4,
  },
  petDetail: {
    fontSize: 14,
    color: '#3F3E3F',
    marginBottom: 4,
  },
  petDescription: {
    fontSize: 14,
    color: '#838383',
    marginBottom: 8,
    fontStyle: 'italic',
  },
  statusContainer: {
    alignItems: 'flex-end',
  },
  statusText: {
    fontSize: 14,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 4,
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
  floatingButton: {
    position: 'absolute',
    bottom: 96,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#FFB08C',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    zIndex: 1,
  },
}); 
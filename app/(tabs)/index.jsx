import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, SafeAreaView, TextInput } from 'react-native';
import { usePets } from '../PetContext';
import { FontAwesome } from '@expo/vector-icons';
import PetDetailsModal from '../../components/PetDetailsModal';

export default function HomeScreen() {
  const { pets, deletePet, updatePetStatus } = usePets();
  const [selectedPet, setSelectedPet] = useState(null);
  const [isPetDetailsModalVisible, setIsPetDetailsModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Filter out adopted pets first, then apply search filter
  const filteredPets = pets
    .filter(pet => pet.adoptionStatus !== 'Adopted')
    .filter(pet => {
      if (!searchQuery) return true;
      const query = searchQuery.toLowerCase();
      return (
        pet.name.toLowerCase().includes(query) ||
        pet.breed.toLowerCase().includes(query) ||
        (pet.adoptionStatus && pet.adoptionStatus.toLowerCase().includes(query))
      );
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
        <Text style={styles.petDescription} numberOfLines={3} ellipsizeMode="tail">
          "{pet.description}"
        </Text>
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
        <Text style={styles.title}>Time to manage your pets!</Text>
        
        <View style={styles.searchContainer}>
          <FontAwesome name="search" size={20} color="#C4C4C4" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search pets..."
            placeholderTextColor="#C4C4C4"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        <ScrollView style={styles.petList}>
          {filteredPets.map(pet => (
            <PetCard key={pet.id} pet={pet} />
          ))}
        </ScrollView>

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
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    borderColor: '#C7C7C7',   
    borderWidth: 0.5,
    marginBottom: 20,
    paddingHorizontal: 15,
    height: 50,
    shadowColor: '#3D356B',
    shadowOffset: { width: 0, height: 12.52 },
    shadowOpacity: 0.065,
    shadowRadius: 11.65,
    elevation: 2,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
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
    height: 140,
    borderRadius: 8,
    marginRight: 12,
    alignSelf: 'flex-start',
    marginTop: 4,
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
  }
});
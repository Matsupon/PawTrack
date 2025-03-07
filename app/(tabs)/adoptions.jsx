import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, FlatList, Image, TouchableOpacity } from 'react-native';
import { usePets } from '../PetContext';
import PetDetailsModal from '../../components/PetDetailsModal';
import { useRouter } from 'expo-router';

export default function AdoptionsScreen() {
  const { pets } = usePets();
  const adoptedPets = pets.filter(pet => pet.adoptionStatus === 'Adopted');
  const [selectedPet, setSelectedPet] = useState(null);
  const [isPetDetailsModalVisible, setIsPetDetailsModalVisible] = useState(false);
  const router = useRouter();

  // Add this useEffect to refresh the list when pets change
  useEffect(() => {
    console.log("Pets updated in adoptions screen");
  }, [pets]);

  const handlePetPress = (pet) => {
    setSelectedPet(pet);
    setIsPetDetailsModalVisible(true);
  };

  const handleModalClose = (statusChanged = false) => {
    setIsPetDetailsModalVisible(false);
    setSelectedPet(null);
    
    // If status was changed to Available, navigate to home screen
    if (statusChanged) {
      console.log("Status changed, navigating to home");
      setTimeout(() => {
        router.replace('/(tabs)');
      }, 300); // Small delay to ensure modal is fully closed
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

      {/* Adopter Image */}
      {item.adopterInfo?.imageUri ? (
        <Image source={{ uri: item.adopterInfo.imageUri }} style={styles.adopterImage} />
      ) : (
        <View style={[styles.adopterImage, styles.placeholder]} />
      )}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>Adoption History</Text>
        
        {adoptedPets.length === 0 ? (
          <Text style={styles.emptyText}>No adoption history yet</Text>
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
    padding: 16,
    paddingTop: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#3F3E3F',
    textAlign: 'center',
    marginBottom: 20,
  },
  adoptionCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#353566',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 30,
    alignItems: 'center',
  },
  petImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 16,
  },
  adopterImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginLeft: 'auto',
  },
  textContainer: {
    flex: 1,
    marginRight: 10,
  },
  petName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#3F3E3F',
    marginBottom: 4,
  },
  adopterName: {
    fontSize: 14,
    color: '#3F3E3F',
  },
  adoptionDate: {
    fontSize: 12,
    color: '#838383',
    marginTop: 8,
  },
  emptyText: {
    textAlign: 'center',
    color: '#838383',
    fontSize: 16,
    marginTop: 40,
  },
  list: {
    paddingBottom: 20,
  },
  placeholder: {
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  contactInfo: {
    fontSize: 12,
    color: '#838383',
  },
}); 
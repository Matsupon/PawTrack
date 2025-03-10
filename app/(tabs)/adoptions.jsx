import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, FlatList, Image, TouchableOpacity } from 'react-native';
import { usePets } from '../PetContext';
import PetDetailsModal from '../../components/PetDetailsModal';
import { useRouter } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';

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
        
        {/* Add total adopted pets counter */}
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
    color: '#FF8C94', // Pink color for adoption theme
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
  adopterImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginLeft: 10,
  },
  placeholder: {
    backgroundColor: '#E5E5E5',
    justifyContent: 'center',
    alignItems: 'center',
  },
}); 
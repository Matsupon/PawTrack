import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, FlatList } from 'react-native';
import { usePets } from '../PetContext';

export default function AdoptionsScreen() {
  const { pets } = usePets();
  
  // Filter only adopted pets
  const adoptedPets = pets.filter(pet => pet.status === 'Adopted');

  const renderAdoptionItem = ({ item }) => (
    <View style={styles.adoptionCard}>
      <Text style={styles.petName}>{item.name}</Text>
      <Text style={styles.petDetails}>Type: {item.type}</Text>
      <Text style={styles.petDetails}>Breed: {item.breed}</Text>
      <Text style={styles.petDetails}>Age: {item.age}</Text>
      <Text style={styles.adoptionDate}>Adopted on: {item.adoptionDate || 'Date not available'}</Text>
    </View>
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
            keyExtractor={(item) => item.id}
            renderItem={renderAdoptionItem}
            contentContainerStyle={styles.listContainer}
          />
        )}
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
  listContainer: {
    paddingBottom: 20,
  },
  adoptionCard: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#353566',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 30,
  },
  petName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#3F3E3F',
    marginBottom: 8,
  },
  petDetails: {
    fontSize: 14,
    color: '#3F3E3F',
    marginBottom: 4,
  },
  adoptionDate: {
    fontSize: 14,
    color: '#EF8888',
    marginTop: 8,
    fontStyle: 'italic',
  },
  emptyText: {
    textAlign: 'center',
    color: '#838383',
    fontSize: 16,
    marginTop: 40,
  },
}); 
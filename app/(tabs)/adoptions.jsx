import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, FlatList, Image } from 'react-native';
import { usePets } from '../PetContext';

export default function AdoptionsScreen() {
  const { pets } = usePets();
  
  // Filter only adopted pets
  const adoptedPets = pets.filter(pet => pet.adoptionStatus === 'Adopted');

  const renderAdoptionItem = ({ item }) => (
    <View style={styles.adoptionCard}>
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
  listContainer: {
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
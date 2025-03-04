import React, { useState } from 'react';
import { View, FlatList, Button, Text, StyleSheet, SafeAreaView, TextInput } from 'react-native';
import { usePets } from '../PetContext';
import PetDetailsModal from '../../components/PetDetailsModal';
import { FontAwesome } from '@expo/vector-icons';

export default function HomeScreen() {
  const { pets, deletePet, updatePetStatus } = usePets();
  const [selectedPet, setSelectedPet] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredPets = pets.filter(pet => {
    const query = searchQuery.toLowerCase();
    return (
      pet.name.toLowerCase().includes(query) ||
      pet.breed.toLowerCase().includes(query) ||
      pet.status.toLowerCase().includes(query)
    );
  });

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

        <FlatList
          data={filteredPets}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.petItem}>
              <Text>{item.name} ({item.breed})</Text>
              <Text>Age: {item.age} - Status: {item.status}</Text>
              <View style={styles.buttonContainer}>
                <Button
                  title="Update Status"
                  onPress={() => {
                    setSelectedPet(item);
                    setIsModalVisible(true);
                  }}
                />
                <Button title="Delete" onPress={() => deletePet(item.id)} />
              </View>
            </View>
          )}
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
    backgroundColor: '#fff',
  },
  title: { 
    fontSize: 24, 
    fontWeight: 'bold', 
    marginBottom: 26, 
    textAlign: 'center',
    color: '#3F3E3F',
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
  petItem: { 
    padding: 16, 
    borderBottomWidth: 1, 
    borderBottomColor: '#ccc',
    backgroundColor: '#fff',
  },
  buttonContainer: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    marginTop: 8 
  }
});
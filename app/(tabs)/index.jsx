import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, SafeAreaView, FlatList, Dimensions } from 'react-native';
import { usePets } from '../PetContext'; 
import PetDetailsModal from '../../components/PetDetailsModal';
import { useRouter } from 'expo-router';

export default function HomeScreen() {
  const { pets } = usePets();
  const [selectedPet, setSelectedPet] = useState(null);
  const [isPetDetailsModalVisible, setIsPetDetailsModalVisible] = useState(false);
  const router = useRouter();
 
  const availablePets = pets.filter(pet => pet.adoptionStatus === 'Available').length;
  const reservedPets = pets.filter(pet => pet.adoptionStatus === 'Reserved').length;
 
  const recentPets = [...pets]
    .filter(pet => pet.adoptionStatus !== 'Adopted')
    .sort((a, b) => { 
      return parseInt(b.id) - parseInt(a.id);
    })
    .slice(0, 3);  

  const handlePetPress = (pet) => {
    setSelectedPet(pet);
    setIsPetDetailsModalVisible(true);
  };

  const handleViewAllPets = () => {
    router.push('/(tabs)/pets');
  };

  const renderPetCard = ({ item }) => (
    <TouchableOpacity 
      style={styles.recentPetCard}
      onPress={() => handlePetPress(item)}
    >
      <Image
        source={{ uri: item.imageUri }}
        style={styles.recentPetImage}
        resizeMode="cover"
      />
      <View style={styles.recentPetInfo}>
        <Text style={styles.recentPetName}>{item.name}</Text>
        <Text style={styles.recentPetBreed}>{item.breed}</Text>
        <View style={styles.statusContainer}>
          <Text style={[
            styles.statusText,
            item.adoptionStatus === 'Available' && styles.statusAvailable,
            item.adoptionStatus === 'Reserved' && styles.statusReserved,
          ]}>
            {item.adoptionStatus}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container}>
        <Text style={styles.title}>Time to manage your pets!</Text>
         
        <View style={styles.statsContainer}>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>{availablePets}</Text>
            <Text style={styles.statLabel}>Available Pets</Text>
          </View>
          
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>{reservedPets}</Text>
            <Text style={styles.statLabel}>Reserved Pets</Text>
          </View>
        </View>
         
        <View style={styles.recentPetsSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recently Added Pets</Text>
            <TouchableOpacity onPress={handleViewAllPets}>
              <Text style={styles.viewAllText}>View All</Text>
            </TouchableOpacity>
          </View>
          
          {recentPets.length > 0 ? (
            <FlatList
              data={recentPets}
              renderItem={renderPetCard}
              keyExtractor={item => item.id}
              horizontal={true}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.recentPetsList}
              ItemSeparatorComponent={() => <View style={{ width: 15 }} />}
            />
          ) : (
            <Text style={styles.noPetsText}>No pets available yet</Text>
          )}
        </View>

        <PetDetailsModal 
          visible={isPetDetailsModalVisible}
          pet={selectedPet}
          onClose={() => {
            setIsPetDetailsModalVisible(false);
            setSelectedPet(null);
          }}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const { width } = Dimensions.get('window');
const cardWidth = width * 0.75;

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
    fontSize: 25,
    fontWeight: 'bold',
    color: '#3F3E3F',
    textAlign: 'center',
    marginVertical: 20,
    marginBottom: 35,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 55,
  },
  statBox: {
    flex: 1,
    backgroundColor: '#F8F8F8',
    borderRadius: 12,
    padding: 12,
    marginHorizontal: 8,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
    height: 90,
  },
  statNumber: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#81CBF9',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: '#3F3E3F',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#3F3E3F',
  },
  viewAllText: {
    fontSize: 16,
    color: '#81CBF9',
  },
  recentPetsSection: {
    marginBottom: 30,
  },
  recentPetsList: {
    paddingVertical: 10,
  },
  recentPetCard: {
    width: cardWidth,
    backgroundColor: '#fff',
    borderRadius: 15,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  recentPetImage: {
    width: '100%',
    height: 180,
  },
  recentPetInfo: {
    padding: 15,
  },
  recentPetName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#3F3E3F',
    marginBottom: 5,
  },
  recentPetBreed: {
    fontSize: 14,
    color: '#838383',
    marginBottom: 8,
  },
  statusContainer: {
    alignItems: 'flex-start',
  },
  statusText: {
    fontSize: 14,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 4,
  },
  statusAvailable: {
    color: '#64D2A4',
    backgroundColor: 'rgba(100, 210, 164, 0.1)',
  },
  statusReserved: {
    color: '#E2E02D',
    backgroundColor: 'rgba(226, 224, 45, 0.1)',
  },
  noPetsText: {
    fontSize: 16,
    color: '#838383',
    fontStyle: 'italic',
    textAlign: 'center',
    marginVertical: 20,
  },
  quickActionsSection: {
    marginBottom: 30,
  },
  quickActionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15,
  },
  actionButton: {
    flex: 1,
    backgroundColor: '#F8F8F8',
    borderRadius: 12,
    padding: 15,
    marginHorizontal: 8,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  actionButtonText: {
    fontSize: 14,
    color: '#3F3E3F',
    marginTop: 8,
    textAlign: 'center',
  },
});
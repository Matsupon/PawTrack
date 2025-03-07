import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, Modal, TouchableOpacity, Alert } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import EditPetModal from './EditPetModal';
import { usePets } from '../app/PetContext';

export default function PetDetailsModal({ visible, pet, onClose }) {
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const { deletePet } = usePets();

  if (!pet) return null;

  const handleDelete = () => {
    // Instead of using Alert, set state to show our custom confirmation
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    try {
      console.log("Deleting pet with ID:", pet.id);
      await deletePet(pet.id);
      setShowDeleteConfirm(false);
      onClose(); // Close the modal after deletion
    } catch (error) {
      console.error("Error deleting pet:", error);
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      onRequestClose={onClose}
      transparent={false}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <FontAwesome name="close" size={24} color="#3F3E3F" />
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.editButton}
            onPress={() => setIsEditModalVisible(true)}
          >
            <FontAwesome name="edit" size={20} color="#fff" />
            <Text style={styles.editButtonText}>Edit</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.scrollView}>
          <Image 
            source={{ uri: pet.imageUri }} 
            style={styles.image}
            resizeMode="cover"
          />
          
          <View style={styles.infoContainer}>
            <Text style={styles.name}>{pet.name}</Text>
            
            <View style={styles.detailRow}>
              <View style={styles.detailItem}>
                <FontAwesome name="paw" size={20} color="#FFB08C" />
                <Text style={styles.detailLabel}>Species</Text>
                <Text style={styles.detailValue}>{pet.species}</Text>
              </View>
              
              <View style={styles.detailItem}>
                <FontAwesome name="info-circle" size={20} color="#FFB08C" />
                <Text style={styles.detailLabel}>Breed</Text>
                <Text style={styles.detailValue}>{pet.breed}</Text>
              </View>
            </View>

            <View style={styles.detailRow}>
              <View style={styles.detailItem}>
                <FontAwesome name="venus-mars" size={20} color="#FFB08C" />
                <Text style={styles.detailLabel}>Gender</Text>
                <Text style={styles.detailValue}>{pet.gender}</Text>
              </View>
              
              <View style={styles.detailItem}>
                <FontAwesome name="calendar" size={20} color="#FFB08C" />
                <Text style={styles.detailLabel}>Age</Text>
                <Text style={styles.detailValue}>{pet.age}</Text>
              </View>
            </View>

            <View style={styles.healthSection}>
              <Text style={styles.sectionTitle}>Health Information</Text>
              
              <View style={styles.healthRow}>
                <View style={styles.healthItem}>
                  <FontAwesome name="medkit" size={20} color="#FFB08C" />
                  <Text style={styles.healthLabel}>Health Status</Text>
                  <Text style={styles.healthValue}>{pet.healthStatus}</Text>
                </View>
                
                <View style={styles.healthItem}>
                  <FontAwesome name="balance-scale" size={20} color="#FFB08C" />
                  <Text style={styles.healthLabel}>Weight</Text>
                  <Text style={styles.healthValue}>{pet.weight} kg</Text>
                </View>
              </View>

              <View style={styles.statusRow}>
                <View style={styles.statusItem}>
                  <FontAwesome 
                    name={pet.vaccinated ? "check-circle" : "times-circle"} 
                    size={20} 
                    color={pet.vaccinated ? "#64D2A4" : "#EF8888"} 
                  />
                  <Text style={styles.statusLabel}>Vaccinated</Text>
                </View>
                
                <View style={styles.statusItem}>
                  <FontAwesome 
                    name={pet.neutered ? "check-circle" : "times-circle"} 
                    size={20} 
                    color={pet.neutered ? "#64D2A4" : "#EF8888"} 
                  />
                  <Text style={styles.statusLabel}>Neutered</Text>
                </View>
              </View>
            </View>

            <View style={styles.descriptionSection}>
              <Text style={styles.sectionTitle}>Description</Text>
              <Text style={styles.description}>{pet.description}</Text>
            </View>

            <View style={styles.adoptionStatus}>
              <Text style={[
                styles.adoptionStatusText,
                pet.adoptionStatus === 'Available' && styles.statusAvailable,
                pet.adoptionStatus === 'Adopted' && styles.statusAdopted,
                pet.adoptionStatus === 'Reserved' && styles.statusReserved,
              ]}>
                {pet.adoptionStatus}
              </Text>
            </View>
          </View>
        </ScrollView>

        {/* Fixed position button at the bottom */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={handleDelete}
          >
            <Text style={styles.buttonText}>Delete Pet</Text>
          </TouchableOpacity>
        </View>

        {/* Custom Delete Confirmation Modal */}
        {showDeleteConfirm && (
          <View style={styles.confirmOverlay}>
            <View style={styles.confirmBox}>
              <Text style={styles.confirmTitle}>Delete Pet</Text>
              <Text style={styles.confirmMessage}>
                Are you sure you want to delete this pet?
              </Text>
              <View style={styles.confirmButtons}>
                <TouchableOpacity 
                  style={[styles.confirmButton, styles.cancelButton]}
                  onPress={() => setShowDeleteConfirm(false)}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.confirmButton, styles.deleteConfirmButton]}
                  onPress={confirmDelete}
                >
                  <Text style={styles.confirmButtonText}>Delete</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}

        <EditPetModal 
          visible={isEditModalVisible}
          pet={pet}
          onClose={() => setIsEditModalVisible(false)}
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 10,
    backgroundColor: '#fff',
    zIndex: 1,
  },
  closeButton: {
    padding: 10,
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#81CBF9', // Pastel blue
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 5,
  },
  editButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  scrollView: {
    flex: 1,
  },
  image: {
    width: '100%',
    height: 300,
    marginTop: 20, // Add margin to move image down
  },
  infoContainer: {
    padding: 20,
  },
  name: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#3F3E3F',
    marginBottom: 20,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  detailItem: {
    flex: 1,
    alignItems: 'center',
  },
  detailLabel: {
    fontSize: 14,
    color: '#838383',
    marginTop: 5,
  },
  detailValue: {
    fontSize: 16,
    color: '#3F3E3F',
    fontWeight: '500',
    marginTop: 2,
  },
  healthSection: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#F8F8F8',
    borderRadius: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#3F3E3F',
    marginBottom: 15,
  },
  healthRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  healthItem: {
    flex: 1,
    alignItems: 'center',
  },
  healthLabel: {
    fontSize: 14,
    color: '#838383',
    marginTop: 5,
  },
  healthValue: {
    fontSize: 16,
    color: '#3F3E3F',
    fontWeight: '500',
    marginTop: 2,
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 15,
  },
  statusItem: {
    alignItems: 'center',
  },
  statusLabel: {
    fontSize: 14,
    color: '#838383',
    marginTop: 5,
  },
  descriptionSection: {
    marginTop: 20,
  },
  description: {
    fontSize: 16,
    color: '#3F3E3F',
    lineHeight: 24,
  },
  adoptionStatus: {
    marginTop: 20,
    alignItems: 'flex-end',
  },
  adoptionStatusText: {
    fontSize: 16,
    fontWeight: '600',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 8,
  },
  statusAvailable: {
    color: '#64D2A4',
    backgroundColor: 'rgba(100, 210, 164, 0.1)',
  },
  statusAdopted: {
    color: '#EF8888',
    backgroundColor: 'rgba(239, 136, 136, 0.1)',
  },
  statusReserved: {
    color: '#E2E02D',
    backgroundColor: 'rgba(226, 224, 45, 0.1)',
  },
  buttonContainer: {
    padding: 16,
    paddingBottom: 30,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  deleteButton: {
    backgroundColor: '#FF3B30',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  
  // Custom confirmation modal styles
  confirmOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000, // High z-index to ensure it's on top
  },
  confirmBox: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  confirmTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#3F3E3F',
  },
  confirmMessage: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
    color: '#3F3E3F',
  },
  confirmButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  confirmButton: {
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 5,
  },
  cancelButton: {
    backgroundColor: '#f0f0f0',
  },
  deleteConfirmButton: {
    backgroundColor: '#FF3B30',
  },
  cancelButtonText: {
    color: '#3F3E3F',
    fontWeight: 'bold',
  },
  confirmButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
}); 
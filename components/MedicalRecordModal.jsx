import React, { useState } from 'react';
import { View, Text, Modal, StyleSheet, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { usePets } from '../app/PetContext';

export default function MedicalRecordModal({ visible, onClose, pet, medicalRecords = [] }) {
  const { updateMedicalRecords, deleteMedicalRecord } = usePets();
  const [showForm, setShowForm] = useState(false);
  const [date, setDate] = useState('');
  const [treatmentType, setTreatmentType] = useState('');
  const [notes, setNotes] = useState('');
  const [vetName, setVetName] = useState('');
  const [editingIndex, setEditingIndex] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [recordToDelete, setRecordToDelete] = useState(null);

  const handleSave = async () => {
    if (!date || !treatmentType || !notes || !vetName) {
      alert('Please fill in all required fields');
      return;
    }

    const newRecord = {
      date,
      treatmentType,
      notes,
      vetName
    };

    let updatedRecords;
    if (editingIndex !== null) {
      // Update existing record
      updatedRecords = [...medicalRecords];
      updatedRecords[editingIndex] = newRecord;
    } else {
      // Add new record
      updatedRecords = [...medicalRecords, newRecord];
    }

    try {
      await updateMedicalRecords(pet.id, updatedRecords);
      // Reset form and state
      setDate('');
      setTreatmentType('');
      setNotes('');
      setVetName('');
      setShowForm(false);
      setEditingIndex(null);
    } catch (error) {
      console.error('Error saving medical record:', error);
      alert('Failed to save medical record. Please try again.');
    }
  };

  const handleEdit = (record, index) => {
    setDate(record.date);
    setTreatmentType(record.treatmentType);
    setNotes(record.notes);
    setVetName(record.vetName);
    setEditingIndex(index);
    setShowForm(true);
  };

  const handleDelete = (index) => {
    setRecordToDelete(index);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    try {
      await deleteMedicalRecord(pet.id, recordToDelete);
      setShowDeleteConfirm(false);
      setRecordToDelete(null);
    } catch (error) {
      console.error('Error deleting medical record:', error);
      alert('Failed to delete medical record. Please try again.');
    }
  };

  const handleClose = () => {
    setShowForm(false);
    setEditingIndex(null);
    setDate('');
    setTreatmentType('');
    setNotes('');
    setVetName('');
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={handleClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.header}>
            <Text style={styles.title}>Medical Records</Text>
            <TouchableOpacity onPress={handleClose}>
              <FontAwesome name="close" size={24} color="#3F3E3F" />
            </TouchableOpacity>
          </View>

          {showForm ? (
            <View style={styles.formContainer}>
              <TextInput
                style={styles.input}
                placeholder="Date (e.g., Apr 1, 2024)"
                value={date}
                onChangeText={setDate}
              />

              <TextInput
                style={styles.input}
                placeholder="Treatment Type"
                value={treatmentType}
                onChangeText={setTreatmentType}
              />

              <TextInput
                style={[styles.input, styles.notesInput]}
                placeholder="Notes"
                value={notes}
                onChangeText={setNotes}
                multiline
                numberOfLines={4}
              />

              <TextInput
                style={styles.input}
                placeholder="Vet Name"
                value={vetName}
                onChangeText={setVetName}
              />

              <TouchableOpacity style={styles.addButton} onPress={handleSave}>
                <Text style={styles.addButtonText}>
                  {editingIndex !== null ? 'Save Changes' : 'Add Medical Record'}
                </Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.contentContainer}>
              <ScrollView style={styles.recordsList}>
                {medicalRecords.map((record, index) => (
                  <View key={index} style={styles.recordItem}>
                    <View style={styles.recordHeader}>
                      <TouchableOpacity 
                        style={styles.editButton}
                        onPress={() => handleEdit(record, index)}
                      >
                        <FontAwesome name="edit" size={16} color="#3F3E3F" />
                      </TouchableOpacity>
                      <TouchableOpacity 
                        style={styles.deleteButton}
                        onPress={() => handleDelete(index)}
                      >
                        <FontAwesome name="trash" size={16} color="#FF3B30" />
                      </TouchableOpacity>
                    </View>
                    <Text style={styles.recordDate}>🗓️ {record.date}</Text>
                    <Text style={styles.recordDetail}>• Treatment: {record.treatmentType}</Text>
                    <Text style={styles.recordDetail}>• Notes: {record.notes}</Text>
                    <Text style={styles.recordDetail}>• Vet: {record.vetName}</Text>
                  </View>
                ))}
              </ScrollView>
              
              <TouchableOpacity 
                style={styles.addRecordButton}
                onPress={() => setShowForm(true)}
              >
                <Text style={styles.addRecordButtonText}>Add Medical Record</Text>
              </TouchableOpacity>
            </View>
          )}

          {showDeleteConfirm && (
            <View style={styles.confirmOverlay}>
              <View style={styles.confirmBox}>
                <Text style={styles.confirmTitle}>Delete Medical Record</Text>
                <Text style={styles.confirmMessage}>
                  Are you sure you want to delete this medical record?
                </Text>
                <View style={styles.confirmButtons}>
                  <TouchableOpacity 
                    style={[styles.confirmButton, styles.cancelButton]}
                    onPress={() => {
                      setShowDeleteConfirm(false);
                      setRecordToDelete(null);
                    }}
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
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 10,
    width: '90%',
    maxWidth: 400,
    maxHeight: '80%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#3F3E3F',
  },
  contentContainer: {
    flex: 1,
  },
  recordsList: {
    padding: 20,
  },
  recordItem: {
    marginBottom: 20,
    padding: 15,
    backgroundColor: '#F8F8F8',
    borderRadius: 8,
    position: 'relative',
  },
  recordHeader: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 1,
  },
  editButton: {
    padding: 8,
    marginRight: 8,
  },
  deleteButton: {
    padding: 8,
  },
  recordDate: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#3F3E3F',
    marginBottom: 8,
  },
  recordDetail: {
    fontSize: 14,
    color: '#3F3E3F',
    marginBottom: 4,
  },
  formContainer: {
    padding: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
  },
  notesInput: {
    height: 100,
    textAlignVertical: 'top',
  },
  addButton: {
    backgroundColor: '#ccccff',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#3F3E3F',
    fontSize: 16,
    fontWeight: 'bold',
  },
  addRecordButton: {
    backgroundColor: '#ccccff',
    padding: 15,
    margin: 20,
    borderRadius: 8,
    alignItems: 'center',
  },
  addRecordButtonText: {
    color: '#3F3E3F',
    fontSize: 16,
    fontWeight: 'bold',
  },
  confirmOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  confirmBox: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    width: '80%',
    maxWidth: 400,
    alignItems: 'center',
  },
  confirmTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#3F3E3F',
    marginBottom: 10,
  },
  confirmMessage: {
    fontSize: 16,
    color: '#3F3E3F',
    textAlign: 'center',
    marginBottom: 20,
  },
  confirmButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  confirmButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
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
    textAlign: 'center',
    fontWeight: 'bold',
  },
  confirmButtonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
  },
}); 
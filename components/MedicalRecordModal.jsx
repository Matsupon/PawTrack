import React, { useState } from 'react';
import { View, Text, Modal, StyleSheet, TextInput, TouchableOpacity, ScrollView, SafeAreaView, KeyboardAvoidingView, Platform } from 'react-native';
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

    const newRecord = { date, treatmentType, notes, vetName };
    const updatedRecords = editingIndex !== null 
      ? medicalRecords.map((record, idx) => idx === editingIndex ? newRecord : record)
      : [...medicalRecords, newRecord];

    try {
      await updateMedicalRecords(pet.id, updatedRecords);
      setDate('');
      setTreatmentType('');
      setNotes('');
      setVetName('');
      setShowForm(false);
      setEditingIndex(null);
    } catch (error) {
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
    <Modal visible={visible} transparent animationType="slide" onRequestClose={handleClose}>
      <View style={styles.modalOverlay}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardAvoiding}
        >
          <SafeAreaView style={styles.safeArea}>
            {/* Centered modal container */}
            <View style={styles.modalContent}>
              <View style={styles.header}>
                <Text style={styles.title}>Medical Records</Text>
                <TouchableOpacity onPress={handleClose}>
                  <FontAwesome name="close" size={24} color="#3F3E3F" />
                </TouchableOpacity>
              </View>

              {showForm ? (
                <ScrollView 
                  style={styles.formContainer}
                  contentContainerStyle={styles.formContent}
                  keyboardShouldPersistTaps="handled"
                >
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
                </ScrollView>
              ) : medicalRecords.length === 0 ? (
                <View style={styles.emptyState}>
                  <TouchableOpacity 
                    style={styles.addRecordButton}
                    onPress={() => setShowForm(true)}
                  >
                    <Text style={styles.addRecordButtonText}>Add Medical Record</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <View style={styles.listContainer}>
                  <ScrollView 
                    style={styles.recordsList}
                    contentContainerStyle={styles.listContent}
                  >
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
            </View>
          </SafeAreaView>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-start', // Changed from 'center'
    alignItems: 'center',
    paddingTop: 60, // Add vertical offset
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 10,
    width: '90%',
    maxHeight: '90%',
    minHeight: 500,
    alignSelf: 'center',
    marginVertical: 20,
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
  formContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  formContent: {
    paddingBottom: 40,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  listContainer: {
    flex: 1,
    justifyContent: 'space-between',
  },
  recordsList: {
    flex: 1,
  },
  listContent: {
    padding: 20,
    paddingBottom: 10,
  },
  recordItem: {
    marginBottom: 20,
    padding: 15,
    backgroundColor: '#F8F8F8',
    borderRadius: 8,
  },
  recordHeader: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 1,
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
    marginTop: 10,
  },
  addRecordButton: {
    backgroundColor: '#ccccff',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    margin: 20,
  },
  addButtonText: {
    color: '#3F3E3F',
    fontSize: 16,
    fontWeight: 'bold',
  },
  confirmOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  confirmBox: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    width: '80%',
  },
  confirmButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
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
  confirmButtonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  cancelButtonText: {
    color: '#3F3E3F',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  safeArea: {
    flex: 1,
    width: '100%',
  },
  keyboardAvoiding: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
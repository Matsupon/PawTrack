import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { usePets } from '../app/PetContext';
import { FontAwesome } from '@expo/vector-icons';

export default function AddPetForm({ onClose, onSubmit }) {
  const { addPet } = usePets();
  const [petData, setPetData] = useState({
    name: '',
    type: '',
    breed: '',
    age: '',
    gender: '',
    description: '',
  });

  const handleSubmit = () => {
    addPet(petData);
    onSubmit(petData);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onClose}>
          <FontAwesome name="close" size={24} color="#3F3E3F" />
        </TouchableOpacity>
        <Text style={styles.title}>Add New Pet</Text>
      </View>

      <ScrollView style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder="Pet Name"
          value={petData.name}
          onChangeText={(text) => setPetData({ ...petData, name: text })}
        />
        {/* Add other input fields for type, breed, age, gender, description */}
        
        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>Add Pet</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#3F3E3F',
    marginLeft: 20,
  },
  form: {
    flex: 1,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
  },
  submitButton: {
    backgroundColor: '#FFB08C',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
}); 
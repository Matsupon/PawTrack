import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const PetContext = createContext();
const STORAGE_KEY = '@pawtrack_pets';

export const PetProvider = ({ children }) => {
  const [pets, setPets] = useState([]);
 
  useEffect(() => {
    loadPets();
  }, []);

  const loadPets = async () => {
    try {
      const storedPets = await AsyncStorage.getItem(STORAGE_KEY);
      if (storedPets) {
        setPets(JSON.parse(storedPets));
      }
    } catch (error) {
      console.error('Error loading pets:', error);
    }
  };

  const savePets = async (newPets) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newPets));
    } catch (error) {
      console.error('Error saving pets:', error);
    }
  };

  const addPet = async (pet) => {
    const newPet = {
      id: Date.now().toString(),
      status: 'Available',
      ...pet
    };
    const updatedPets = [...pets, newPet];
    setPets(updatedPets);
    await savePets(updatedPets);
  };

  const updatePetStatus = async (id, status, adopterInfo) => {
    const updatedPets = pets.map(pet => 
      pet.id === id ? { 
        ...pet,
        adoptionStatus: status,
        adopterInfo: status === 'Adopted' ? adopterInfo : null,
        adoptionDate: status === 'Adopted' ? new Date().toISOString() : null
      } : pet
    );
    setPets(updatedPets);
    await savePets(updatedPets);
  };

  const deletePet = async (id) => {
    try {
      console.log("Deleting pet with ID:", id); 
      const currentPets = [...pets]; 
      const updatedPets = currentPets.filter(pet => pet.id !== id);
      console.log("Before deletion:", currentPets.length, "After deletion:", updatedPets.length);
      setPets(updatedPets);
      await savePets(updatedPets);
    } catch (error) {
      console.error("Error deleting pet:", error);
    }
  };
  

  const searchPets = (query) => {
    return pets.filter(pet => 
      pet.name.toLowerCase().includes(query.toLowerCase())
    );
  };

  const updatePet = async (updatedPet) => {
    const updatedPets = pets.map(pet => 
      pet.id === updatedPet.id ? updatedPet : pet
    );
    setPets(updatedPets);
    await savePets(updatedPets);
  };

  return (
    <PetContext.Provider value={{ 
      pets, 
      addPet, 
      updatePetStatus, 
      deletePet, 
      searchPets,
      updatePet 
    }}>
      {children}
    </PetContext.Provider>
  );
};

export const usePets = () => useContext(PetContext);

export default PetContext;
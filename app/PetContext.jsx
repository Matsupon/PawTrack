import React, { createContext, useState, useContext } from 'react';

const PetContext = createContext();

export const PetProvider = ({ children }) => {
  const [pets, setPets] = useState([]);

  const addPet = (pet) => {
    const newPet = {
      id: Date.now().toString(),
      status: 'available',
      ...pet
    };
    setPets(prev => [...prev, newPet]);
  };

  const updatePetStatus = (id, status, adopterInfo) => {
    setPets(prev => prev.map(pet => 
      pet.id === id ? { ...pet, status, adopterInfo } : pet
    ));
  };

  const deletePet = (id) => {
    setPets(prev => prev.filter(pet => pet.id !== id));
  };

  const searchPets = (query) => {
    return pets.filter(pet => 
      pet.name.toLowerCase().includes(query.toLowerCase())
    );
  };

  return (
    <PetContext.Provider value={{ pets, addPet, updatePetStatus, deletePet, searchPets }}>
      {children}
    </PetContext.Provider>
  );
};

export const usePets = () => useContext(PetContext);

export default null;
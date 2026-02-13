import React, { useState, useContext } from 'react';
import { Button, FormControl, FormLabel, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Textarea, useToast } from '@chakra-ui/react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext.jsx';

const AddRecipeModal = ({ isOpen, onClose, fetchRecipes }) => {
  const [name, setName] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [steps, setSteps] = useState('');
  const { userData } = useContext(AuthContext);
  const toast = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`https://recipedia-m8ji.onrender.com/recipes/add`,
        { name, imageUrl, steps },
        { headers: { "x-auth-token": userData.token } }
      );
      toast({
        title: 'Recipe added.',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
      fetchRecipes();
      onClose();
    } catch (err) {
      toast({
        title: 'An error occurred.',
        description: err.response.data.msg,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Add a New Recipe</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <form onSubmit={handleSubmit}>
            <FormControl id="name" isRequired>
              <FormLabel>Recipe Name</FormLabel>
              <Input type="text" onChange={(e) => setName(e.target.value)} />
            </FormControl>
            <FormControl id="imageUrl" mt={4} isRequired>
              <FormLabel>Image URL</FormLabel>
              <Input type="text" onChange={(e) => setImageUrl(e.target.value)} />
            </FormControl>
            <FormControl id="steps" mt={4} isRequired>
              <FormLabel>Cooking Steps</FormLabel>
              <Textarea onChange={(e) => setSteps(e.target.value)} />
            </FormControl>
          </form>
        </ModalBody>

        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={handleSubmit}>
            Save
          </Button>
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default AddRecipeModal; 
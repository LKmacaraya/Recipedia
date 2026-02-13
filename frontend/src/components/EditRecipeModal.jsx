import React, { useState, useContext, useEffect } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  useToast,
} from '@chakra-ui/react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext.jsx';

const EditRecipeModal = ({ isOpen, onClose, fetchRecipes, recipe }) => {
  const [name, setName] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [steps, setSteps] = useState('');
  const { userData } = useContext(AuthContext);
  const toast = useToast();

  useEffect(() => {
    if (recipe) {
      setName(recipe.name);
      setImageUrl(recipe.imageUrl);
      setSteps(recipe.steps);
    }
  }, [recipe]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`https://recipedia-m8ji.onrender.com/recipes/update/${recipe._id}`,
        { name, imageUrl, steps },
        { headers: { "x-auth-token": userData.token } }
      );
      toast({
        title: 'Recipe updated.',
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
        <ModalHeader>Edit Recipe</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <form onSubmit={handleSubmit}>
            <FormControl id="name" isRequired>
              <FormLabel>Recipe Name</FormLabel>
              <Input type="text" value={name} onChange={(e) => setName(e.target.value)} />
            </FormControl>
            <FormControl id="imageUrl" mt={4} isRequired>
              <FormLabel>Image URL</FormLabel>
              <Input type="text" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} />
            </FormControl>
            <FormControl id="steps" mt={4} isRequired>
              <FormLabel>Cooking Steps</FormLabel>
              <Textarea value={steps} onChange={(e) => setSteps(e.target.value)} />
            </FormControl>
          </form>
        </ModalBody>

        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={handleSubmit}>
            Save Changes
          </Button>
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default EditRecipeModal; 
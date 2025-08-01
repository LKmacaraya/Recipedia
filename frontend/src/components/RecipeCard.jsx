import React, { useState, useContext } from 'react';
import { Box, Image, Text, Button, Flex, useDisclosure, useToast } from '@chakra-ui/react';
import ViewRecipeModal from './ViewRecipeModal';
import EditRecipeModal from './EditRecipeModal';
import { AuthContext } from '../context/AuthContext.jsx';
import axios from 'axios';

const RecipeCard = ({ recipe, fetchRecipes }) => {
  const { isOpen: isViewOpen, onOpen: onViewOpen, onClose: onViewClose } = useDisclosure();
  const { isOpen: isEditOpen, onOpen: onEditOpen, onClose: onEditClose } = useDisclosure();
  const { userData } = useContext(AuthContext);
  const toast = useToast();

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this recipe?")) {
      try {
        await axios.delete(`http://localhost:5000/recipes/${recipe._id}`, {
          headers: { "x-auth-token": userData.token }
        });
        toast({
          title: 'Recipe deleted.',
          status: 'success',
          duration: 5000,
          isClosable: true,
        });
        fetchRecipes();
      } catch (err) {
        toast({
          title: 'An error occurred.',
          description: err.response.data.msg,
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      }
    }
  };

  return (
    <>
      <Box borderWidth="1px" borderRadius="lg" overflow="hidden" onClick={onViewOpen} cursor="pointer">
        <Image src={recipe.imageUrl} alt={recipe.name} />

        <Box p="6">
          <Box d="flex" alignItems="baseline">
            <Text fontWeight="semibold" as="h4" lineHeight="tight" isTruncated>
              {recipe.name}
            </Text>
          </Box>

          {userData.user && userData.user.id === recipe.userOwner && (
            <Flex justify="flex-end" mt={4}>
              <Button size="sm" colorScheme="teal" mr={2} onClick={(e) => { e.stopPropagation(); onEditOpen(); }}>
                Edit
              </Button>
              <Button size="sm" colorScheme="red" onClick={(e) => { e.stopPropagation(); handleDelete(); }}>
                Delete
              </Button>
            </Flex>
          )}
        </Box>
      </Box>
      <ViewRecipeModal isOpen={isViewOpen} onClose={onViewClose} recipe={recipe} />
      <EditRecipeModal isOpen={isEditOpen} onClose={onEditClose} recipe={recipe} fetchRecipes={fetchRecipes} />
    </>
  );
};

export default RecipeCard; 
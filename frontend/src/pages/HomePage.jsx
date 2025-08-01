import React, { useEffect, useState, useContext } from 'react';
import { Box, SimpleGrid, Button, Input, Flex, useDisclosure } from '@chakra-ui/react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext.jsx';
import RecipeCard from '../components/RecipeCard';
import AddRecipeModal from '../components/AddRecipeModal';

const HomePage = () => {
  const [recipes, setRecipes] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const { userData } = useContext(AuthContext);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const fetchRecipes = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/recipes`);
      setRecipes(response.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchRecipes();
  }, []);

  const filteredRecipes = recipes.filter(recipe =>
    recipe.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Box p={8}>
      <Flex mb={8} justify="space-between" align="center">
        <Input
          placeholder="Search recipes..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          maxW="400px"
        />
        {userData.user && (
          <Button onClick={onOpen} colorScheme="teal">Add Recipe</Button>
        )}
      </Flex>
      <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={8}>
        {filteredRecipes.map(recipe => (
          <RecipeCard key={recipe._id} recipe={recipe} fetchRecipes={fetchRecipes} />
        ))}
      </SimpleGrid>
      <AddRecipeModal isOpen={isOpen} onClose={onClose} fetchRecipes={fetchRecipes} />
    </Box>
  );
};

export default HomePage; 
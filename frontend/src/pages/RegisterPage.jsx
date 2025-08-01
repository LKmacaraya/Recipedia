import React, { useState } from 'react';
import { Box, Button, FormControl, FormLabel, Input, Heading, useToast } from '@chakra-ui/react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const RegisterPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const toast = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`http://localhost:5000/users/register`, { username, password });
      toast({
        title: 'Account created.',
        description: "We've created your account for you.",
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
      navigate('/login');
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
    <Box maxW="sm" mx="auto" mt={8} p={6} borderWidth={1} borderRadius="lg">
      <Heading as="h2" size="lg" textAlign="center" mb={6}>
        Register
      </Heading>
      <form onSubmit={handleSubmit}>
        <FormControl id="username" isRequired>
          <FormLabel>Username</FormLabel>
          <Input type="text" onChange={(e) => setUsername(e.target.value)} />
        </FormControl>
        <FormControl id="password" mt={4} isRequired>
          <FormLabel>Password</FormLabel>
          <Input type="password" onChange={(e) => setPassword(e.target.value)} />
        </FormControl>
        <Button colorScheme="teal" width="full" mt={6} type="submit">
          Register
        </Button>
      </form>
    </Box>
  );
};

export default RegisterPage; 
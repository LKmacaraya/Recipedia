import React, { useState, useContext } from 'react';
import { Box, Button, FormControl, FormLabel, Input, Heading, useToast } from '@chakra-ui/react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext.jsx';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { setUserData } = useContext(AuthContext);
  const toast = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const loginRes = await axios.post(`https://recipedia-m8ji.onrender.com/users/login`, { username, password });
      setUserData({
        token: loginRes.data.token,
        user: loginRes.data.user,
      });
      localStorage.setItem("auth-token", loginRes.data.token);
      localStorage.setItem("user", JSON.stringify(loginRes.data.user));
      toast({
        title: 'Logged in.',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
      navigate('/');
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
        Login
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
          Login
        </Button>
      </form>
    </Box>
  );
};

export default LoginPage; 
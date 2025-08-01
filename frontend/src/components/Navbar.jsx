import React, { useContext } from 'react';
import { Box, Flex, Link, Button } from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext.jsx';

const Navbar = () => {
  const { userData, setUserData } = useContext(AuthContext);

  const logout = () => {
    setUserData({
      token: undefined,
      user: undefined,
    });
    localStorage.removeItem("auth-token");
    localStorage.removeItem("user");
  };

  return (
    <Flex
      as="nav"
      align="center"
      justify="space-between"
      wrap="wrap"
      padding="1.5rem"
      bg="teal.500"
      color="white"
    >
      <Box>
        <Link as={RouterLink} to="/" fontSize="lg" fontWeight="bold">
          Recipedia
        </Link>
      </Box>

      <Box>
        {userData.user ? (
          <Button onClick={logout} variant="ghost">Logout</Button>
        ) : (
          <>
            <Link as={RouterLink} to="/login" mr="4">
              <Button variant="ghost">Login</Button>
            </Link>
            <Link as={RouterLink} to="/register">
              <Button variant="ghost">Register</Button>
            </Link>
          </>
        )}
      </Box>
    </Flex>
  );
};

export default Navbar; 
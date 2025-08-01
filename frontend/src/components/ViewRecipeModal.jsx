import React from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  Image,
  Text,
} from '@chakra-ui/react';

const ViewRecipeModal = ({ isOpen, onClose, recipe }) => {
  if (!recipe) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{recipe.name}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Image src={recipe.imageUrl} alt={recipe.name} borderRadius="md" mb={4} />
          <Text whiteSpace="pre-wrap">{recipe.steps}</Text>
        </ModalBody>

        <ModalFooter>
          <Button variant="ghost" onClick={onClose}>Close</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ViewRecipeModal; 
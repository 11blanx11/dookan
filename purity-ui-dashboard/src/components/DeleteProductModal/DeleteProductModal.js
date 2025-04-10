import React from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Text
} from '@chakra-ui/react';
import axios from 'axios';

const DeleteProductModal = ({ isOpen, onClose, onDelete, selectedProduct }) => {

    const handleDelete = async () => {
        const authToken = sessionStorage.getItem('authToken') || "";
        console.log("delteding prod from modal: ", selectedProduct)
        try {
            const deleteResponse = await axios.delete(`${process.env.REACT_APP_BACKEND_URL}/api/products/${selectedProduct["_id"]}`, 
                {
                headers: {
                  'Authorization': authToken,
                  'Content-Type': 'application/json'
                }
              });
            onDelete(selectedProduct);
            onClose();
        } catch (error) {
            console.log(error)
        }

    }

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent borderRadius="md">
        <ModalHeader>Confirm Deletion</ModalHeader>
        <ModalBody>
          <Text>
            Are you sure you want to delete {selectedProduct["Title"] || 'this item'}?
          </Text>
        </ModalBody>
        <ModalFooter gap={3}>
            <Button colorScheme="red" onClick={handleDelete}>Yes</Button>
            <Button onClick={onClose}>No</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default DeleteProductModal;
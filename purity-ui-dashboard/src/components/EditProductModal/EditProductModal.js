import { React, useEffect, useState } from "react";
import axios from "axios";
import { useHistory } from "react-router-dom";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Input,
  Button,
} from "@chakra-ui/react";
import { useSharedStyle } from "antd/es/input/style";
import { message } from "antd";

function EditProductModal({ isOpen, onClose, selectedProduct, onEditProduct }) {
  const [editedProduct, setEditedProduct] = useState(selectedProduct);
  console.log("Edit Product Modal Called");
  console.log("Selectd Product is: ", selectedProduct);
  // using to change whenever selectedProduct changes
  useEffect(() => {
    setEditedProduct(selectedProduct);
  }, [selectedProduct]);

  console.log("Edited pructL: ", editedProduct);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedProduct((prev) => ({
      ...prev,
      [name]:
        name === "Shop location" || name === "Variant Price"
          ? parseFloat(value)
          : value,
    }));
  };

  const isFormComplete = () => {
    return (
      editedProduct.Title?.trim() !== '' && 
      editedProduct.Handle?.trim() !== '' && 
      editedProduct["Image Src"]?.trim() !== '' && 
      editedProduct.Vendor?.trim() !== '' && 
      editedProduct.Tags?.trim() !== '' && 
      editedProduct["Shop location"] >= 0 &&
      editedProduct["Variant Price"] > 0
    );
  };

  const handleSubmit = async () => {
    console.log("Payload to send: ", editedProduct);
    const authToken = sessionStorage.getItem('authToken') || "";
    try {
      console.log(`Edit User url ${process.env.REACT_APP_BACKEND_URL}/api/products/${editedProduct["_id"]}`)
      const editResponse = await axios.put(`${process.env.REACT_APP_BACKEND_URL}/api/products/${editedProduct["_id"]}`, 
        {editedProduct},
        {
        headers: {
          'Authorization': authToken,
          'Content-Type': 'application/json'
        }
      });
      onEditProduct(editedProduct);
      onClose();
    } catch (error) {
      console.log('Failed due to', error)
      message.error(error?.response?.data?.error)
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Edit Product</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <FormControl mb={3}>
            <FormLabel>Product Title</FormLabel>
            <Input
              name="Title"
              value={editedProduct.Title}
              onChange={handleChange}
            />
          </FormControl>
          <FormControl mb={3}>
            <FormLabel>Handle</FormLabel>
            <Input
              name="Handle"
              value={editedProduct.Handle}
              onChange={handleChange}
            />
          </FormControl>
          <FormControl 
            mb={3}
            isDisabled={true}
          >
            <FormLabel>Product SKU</FormLabel>
            <Input
              name="Variant SKU"
              value={editedProduct["Variant SKU"]}
              onChange={handleChange}
            />
          </FormControl>
          <FormControl mb={3}>
            <FormLabel>Image URL</FormLabel>
            <Input
              name="Image Src"
              value={editedProduct["Image Src"]}
              onChange={handleChange}
            />
          </FormControl>
          <FormControl mb={3}>
            <FormLabel>Vendor</FormLabel>
            <Input
              name="Vendor"
              value={editedProduct.Vendor}
              onChange={handleChange}
            />
          </FormControl>
          <FormControl mb={3}>
            <FormLabel>Tags (comma separated)</FormLabel>
            <Input
              name="Tags"
              value={editedProduct.Tags}
              onChange={handleChange}
            />
          </FormControl>
          <FormControl mb={3}>
            <FormLabel>Inventory Quantity</FormLabel>
            <Input
              name="Shop location"
              type="number"
              value={editedProduct["Shop location"]}
              onChange={handleChange}
            />
          </FormControl>
          <FormControl mb={3}>
            <FormLabel>Price</FormLabel>
            <Input
              name="Variant Price"
              type="number"
              step="0.01"
              value={editedProduct["Variant Price"]}
              onChange={handleChange}
            />
          </FormControl>
        </ModalBody>
        <ModalFooter>
          <Button 
            colorScheme="blue" 
            mr={3} 
            onClick={handleSubmit}
            isDisabled={!isFormComplete()}
            >
            Edit Product
          </Button>
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

export default EditProductModal;

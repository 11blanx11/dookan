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
  Grid,
  GridItem,
  Text,
  Box,
  Flex,
} from "@chakra-ui/react";

// This component receives product data and isOpen/onClose from parent
const ShowProductModal = ({ isOpen, onClose, selectedProduct }) => {
  if (!selectedProduct) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{selectedProduct.Title}</ModalHeader>
        <ModalCloseButton />

        <ModalBody>
          {/* Centered Image */}
          <Flex justifyContent="center" mb={6}>
            <Image
              src={selectedProduct["Image Src"]}
              alt={selectedProduct.Title}
              borderRadius="md"
              objectFit="cover"
              maxH="300px"
            />
          </Flex>

          {/* Two-column grid for data */}
          <Grid templateColumns="repeat(2, 1fr)" gap={4}>
            <GridItem>
              <Box mb={3}>
                <Text fontSize="sm" color="gray.500">
                  Handle
                </Text>
                <Text fontSize="smaller">{selectedProduct.Handle}</Text>
              </Box>

              <Box mb={3}>
                <Text fontSize="sm" color="gray.500">
                  Vendor
                </Text>
                <Text fontSize="smaller">{selectedProduct.Vendor}</Text>
              </Box>

              <Box mb={3}>
                <Text fontSize="sm" color="gray.500">
                  Tags
                </Text>
                <Text fontSize="smaller">{selectedProduct.Tags}</Text>
              </Box>

              <Box mb={3}>
                <Text fontSize="sm" color="gray.500">
                  Shipping Cost Applicable
                </Text>
                <Text fontSize="smaller">
                  {selectedProduct["Variant Requires Shipping"] ? "Yes" : "No"}
                </Text>
              </Box>

              <Box mb={3}>
                <Text fontSize="sm" color="gray.500">
                  Is Variant Taxable
                </Text>
                <Text fontSize="smaller">
                  {selectedProduct["Variant Taxable"] ? "Yes" : "No"}
                </Text>
              </Box>
            </GridItem>

            <GridItem>
              <Box mb={3}>
                <Text fontSize="sm" color="gray.500">
                  Price
                </Text>
                <Text fontSize="smaller">
                  INR {selectedProduct["Variant Price"]}
                </Text>
              </Box>

              <Box mb={3}>
                <Text fontSize="sm" color="gray.500">
                  SKU
                </Text>
                <Text fontSize="smaller">{selectedProduct["Variant SKU"]}</Text>
              </Box>

              <Box mb={3}>
                <Text fontSize="sm" color="gray.500">
                  Product Stock In Shop
                </Text>
                <Text fontSize="smaller">
                  {selectedProduct["Shop location"]}
                </Text>
              </Box>

              <Box mb={3}>
                <Text fontSize="sm" color="gray.500">
                  Inventory Tracked By
                </Text>
                <Text fontSize="smaller">
                  {selectedProduct["Variant Inventory Tracker"]}
                </Text>
              </Box>
            </GridItem>
          </Grid>
        </ModalBody>

        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={onClose}>
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ShowProductModal;

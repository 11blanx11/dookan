import {
  Avatar,
  Badge,
  Button,
  Flex,
  Td,
  Text,
  Tr,
  useColorModeValue,
} from "@chakra-ui/react";
import React from "react";
import Transactions from "views/Dashboard/Billing/components/Transactions";

function ProductsTableRow(props) {
  const {
    handle,
    title,
    vendor,
    tags,
    inventory,
    price,
    image,
    currency,
  } = props;
  const textColor = useColorModeValue("gray.700", "white");
  const bgStatus = useColorModeValue("gray.400", "#1a202c");
  const colorStatus = useColorModeValue("white", "gray.400");
  const inStock = inventory > 0 ? true : false;
  const isMale = tags.toLowerCase() === "men" ? true : false;
  const transactionCurrency = currency || "INR";

  return (
    <Tr filter={inStock === true ? "none" : "opacity(0.5)"}>
      <Td minWidth={{ sm: "250px" }} pl="0px">
        <Flex align="center" py=".8rem" minWidth="100%" flexWrap="nowrap">
          <Avatar src={image} w="50px" borderRadius="12px" me="18px" />
          <Flex direction="column">
            <Text
              fontSize="md"
              color={textColor}
              fontWeight="bold"
              minWidth="100%"
            >
              {title}
            </Text>
            <Text fontSize="sm" color="gray.400" fontWeight="normal">
              {handle}
            </Text>
          </Flex>
        </Flex>
      </Td>

      <Td>
        <Flex direction="column">
          <Text fontSize="md" color={textColor} fontWeight="bold">
            {vendor}
          </Text>
          {/* <Text fontSize="sm" color="gray.400" fontWeight="normal">
            {subdomain}
          </Text> */}
        </Flex>
      </Td>
      <Td>
        <Flex direction="column">
          <Badge
            bg={isMale ? "blue.300" : "pink.300"}
            color={"ghostwhite"}
            fontSize="16px"
            p="3px 10px"
            borderRadius="8px"
            // textAlign="center"
          >
            {tags}
          </Badge>
        </Flex>
      </Td>
      <Td>
        <Flex direction="column">
          <Badge
            bg={inStock === true ? "green.400" : bgStatus}
            color={inStock === true ? "white" : colorStatus}
            fontSize="16px"
            p="3px 10px"
            borderRadius="8px"
            width="fit-content"
          >
            {inStock === true ? "In Stock" : "Out of Stock"}
          </Badge>
          <Text
            mt="5px"
            color="black"
            fontSize="14px"
            fontWeight="black"
            p="2px 8px"
            borderRadius="8px"
            width="fit-content"
          >
            {inventory}/50
          </Text>
        </Flex>
      </Td>
      <Td>
        <Flex direction="row">
          <Text mr="4px" fontSize="md" color="gray.600" fontWeight="normal">
            {transactionCurrency}
          </Text>
          <Text fontSize="md" color={textColor} fontWeight="bold">
            {price}
          </Text>
        </Flex>
      </Td>

      <Td>
        <Button p="0px" bg="transparent" variant="no-hover">
          <Text
            fontSize="md"
            color="gray.400"
            fontWeight="bold"
            cursor="pointer"
          >
            Edit
          </Text>
        </Button>
      </Td>
    </Tr>
  );
}

export default ProductsTableRow;

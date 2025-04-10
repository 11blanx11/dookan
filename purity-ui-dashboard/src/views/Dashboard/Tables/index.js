// Chakra imports
import { Flex } from "@chakra-ui/react";
import { React, useState, useEffect } from "react";
import Authors from "./components/Authors";
import Projects from "./components/Projects";
import Products from "./components/Products";
import {
  tablesTableData,
  dashboardTableData,
  productsTableData,
} from "variables/general";
import axios from "axios";

function Tables() {
  const [productsData, setProductsData] = useState([]);
  const [isProductsLoading, setIsProductsLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = sessionStorage.getItem("authToken") || "";
  console.log("Session TOken: ", token);

  useEffect(() => {
    console.log(
      `Fetching Route: ${process.env.REACT_APP_BACKEND_URL}/api/products/`
    );
    const fetchProducts = async () => {
      try {
        setIsProductsLoading(true);
        const response = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/api/products/`,
          {
            headers: {
              Authorization: token,
              "Content-Type": "application/json",
            },
          }
        );
        console.log("Fetch Products Response: ", response);
        if (!response.status) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response?.data?.data;
        setProductsData(data);
        setIsProductsLoading(false);
      } catch (err) {
        console.error("Error fetching products:", err);
        setError(err.message);
        setIsProductsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <Flex direction="column" pt={{ base: "120px", md: "75px" }}>
      {/* <Authors
        title={"Authors Table"}
        captions={["Author", "Function", "Status", "Employed", ""]}
        data={tablesTableData}
      />
      <Projects
        title={"Projects Table"}
        captions={["Companies", "Budget", "Status", "Completion", ""]}
        data={dashboardTableData}
      /> */}
      {/* {isProductsLoading ? (
        <p>Loading products...</p>
      ) : error ? (
        <p>Error loading products: {error}</p>
      ) : (
        <Products
          title={"Products Table"}
          captions={["Handle", "Vendor", "Tags", "Inventory", "Price", ""]}
          data={productsData}
        />
      )} */}
      <Products
        title={"Products Table"}
        captions={["Handle", "Vendor", "Tags", "Inventory", "Price", ""]}
        data={productsData || productsTableData}
      />
    </Flex>
  );
}

export default Tables;

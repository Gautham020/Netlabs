import React, { useState, useEffect, useMemo } from "react";
import * as XLSX from "xlsx";
import { Pie } from "react-chartjs-2";
import Chart from "chart.js/auto";

const BackorderReport = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState({});
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedProduct, setSelectedProduct] = useState("");

  useEffect(() => {
    loadExcelData();
  }, []);

  const loadExcelData = async () => {
    try {
      const response = await fetch(
        `${process.env.PUBLIC_URL}/Update inventory data.xlsx`
      );
      const arrayBuffer = await response.arrayBuffer();
      const workbook = XLSX.read(arrayBuffer, { type: "array" });
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);

      setData(jsonData);
      setCategories([...new Set(jsonData.map((item) => item.CategoryName))]);
      setProducts([...new Set(jsonData.map((item) => item.ProductName))]);
    } catch (error) {
      console.error("Failed to load Excel data:", error);
    }
  };

  const filteredInventoryData = useMemo(() => {
    return data.filter(
      (item) =>
        (!selectedCategory || item.CategoryName === selectedCategory) &&
        (!selectedProduct || item.ProductName === selectedProduct)
    );
  }, [data, selectedCategory, selectedProduct]);

  const calculateBackorderData = () => {
    const backorderData = {};

    filteredInventoryData.forEach((item) => {
      const productName = item.ProductName;
      const orderedQty = Number(item.OrderItemQuantity) || 0;
      const availableQty = Number(item.AvaliableQuantity) || 0;

      if (availableQty < orderedQty) {
        const backorderQty = orderedQty - availableQty;
        if (!backorderData[productName]) {
          backorderData[productName] = 0;
        }
        backorderData[productName] += backorderQty;
      }
    });

    setFilteredData(backorderData);
  };

  useEffect(() => {
    calculateBackorderData();
  }, [filteredInventoryData]);

  const handleCategoryChange = (event) =>
    setSelectedCategory(event.target.value);
  const handleProductChange = (event) => setSelectedProduct(event.target.value);

  const getChartData = () => {
    const productNames = Object.keys(filteredData);
    const backorderQuantities = Object.values(filteredData);

    return {
      labels: productNames,
      datasets: [
        {
          label: "Backorder Quantity",
          data: backorderQuantities,
          backgroundColor: [
            "#f44336",
            "#2196f3",
            "#4caf50",
            "#ff9800",
            "#9e9e9e",
          ],
        },
      ],
    };
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Backorder Report</h2>

      <div className="mb-4">
        <label className="block font-semibold mb-2">Select Category</label>
        <select
          aria-label="Select Category"
          value={selectedCategory}
          onChange={handleCategoryChange}
          className="border p-2 rounded w-full"
        >
          <option value="">All Categories</option>
          {categories.map((category, index) => (
            <option key={index} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-4">
        <label className="block font-semibold mb-2">Select Product</label>
        <select
          aria-label="Select Product"
          value={selectedProduct}
          onChange={handleProductChange}
          className="border p-2 rounded w-full"
        >
          <option value="">All Products</option>
          {products.map((product, index) => (
            <option key={index} value={product}>
              {product}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-8">
        <h3 className="font-semibold text-lg mb-4">Backorder Pie Chart</h3>
        <Pie
          data={getChartData()}
          options={{
            plugins: {
              tooltip: {
                callbacks: {
                  label: (context) => {
                    const label = context.label || "";
                    const value = context.raw || 0;
                    return `${label}: ${value} units on backorder`;
                  },
                },
              },
              legend: {
                position: "top",
              },
            },
          }}
        />
      </div>

      <div className="mt-4">
        <h3 className="font-semibold text-lg mb-2">Backorder Descriptions</h3>
        <ul>
          <li>
            <strong>Backorder:</strong> Items ordered but currently out of
            stock.
          </li>
        </ul>
      </div>
    </div>
  );
};

export default BackorderReport;

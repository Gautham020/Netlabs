import React, { useState, useEffect, useMemo } from "react";
import * as XLSX from "xlsx";
import { Bar } from "react-chartjs-2";
import Chart from "chart.js/auto";

const InventoryAgingReport = () => {
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

  const excelSerialDateToJSDate = (serial) => {
    const excelEpoch = new Date(1900, 0, 1);
    return new Date(excelEpoch.getTime() + (serial - 2) * 86400000);
  };

  const filteredInventoryData = useMemo(() => {
    return data.filter(
      (item) =>
        (!selectedCategory || item.CategoryName === selectedCategory) &&
        (!selectedProduct || item.ProductName === selectedProduct)
    );
  }, [data, selectedCategory, selectedProduct]);

  const calculateAgingData = () => {
    const agingData = {
      "0-30": 0,
      "31-60": 0,
      "61-90": 0,
      "91-120": 0,
      Others: 0,
    };
    const today = new Date(); 
    console.log(today, "today");
    console.log(filteredInventoryData, "filteredInventoryData");
    filteredInventoryData.forEach((item) => {
      console.log(item.AvaliableQuantity, 11111);
      const orderDate = excelSerialDateToJSDate(item["OrderDate"]);
      const availableQty = Number(item.AvaliableQuantity) || 0;
      const diffDays = Math.floor((today - orderDate) / (1000 * 60 * 60 * 24));
      console.log(diffDays, 1);
      console.log(availableQty, 2);
      console.log(orderDate, 3);
      if (diffDays <= 30) agingData["0-30"] += availableQty;
      else if (diffDays <= 60) agingData["31-60"] += availableQty;
      else if (diffDays <= 90) agingData["61-90"] += availableQty;
      else if (diffDays <= 120) agingData["91-120"] += availableQty;
      else agingData["Others"] += availableQty;
    });

    setFilteredData(agingData);
  };

  useEffect(() => {
    calculateAgingData();
  }, [filteredInventoryData]);

  const handleCategoryChange = (event) =>
    setSelectedCategory(event.target.value);
  const handleProductChange = (event) => setSelectedProduct(event.target.value);

  const getChartData = () => ({
    labels: ["0-30 Days", "31-60 Days", "61-90 Days", "91-120 Days", "Others"],
    datasets: [
      {
        label: "Stock Quantity",
        data: Object.values(filteredData),
        backgroundColor: [
          "#4caf50",
          "#ff9800",
          "#f44336",
          "#2196f3",
          "#9e9e9e",
        ],
      },
    ],
  });

  const agingDescriptions = {
    "0-30 Days": "New inventory that is still fresh.",
    "31-60 Days":
      "Inventory that has been in stock for over a month but is still relatively recent.",
    "61-90 Days": "Inventory that is approaching a three-month mark.",
    "91-120 Days": "Items that have been in stock for three to four months.",
    Others: "Any inventory that has been in stock for longer than 120 days.",
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Inventory Aging Report</h2>

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
        <h3 className="font-semibold text-lg mb-4">Inventory Aging Graph</h3>
        <Bar
          data={getChartData()}
          options={{
            plugins: {
              tooltip: {
                callbacks: {
                  label: (context) => {
                    const label = context.label || "";
                    const value = context.raw || 0;
                    return `${label}: ${value} units - ${agingDescriptions[label]}`;
                  },
                },
              },
            },
          }}
        />
      </div>

      <div className="mt-4">
        <h3 className="font-semibold text-lg mb-2">
          Aging Category Descriptions
        </h3>
        <ul>
          {Object.entries(agingDescriptions).map(([key, description]) => (
            <li key={key} className="mb-2">
              <strong>{key}:</strong> {description}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default InventoryAgingReport;

import React, { useState, useEffect } from "react";
import * as XLSX from "xlsx";
import { Bar, Pie } from "react-chartjs-2";
import { Chart as ChartJS } from "chart.js/auto";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

const generateColor = (index) => {
  const colors = [
    "#FF5733",
    "#33FF57",
    "#3357FF",
    "#F9FF33",
    "#FF33A1",
    "#33FFF9",
    "#9C33FF",
    "#FF9C33",
    "#33FF9C",
    "#9CFF33",
  ];
  return colors[index % colors.length];
};

const Graph = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [categoryOptions, setCategoryOptions] = useState([]);

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
      setFilteredData(jsonData);

      const categories = [
        ...new Set(jsonData.map((item) => item.CategoryName)),
      ];
      setCategoryOptions(categories);
    } catch (error) {
      console.error("Error loading Excel data:", error.message);
    }
  };

  useEffect(() => {
    loadExcelData();
  }, []);

  const filterByCategory = (category) => {
    setSelectedCategory(category);
    const filtered = data.filter((item) => item.CategoryName === category);
    setFilteredData(filtered);
  };

  const generateSummary = (data) => ({
    shippedCount: data
      .filter((item) => item.Status === "Shipped")
      .reduce((acc, item) => acc + item.OrderItemQuantity, 0),
    receivedCount: data
      .filter((item) => item.Status === "Received")
      .reduce((acc, item) => acc + item.OrderItemQuantity, 0),
    totalOrderQuantity: data.reduce(
      (acc, item) => acc + item.OrderItemQuantity,
      0
    ),
    totalAvailableQuantity: data.reduce(
      (acc, item) => acc + item.AvaliableQuantity,
      0
    ),
  });

  const summary = generateSummary(filteredData);

  const shippedReceivedData = {
    labels: ["Shipped", "Received"],
    datasets: [
      {
        label: "Quantity",
        data: [summary.shippedCount, summary.receivedCount],
        backgroundColor: ["#3b82f6", "#34d399"],
      },
    ],
  };

  const categoryData = {
    labels: categoryOptions,
    datasets: [
      {
        label: "Total Order Quantity",
        data: categoryOptions.map((cat) =>
          filteredData
            .filter((item) => item.CategoryName === cat)
            .reduce((sum, item) => sum + item.OrderItemQuantity, 0)
        ),
        backgroundColor: "#a855f7",
      },
      {
        label: "Total Available Quantity",
        data: categoryOptions.map((cat) =>
          filteredData
            .filter((item) => item.CategoryName === cat)
            .reduce((sum, item) => sum + item.AvaliableQuantity, 0)
        ),
        backgroundColor: "#f97316",
      },
    ],
  };

  const pieChartDataAllCategories = {
    labels: categoryOptions,
    datasets: [
      {
        data: categoryOptions.map((cat) =>
          data
            .filter((item) => item.CategoryName === cat)
            .reduce((sum, item) => sum + item.OrderItemQuantity, 0)
        ),
        backgroundColor: categoryOptions.map((_, index) =>
          generateColor(index)
        ),
      },
    ],
  };

  const pieChartDataSelectedCategory = {
    labels: ["Total Order Quantity", "Total Available Quantity"],
    datasets: [
      {
        data: [
          filteredData.reduce((sum, item) => sum + item.OrderItemQuantity, 0),
          filteredData.reduce((sum, item) => sum + item.AvaliableQuantity, 0),
        ],
        backgroundColor: ["#a855f7", "#f97316"],
      },
    ],
  };

  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(filteredData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Inventory Data");
    XLSX.writeFile(wb, "Filtered_Inventory_Report.xlsx");
  };

  const exportToPDF = () => {
    const input = document.getElementById("pdf-content");
    html2canvas(input).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const imgWidth = 190;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      pdf.addImage(imgData, "PNG", 10, 10, imgWidth, imgHeight);
      pdf.save("Inventory_Report.pdf");
    });
  };

  return (
    <div id="pdf-content" className="p-6">
      <div className="mb-4">
        <label htmlFor="categoryDropdown" className="mr-2">
          Filter by Category:
        </label>
        <select
          id="categoryDropdown"
          onChange={(e) => filterByCategory(e.target.value)}
          value={selectedCategory}
          className="border p-2 rounded"
        >
          <option value="">Select a Category</option>
          {categoryOptions.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>

      <div className="flex gap-4 mb-6">
        <button
          onClick={exportToExcel}
          className="bg-green-600 text-white p-2 rounded"
        >
          Download Table as Excel
        </button>
        <button
          onClick={exportToPDF}
          className="bg-blue-600 text-white p-2 rounded"
        >
          Download Page as PDF
        </button>
      </div>

      <div className="flex gap-6 mb-8">
        <div className="flex-1">
          <h3 className="font-semibold mb-4">Shipped vs Received Quantities</h3>
          <Bar data={shippedReceivedData} />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold mb-4">
            Category-wise Order and Available Quantities
          </h3>
          <Bar data={categoryData} />
        </div>
      </div>

      <div className="flex-1 mb-8">
        <h3 className="font-semibold mb-4">
          {selectedCategory
            ? "Selected Category Breakdown"
            : "All Categories Breakdown"}
        </h3>
        <div className="w-full h-[400px]">
          <Pie
            data={
              selectedCategory
                ? pieChartDataSelectedCategory
                : pieChartDataAllCategories
            }
          />
        </div>
      </div>

      {selectedCategory && (
        <div className="overflow-x-auto">
          <table className="w-[900px] border-collapse border border-gray-300 table-fixed">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 px-4 py-2 truncate">
                  Order Date
                </th>
                <th className="border border-gray-300 px-4 py-2 truncate">
                  Warehouse
                </th>
                <th className="border border-gray-300 px-4 py-2 truncate">
                  Category
                </th>
                <th className="border border-gray-300 px-4 py-2 truncate">
                  Product
                </th>
                <th className="border border-gray-300 px-4 py-2 truncate">
                  Vendor
                </th>
                <th className="border border-gray-300 px-4 py-2 truncate">
                  Shipped Quantity
                </th>
                <th className="border border-gray-300 px-4 py-2 truncate">
                  Received Quantity
                </th>
                <th className="border border-gray-300 px-4 py-2 truncate">
                  Available Quantity
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((item, index) => (
                <tr key={index}>
                  <td className="border border-gray-300 px-4 py-2 truncate">
                    {item.OrderDate}
                  </td>
                  <td className="border border-gray-300 px-4 py-2 truncate">
                    {item.WarehouseName}
                  </td>
                  <td className="border border-gray-300 px-4 py-2 truncate">
                    {item.CategoryName}
                  </td>
                  <td className="border border-gray-300 px-4 py-2 truncate">
                    {item.ProductName}
                  </td>
                  <td className="border border-gray-300 px-4 py-2 truncate">
                    {item.VendorEmail}
                  </td>
                  <td className="border border-gray-300 px-4 py-2 truncate">
                    {item.Status === "Shipped" ? item.OrderItemQuantity : 0}
                  </td>
                  <td className="border border-gray-300 px-4 py-2 truncate">
                    {item.Status === "Received" ? item.OrderItemQuantity : 0}
                  </td>
                  <td className="border border-gray-300 px-4 py-2 truncate">
                    {item.AvaliableQuantity}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Graph;

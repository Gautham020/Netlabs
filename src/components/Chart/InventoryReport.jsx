import React, { useState, useEffect } from "react";
import * as XLSX from "xlsx";
import Chart from "./Chart";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
const InventoryReport = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const loadExcelData = async () => {
    try {
      const response = await fetch(
        `${process.env.PUBLIC_URL}/Update inventory data.xlsx`
      );

      if (!response.ok) {
        console.error("Failed to fetch the file:", response.statusText);
        throw new Error("Failed to fetch the file");
      }

      const arrayBuffer = await response.arrayBuffer();
      const workbook = XLSX.read(arrayBuffer, { type: "array" });

      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);
      setData(jsonData);
      setFilteredData(jsonData); // Initial unfiltered data
    } catch (error) {
      console.error("Error loading Excel data:", error.message);
    }
  };

  useEffect(() => {
    loadExcelData();
  }, []);

  const excelSerialDateToJSDate = (serial) => {
    const excelEpoch = new Date(1900, 0, 1);
    return new Date(excelEpoch.getTime() + (serial - 2) * 86400000);
  };

  const filterDataByDate = () => {
    const filtered = data.filter((item) => {
      console.log("Order Date (raw):", item.OrderDate);
      const orderDate = excelSerialDateToJSDate(item.OrderDate);
      console.log("Converted OrderDate:", orderDate);

      if (isNaN(orderDate)) {
        console.log("Skipping invalid OrderDate:", item.OrderDate);
        return false;
      }

      const start = startDate ? new Date(startDate) : null;
      const end = endDate ? new Date(endDate) : null;

      if (start && isNaN(start)) {
        console.error("Invalid startDate:", startDate);
        return false;
      }
      if (end && isNaN(end)) {
        console.error("Invalid endDate:", endDate);
        return false;
      }

      return (!start || orderDate >= start) && (!end || orderDate <= end);
    });

    setFilteredData(filtered);
  };

  const summary = {
    totalWarehouse: new Set(filteredData.map((item) => item.WarehouseName))
      .size,
    totalCategories: new Set(filteredData.map((item) => item.CategoryName))
      .size,
    totalProducts: filteredData.length,
    totalVendors: new Set(filteredData.map((item) => item.VendorEmail)).size,
    shippedCount: filteredData
      .filter((item) => item.Status === "Shipped")
      .reduce((acc, item) => acc + item.OrderItemQuantity, 0),
    receivedCount: filteredData
      .filter((item) => item.Status === "Received")
      .reduce((acc, item) => acc + item.OrderItemQuantity, 0),
    totalOrderQuantity: filteredData.reduce(
      (acc, item) => acc + item.OrderItemQuantity,
      0
    ),
    totalAvailableQuantity: filteredData.reduce(
      (acc, item) => acc + item.AvaliableQuantity,
      0
    ),
  };

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

  const vendorData = {
    labels: [...new Set(filteredData.map((item) => item.VendorEmail))],
    datasets: [
      {
        label: "Total Order Quantity",
        data: filteredData.reduce((acc, item) => {
          acc[item.VendorEmail] =
            (acc[item.VendorEmail] || 0) + item.OrderItemQuantity;
          return acc;
        }, {}),
        backgroundColor: "#a855f7",
      },
      {
        label: "Total Available Quantity",
        data: filteredData.reduce((acc, item) => {
          acc[item.VendorEmail] =
            (acc[item.VendorEmail] || 0) + item.AvaliableQuantity;
          return acc;
        }, {}),
        backgroundColor: "#f97316",
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
    <div className="p-6  ">
      <h2 className="text-2xl font-bold mb-4">Inventory Summary</h2>

      <div className="flex gap-4 mb-6">
        <input
          type="date"
          className="border p-2 rounded"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          placeholder="Start Date"
        />
        <input
          type="date"
          className="border p-2 rounded"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          placeholder="End Date"
        />
        <button
          onClick={filterDataByDate} // Trigger filter on button click
          className="bg-blue-800 shadow-lg text-teal-50 rounded-sm w-40 py-2"
        >
          Filter
        </button>
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="p-4 border border-gray-200 rounded shadow">
          <h3 className="font-semibold">Total Warehouse</h3>
          <p>{summary.totalWarehouse}</p>
        </div>
        <div className="p-4 border border-gray-200 rounded shadow">
          <h3 className="font-semibold">Total Categories</h3>
          <p>{summary.totalCategories}</p>
        </div>
        <div className="p-4 border border-gray-200 rounded shadow">
          <h3 className="font-semibold">Total Products</h3>
          <p>{summary.totalProducts}</p>
        </div>
        <div className="p-4 border border-gray-200 rounded shadow">
          <h3 className="font-semibold">Total Vendors</h3>
          <p>{summary.totalVendors}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Chart
          data={shippedReceivedData}
          title="Shipped vs Received Quantities"
          chartType="Bar"
        />
        <Chart
          data={vendorData}
          title="Vendor-wise Order and Available Quantities"
          chartType="Bar"
        />
      </div>

      <div className="overflow-x-auto">
        <table className="w-[900px] border-collapse border border-gray-300 table-fixed">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 px-4 py-2 w-1/8 text-left truncate">
                Order Date
              </th>
              <th className="border border-gray-300 px-4 py-2 w-1/8 text-left truncate">
                Warehouse
              </th>
              <th className="border border-gray-300 px-4 py-2 w-1/8 text-left truncate">
                Category
              </th>
              <th className="border border-gray-300 px-4 py-2 w-1/8 text-left truncate">
                Product
              </th>
              <th className="border border-gray-300 px-4 py-2 w-1/8 text-left truncate">
                Vendor
              </th>
              <th className="border border-gray-300 px-4 py-2 w-1/8 text-left truncate">
                Shipped Quantity
              </th>
              <th className="border border-gray-300 px-4 py-2 w-1/8 text-left truncate">
                Received Quantity
              </th>
              <th className="border border-gray-300 px-4 py-2 w-1/8 text-left truncate">
                Available Quantity
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((item, index) => (
              <tr key={index} className="text-left">
                <td className="border border-gray-300 px-4 py-2 truncate">
                  {item.OrderDate || "N/A"}
                </td>
                <td className="border border-gray-300 px-4 py-2 truncate">
                  {item.WarehouseName || "N/A"}
                </td>
                <td className="border border-gray-300 px-4 py-2 truncate">
                  {item.CategoryName || "N/A"}
                </td>
                <td className="border border-gray-300 px-4 py-2 truncate">
                  {item.ProductName || "N/A"}
                </td>
                <td className="border border-gray-300 px-4 py-2 truncate">
                  {item.VendorEmail || "N/A"}
                </td>
                <td className="border border-gray-300 px-4 py-2 truncate">
                  {item.Status === "Shipped" ? item.OrderItemQuantity : 0}
                </td>
                <td className="border border-gray-300 px-4 py-2 truncate">
                  {item.Status === "Received" ? item.OrderItemQuantity : 0}
                </td>
                <td className="border border-gray-300 px-4 py-2 truncate">
                  {item.AvaliableQuantity ?? 0}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default InventoryReport;

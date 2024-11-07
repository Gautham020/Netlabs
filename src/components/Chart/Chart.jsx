import React from "react";
import { Bar, Line, Pie } from "react-chartjs-2";
import "chart.js/auto";

const Chart = ({ data, title, chartType = "Bar" }) => {
  const renderChart = () => {
    switch (chartType) {
      case "Bar":
        return <Bar data={data} options={chartOptions} />;
      case "Line":
        return <Line data={data} options={chartOptions} />;
      case "Pie":
        return <Pie data={data} options={chartOptions} />;
      default:
        return <Bar data={data} options={chartOptions} />;
    }
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: title,
      },
    },
  };

  return (
    <div className="p-4 bg-white rounded shadow-md">
      <h2 className="text-xl font-bold mb-2 text-center">{title}</h2>
      {renderChart()}
    </div>
  );
};

export default Chart;

import React from "react";

import InventoryReport from "../components/Chart/InventoryReport";

export default function Home() {
  return (
    <div className="  flex flex-col bg-white p-3 ">
      <div className="w-full ">
        <InventoryReport />
      </div>
    </div>
  );
}

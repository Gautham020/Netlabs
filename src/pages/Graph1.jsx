import React, { useEffect, useState } from "react";
import axios from "axios";
import saved from "../images/bookmark.png";
import check from "../images/check.png";
import edit from "../images/edit.png";
import Swal from "sweetalert2";
import Graph from "../components/Chart/Graph";

export default function Graph1() {
  return (
    <div className="container mx-auto p-4">
      <div className="w-full border rounded-lg p-4 mb-4 bg-gray-100 border-red-700">
        <Graph />
      </div>
    </div>
  );
}

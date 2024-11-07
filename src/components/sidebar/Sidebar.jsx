import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  HomeIcon,
  ChartBarIcon,
  ClipboardListIcon,
  DocumentReportIcon,
  UserIcon,
} from "@heroicons/react/solid";
import person from "../../images/avatar.png";
import personicon from "../../images/user (2).png";
import netlab from "../../images/circle-outline-xxl.png";

export default function Sidebar() {
  const currentUser = localStorage.getItem("currentUser");
  const [watchlistName, setWatchlistName] = useState("My Watchlist");

  useEffect(() => {
    const storedWatchlistName =
      localStorage.getItem(`watchlistName_${currentUser}`) || "My Watchlist";
    setWatchlistName(storedWatchlistName);
  }, [currentUser]);

  return (
    <div
      className="fixed top-0 left-0 min-h-screen bg-[#4C3BCF] text-white dark:bg-gray-900 dark:text-white 
                 flex flex-col items-center w-20 md:w-64 hover:w-64 transition-all duration-300 
                 ease-in-out shadow-xl rounded-l-lg z-20 overflow-hidden"
    >
      <div className="mb-6 p-4 mt-8 w-full text-center  border-spacing-4 bg-gray-500">
        <h5 className="font-sans text-xl font-semibold text-white flex items-center justify-center md:justify-start">
          <img className="w-7 h-7" src={netlab} alt="Logo" />
          <span className="hidden md:block ml-2">NetLabs</span>
        </h5>
      </div>

      <nav className="flex flex-col gap-4 w-full p-2 font-sans text-base font-normal text-gray-700">
        <SidebarLink
          to="/"
          icon={<HomeIcon className="h-6 w-6 text-white" />}
          label="Date Based Report"
        />
        <SidebarLink
          to="/graph"
          icon={<ChartBarIcon className="h-6 w-6 text-white" />}
          label="Category Graph"
        />
        <SidebarLink
          to="/graph2"
          icon={<ClipboardListIcon className="h-6 w-6 text-white" />}
          label="Inventory Aging Report"
        />
        <SidebarLink
          to="/graph3"
          icon={<DocumentReportIcon className="h-6 w-6 text-white" />}
          label="BackOrder Report"
        />

        <Link to="#">
          <div
            role="button"
            tabIndex="0"
            className="flex mt-32 items-center p-3 w-full bg-slate-400 hover:bg-white hover:bg-opacity-80 transition-colors duration-300 rounded-lg justify-center md:justify-start"
          >
            <img
              className="w-10 h-10"
              src={currentUser ? person : personicon}
              alt="Profile"
            />
            <span className="ml-3 text-sm hidden md:inline-block text-white">
              {currentUser ? currentUser : "Gautham"}
            </span>
          </div>
        </Link>
      </nav>
    </div>
  );
}

// Sidebar link component
function SidebarLink({ to, icon, label }) {
  return (
    <Link to={to}>
      <div
        role="button"
        tabIndex="0"
        className="flex items-center p-3 w-full hover:bg-opacity-80 hover:bg-[#6757d1] transition-colors duration-300 lg:text-white rounded-lg justify-center md:justify-start"
      >
        {icon}
        <span className="ml-4 hidden md:inline-block text-white">{label}</span>
      </div>
    </Link>
  );
}

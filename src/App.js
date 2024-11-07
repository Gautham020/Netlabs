import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import Home from "./pages/Home";
import Sidebar from "./components/sidebar/Sidebar";
import Header from "./components/header/Header";
import Login from "./pages/Login";
import Graph2 from "./pages/Graph2";
import Graph3 from "./pages/Graph3";
import Graph1 from "./pages/Graph1";

function App() {
  const isLoggedIn = !!localStorage.getItem("currentUser");

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route
          path="/"
          element={
            <div className="flex h-screen">
              <div className="w-64  h-full  ">
                <Sidebar />
              </div>

              <div className="flex-grow  ">
                <div className=" w-full ml-0 ">
                  <Header className="overflow-hidden" />
                </div>

                <div className="p-0   overflow-y-auto p-10 ">
                  <Home />
                </div>
              </div>
            </div>
          }
        />
        <Route
          path="/graph"
          element={
            <div className="flex h-screen">
              <div className="w-64 p-3 h-full">
                <Sidebar />
              </div>

              <div className="flex-grow ">
                <div className=" w-full ml-0">
                  <Header />
                </div>

                <div className="p-4 mt-16 overflow-y-auto">
                  <Graph1 />
                </div>
              </div>
            </div>
          }
        />
        <Route
          path="/graph2"
          element={
            <div className="flex h-screen">
              <div className="w-64 p-3 h-full">
                <Sidebar />
              </div>

              <div className="flex-grow ">
                <div className=" w-full ml-0">
                  <Header />
                </div>

                <div className="p-4 mt-16 overflow-y-auto">
                  <Graph2 />
                </div>
              </div>
            </div>
          }
        />
        <Route
          path="/graph3"
          element={
            <div className="flex h-screen">
              <div className="w-64 p-3 h-full">
                <Sidebar />
              </div>

              <div className="flex-grow ">
                <div className=" w-full ml-0">
                  <Header />
                </div>

                <div className="p-4 mt-16 overflow-y-auto">
                  <Graph3 />
                </div>
              </div>
            </div>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;

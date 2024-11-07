import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; 
import Swal from "sweetalert2";
import BgImage from "../images/superhero-standing-ledge-city_1161840-2770.avif";

export default function Login() {
  const [email, setEmail] = useState(""); 
  const [error, setError] = useState(""); 
  const navigate = useNavigate();
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!email) {
      setError("Please enter your email.");
      return;
    }

    const users = JSON.parse(localStorage.getItem("users")) || {};

    if (users[email]) {
      localStorage.setItem("currentUser", email); 

      Swal.fire({
        icon: "info",
        title: "Email already exists",
        text: "You are already registered, logging you in...",
        confirmButtonText: "Ok",
      }).then(() => {
        navigate("/"); 
      });
    } else {
      users[email] = { email }; 
      localStorage.setItem("users", JSON.stringify(users));
      localStorage.setItem("currentUser", email);

      Swal.fire({
        title: "Terms and conditions",
        input: "checkbox",
        inputValue: 1,
        inputPlaceholder: "I agree with the terms and conditions",
        confirmButtonText: "Continue&nbsp;<i class='fa fa-arrow-right'></i>",
        inputValidator: (result) => {
          return !result && "You need to agree with T&C";
        },
      }).then((result) => {
        if (result.value) {
          Swal.fire({
            icon: "success",
            title: "Registration Successful",
            text: "Press OK to login to our website",
            confirmButtonText: "OK",
          }).then(() => {
            navigate("/");
          });
        }
      });
    }
  };

  return (
    <div
      className="flex items-center justify-center min-h-screen bg-cover bg-center"
      style={{
        backgroundImage: `url(${BgImage})`, 
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md mx-4 sm:mx-auto sm:max-w-md md:max-w-lg lg:max-w-xl">
        <h2 className="text-lg font-semibold mb-4 text-center sm:text-2xl">
          Movie App Login
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              className="block text-sm font-medium text-gray-700"
              htmlFor="email"
            >
              Email:
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)} 
              className="mt-1 p-2 border border-gray-300 rounded-md w-full"
              placeholder="Enter your email"
              required 
            />
          </div>
          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}{" "}
          <button
            type="submit"
            className="w-full bg-red-400 text-white py-2 rounded-md hover:bg-red-600 transition duration-200"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}

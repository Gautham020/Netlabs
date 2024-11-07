import React from "react";

export default function Header() {
  return (
    <nav className=" overflow-hidden top-0 left-6 max-w-screen px-4 py-2 bg-white shadow-md rounded-md lg:px-8 lg:py-3 z-9">
      <div className=" container flex flex-wrap items-center justify-between mx-auto text-slate-800">
       

        <div className="flex-grow hidden lg:flex justify-center mr-[300px]">
          <div className="w-full max-w-lg min-w-[200px] relative">
            <input
              type="text"
              className="w-full pl-10 pr-3 py-2 bg-transparent placeholder:text-slate-400 text-slate-600 text-sm border border-slate-200 rounded-md transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
              placeholder="Type here..."
            />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="absolute w-5 h-5 top-2.5 left-2.5 text-slate-600"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
              />
            </svg>
          </div>
        </div>
      </div>
    </nav>
  );
}

import React from "react";

const Navbar = () => {
  return (
    <nav className="bg-pink text-white py-4 px-8 shadow-md">
      <div className="flex justify-between items-center max-w-screen-xl mx-auto">
        <div className="text-xl font-bold">BreastCare</div>
        <ul className="flex gap-6">
          <li>
            <a href="#about" className="hover:underline">
              About
            </a>
          </li>
          <li>
            <a href="#contact" className="hover:underline">
              Contact
            </a>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;

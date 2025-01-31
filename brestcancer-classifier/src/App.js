import React from "react";
import Navbar from "./Navbar";
import FileUploader from "./FileUploader";
import bishwaImg from "./assets/b.png";
import ismarikaImg from "./assets/i.jpg";
import diwashImg from "./assets/d.jpg";

function App() {
  return (
    <div className="App">
      <Navbar />
      <header className="custom-header">
  <div className="container mx-auto px-4 glassmorphic-container">
    <h1 className="text-4xl font-bold mb-4 drop-shadow-md">
      AI Breast Cancer Classification and <span className="text-pink-dark">ROI Segmentation</span>
    </h1>
    <p className="text-lg font-medium drop-shadow-sm">
      Upload your breast ultrasound and generate an AI-driven report!
    </p>
  </div>
</header>




      <FileUploader />
      {/* About Section */}
      <section className="custom-about" id='about'>
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold text-center text-pink-800 mb-12">About This Project</h2>
          <div className="grid md:grid-cols-3 gap-8 text-center text-gray-800">
            {[
              { name: "Bishwa Kiran Poudel", roll: "Roll No: 13", img: bishwaImg },
              { name: "Ismarika Sendang", roll: "Roll No: 15", img: ismarikaImg },
              { name: "Diwash Ghimire", roll: "Roll No: 14", img: diwashImg },
            ].map((student, index) => (
              <div key={index} className="p-8  rounded-xl shadow-lg flex flex-col items-center glassmorphic-container2">
                <img src={student.img} alt={student.name} className="w-24 h-24 rounded-full mb-4 border-4 border-pink-500" />
                <h3 className="text-2xl font-semibold text-pink-600">{student.name}</h3>
                <p className="text-gray-700 text-lg">Batch 077 | {student.roll}</p>
              </div>
            ))}
          </div>
          <p className="text-center text-gray-700 mt-12 text-xl max-w-2xl mx-auto glassmorphic-container2">
            This is a 7th semester project of CSIT students from Mechi Multiple Campus, developed for segmentation and classification of breast cancer ultrasound images.
          </p>
        </div>
      </section>
    </div>
  );
}

export default App;

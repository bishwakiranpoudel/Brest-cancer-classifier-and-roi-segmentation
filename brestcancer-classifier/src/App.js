import React from "react";
import Navbar from "./Navbar";
import FileUploader from "./FileUploader";

function App() {
  return (
    <div className="App">
      <Navbar />
      <header className="text-center py-16 bg-gradient-to-r from-pink via-pink-light to-white text-white">
  <div className="container mx-auto px-4">
    <h1 className="text-4xl font-bold mb-4 drop-shadow-md">
      AI Breast Cancer Classification and <span className="text-pink-dark">ROI Segmentation</span>
    </h1>
    <p className="text-lg font-medium drop-shadow-sm">
      Upload your breast ultrasound and generate an AI-driven report!
    </p>
  </div>
</header>




      <FileUploader />
    </div>
  );
}

export default App;

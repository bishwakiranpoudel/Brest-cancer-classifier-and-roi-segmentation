import React, { useState } from "react";

const FileUploader = () => {
  const [files, setFiles] = useState([]);
  const [uploadedImages, setUploadedImages] = useState([]);

  // Function to send the image to the API and update the response
  const sendImageToApi = async (file, index) => {
    const formData = new FormData();
    formData.append("image", file.file);

    try {
      const response = await fetch("http://127.0.0.1:8000/api/predict/", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        setUploadedImages((prev) =>
          prev.map((img, idx) =>
            idx === index
              ? {
                  ...img,
                  predictedClass: data.predicted_class,
                  apiImage: data.segmentation_overlay
                    ? `data:image/png;base64,${data.segmentation_overlay}`
                    : null,
                }
              : img
          )
        );
      } else {
        alert(`Request failed with status code ${response.status}`);
      }
    } catch (error) {
      console.error("Error sending image to API:", error);
      alert("An error occurred while sending the image to the API.");
    }
  };

  const handleFiles = (selectedFiles) => {
    const newFiles = Array.from(selectedFiles).map((file) => ({
      file,
      preview: URL.createObjectURL(file),
      predictedClass: null,
      apiImage: null,
    }));

    setFiles((prev) => [...prev, ...newFiles]);
    setUploadedImages((prev) => [...prev, ...newFiles]);
  };

  const handleFileSelect = (event) => {
    handleFiles(event.target.files);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    handleFiles(event.dataTransfer.files);
  };

  return (
    <div className="bg-offwhite min-h-screen py-12 px-4">
      <div className="max-w-screen-xl mx-auto space-y-12">
        {/* Drag-and-Drop or File Upload */}
        <div
          className="border-2 border-dashed border-pink-light rounded-lg p-8 text-center"
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
        >
          <p className="text-pink-dark font-medium">
            Drag and drop your image files here, or
          </p>
          <input
            type="file"
            accept=".png"
            multiple
            onChange={handleFileSelect}
            className="hidden"
            id="image"
          />
          <label
            htmlFor="image"
            className="cursor-pointer mt-4 inline-block bg-pink text-white px-6 py-3 rounded-lg shadow-md hover:bg-pink-dark transition"
          >
            Browse Files
          </label>
        </div>

        {/* Uploaded Files */}
        {uploadedImages.length > 0 && (
          <div className="space-y-8">
            <h3 className="text-2xl font-bold text-pink-dark">Uploaded Images</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {uploadedImages.map((image, index) => (
                <div
                  key={index}
                  className="bg-white rounded-lg shadow-lg p-6 flex flex-col space-y-4"
                >
                  {/* Original Image */}
                  <div>
                    <img
                      src={image.preview}
                      alt="Original preview"
                      className="w-full h-auto object-cover rounded-lg border border-pink-light"
                    />
                    <p className="text-center mt-2 text-pink-dark">Original Image</p>
                  </div>

                  {/* API Processed Image */}
                  <div>
                    {image.apiImage ? (
                      <>
                        <img
                          src={image.apiImage}
                          alt="Processed preview"
                          className="w-full h-auto object-cover rounded-lg border border-pink-light"
                        />
                        <p className="text-center mt-2 text-pink-dark">
                          Processed Image
                        </p>
                      </>
                    ) : (
                      <div className="text-center py-10 bg-gray-50 rounded-lg border border-l-gray-200">
                        <p className="text-gray-600">No processed image available</p>
                      </div>
                    )}
                  </div>

                  {/* Prediction & Actions */}
                  <div className="flex flex-col items-center space-y-4">
                    {image.predictedClass && (
                      <span className="text-lg font-semibold text-pink">
                        Prediction: {image.predictedClass}
                      </span>
                    )}
                    {image.predictedClass ? (
                      image.apiImage && (
                        <button
                          className="bg-pink text-white px-4 py-2 rounded-lg shadow-md hover:bg-pink-dark transition"
                          onClick={() => {
                            const link = document.createElement("a");
                            link.href = image.apiImage;
                            link.download = "result.png";
                            link.click();
                          }}
                        >
                          Download Processed Image
                        </button>
                      )
                    ) : (
                      <button
                        onClick={() => sendImageToApi(image, index)}
                        className="bg-pink text-white px-4 py-2 rounded-lg shadow-md hover:bg-pink-dark transition"
                      >
                        Send to API
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FileUploader;

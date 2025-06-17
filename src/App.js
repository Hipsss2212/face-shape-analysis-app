import React from 'react';
import FaceAnalysis from './components/FaceAnalysis';

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Face Shape Analysis
          </h1>
          <p className="text-lg text-gray-600">
            Upload your photo to analyze your face shape and get personalized hairstyle recommendations
          </p>
        </header>
        
        <FaceAnalysis />
        
        <footer className="mt-12 text-center text-gray-500 text-sm">
          <p>
            This application processes images locally on your device. 
            No images are stored or transmitted to external servers.
          </p>
          <p className="mt-2">
            Built with ReactJS, OpenCV.js, and Mediapipe FaceMesh
          </p>
        </footer>
      </div>
    </div>
  );
}

export default App; 
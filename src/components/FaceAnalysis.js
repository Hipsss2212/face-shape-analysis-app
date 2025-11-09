import React, { useState, useRef, useEffect } from 'react';
import {
  calculateFaceMeasurements,
  determineFaceShape,
  getHairstyleRecommendations,
  drawLandmarks
} from '../utils/faceShapeUtils';
import Chatbox from './Chatbox';

const FaceAnalysis = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [opencvReady, setOpencvReady] = useState(false);
  const [mediapipeReady, setMediapipeReady] = useState(false);
  const [canvasCreated, setCanvasCreated] = useState(false);
  const [chatboxOpen, setChatboxOpen] = useState(false);
  const [showLandmarks, setShowLandmarks] = useState(true);
  const [showMeasurements, setShowMeasurements] = useState(true);

  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);

  // Check if OpenCV.js and Mediapipe are loaded
  useEffect(() => {
    const checkLibraries = () => {
      if (window.opencvReady) {
        setOpencvReady(true);
      }
      if (window.FaceMesh) {
        setMediapipeReady(true);
      }
    };

    const interval = setInterval(checkLibraries, 100);
    return () => clearInterval(interval);
  }, []);

  // Force re-render when analysis result changes - removed, handled in draw canvas useEffect

  // Draw canvas when analysis result is available
  useEffect(() => {
    if (analysisResult && canvasRef.current && selectedImage) {
      console.log('Drawing canvas with analysis results...');
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      
      // Create image element to draw
      const img = new Image();
      img.onload = () => {
        try {
          // Set canvas dimensions
          const maxWidth = 800;
          const maxHeight = 600;
          let width = img.width;
          let height = img.height;
          
          // Scale down if too large
          if (width > maxWidth || height > maxHeight) {
            const ratio = Math.min(maxWidth / width, maxHeight / height);
            width = width * ratio;
            height = height * ratio;
          }
          
          canvas.width = width;
          canvas.height = height;
          
          // Clear canvas first
          ctx.clearRect(0, 0, width, height);
          
          // Draw original image
          ctx.drawImage(img, 0, 0, width, height);
          
          // Draw landmarks with correct parameter order
          drawLandmarks(
            ctx, 
            analysisResult.landmarks, 
            canvas, 
            analysisResult.faceShape.shape, 
            analysisResult.measurements, 
            analysisResult.faceShape.confidence, 
            analysisResult.faceShape.secondBestShape, 
            analysisResult.faceShape.scoreDiff, 
            analysisResult.faceShape.quality,
            showLandmarks,
            showMeasurements,
            img
          );
          
          console.log('Canvas drawn successfully');
          setCanvasCreated(true);
        } catch (error) {
          console.error('Error drawing canvas:', error);
        }
      };
      img.onerror = (error) => {
        console.error('Error loading image:', error);
      };
      img.src = selectedImage;
    }
  }, [analysisResult, selectedImage, showLandmarks, showMeasurements]);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    console.log('File selected:', file.name, file.type, file.size);

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file (JPEG, PNG)');
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setError('Image file size must be less than 10MB');
      return;
    }

    setError(null);
    setAnalysisResult(null);
    
    const reader = new FileReader();
    reader.onload = (e) => {
      console.log('File loaded successfully');
      setSelectedImage(e.target.result);
      setImagePreview(e.target.result);
    };
    
    reader.onerror = (e) => {
      console.error('Error reading file:', e);
      setError('Error reading the image file. Please try again.');
    };
    
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      console.log('File dropped:', file.name, file.type, file.size);
      
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setError('Please select a valid image file (JPEG, PNG)');
        return;
      }

      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        setError('Image file size must be less than 10MB');
        return;
      }

      setError(null);
      setAnalysisResult(null);
      
      const reader = new FileReader();
      reader.onload = (e) => {
        console.log('File loaded successfully from drop');
        setSelectedImage(e.target.result);
        setImagePreview(e.target.result);
      };
      
      reader.onerror = (e) => {
        console.error('Error reading dropped file:', e);
        setError('Error reading the image file. Please try again.');
      };
      
      reader.readAsDataURL(file);
    }
  };

  const processImage = async () => {
    if (!selectedImage) {
      setError('Please select an image first');
      return;
    }

    if (!opencvReady || !mediapipeReady) {
      setError('Please wait for libraries to load completely');
      return;
    }

    console.log('Starting image processing...');

    setIsProcessing(true);
    setError(null);

    try {
      // Create a temporary canvas for processing
      const tempCanvas = document.createElement('canvas');
      const tempCtx = tempCanvas.getContext('2d');

      // Create image element
      const img = new Image();
      img.onload = async () => {
        try {
          console.log('Image loaded, dimensions:', img.width, 'x', img.height);
          
          // Set temporary canvas dimensions
          tempCanvas.width = img.width;
          tempCanvas.height = img.height;

          // Draw image on temporary canvas
          tempCtx.drawImage(img, 0, 0);

          console.log('Image drawn to temporary canvas');

          // Initialize Mediapipe FaceMesh
          const faceMesh = new window.FaceMesh({
            locateFile: (file) => {
              return `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`;
            }
          });

          faceMesh.setOptions({
            maxNumFaces: 1,
            refineLandmarks: true,
            minDetectionConfidence: 0.5,
            minTrackingConfidence: 0.5
          });

          console.log('FaceMesh initialized, processing image...');

          // Process the image using temporary canvas
          const results = await new Promise((resolve, reject) => {
            faceMesh.onResults((results) => {
              console.log('FaceMesh results received:', results);
              resolve(results);
            });

            faceMesh.send({ image: tempCanvas });
          });

          if (!results.multiFaceLandmarks || results.multiFaceLandmarks.length === 0) {
            setError('No face detected in the image. Please try with a clearer photo.');
            setIsProcessing(false);
            return;
          }

          if (results.multiFaceLandmarks.length > 1) {
            setError('Multiple faces detected. Please upload an image with only one face.');
            setIsProcessing(false);
            return;
          }

          const landmarks = results.multiFaceLandmarks[0];
          console.log('Landmarks extracted:', landmarks.length, 'points');

          // Calculate face measurements
          const measurements = calculateFaceMeasurements(landmarks);
          console.log('Measurements calculated:', measurements);
          
          // Determine face shape
          const faceShape = determineFaceShape(measurements);
          console.log('Face shape determined:', faceShape);
          
          // Get hairstyle recommendations
          const hairstyleRecommendations = getHairstyleRecommendations(faceShape.shape);

          // Set analysis result first
          setAnalysisResult({
            landmarks,
            measurements,
            faceShape,
            hairstyleRecommendations,
          });
          
          // Canvas will be drawn in useEffect after state is set
          setCanvasCreated(true);

        } catch (innerError) {
          console.error('Error during image processing:', innerError);
          setError('Error during image processing: ' + innerError.message);
        } finally {
          setIsProcessing(false);
        }
      };
      img.onerror = () => {
        console.error('Error loading image for processing.');
        setError('Could not load image for processing. Please try again.');
        setIsProcessing(false);
      };
      img.src = selectedImage;

    } catch (outerError) {
      console.error('Unexpected error:', outerError);
      setError('An unexpected error occurred: ' + outerError.message);
      setIsProcessing(false);
    }
  };

  const resetAnalysis = () => {
    setSelectedImage(null);
    setImagePreview(null);
    setAnalysisResult(null);
    setError(null);
    setCanvasCreated(false);
    // Clear canvas content
    const canvasContainer = document.getElementById('canvas-container');
    if (canvasContainer) {
      canvasContainer.innerHTML = '';
    }
  };

  const formatMeasurement = (value) => {
    return `${value.toFixed(2)}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Face Shape Analyzer</h1>
                <p className="text-sm text-gray-600">AI-powered facial analysis and hairstyle recommendations</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <div className={`w-3 h-3 rounded-full ${opencvReady ? 'bg-green-500' : 'bg-gray-300'}`}></div>
              <span className="text-sm text-gray-600">OpenCV</span>
              <div className={`w-3 h-3 rounded-full ${mediapipeReady ? 'bg-green-500' : 'bg-gray-300'}`}></div>
              <span className="text-sm text-gray-600">MediaPipe</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column - Upload and Controls */}
          <div className="lg:col-span-1 space-y-6">
            
            {/* Upload Section */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Upload Image</h2>
              
              {/* Status Indicator */}
              <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Library Status:</span>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      opencvReady && mediapipeReady 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {opencvReady && mediapipeReady ? 'Ready' : 'Loading...'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Upload Area */}
              <div 
                className={`relative border-2 border-dashed rounded-lg p-6 text-center transition-all duration-200 ${
                  selectedImage 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-300 hover:border-gray-400'
                } ${isProcessing ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current.click()}
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageUpload}
                  className="hidden"
                  accept="image/jpeg, image/png"
                />
                
                {imagePreview ? (
                  <div className="space-y-3">
                    <img 
                      src={imagePreview} 
                      alt="Preview" 
                      className="max-w-full h-32 object-cover mx-auto rounded-lg shadow-sm" 
                    />
                    <p className="text-sm text-blue-600 font-medium">Image selected ✓</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mx-auto">
                      <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">Upload an image</p>
                      <p className="text-xs text-gray-500">Drag and drop or click to browse</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Error Display */}
              {error && (
                <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="mt-6 space-y-3">
                <button
                  onClick={processImage}
                  disabled={!selectedImage || isProcessing || !opencvReady || !mediapipeReady}
                  className={`w-full py-3 px-4 rounded-lg font-medium transition-all duration-200 ${
                    (!selectedImage || isProcessing || !opencvReady || !mediapipeReady) 
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                      : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 shadow-md hover:shadow-lg'
                  }`}
                >
                  {isProcessing ? (
                    <div className="flex items-center justify-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Processing...</span>
                    </div>
                  ) : (
                    'Analyze Face'
                  )}
                </button>
                
                <button
                  onClick={resetAnalysis}
                  disabled={!selectedImage && !analysisResult && !error}
                  className={`w-full py-2 px-4 rounded-lg font-medium transition-all duration-200 ${
                    (!selectedImage && !analysisResult && !error) 
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Reset
                </button>
              </div>
            </div>

            {/* Quick Info */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">How it works</h3>
              <div className="space-y-3 text-sm text-gray-600">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-bold">1</div>
                  <p>Upload a clear photo with your face visible</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-bold">2</div>
                  <p>AI analyzes facial landmarks and measurements</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-bold">3</div>
                  <p>Get your face shape and personalized hairstyle recommendations</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Results */}
          <div className="lg:col-span-2 space-y-6">
            
            {!analysisResult ? (
              /* Welcome/Empty State */
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
                <div className="w-24 h-24 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-12 h-12 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Ready to analyze your face shape?</h3>
                <p className="text-gray-600 mb-6">Upload an image to get started with AI-powered facial analysis</p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <div className="font-semibold text-gray-900">6 Face Shapes</div>
                    <div className="text-gray-600">Oval, Round, Square, Heart, Diamond, Oblong</div>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <div className="font-semibold text-gray-900">468 Landmarks</div>
                    <div className="text-gray-600">Precise facial measurements</div>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <div className="font-semibold text-gray-900">AI Powered</div>
                    <div className="text-gray-600">Advanced computer vision</div>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <div className="font-semibold text-gray-900">Personalized</div>
                    <div className="text-gray-600">Hairstyle recommendations</div>
                  </div>
                </div>
              </div>
            ) : (
              /* Analysis Results */
              <div className="space-y-6">
                
                {/* Main Results Header */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold text-gray-900">Analysis Results</h2>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-600">Confidence:</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        analysisResult.faceShape.confidence >= 80 
                          ? 'bg-green-100 text-green-800' 
                          : analysisResult.faceShape.confidence >= 60 
                          ? 'bg-yellow-100 text-yellow-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {analysisResult.faceShape.confidence}%
                      </span>
                    </div>
                  </div>
                  
                  {/* Face Shape Result */}
                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">Detected Face Shape</h3>
                        <p className="text-2xl font-bold text-blue-600">{analysisResult.faceShape.shape}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-600">Quality Score</p>
                        <p className="text-lg font-semibold text-gray-900">
                          {(analysisResult.faceShape.quality * 100).toFixed(0)}%
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Canvas and Measurements Grid */}
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                  
                  {/* Canvas */}
                  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-gray-900">Facial Landmarks</h3>
                      {analysisResult && (
                        <div className="flex items-center space-x-4">
                          {/* Toggle Landmarks */}
                          <label className="flex items-center space-x-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={showLandmarks}
                              onChange={(e) => setShowLandmarks(e.target.checked)}
                              className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                            />
                            <span className="text-sm text-gray-700">Landmarks</span>
                          </label>
                          {/* Toggle Measurements */}
                          <label className="flex items-center space-x-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={showMeasurements}
                              onChange={(e) => setShowMeasurements(e.target.checked)}
                              className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                            />
                            <span className="text-sm text-gray-700">Measurements</span>
                          </label>
                        </div>
                      )}
                    </div>
                    <div id="canvas-container" className="flex flex-col items-center justify-center bg-gray-50 rounded-lg p-4">
                      {analysisResult ? (
                        <>
                          <canvas 
                            ref={canvasRef} 
                            className="max-w-full h-auto border border-gray-200 rounded-lg shadow-sm bg-white" 
                            style={{
                              maxHeight: '60vh', 
                              maxWidth: '100%',
                              display: canvasCreated ? 'block' : 'none'
                            }}
                          />
                          {!canvasCreated && (
                            <div className="w-full h-64 bg-gray-100 rounded-lg flex items-center justify-center text-gray-500">
                              <div className="text-center">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto mb-2"></div>
                                <p>Preparing visualization...</p>
                              </div>
                            </div>
                          )}
                        </>
                      ) : (
                        <div className="w-full h-64 bg-gray-100 rounded-lg flex items-center justify-center text-gray-500">
                          <p>Canvas will appear here after analysis</p>
                        </div>
                      )}
                    </div>
                    {analysisResult && (
                      <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                        <p className="text-xs text-gray-600">
                          <span className="font-semibold">468 landmarks</span> detected • 
                          <span className="font-semibold"> {analysisResult.landmarks.length}</span> points shown
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Measurements */}
                  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Facial Measurements</h3>
                    {analysisResult.measurements && (
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="p-3 bg-gray-50 rounded-lg">
                            <p className="text-sm text-gray-600">Face Length</p>
                            <p className="text-lg font-semibold text-gray-900">{formatMeasurement(analysisResult.measurements.faceLength)}</p>
                          </div>
                          <div className="p-3 bg-gray-50 rounded-lg">
                            <p className="text-sm text-gray-600">Face Width</p>
                            <p className="text-lg font-semibold text-gray-900">{formatMeasurement(analysisResult.measurements.faceWidth)}</p>
                          </div>
                          <div className="p-3 bg-gray-50 rounded-lg">
                            <p className="text-sm text-gray-600">Cheekbone Width</p>
                            <p className="text-lg font-semibold text-gray-900">{formatMeasurement(analysisResult.measurements.cheekboneWidth)}</p>
                          </div>
                          <div className="p-3 bg-gray-50 rounded-lg">
                            <p className="text-sm text-gray-600">Jaw Width</p>
                            <p className="text-lg font-semibold text-gray-900">{formatMeasurement(analysisResult.measurements.jawWidth)}</p>
                          </div>
                        </div>
                        
                        <div className="border-t pt-4">
                          <h4 className="font-semibold text-gray-900 mb-3">Key Ratios</h4>
                          <div className="grid grid-cols-2 gap-3 text-sm">
                            <div className="flex justify-between">
                              <span className="text-gray-600">Face (L/W):</span>
                              <span className="font-semibold">{analysisResult.measurements.faceRatio.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Jaw/Forehead:</span>
                              <span className="font-semibold">{analysisResult.measurements.jawToForeheadRatio.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Cheekbone/Jaw:</span>
                              <span className="font-semibold">{analysisResult.measurements.cheekboneToJawRatio.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Chin Angle:</span>
                              <span className="font-semibold">{analysisResult.measurements.chinAngle.toFixed(1)}°</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Shape Scores */}
                {analysisResult.faceShape.scores && (
                  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Shape Analysis Scores</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                      {Object.entries(analysisResult.faceShape.scores)
                        .sort(([, scoreA], [, scoreB]) => scoreB - scoreA)
                        .map(([shape, score]) => (
                          <div 
                            key={shape} 
                            className={`p-3 rounded-lg border-2 transition-all duration-200 ${
                              shape === analysisResult.faceShape.shape 
                                ? 'border-blue-500 bg-blue-50' 
                                : 'border-gray-200 bg-gray-50'
                            }`}
                          >
                            <p className="text-sm font-medium text-gray-900">{shape}</p>
                            <p className={`text-lg font-bold ${
                              shape === analysisResult.faceShape.shape 
                                ? 'text-blue-600' 
                                : 'text-gray-600'
                            }`}>
                              {score.toFixed(2)}
                            </p>
                          </div>
                        ))}
                    </div>
                  </div>
                )}

                {/* Hairstyle Recommendations */}
                {analysisResult.hairstyleRecommendations && (
                  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Hairstyle Recommendations</h3>
                    <div className="space-y-4">
                      <p className="text-gray-700 leading-relaxed">{analysisResult.hairstyleRecommendations.description}</p>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg">
                          <h4 className="font-semibold text-blue-900 mb-2">Short Hair</h4>
                          <p className="text-sm text-blue-800">{analysisResult.hairstyleRecommendations.short}</p>
                        </div>
                        <div className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg">
                          <h4 className="font-semibold text-purple-900 mb-2">Medium Hair</h4>
                          <p className="text-sm text-purple-800">{analysisResult.hairstyleRecommendations.medium}</p>
                        </div>
                        <div className="p-4 bg-gradient-to-br from-pink-50 to-pink-100 rounded-lg">
                          <h4 className="font-semibold text-pink-900 mb-2">Long Hair</h4>
                          <p className="text-sm text-pink-800">{analysisResult.hairstyleRecommendations.long}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Chatbox Button */}
                {analysisResult && (
                  <div className="flex justify-center mt-6">
                    <button
                      onClick={() => setChatboxOpen(true)}
                      className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg shadow-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 flex items-center space-x-2 font-semibold"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                      <span>Tư vấn với AI</span>
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Chatbox Component */}
      <Chatbox
        analysisResult={analysisResult}
        isOpen={chatboxOpen}
        onClose={() => setChatboxOpen(false)}
      />
    </div>
  );
};

export default FaceAnalysis; 
import React, { useState, useContext } from 'react';
import { AuthContext } from './contexts/AuthContext';
import FaceAnalysis from './components/FaceAnalysis';
import Login from './components/Login';
import Register from './components/Register';
import Profile from './components/Profile';
import { logout as logoutService } from './services/authService';

function App() {
  const { user, logout: logoutContext, loading } = useContext(AuthContext);
  const [showRegister, setShowRegister] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  const handleLogout = () => {
    logoutService();
    logoutContext();
  };

  // Hiển thị loading khi đang kiểm tra authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Đang tải...</p>
        </div>
      </div>
    );
  }

  // Hiển thị Login hoặc Register nếu chưa đăng nhập
  if (!user) {
    if (showRegister) {
      return <Register onSwitchToLogin={() => setShowRegister(false)} />;
    }
    return <Login onSwitchToRegister={() => setShowRegister(true)} />;
  }

  // Hiển thị trang Profile nếu showProfile = true
  if (showProfile) {
    return <Profile onBack={() => setShowProfile(false)} />;
  }

  // Hiển thị ứng dụng chính nếu đã đăng nhập
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-8">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center space-x-4">
              {user.avatar ? (
                <img
                  src={user.avatar}
                  alt="Avatar"
                  className="w-12 h-12 rounded-full object-cover border-2 border-indigo-200"
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-indigo-500 flex items-center justify-center text-white font-semibold text-lg">
                  {user.username.charAt(0).toUpperCase()}
                </div>
              )}
              <div className="text-left">
                <p className="text-sm text-gray-600">Xin chào,</p>
                <p className="text-lg font-semibold text-gray-800">
                  {user.fullName || user.username}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setShowProfile(true)}
                className="px-4 py-2 bg-indigo-500 text-white rounded-md hover:bg-indigo-600 transition-colors text-sm font-medium"
              >
                Hồ sơ
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors text-sm font-medium"
              >
                Đăng xuất
              </button>
            </div>
          </div>
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
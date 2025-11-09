// API Service - Giao tiếp với json-server
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

// Kiểm tra API có khả dụng không
let apiAvailable = true;

// Helper function để kiểm tra API
const checkApiAvailability = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/users`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
    return response.ok;
  } catch (error) {
    return false;
  }
};

// Lấy danh sách users từ API
export const getUsersFromAPI = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/users`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch users');
    }
    
    const data = await response.json();
    apiAvailable = true;
    return data;
  } catch (error) {
    console.warn('API not available, falling back to localStorage:', error);
    apiAvailable = false;
    throw error;
  }
};

// Tạo user mới qua API
export const createUserAPI = async (userData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to create user');
    }
    
    const data = await response.json();
    apiAvailable = true;
    return data;
  } catch (error) {
    console.warn('API not available:', error);
    apiAvailable = false;
    throw error;
  }
};

// Cập nhật user qua API
export const updateUserAPI = async (userId, userData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });
    
    if (!response.ok) {
      throw new Error('Failed to update user');
    }
    
    const data = await response.json();
    apiAvailable = true;
    return data;
  } catch (error) {
    console.warn('API not available:', error);
    apiAvailable = false;
    throw error;
  }
};

// Tìm user theo điều kiện
export const findUserAPI = async (query) => {
  try {
    // json-server hỗ trợ query parameters
    const queryString = Object.keys(query)
      .map(key => `${key}=${encodeURIComponent(query[key])}`)
      .join('&');
    
    const response = await fetch(`${API_BASE_URL}/users?${queryString}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
    
    if (!response.ok) {
      throw new Error('Failed to find user');
    }
    
    const data = await response.json();
    apiAvailable = true;
    return Array.isArray(data) ? data : [data];
  } catch (error) {
    console.warn('API not available:', error);
    apiAvailable = false;
    throw error;
  }
};

// Lấy user theo ID
export const getUserByIdAPI = async (userId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
    
    if (!response.ok) {
      throw new Error('Failed to get user');
    }
    
    const data = await response.json();
    apiAvailable = true;
    return data;
  } catch (error) {
    console.warn('API not available:', error);
    apiAvailable = false;
    throw error;
  }
};

// Kiểm tra API có khả dụng không
export const isAPIAvailable = () => apiAvailable;

// Khởi tạo kiểm tra API khi load
checkApiAvailability().catch(() => {
  apiAvailable = false;
});


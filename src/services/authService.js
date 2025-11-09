// Auth Service - Quản lý đăng ký và đăng nhập
// Sử dụng json-server API với fallback về localStorage

import {
  getUsersFromAPI,
  createUserAPI,
  updateUserAPI,
  findUserAPI,
  getUserByIdAPI,
  isAPIAvailable,
} from './apiService';

const STORAGE_KEY = 'face_shape_app_users';
const CURRENT_USER_KEY = 'face_shape_app_current_user';

// Khởi tạo dữ liệu từ db.json nếu chưa có
const initializeUsers = () => {
  const users = localStorage.getItem(STORAGE_KEY);
  if (!users) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([]));
  }
};

// Lấy danh sách users từ localStorage
const getUsers = () => {
  initializeUsers();
  const users = localStorage.getItem(STORAGE_KEY);
  return JSON.parse(users || '[]');
};

// Lưu users vào localStorage
const saveUsers = (users) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
};

// Đăng ký tài khoản mới
export const register = async (userData) => {
  const { username, email, password } = userData;

  // Validation
  if (!username || !email || !password) {
    throw new Error('Vui lòng điền đầy đủ thông tin');
  }

  if (password.length < 6) {
    throw new Error('Mật khẩu phải có ít nhất 6 ký tự');
  }

  // Kiểm tra email hợp lệ
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    throw new Error('Email không hợp lệ');
  }

  // Thử sử dụng API trước
  try {
    // Kiểm tra username và email đã tồn tại chưa
    const existingUsers = await getUsersFromAPI();
    if (existingUsers.find(user => user.username === username)) {
      throw new Error('Tên đăng nhập đã tồn tại');
    }
    if (existingUsers.find(user => user.email === email)) {
      throw new Error('Email đã được sử dụng');
    }

    // Tạo user mới qua API
    const newUser = {
      username,
      email,
      password, // Trong thực tế nên hash password
      createdAt: new Date().toISOString(),
      fullName: '',
      phone: '',
      avatar: '',
      bio: '',
    };

    const createdUser = await createUserAPI(newUser);

    return {
      success: true,
      message: 'Đăng ký thành công (đã lưu vào db.json)',
      user: {
        id: createdUser.id,
        username: createdUser.username,
        email: createdUser.email,
      },
    };
  } catch (apiError) {
    // Fallback về localStorage nếu API không khả dụng
    console.warn('API not available, using localStorage:', apiError);
    
    const users = getUsers();

    // Kiểm tra username đã tồn tại
    if (users.find(user => user.username === username)) {
      throw new Error('Tên đăng nhập đã tồn tại');
    }

    // Kiểm tra email đã tồn tại
    if (users.find(user => user.email === email)) {
      throw new Error('Email đã được sử dụng');
    }

    // Tạo user mới trong localStorage
    const newUser = {
      id: Date.now().toString(),
      username,
      email,
      password,
      createdAt: new Date().toISOString(),
      fullName: '',
      phone: '',
      avatar: '',
      bio: '',
    };

    users.push(newUser);
    saveUsers(users);

    return {
      success: true,
      message: 'Đăng ký thành công (lưu tạm trong localStorage)',
      user: {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
      },
    };
  }
};

// Đăng nhập
export const login = async (credentials) => {
  const { username, password } = credentials;

  if (!username || !password) {
    throw new Error('Vui lòng điền đầy đủ thông tin');
  }

  // Thử sử dụng API trước
  try {
    // Tìm user theo username hoặc email
    const usersByUsername = await findUserAPI({ username });
    const usersByEmail = await findUserAPI({ email: username }); // username có thể là email
    
    const user = [...usersByUsername, ...usersByEmail].find(
      u => (u.username === username || u.email === username) && u.password === password
    );

    if (!user) {
      throw new Error('Tên đăng nhập hoặc mật khẩu không đúng');
    }

    // Lưu thông tin user hiện tại (bao gồm cả profile)
    const currentUser = {
      id: user.id,
      username: user.username,
      email: user.email,
      fullName: user.fullName || '',
      phone: user.phone || '',
      avatar: user.avatar || '',
      bio: user.bio || '',
      updatedAt: user.updatedAt || user.createdAt,
    };
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(currentUser));

    return {
      success: true,
      message: 'Đăng nhập thành công',
      user: currentUser,
    };
  } catch (apiError) {
    // Fallback về localStorage
    console.warn('API not available, using localStorage:', apiError);
    
    const users = getUsers();

    // Tìm user theo username hoặc email
    const user = users.find(
      u => (u.username === username || u.email === username) && u.password === password
    );

    if (!user) {
      throw new Error('Tên đăng nhập hoặc mật khẩu không đúng');
    }

    // Lưu thông tin user hiện tại (bao gồm cả profile)
    const currentUser = {
      id: user.id,
      username: user.username,
      email: user.email,
      fullName: user.fullName || '',
      phone: user.phone || '',
      avatar: user.avatar || '',
      bio: user.bio || '',
      updatedAt: user.updatedAt || user.createdAt,
    };
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(currentUser));

    return {
      success: true,
      message: 'Đăng nhập thành công',
      user: currentUser,
    };
  }
};

// Đăng xuất
export const logout = () => {
  localStorage.removeItem(CURRENT_USER_KEY);
  return { success: true, message: 'Đăng xuất thành công' };
};

// Lấy thông tin user hiện tại
export const getCurrentUser = () => {
  const userStr = localStorage.getItem(CURRENT_USER_KEY);
  if (!userStr) return null;
  return JSON.parse(userStr);
};

// Kiểm tra đã đăng nhập chưa
export const isAuthenticated = () => {
  return getCurrentUser() !== null;
};

// Lấy đầy đủ thông tin profile của user
export const getUserProfile = async (userId) => {
  // Thử sử dụng API trước
  try {
    const user = await getUserByIdAPI(userId);
    if (!user) return null;
    
    return {
      id: user.id,
      username: user.username,
      email: user.email,
      fullName: user.fullName || '',
      phone: user.phone || '',
      avatar: user.avatar || '',
      bio: user.bio || '',
      createdAt: user.createdAt,
      updatedAt: user.updatedAt || user.createdAt,
    };
  } catch (apiError) {
    // Fallback về localStorage
    console.warn('API not available, using localStorage:', apiError);
    const users = getUsers();
    const user = users.find(u => u.id === userId);
    if (!user) return null;
    
    return {
      id: user.id,
      username: user.username,
      email: user.email,
      fullName: user.fullName || '',
      phone: user.phone || '',
      avatar: user.avatar || '',
      bio: user.bio || '',
      createdAt: user.createdAt,
      updatedAt: user.updatedAt || user.createdAt,
    };
  }
};

// Cập nhật thông tin profile
export const updateProfile = async (userId, profileData) => {
  const { fullName, phone, email, bio, avatar } = profileData;
  
  // Validation email nếu có thay đổi
  if (email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new Error('Email không hợp lệ');
    }
  }

  // Validation phone nếu có
  if (phone) {
    const phoneRegex = /^[0-9]{10,11}$/;
    if (!phoneRegex.test(phone.replace(/\s/g, ''))) {
      throw new Error('Số điện thoại không hợp lệ (10-11 chữ số)');
    }
  }

  // Thử sử dụng API trước
  try {
    // Lấy user hiện tại để kiểm tra email
    const currentUser = await getUserByIdAPI(userId);
    if (!currentUser) {
      throw new Error('Không tìm thấy người dùng');
    }

    // Kiểm tra email đã được sử dụng bởi user khác
    if (email && email !== currentUser.email) {
      const users = await getUsersFromAPI();
      if (users.find(u => u.id !== userId && u.email === email)) {
        throw new Error('Email đã được sử dụng');
      }
    }

    // Cập nhật thông tin qua API
    const updateData = {
      ...(email && { email }),
      ...(fullName !== undefined && { fullName }),
      ...(phone !== undefined && { phone }),
      ...(bio !== undefined && { bio }),
      ...(avatar !== undefined && { avatar }),
      updatedAt: new Date().toISOString(),
    };

    const updatedUser = await updateUserAPI(userId, updateData);

    // Cập nhật currentUser nếu đang là user hiện tại
    const currentUserSession = getCurrentUser();
    if (currentUserSession && currentUserSession.id === userId) {
      const newSessionUser = {
        ...currentUserSession,
        ...updateData,
      };
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(newSessionUser));
    }

    return {
      success: true,
      message: 'Cập nhật hồ sơ thành công (đã lưu vào db.json)',
      user: await getUserProfile(userId),
    };
  } catch (apiError) {
    // Fallback về localStorage
    console.warn('API not available, using localStorage:', apiError);
    
    const users = getUsers();
    const userIndex = users.findIndex(u => u.id === userId);
    
    if (userIndex === -1) {
      throw new Error('Không tìm thấy người dùng');
    }

    // Kiểm tra email đã được sử dụng bởi user khác
    if (email && email !== users[userIndex].email) {
      if (users.find(u => u.id !== userId && u.email === email)) {
        throw new Error('Email đã được sử dụng');
      }
    }

    // Cập nhật thông tin
    users[userIndex] = {
      ...users[userIndex],
      ...(email && { email }),
      ...(fullName !== undefined && { fullName }),
      ...(phone !== undefined && { phone }),
      ...(bio !== undefined && { bio }),
      ...(avatar !== undefined && { avatar }),
      updatedAt: new Date().toISOString(),
    };

    saveUsers(users);

    // Cập nhật currentUser nếu đang là user hiện tại
    const currentUserSession = getCurrentUser();
    if (currentUserSession && currentUserSession.id === userId) {
      const updatedUser = {
        ...currentUserSession,
        ...(email && { email }),
        ...(fullName !== undefined && { fullName }),
        ...(phone !== undefined && { phone }),
        ...(bio !== undefined && { bio }),
        ...(avatar !== undefined && { avatar }),
        updatedAt: users[userIndex].updatedAt,
      };
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(updatedUser));
    }

    return {
      success: true,
      message: 'Cập nhật hồ sơ thành công (lưu tạm trong localStorage)',
      user: await getUserProfile(userId),
    };
  }
};

// Đổi mật khẩu
export const changePassword = async (userId, oldPassword, newPassword) => {
  if (!oldPassword || !newPassword) {
    throw new Error('Vui lòng điền đầy đủ thông tin');
  }

  if (newPassword.length < 6) {
    throw new Error('Mật khẩu mới phải có ít nhất 6 ký tự');
  }

  // Thử sử dụng API trước
  try {
    const user = await getUserByIdAPI(userId);
    if (!user) {
      throw new Error('Không tìm thấy người dùng');
    }

    if (user.password !== oldPassword) {
      throw new Error('Mật khẩu cũ không đúng');
    }

    await updateUserAPI(userId, {
      password: newPassword,
      updatedAt: new Date().toISOString(),
    });

    return {
      success: true,
      message: 'Đổi mật khẩu thành công (đã lưu vào db.json)',
    };
  } catch (apiError) {
    // Fallback về localStorage
    console.warn('API not available, using localStorage:', apiError);
    
    const users = getUsers();
    const userIndex = users.findIndex(u => u.id === userId);

    if (userIndex === -1) {
      throw new Error('Không tìm thấy người dùng');
    }

    if (users[userIndex].password !== oldPassword) {
      throw new Error('Mật khẩu cũ không đúng');
    }

    users[userIndex].password = newPassword;
    users[userIndex].updatedAt = new Date().toISOString();
    saveUsers(users);

    return {
      success: true,
      message: 'Đổi mật khẩu thành công (lưu tạm trong localStorage)',
    };
  }
};


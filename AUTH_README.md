# Hướng dẫn sử dụng chức năng Đăng ký/Đăng nhập

## Tổng quan

Ứng dụng đã được bổ sung chức năng đăng ký và đăng nhập tài khoản. Dữ liệu người dùng được lưu trữ trong `db.json` và sử dụng localStorage để quản lý session.

## Cấu trúc

### Files đã thêm:

1. **`db.json`** - File lưu trữ dữ liệu người dùng (schema)
2. **`src/services/authService.js`** - Service xử lý đăng ký, đăng nhập, đăng xuất
3. **`src/contexts/AuthContext.js`** - Context quản lý authentication state
4. **`src/components/Login.js`** - Component form đăng nhập
5. **`src/components/Register.js`** - Component form đăng ký

### Files đã cập nhật:

1. **`src/App.js`** - Tích hợp authentication, hiển thị Login/Register khi chưa đăng nhập
2. **`src/index.js`** - Bọc App với AuthProvider
3. **`package.json`** - Thêm json-server (optional)

## Cách hoạt động

### 1. Lưu trữ dữ liệu

Hiện tại ứng dụng sử dụng **localStorage** để lưu trữ dữ liệu người dùng:
- Dữ liệu được lưu trong `localStorage` với key `face_shape_app_users`
- Session hiện tại được lưu với key `face_shape_app_current_user`
- File `db.json` được tạo để làm schema/template

### 2. Đăng ký tài khoản

- Người dùng điền form: Tên đăng nhập, Email, Mật khẩu, Xác nhận mật khẩu
- Validation:
  - Tất cả trường bắt buộc
  - Mật khẩu tối thiểu 6 ký tự
  - Email phải hợp lệ
  - Mật khẩu xác nhận phải khớp
  - Username và Email không được trùng
- Sau khi đăng ký thành công, tự động đăng nhập

### 3. Đăng nhập

- Người dùng có thể đăng nhập bằng username hoặc email
- Sau khi đăng nhập thành công, session được lưu và chuyển đến trang chính

### 4. Đăng xuất

- Click nút "Đăng xuất" ở header
- Xóa session và quay về trang đăng nhập

## Sử dụng với JSON Server (Optional)

Nếu muốn sử dụng JSON Server làm API backend:

### 1. Cài đặt dependencies:

```bash
npm install
```

### 2. Chạy JSON Server (terminal riêng):

```bash
npm run server
```

Server sẽ chạy tại `http://localhost:3001`

### 3. Cập nhật authService.js

Thay đổi các hàm trong `src/services/authService.js` để sử dụng fetch API thay vì localStorage:

```javascript
// Ví dụ với fetch API
export const register = async (userData) => {
  const response = await fetch('http://localhost:3001/users', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData)
  });
  return response.json();
};
```

## Tính năng

✅ Đăng ký tài khoản mới
✅ Đăng nhập với username hoặc email
✅ Đăng xuất
✅ Validation form đầy đủ
✅ Hiển thị thông báo lỗi/thành công
✅ Lưu session (giữ đăng nhập khi refresh)
✅ UI/UX đẹp với Tailwind CSS
✅ Responsive design

## Bảo mật

⚠️ **Lưu ý**: Hiện tại mật khẩu được lưu dạng plain text. Trong môi trường production, nên:
- Hash mật khẩu (sử dụng bcrypt)
- Sử dụng JWT tokens cho authentication
- Thêm HTTPS
- Validate và sanitize input phía server

## Cấu trúc dữ liệu User

```json
{
  "id": "string",
  "username": "string",
  "email": "string",
  "password": "string",
  "createdAt": "ISO date string"
}
```

## Troubleshooting

### Không thể đăng nhập sau khi đăng ký
- Kiểm tra console để xem lỗi
- Xóa localStorage và thử lại: `localStorage.clear()`

### Dữ liệu bị mất sau khi refresh
- Kiểm tra xem localStorage có được bật trong browser không
- Kiểm tra xem có extension nào block localStorage không

### Form validation không hoạt động
- Đảm bảo tất cả trường đã được điền đầy đủ
- Kiểm tra format email

## Tương lai có thể mở rộng

- [ ] Hash mật khẩu
- [ ] JWT authentication
- [ ] Quên mật khẩu
- [ ] Đổi mật khẩu
- [ ] Profile user
- [ ] Lưu lịch sử phân tích khuôn mặt theo user
- [ ] Upload avatar
- [ ] Email verification


# Hướng dẫn sử dụng db.json

## Tổng quan

Hệ thống đã được cập nhật để lưu tài khoản vào `db.json` thông qua json-server API. Hệ thống sẽ tự động fallback về localStorage nếu json-server không chạy.

## Cấu trúc db.json

File `db.json` có cấu trúc như sau:

```json
{
  "users": [
    {
      "id": "1",
      "username": "user1",
      "email": "user1@example.com",
      "password": "password123",
      "fullName": "Nguyễn Văn A",
      "phone": "0123456789",
      "avatar": "https://example.com/avatar.jpg",
      "bio": "Giới thiệu về bản thân",
      "createdAt": "2025-01-01T00:00:00.000Z",
      "updatedAt": "2025-01-01T00:00:00.000Z"
    }
  ]
}
```

## Cách sử dụng

### 1. Chạy json-server

Mở terminal mới và chạy:

```bash
npm run server
```

Server sẽ chạy tại `http://localhost:3001`

### 2. Chạy ứng dụng React

Trong terminal khác:

```bash
npm start
```

Ứng dụng sẽ chạy tại `http://localhost:3000`

### 3. Sử dụng ứng dụng

- **Đăng ký tài khoản**: Tài khoản sẽ được lưu vào `db.json` nếu json-server đang chạy
- **Đăng nhập**: Hệ thống sẽ tìm tài khoản từ `db.json`
- **Cập nhật profile**: Thay đổi sẽ được lưu vào `db.json`
- **Đổi mật khẩu**: Mật khẩu mới sẽ được lưu vào `db.json`

## Fallback Mechanism

Nếu json-server không chạy:
- Hệ thống sẽ tự động chuyển sang sử dụng localStorage
- Dữ liệu sẽ được lưu tạm trong browser
- Khi json-server chạy lại, bạn cần đăng ký lại tài khoản

## API Endpoints

json-server tự động tạo các endpoints:

- `GET /users` - Lấy danh sách tất cả users
- `GET /users/:id` - Lấy user theo ID
- `POST /users` - Tạo user mới
- `PATCH /users/:id` - Cập nhật user
- `DELETE /users/:id` - Xóa user

## Lưu ý

1. **Bảo mật**: Mật khẩu đang được lưu dạng plain text. Trong production nên hash mật khẩu.

2. **CORS**: Nếu gặp lỗi CORS, có thể cần cấu hình json-server với CORS middleware.

3. **Port**: Mặc định json-server chạy ở port 3001. Nếu port này đã được sử dụng, bạn có thể thay đổi trong `package.json`:
   ```json
   "server": "json-server --watch db.json --port 3002"
   ```

4. **API URL**: Nếu thay đổi port, cần cập nhật `API_BASE_URL` trong `src/services/apiService.js` hoặc tạo file `.env`:
   ```
   REACT_APP_API_URL=http://localhost:3002
   ```

## Troubleshooting

### Lỗi: "API not available"
- Kiểm tra json-server có đang chạy không
- Kiểm tra port 3001 có bị chiếm không
- Kiểm tra file `db.json` có tồn tại và đúng format không

### Dữ liệu không lưu vào db.json
- Đảm bảo json-server đang chạy
- Kiểm tra quyền ghi file trong thư mục dự án
- Xem console để kiểm tra lỗi API

### Không thể đăng nhập sau khi đăng ký
- Kiểm tra dữ liệu đã được lưu vào `db.json` chưa
- Kiểm tra json-server có đang chạy không
- Thử refresh lại trang


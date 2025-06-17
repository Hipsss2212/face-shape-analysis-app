// Các hàm toán học cơ bản cho xử lý hình ảnh

// Tính khoảng cách giữa hai điểm
export const calculateDistance = (point1, point2) => {
  const dx = point1.x - point2.x;
  const dy = point1.y - point2.y;
  return Math.sqrt(dx * dx + dy * dy);
};

// Tính góc giữa ba điểm
export const calculateAngle = (point1, point2, point3) => {
  const a = calculateDistance(point1, point2);
  const b = calculateDistance(point2, point3);
  const c = calculateDistance(point1, point3);
  
  if (a === 0 || b === 0) return 0;
  
  const cosAngle = (a * a + b * b - c * c) / (2 * a * b);
  return Math.acos(Math.max(-1, Math.min(1, cosAngle))) * (180 / Math.PI);
}; 
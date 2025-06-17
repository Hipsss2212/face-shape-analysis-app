// Tính toán độ chính xác và chất lượng của phép đo

// Xác định chất lượng đo dựa trên các giá trị cực đoan (cho thấy vấn đề phát hiện)
export const calculateMeasurementQuality = (measurements) => {
  if (!measurements) return 0.5; // Trả về chất lượng thấp nếu không có đo

  const { 
    faceLength, 
    faceWidth, 
    cheekboneWidth, 
    jawWidth, 
    chinTopWidth,
    eyeDistance,
    noseWidth
  } = measurements;

  // Kiểm tra đơn giản cho các giá trị cực đoan (điều chỉnh ngưỡng khi cần)
  let qualityScore = 1.0; // Bắt đầu với chất lượng hoàn hảo

  // Kiểm tra tỷ lệ rất nhỏ hoặc rất lớn
  if (faceLength / faceWidth < 1.1 || faceLength / faceWidth > 1.9) qualityScore -= 0.1; // Rất tròn hoặc rất dài
  if (cheekboneWidth / faceWidth < 0.7 || cheekboneWidth / faceWidth > 1.1) qualityScore -= 0.1; // Gò má rất hẹp hoặc rất rộng
  if (jawWidth / faceWidth < 0.6 || jawWidth / faceWidth > 1.1) qualityScore -= 0.1; // Hàm rất hẹp hoặc rất rộng
  if (chinTopWidth / jawWidth < 0.7 || chinTopWidth / jawWidth > 1.1) qualityScore -= 0.1; // Cằm rất nhọn hoặc rất rộng
  if (eyeDistance / faceWidth < 0.2 || eyeDistance / faceWidth > 0.5) qualityScore -= 0.1; // Mắt rất gần hoặc rất xa
  if (noseWidth / faceWidth < 0.1 || noseWidth / faceWidth > 0.3) qualityScore -= 0.1; // Mũi rất hẹp hoặc rất rộng

  // Đảm bảo điểm chất lượng trong phạm vi hợp lệ
  return Math.max(0.7, Math.min(1.0, qualityScore));
}; 
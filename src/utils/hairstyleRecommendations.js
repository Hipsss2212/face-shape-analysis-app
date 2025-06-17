// Gợi ý kiểu tóc dựa trên hình dạng mặt

// Lấy gợi ý kiểu tóc dựa trên hình dạng mặt
export const getHairstyleRecommendations = (faceShape) => {
  switch (faceShape) {
    case 'Oval':
      return {
        short: 'Bob cut, Pixie cut, Lob (long bob)',
        medium: 'Layered shoulder-length, Shag, Face-framing layers',
        long: 'Long layers, Beach waves, Straight with minimal layers',
        description: 'Khuôn mặt oval cân đối và đối xứng, cho phép hầu hết mọi kiểu tóc. Rất linh hoạt, hãy thoải mái thử nghiệm!'
      };
    case 'Round':
      return {
        short: 'Asymmetrical bob, Pixie with height, Side-swept bangs',
        medium: 'Lob with layers, Shoulder-length with soft waves, Graduated bob',
        long: 'Long layers, Straight hair to elongate, High ponytails or buns',
        description: 'Khuôn mặt tròn thường có chiều dài và chiều rộng tương tự với các đường nét mềm mại, cong. Nhắm đến các kiểu tạo chiều cao và tạo góc để kéo dài khuôn mặt.'
      };
    case 'Square':
      return {
        short: 'Soft pixie, Layered bob (to jawline), Side-parted styles',
        medium: 'Wavy lob, Shoulder-length with soft layers, Curtain bangs',
        long: 'Long waves, Layered cuts, Rounder styles to soften angular features',
        description: 'Khuôn mặt vuông có đường hàm mạnh mẽ, góc cạnh và trán rộng. Chọn các kiểu làm mềm các đặc điểm này và tạo sự cân bằng, chẳng hạn như các lớp mềm và sóng.'
      };
    case 'Heart':
      return {
        short: 'Pixie with volume at top, Chin-length bob, Side-swept bangs',
        medium: 'Collarbone-length with waves, Lob with layers starting below chin, Long bangs',
        long: 'Long layers, Deep side part, Styles that add width around the jawline',
        description: 'Khuôn mặt hình trái tim có trán và gò má rộng, thu nhỏ dần đến cằm hẹp hơn, đôi khi nhọn. Các kiểu cân bằng phần trên rộng với phần dưới hẹp là lý tưởng.'
      };
    case 'Diamond':
      return {
        short: 'Chin-length bob, Pixie with side bangs, Tucked behind ears',
        medium: 'Shoulder-length with layers, Waves that add volume at jawline, Deep side part',
        long: 'Long layers with volume at chin, Half-up styles, Sweeping bangs',
        description: 'Khuôn mặt kim cương có gò má rộng với trán và hàm hẹp hơn. Các kiểu làm mềm gò má và thêm chiều rộng cho trán và hàm rất quyến rũ.'
      };
    case 'Oblong':
      return {
        short: 'Chin-length bob, Curly bob, Blunt bangs',
        medium: 'Shoulder-length waves, Layered cuts that add volume to the sides, Full bangs',
        long: 'Long layers with volume at the sides, Beach waves, Styles that create horizontal interest',
        description: 'Khuôn mặt dài hơn chiều rộng, thường có đường hàm thẳng và hẹp. Các kiểu thêm chiều rộng và làm mềm chiều dài là bổ sung nhất.'
      };
    default:
      return {
        short: 'Tham khảo chuyên gia tạo kiểu',
        medium: 'Tham khảo chuyên gia tạo kiểu',
        long: 'Tham khảo chuyên gia tạo kiểu',
        description: 'Không thể xác định gợi ý cụ thể. Vui lòng tham khảo chuyên gia tạo kiểu.'
      };
  }
}; 
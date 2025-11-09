// AI Chat Service - Tư vấn dựa trên kết quả phân tích gương mặt

// Lưu lịch sử chat vào localStorage
const CHAT_HISTORY_KEY = 'face_shape_chat_history';

// Lấy lịch sử chat
export const getChatHistory = (userId) => {
  const key = `${CHAT_HISTORY_KEY}_${userId}`;
  const history = localStorage.getItem(key);
  return history ? JSON.parse(history) : [];
};

// Lưu lịch sử chat
export const saveChatMessage = (userId, message, isUser = true) => {
  const key = `${CHAT_HISTORY_KEY}_${userId}`;
  const history = getChatHistory(userId);
  const newMessage = {
    id: Date.now().toString(),
    message,
    isUser,
    timestamp: new Date().toISOString(),
  };
  history.push(newMessage);
  localStorage.setItem(key, JSON.stringify(history));
  return newMessage;
};

// Xóa lịch sử chat
export const clearChatHistory = (userId) => {
  const key = `${CHAT_HISTORY_KEY}_${userId}`;
  localStorage.removeItem(key);
};

// Tạo phản hồi AI dựa trên kết quả phân tích và câu hỏi
export const generateAIResponse = (userMessage, analysisResult, chatHistory = []) => {
  const message = userMessage.toLowerCase().trim();
  
  // Nếu có kết quả phân tích, tư vấn dựa trên đó
  if (analysisResult) {
    const { faceShape, measurements, hairstyleRecommendations } = analysisResult;
    const shape = faceShape?.shape || 'Unknown';
    const confidence = faceShape?.confidence || 0;
    
    // Câu hỏi về hình dạng khuôn mặt
    if (message.includes('hình dạng') || message.includes('khuôn mặt') || message.includes('face shape')) {
      return `Dựa trên phân tích, khuôn mặt của bạn có hình dạng **${shape}** với độ tin cậy ${confidence}%. ${getShapeDescription(shape)}`;
    }
    
    // Câu hỏi về kiểu tóc
    if (message.includes('kiểu tóc') || message.includes('hairstyle') || message.includes('tóc') || message.includes('cắt tóc')) {
      if (hairstyleRecommendations) {
        let response = `Dựa trên khuôn mặt ${shape} của bạn, tôi khuyên bạn:\n\n`;
        response += `**${hairstyleRecommendations.description || ''}**\n\n`;
        
        if (hairstyleRecommendations.short) {
          response += `**Tóc ngắn:**\n${hairstyleRecommendations.short}\n\n`;
        }
        if (hairstyleRecommendations.medium) {
          response += `**Tóc trung bình:**\n${hairstyleRecommendations.medium}\n\n`;
        }
        if (hairstyleRecommendations.long) {
          response += `**Tóc dài:**\n${hairstyleRecommendations.long}\n\n`;
        }
        
        return response.trim();
      }
      
      return `Dựa trên khuôn mặt ${shape} của bạn, bạn có thể thử nhiều kiểu tóc khác nhau. Hãy tham khảo phần "Hairstyle Recommendations" ở trên để xem chi tiết!`;
    }
    
    // Câu hỏi về số đo
    if (message.includes('số đo') || message.includes('measurement') || message.includes('kích thước')) {
      return `**Số đo khuôn mặt của bạn:**\n\n` +
        `- Tỷ lệ khuôn mặt (Dài/Rộng): ${measurements.faceRatio?.toFixed(2) || 'N/A'}\n` +
        `- Chiều dài khuôn mặt: ${measurements.faceLength?.toFixed(1) || 'N/A'}px\n` +
        `- Chiều rộng khuôn mặt: ${measurements.faceWidth?.toFixed(1) || 'N/A'}px\n` +
        `- Chiều rộng xương gò má: ${measurements.cheekboneWidth?.toFixed(1) || 'N/A'}px\n` +
        `- Chiều rộng hàm: ${measurements.jawWidth?.toFixed(1) || 'N/A'}px`;
    }
    
    // Câu hỏi về độ tin cậy
    if (message.includes('độ tin cậy') || message.includes('confidence') || message.includes('chính xác')) {
      return `Kết quả phân tích có độ tin cậy ${confidence}%. ` +
        (confidence >= 80 ? 'Đây là kết quả rất đáng tin cậy!' :
         confidence >= 60 ? 'Kết quả khá đáng tin cậy, nhưng bạn có thể thử phân tích lại với ảnh rõ hơn.' :
         'Kết quả có thể không chính xác lắm. Hãy thử với ảnh rõ hơn, ánh sáng tốt hơn và khuôn mặt nhìn thẳng.');
    }
    
    // Câu hỏi tổng quát về tư vấn
    if (message.includes('tư vấn') || message.includes('advice') || message.includes('khuyên') || message.includes('nên')) {
      return generateComprehensiveAdvice(shape, hairstyleRecommendations, measurements);
    }
  }
  
  // Câu hỏi chào hỏi
  if (message.includes('xin chào') || message.includes('hello') || message.includes('hi') || message.includes('chào')) {
    if (analysisResult) {
      return `Xin chào! Tôi có thể tư vấn cho bạn về khuôn mặt ${analysisResult.faceShape?.shape || ''} của bạn. Bạn muốn biết gì? (kiểu tóc, số đo, hình dạng...)`;
    }
    return 'Xin chào! Tôi là AI tư vấn về khuôn mặt và kiểu tóc. Hãy upload ảnh và phân tích khuôn mặt trước để tôi có thể tư vấn cho bạn nhé!';
  }
  
  // Câu hỏi về cách sử dụng
  if (message.includes('cách dùng') || message.includes('hướng dẫn') || message.includes('help') || message.includes('giúp')) {
    return `**Hướng dẫn sử dụng:**\n\n` +
      `1. Upload ảnh khuôn mặt của bạn\n` +
      `2. Click "Phân tích" để phân tích khuôn mặt\n` +
      `3. Sau khi có kết quả, bạn có thể hỏi tôi:\n` +
      `   - "Hình dạng khuôn mặt của tôi là gì?"\n` +
      `   - "Kiểu tóc nào phù hợp với tôi?"\n` +
      `   - "Số đo khuôn mặt của tôi?"\n` +
      `   - "Tư vấn cho tôi về kiểu tóc"\n\n` +
      `Tôi sẽ tư vấn dựa trên kết quả phân tích!`;
  }
  
  // Câu hỏi không hiểu
  if (analysisResult) {
    return `Tôi hiểu bạn đang hỏi về "${userMessage}". Dựa trên kết quả phân tích, bạn có thể hỏi tôi về:\n\n` +
      `- Hình dạng khuôn mặt\n` +
      `- Kiểu tóc phù hợp\n` +
      `- Số đo khuôn mặt\n` +
      `- Tư vấn tổng quát\n\n` +
      `Hoặc bạn có thể hỏi "tư vấn cho tôi" để nhận lời khuyên chi tiết!`;
  }
  
  return `Xin lỗi, tôi chưa hiểu câu hỏi của bạn. Hãy upload ảnh và phân tích khuôn mặt trước, sau đó tôi sẽ có thể tư vấn cho bạn tốt hơn!`;
};

// Mô tả hình dạng khuôn mặt
const getShapeDescription = (shape) => {
  const descriptions = {
    'Oval': 'Khuôn mặt Oval là hình dạng lý tưởng và cân đối nhất. Bạn rất may mắn vì hầu hết các kiểu tóc đều phù hợp với bạn!',
    'Round': 'Khuôn mặt tròn có chiều dài và chiều rộng gần bằng nhau. Nên chọn kiểu tóc tạo chiều cao và làm khuôn mặt trông dài hơn.',
    'Square': 'Khuôn mặt vuông có góc cạnh rõ ràng ở hàm. Nên chọn kiểu tóc mềm mại để làm mềm các góc cạnh.',
    'Heart': 'Khuôn mặt trái tim có trán rộng và cằm nhọn. Nên chọn kiểu tóc cân bằng phần dưới khuôn mặt.',
    'Diamond': 'Khuôn mặt kim cương có xương gò má rộng và trán/cằm hẹp. Nên chọn kiểu tóc tạo độ rộng ở trán và cằm.',
    'Oblong': 'Khuôn mặt dài có chiều dài lớn hơn nhiều so với chiều rộng. Nên chọn kiểu tóc tạo độ rộng và ngắn gọn hơn.',
  };
  return descriptions[shape] || 'Đây là một hình dạng khuôn mặt độc đáo!';
};

// Tạo lời khuyên tổng quát
const generateComprehensiveAdvice = (shape, hairstyleRecommendations, measurements) => {
  let advice = `**Tư vấn tổng quát cho khuôn mặt ${shape}:**\n\n`;
  
  if (hairstyleRecommendations) {
    if (hairstyleRecommendations.description) {
      advice += `${hairstyleRecommendations.description}\n\n`;
    }
    
    if (hairstyleRecommendations.short) {
      advice += `**✂️ Tóc ngắn:**\n${hairstyleRecommendations.short}\n\n`;
    }
    if (hairstyleRecommendations.medium) {
      advice += `**✂️ Tóc trung bình:**\n${hairstyleRecommendations.medium}\n\n`;
    }
    if (hairstyleRecommendations.long) {
      advice += `**✂️ Tóc dài:**\n${hairstyleRecommendations.long}\n\n`;
    }
  }
  
  // Thêm lời khuyên dựa trên số đo
  if (measurements) {
    if (measurements.faceRatio > 1.5) {
      advice += `💡 **Gợi ý:** Khuôn mặt bạn hơi dài, nên chọn kiểu tóc có độ rộng ngang để cân bằng.\n\n`;
    } else if (measurements.faceRatio < 1.1) {
      advice += `💡 **Gợi ý:** Khuôn mặt bạn hơi tròn, nên chọn kiểu tóc tạo chiều cao.\n\n`;
    }
  }
  
  advice += `**Lưu ý:** Đây chỉ là gợi ý dựa trên phân tích. Bạn nên tham khảo thêm ý kiến của thợ cắt tóc chuyên nghiệp!`;
  
  return advice;
};

// Xử lý tin nhắn và trả về phản hồi AI
export const processMessage = async (userMessage, analysisResult, userId) => {
  // Lưu tin nhắn của user
  saveChatMessage(userId, userMessage, true);
  
  // Tạo phản hồi AI
  const history = getChatHistory(userId);
  const aiResponse = generateAIResponse(userMessage, analysisResult, history);
  
  // Lưu phản hồi AI
  saveChatMessage(userId, aiResponse, false);
  
  return aiResponse;
};


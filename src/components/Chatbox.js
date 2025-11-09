import React, { useState, useEffect, useRef, useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { processMessage, getChatHistory, clearChatHistory } from '../services/aiChatService';

const Chatbox = ({ analysisResult, isOpen, onClose }) => {
  const { user } = useContext(AuthContext);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Load chat history khi mở chatbox
  useEffect(() => {
    if (isOpen && user) {
      const history = getChatHistory(user.id);
      setMessages(history);
      
      // Focus vào input
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus();
        }
      }, 100);
    }
  }, [isOpen, user]);

  // Scroll to bottom khi có tin nhắn mới
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim() || isLoading || !user) return;

    const userMessage = inputMessage.trim();
    setInputMessage('');
    setIsLoading(true);

    try {
      // Thêm tin nhắn user vào UI ngay
      const userMsg = {
        id: Date.now().toString(),
        message: userMessage,
        isUser: true,
        timestamp: new Date().toISOString(),
      };
      setMessages(prev => [...prev, userMsg]);

      // Xử lý và nhận phản hồi AI
      const aiResponse = await processMessage(userMessage, analysisResult, user.id);
      
      // Thêm phản hồi AI vào UI
      const aiMsg = {
        id: (Date.now() + 1).toString(),
        message: aiResponse,
        isUser: false,
        timestamp: new Date().toISOString(),
      };
      setMessages(prev => [...prev, aiMsg]);
    } catch (error) {
      console.error('Error processing message:', error);
      const errorMsg = {
        id: Date.now().toString(),
        message: 'Xin lỗi, có lỗi xảy ra. Vui lòng thử lại!',
        isUser: false,
        timestamp: new Date().toISOString(),
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus();
        }
      }, 100);
    }
  };

  const handleClearHistory = () => {
    if (user && window.confirm('Bạn có chắc muốn xóa toàn bộ lịch sử chat?')) {
      clearChatHistory(user.id);
      setMessages([]);
    }
  };

  const handleQuickQuestion = (question) => {
    setInputMessage(question);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-4 right-4 w-96 h-[600px] bg-white rounded-lg shadow-2xl flex flex-col z-50 border border-gray-200">
      {/* Header */}
      <div className="bg-indigo-600 text-white p-4 rounded-t-lg flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-green-400 rounded-full"></div>
          <h3 className="font-semibold">AI Tư vấn</h3>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={handleClearHistory}
            className="text-xs px-2 py-1 bg-indigo-700 rounded hover:bg-indigo-800 transition-colors"
            title="Xóa lịch sử"
          >
            🗑️
          </button>
          <button
            onClick={onClose}
            className="text-white hover:text-gray-200 transition-colors"
          >
            ✕
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
        {messages.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            <div className="text-4xl mb-2">👋</div>
            <p className="text-sm mb-4">Xin chào! Tôi là AI tư vấn về khuôn mặt và kiểu tóc.</p>
            {analysisResult ? (
              <div className="text-xs text-gray-400">
                <p>Kết quả phân tích: {analysisResult.faceShape?.shape}</p>
                <p className="mt-2">Bạn có thể hỏi tôi về:</p>
                <ul className="list-disc list-inside mt-1 space-y-1">
                  <li>Hình dạng khuôn mặt</li>
                  <li>Kiểu tóc phù hợp</li>
                  <li>Số đo khuôn mặt</li>
                  <li>Tư vấn tổng quát</li>
                </ul>
              </div>
            ) : (
              <p className="text-xs text-gray-400">Hãy phân tích khuôn mặt trước để tôi có thể tư vấn tốt hơn!</p>
            )}
          </div>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.isUser ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-lg px-4 py-2 ${
                  msg.isUser
                    ? 'bg-indigo-600 text-white'
                    : 'bg-white text-gray-800 border border-gray-200'
                }`}
              >
                <div className="whitespace-pre-wrap text-sm">{msg.message}</div>
                <div
                  className={`text-xs mt-1 ${
                    msg.isUser ? 'text-indigo-100' : 'text-gray-400'
                  }`}
                >
                  {new Date(msg.timestamp).toLocaleTimeString('vi-VN', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </div>
              </div>
            </div>
          ))
        )}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white text-gray-800 border border-gray-200 rounded-lg px-4 py-2">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Questions */}
      {analysisResult && messages.length === 0 && (
        <div className="px-4 py-2 bg-gray-100 border-t border-gray-200">
          <p className="text-xs text-gray-600 mb-2">Câu hỏi nhanh:</p>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => handleQuickQuestion('Hình dạng khuôn mặt của tôi là gì?')}
              className="text-xs px-2 py-1 bg-white border border-gray-300 rounded hover:bg-gray-50 transition-colors"
            >
              Hình dạng?
            </button>
            <button
              onClick={() => handleQuickQuestion('Kiểu tóc nào phù hợp với tôi?')}
              className="text-xs px-2 py-1 bg-white border border-gray-300 rounded hover:bg-gray-50 transition-colors"
            >
              Kiểu tóc?
            </button>
            <button
              onClick={() => handleQuickQuestion('Tư vấn cho tôi')}
              className="text-xs px-2 py-1 bg-white border border-gray-300 rounded hover:bg-gray-50 transition-colors"
            >
              Tư vấn
            </button>
          </div>
        </div>
      )}

      {/* Input */}
      <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-200 bg-white rounded-b-lg">
        <div className="flex space-x-2">
          <input
            ref={inputRef}
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Nhập câu hỏi của bạn..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={!inputMessage.trim() || isLoading}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? '...' : 'Gửi'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Chatbox;


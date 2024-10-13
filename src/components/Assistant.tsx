import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, MessageSquare, Edit } from 'lucide-react';
import { getGroqResponse } from '../utils/groqApi';
import ReactMarkdown from 'react-markdown';

interface Message {
  text: string;
  isUser: boolean;
}

interface AssistantProps {
  currentStep: number;
  setEditMode: React.Dispatch<React.SetStateAction<boolean>>;
}

const Assistant: React.FC<AssistantProps> = ({ currentStep, setEditMode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [showSidebar, setShowSidebar] = useState(false);
  const [editMode, setEditModeState] = useState(false);
  const [conversationHistory, setConversationHistory] = useState<{ role: string; content: string }[]>([]);

  useEffect(() => {
    if (isOpen) {
      const initialMessage = getInitialMessage(currentStep);
      setMessages([{ text: initialMessage, isUser: false }]);
      setConversationHistory([{ role: 'assistant', content: initialMessage }]);
    }
  }, [isOpen, currentStep]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const getInitialMessage = (step: number) => {
    switch (step) {
      case 1:
        return "기본 비즈니스 정보를 입력하고 계시네요. 회사명, 업종, 주요 제품/서비스에 대해 구체적으로 작성해보세요.";
      case 2:
        return "타겟 오디언스 정보를 입력하고 계십니다. 주 고객층과 그들의 관심사나 니즈를 명확히 정의해보세요.";
      case 3:
        return "제품/서비스 상세 정보를 작성 중이시군요. 주요 특징과 경쟁사 대비 차별점을 강조해보세요.";
      case 4:
        return "마케팅 목표와 브랜드 아이덴티티를 정의하고 계시네요. 명확한 CTA와 브랜드 톤앤보이스를 설정해보세요.";
      case 5:
        return "추가 콘텐츠 요소를 입력하고 계십니다. 고객 후기와 FAQ는 신뢰도를 높이는 데 큰 도움이 됩니다.";
      case 6:
        return "연락처와 법적 정보를 입력하고 계시네요. 이 정보들은 고객과의 소통과 법적 보호에 중요합니다.";
      case 7:
        return "프로젝트 최종 결과를 확인하고 계시네요. 생성된 웹페이지를 검토하고 필요한 부분을 수정해보세요. HTML 코드도 확인할 수 있습니다.";
      default:
        return "안녕하세요! 무엇을 도와드릴까요?";
    }
  };

  const handleSendMessage = async () => {
    if (inputText.trim() !== '') {
      const newUserMessage = { text: inputText, isUser: true };
      setMessages(prevMessages => [...prevMessages, newUserMessage]);
      
      const updatedHistory = [...conversationHistory, { role: 'user', content: inputText }];
      setConversationHistory(updatedHistory);
      
      setInputText('');
      
      try {
        const aiResponse = await getGroqResponse(inputText, currentStep, updatedHistory);
        const newAiMessage = { text: aiResponse, isUser: false };
        setMessages(prevMessages => [...prevMessages, newAiMessage]);
        setConversationHistory(prev => [...prev, { role: 'assistant', content: aiResponse }]);
      } catch (error) {
        console.error('GROQ API 오류:', error);
        const errorMessage = { text: "죄송합니다. 응답을 생성하는 중 오류가 발생했습니다.", isUser: false };
        setMessages(prevMessages => [...prevMessages, errorMessage]);
        setConversationHistory(prev => [...prev, { role: 'assistant', content: errorMessage.text }]);
      }
    }
  };

  const handleViewConversation = () => {
    // 대화 기록을 보는 로직 구현
    console.log("대화 기록 보기");
  };

  const handleEditMode = () => {
    const newEditMode = !editMode;
    setEditModeState(newEditMode);
    setEditMode(newEditMode);
    console.log("편집 모드 전환");
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-blue-500 text-white rounded-full p-3 shadow-lg hover:bg-blue-600 transition-colors duration-300"
        >
          <MessageCircle size={24} />
        </button>
      )}
      {isOpen && (
        <div className="bg-white rounded-lg shadow-xl w-96 h-96 flex">
          {showSidebar && (
            <div className="w-24 bg-gray-100 p-2 flex flex-col items-center">
              <button
                onClick={handleViewConversation}
                className="mb-2 p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600"
                title="대화 확인하기"
              >
                <MessageSquare size={20} />
              </button>
              <button
                onClick={handleEditMode}
                className={`p-2 ${editMode ? 'bg-red-500' : 'bg-blue-500'} text-white rounded-full hover:bg-blue-600`}
                title="수정 모드"
              >
                <Edit size={20} />
              </button>
            </div>
          )}
          <div className="flex-1 flex flex-col">
            <div className="flex justify-between items-center p-4 border-b">
              <h3 className="text-lg font-semibold">어시스턴트</h3>
              <div>
                <button onClick={() => setShowSidebar(!showSidebar)} className="mr-2 text-gray-500 hover:text-gray-700">
                  {showSidebar ? <X size={20} /> : <MessageSquare size={20} />}
                </button>
                <button onClick={() => setIsOpen(false)} className="text-gray-500 hover:text-gray-700">
                  <X size={20} />
                </button>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-4">
              {messages.map((message, index) => (
                <div key={index} className={`mb-4 ${message.isUser ? 'text-right' : 'text-left'}`}>
                  <span className={`inline-block p-2 rounded-lg ${message.isUser ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'}`}>
                    {message.isUser ? (
                      message.text
                    ) : (
                      <ReactMarkdown>{message.text}</ReactMarkdown>
                    )}
                  </span>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
            <div className="border-t p-4 flex">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="메시지를 입력하세요..."
                className="flex-1 border rounded-l-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={handleSendMessage}
                className="bg-blue-500 text-white px-4 py-2 rounded-r-lg hover:bg-blue-600 transition-colors duration-300"
              >
                <Send size={20} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Assistant;

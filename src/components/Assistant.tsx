import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, MessageSquare, Edit, Image, Loader } from 'lucide-react';
import { getGroqResponse } from '../utils/groqApi';
import ReactMarkdown from 'react-markdown';
import { generateImage, generateDummyImage } from '../utils/imageGeneration';

interface Message {
  text: string;
  isUser: boolean;
  imageUrl?: string;
  isLoading?: boolean;
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
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);

  useEffect(() => {
    const initialMessage = getInitialMessage(currentStep);
    setMessages([{ text: initialMessage, isUser: false }]);
    setConversationHistory([{ role: 'assistant', content: initialMessage }]);
  }, [currentStep]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const getInitialMessage = (step: number) => {
    switch (step) {
      case 0:
        return "안녕하세요! LLM 랜딩페이지 생성기에 오신 것을 환영합니다. 무엇을 도와드릴까요?";
      case 1:
        return "새 프로젝트를 시작하셨군요! 기본 비즈니스 정보를 입력해주세요. 회사명, 업종, 주요 제품 또는 서비스에 대해 알려주세요.";
      case 2:
        return "타겟 오디언스 정보를 입력하고 계시네요. 주 타겟 고객층과 그들의 주요 관심사나 니즈에 대해 자세히 설명해주세요.";
      case 3:
        return "제품/서비스 상세 정보를 작성 중이시군요. 주요 특징, 경쟁사 대비 차별화 포인트, 가격 정보 등을 명확하게 설명해주세요.";
      case 4:
        return "마케팅 목표와 브랜드 아이덴티티를 정의하고 계시네요. 랜딩 페이지의 주요 목적, CTA 내용, 브랜드 슬로건, 색상, 톤앤보이스에 대해 알려주세요.";
      case 5:
        return "추가 콘텐츠 요소를 입력하고 계십니다. 고객 후기나 추천사, FAQ 항목을 추가하면 랜딩 페이지의 신뢰도를 높일 수 있습니다.";
      case 6:
        return "연락처와 법적 정보를 입력하고 계시네요. 이메일, 전화번호, 소셜 미디어 링크, 개인정보 처리방침, 이용약관 링크 등을 포함해주세요.";
      case 7:
        return "프로젝트 최종 결과를 확인하고 계시네요. 생성된 웹페이지를 검토하고 필요한 부분을 수정해보세요. HTML 코드도 확인할 수 있습니다. 추가로 도움이 필요하신 부분이 있나요?";
      default:
        return "현재 단계에 대해 어떤 도움이 필요하신가요?";
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

  const handleGenerateImage = async () => {
    if (inputText.trim() === '') {
      return;
    }

    setIsGeneratingImage(true);
    const newMessage = { text: `이미지 생성 중: ${inputText}`, isUser: false, isLoading: true };
    setMessages(prevMessages => [...prevMessages, newMessage]);
    setInputText('');

    try {
      let imageBlob;
      try {
        imageBlob = await generateImage(inputText);
      } catch (error) {
        console.warn('Hugging Face API 오류, 더미 이미지 사용:', error);
        imageBlob = await generateDummyImage(inputText);
      }
      const imageUrl = URL.createObjectURL(imageBlob);
      setMessages(prevMessages => 
        prevMessages.map(msg => 
          msg === newMessage ? { ...msg, text: `이미지 생성: ${inputText}`, imageUrl, isLoading: false } : msg
        )
      );
    } catch (error) {
      console.error('이미지 생성 중 오류 발생:', error);
      setMessages(prevMessages => 
        prevMessages.map(msg => 
          msg === newMessage ? { ...msg, text: "이미지 생성 중 오류가 발생했습니다.", isLoading: false } : msg
        )
      );
    } finally {
      setIsGeneratingImage(false);
    }
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
                    ) : message.isLoading ? (
                      <div className="flex items-center">
                        <Loader className="animate-spin mr-2" size={16} />
                        {message.text}
                      </div>
                    ) : (
                      <ReactMarkdown>{message.text}</ReactMarkdown>
                    )}
                  </span>
                  {message.imageUrl && !message.isLoading && (
                    <img src={message.imageUrl} alt="Generated" className="mt-2 max-w-full h-auto rounded" />
                  )}
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
              <button
                onClick={handleGenerateImage}
                className="bg-green-500 text-white px-4 py-2 rounded-lg ml-2 hover:bg-green-600 transition-colors duration-300"
                disabled={isGeneratingImage}
              >
                <Image size={20} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Assistant;
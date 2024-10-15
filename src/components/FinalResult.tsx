import React, { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Assistant from './Assistant';
import { generateHtmlContent } from '../utils/groqApi';
import { getUser } from '../utils/auth';
import LoadingSpinner from './LoadingSpinner';
import { generateImage, generateDummyImage } from '../utils/imageGeneration';
import ReactMarkdown from 'react-markdown';

interface FormData {
  companyName: string;
  industry: string;
  mainProduct: string;
  targetAudience: string;
  customerInterests: string;
  productFeatures: string;
  uniqueSellingPoints: string;
  priceInfo: string;
  callToAction: string;
  marketingGoal: string;
  brandSlogan: string;
  customerReviews: string;
  faqItems: string;
  email: string;
  phone: string;
  socialMedia: string;
}

const FinalResult: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const formData = location.state?.formData as FormData | undefined;
  const summarizedAdvice = location.state?.summarizedAdvice as string | undefined;
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [iframeHeight, setIframeHeight] = useState('600px');
  const [editMode, setEditMode] = useState(false);
  const [annotations, setAnnotations] = useState<{ x: number; y: number; text: string }[]>([]);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [startPoint, setStartPoint] = useState({ x: 0, y: 0 });
  const [htmlContent, setHtmlContent] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [imagePrompt, setImagePrompt] = useState('');
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null);
  const [parsedHtmlContent, setParsedHtmlContent] = useState<{ html: string; advice: string }>({ html: '', advice: '' });

  useEffect(() => {
    const fetchHtmlContent = async () => {
      if (formData && summarizedAdvice) {
        try {
          setIsLoading(true);
          console.log('HTML 콘텐츠 생성 요청 시작');
          
          const content = await generateHtmlContent(formData, summarizedAdvice);
          
          console.log('받아온 HTML 콘텐츠:', content);
          
          // HTML 코드와 조언 분리
          const htmlMatch = content.match(/```html\n([\s\S]*?)\n```/);
          let html = htmlMatch ? htmlMatch[1] : '';
          const advice = content.replace(/```html\n[\s\S]*?\n```/, '').trim();
          
          // Tailwind CSS CDN 추가
          html = `
            <html>
              <head>
                <script src="https://cdn.tailwindcss.com"></script>
              </head>
              <body>
                ${html}
              </body>
            </html>
          `;
          
          setParsedHtmlContent({ html, advice });
          setHtmlContent(html);
        } catch (error) {
          console.error('HTML 콘텐츠 생성 오류:', error);
          console.error('오류 발생 시 formData:', JSON.stringify(formData, null, 2));
          console.error('오류 발생 시 summarizedAdvice:', summarizedAdvice);
          setError('HTML 콘텐츠를 생성하는 중 오류가 발생했습니다.');
        } finally {
          setIsLoading(false);
        }
      } else {
        console.warn('formData 또는 summarizedAdvice가 없습니다.');
        setError('프로젝트 데이터를 찾을 수 없습니다.');
        setIsLoading(false);
      }
    };

    fetchHtmlContent();
  }, [formData, summarizedAdvice]);

  useEffect(() => {
    const iframe = iframeRef.current;
    if (iframe) {
      iframe.onload = () => {
        const iframeDocument = iframe.contentDocument || iframe.contentWindow?.document;
        if (iframeDocument) {
          const height = iframeDocument.documentElement.scrollHeight;
          setIframeHeight(`${height}px`);
        }
      };
    }
  }, [htmlContent]);

  const handleSaveProject = async () => {
    const user = getUser();
    if (!user || !user.id) {
      setError('로그인이 필요합니다.');
      return;
    }

    try {
      console.log('저장할 HTML 콘텐츠:', htmlContent);
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/projects`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.id,
          name: formData?.companyName || '새 프로젝트',
          data: formData,
          htmlContent: htmlContent,
        }),
      });

      const result = await response.json();
      console.log('서버 응답:', result);
      if (result.success) {
        setShowSuccessModal(true);
      } else {
        setError('프로젝트 저장에 실패했습니다: ' + result.message);
      }
    } catch (error) {
      console.error('프로젝트 저장 중 오류 발생:', error);
      setError('프로젝트 저장 중 오류가 발생했습니다.');
    }
  };

  const handleGenerateImage = async () => {
    if (!imagePrompt.trim()) {
      setError('이미지 프롬프트를 입력해주세요.');
      return;
    }

    try {
      setIsLoading(true);
      let imageBlob;
      try {
        imageBlob = await generateImage(imagePrompt);
      } catch (error) {
        console.warn('Hugging Face API 오류, 더미 이미지 사용:', error);
        imageBlob = await generateDummyImage(imagePrompt);
      }
      const imageUrl = URL.createObjectURL(imageBlob);
      setGeneratedImageUrl(imageUrl);

      // HTML에 이미지 추가
      const updatedHtmlContent = insertImageIntoHtml(htmlContent, imageUrl);
      setHtmlContent(updatedHtmlContent);
    } catch (error: any) {
      console.error('이미지 생성 중 오류 발생:', error);
      setError(`이미지를 생성하는 중 오류가 발생했습니다: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const insertImageIntoHtml = (html: string, imageUrl: string): string => {
    // 간단한 예: body 태그 바로 다음에 이미지 삽입
    return html.replace('<body>', `<body><img src="${imageUrl}" alt="Generated Image" style="max-width: 100%; height: auto;">`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8 relative">
      {isLoading && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
          <LoadingSpinner />
        </div>
      )}
      {error && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-xl shadow-lg">
            <h2 className="text-2xl font-bold text-red-600 mb-4">오류 발생</h2>
            <p className="text-gray-700">{error}</p>
          </div>
        </div>
      )}
      {!isLoading && !error && (
        <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden p-8">
          <h1 className="text-3xl font-bold mb-8 text-gray-800">프로젝트 최종 결과</h1>
          <div className="mb-8 relative">
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">웹페이지 미리보기</h2>
            <div className="border border-gray-300 rounded-lg overflow-hidden">
              <iframe
                ref={iframeRef}
                srcDoc={htmlContent}
                title="Generated Webpage"
                width="100%"
                height={iframeHeight}
                style={{ border: 'none' }}
              />
            </div>
          </div>
          <div className="mt-8">
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">HTML 코드</h2>
            <div className="mt-4 p-4 bg-gray-100 rounded-lg overflow-auto max-h-96">
              <pre className="text-sm">{parsedHtmlContent.html}</pre>
            </div>
          </div>
          <div className="mt-8">
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">AI 조언</h2>
            <div className="mt-4 p-4 bg-gray-100 rounded-lg overflow-auto max-h-96">
              <ReactMarkdown className="prose">
                {parsedHtmlContent.advice}
              </ReactMarkdown>
            </div>
          </div>
          <div className="mt-8">
            <button
              onClick={handleSaveProject}
              className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition duration-300 ease-in-out"
            >
              프로젝트 저장
            </button>
          </div>
          {/* 이미지 생성 섹션 */}
          <div className="mt-8">
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">이미지 생성</h2>
            <div className="flex items-center space-x-4">
              <input
                type="text"
                value={imagePrompt}
                onChange={(e) => setImagePrompt(e.target.value)}
                placeholder="이미지 프롬프트 입력"
                className="flex-grow px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={handleGenerateImage}
                className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition duration-300 ease-in-out"
              >
                이미지 생성
              </button>
            </div>
          </div>
          {generatedImageUrl && (
            <div className="mt-4">
              <img src={generatedImageUrl} alt="Generated" className="max-w-full h-auto rounded-lg shadow-md" />
            </div>
          )}
        </div>
      )}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-xl shadow-lg">
            <h2 className="text-2xl font-bold text-green-600 mb-4">저장 성공</h2>
            <p className="text-gray-700 mb-6">프로젝트가 성공적으로 저장되었습니다.</p>
            <div className="flex justify-end">
              <button
                onClick={() => {
                  setShowSuccessModal(false);
                  navigate('/dashboard');
                }}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-200"
              >
                대시보드로 이동
              </button>
            </div>
          </div>
        </div>
      )}
      <Assistant currentStep={7} setEditMode={setEditMode} />
    </div>
  );
};

export default FinalResult;
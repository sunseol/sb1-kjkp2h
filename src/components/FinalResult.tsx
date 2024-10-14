import React, { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Assistant from './Assistant';
import { generateHtmlContent } from '../utils/groqApi';
import { getUser } from '../utils/auth';
import LoadingSpinner from './LoadingSpinner';

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

  useEffect(() => {
    const fetchHtmlContent = async () => {
      if (formData) {
        try {
          setIsLoading(true);
          console.log('HTML 콘텐츠 생성 요청 시작');
          
          const content = await generateHtmlContent(formData);
          
          console.log('받아온 HTML 콘텐츠:', content);
          
          setHtmlContent(content);
        } catch (error) {
          console.error('HTML 콘텐츠 생성 오류:', error);
          console.error('오류 발생 시 formData:', JSON.stringify(formData, null, 2));
          setError('HTML 콘텐츠를 생성하는 중 오류가 발생했습니다.');
        } finally {
          setIsLoading(false);
        }
      } else {
        console.warn('formData가 없습니다.');
        setError('프로젝트 데이터를 찾을 수 없습니다.');
        setIsLoading(false);
      }
    };

    fetchHtmlContent();
  }, [formData]);

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
              <pre className="text-sm">{htmlContent}</pre>
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

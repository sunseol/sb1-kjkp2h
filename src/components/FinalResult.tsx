import React, { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Assistant from './Assistant';
import html2canvas from 'html2canvas';
import { generateHtmlContent } from '../utils/groqApi';

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
  const formData = location.state?.formData as FormData | undefined;
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [iframeHeight, setIframeHeight] = useState('600px');
  const [editMode, setEditMode] = useState(false);
  const [annotations, setAnnotations] = useState<{ x: number; y: number; text: string }[]>([]);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [startPoint, setStartPoint] = useState({ x: 0, y: 0 });
  const [htmlContent, setHtmlContent] = useState<string>('');

  useEffect(() => {
    const fetchHtmlContent = async () => {
      if (formData) {
        try {
          // 디버그: HTML 생성 요청 시작 로깅
          console.log('HTML 콘텐츠 생성 요청 시작');
          
          const content = await generateHtmlContent(formData);
          
          // 디버그: 받아온 HTML 콘텐츠 로깅
          console.log('받아온 HTML 콘텐츠:', content);
          
          setHtmlContent(content);
        } catch (error) {
          console.error('HTML 콘텐츠 생성 오류:', error);
          // 디버그: 오류 발생 시 formData 로깅
          console.error('오류 발생 시 formData:', JSON.stringify(formData, null, 2));
          setHtmlContent('<p>HTML 콘텐츠를 생성하는 중 오류가 발생했습니다.</p>');
        }
      } else {
        // 디버그: formData가 없는 경우 로깅
        console.warn('formData가 없습니다.');
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
  }, []);

  useEffect(() => {
    if (editMode && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        annotations.forEach(({ x, y, text }) => {
          ctx.beginPath();
          ctx.arc(x, y, 5, 0, 2 * Math.PI);
          ctx.fillStyle = 'red';
          ctx.fill();
          ctx.font = '14px Arial';
          ctx.fillStyle = 'red';
          ctx.fillText(text, x + 10, y);
        });
      }
    }
  }, [editMode, annotations]);

  useEffect(() => {
    if (editMode && canvasRef.current) {
      const canvas = canvasRef.current;
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.strokeStyle = 'red';
        ctx.lineWidth = 2;
        ctx.lineCap = 'round';
      }
    }
  }, [editMode]);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (editMode) {
      setIsDrawing(true);
      const canvas = canvasRef.current!;
      const rect = canvas.getBoundingClientRect();
      setStartPoint({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      });
    }
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !editMode || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const endPoint = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };

    ctx.beginPath();
    ctx.moveTo(startPoint.x, startPoint.y);
    ctx.lineTo(endPoint.x, endPoint.y);
    ctx.stroke();

    setStartPoint(endPoint);
  };

  const endDrawing = () => {
    setIsDrawing(false);
  };

  if (!formData) {
    return <div>No data available</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
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
            {editMode && (
              <canvas
                ref={canvasRef}
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={endDrawing}
                onMouseOut={endDrawing}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  pointerEvents: 'auto',
                }}
              />
            )}
          </div>
        </div>
        <div className="mt-8">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">HTML 코드</h2>
          <div className="mt-4 p-4 bg-gray-100 rounded-lg overflow-auto max-h-96">
            <pre className="text-sm">{htmlContent}</pre>
          </div>
        </div>
      </div>
      <Assistant currentStep={7} setEditMode={setEditMode} />
    </div>
  );
};

export default FinalResult;

import React, { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Assistant from './Assistant';
import { html2canvas } from 'html2canvas';

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

  const htmlContent = `
  <!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>AI 문서 작성 도우미 - 당신의 글쓰기를 혁신하세요</title>
    <meta name="description" content="AI 기술을 활용한 문서 작성 SaaS로 효율적이고 전문적인 문서를 작성하세요.">
    <style>
        /* 리셋 및 기본 스타일 */
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        body {
            font-family: 'Arial', sans-serif;
            line-height: 1.6;
            color: #333;
        }
        
        /* 레이아웃 */
        .container {
            width: 90%;
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px;
        }
        
        /* 타이포그래피 */
        h1, h2, h3 {
            margin-bottom: 20px;
        }
        h1 {
            font-size: 2.5em;
        }
        h2 {
            font-size: 2em;
        }
        h3 {
            font-size: 1.5em;
        }
        p {
            margin-bottom: 15px;
        }
        
        /* 헤더 및 네비게이션 */
        header {
            background-color: #f8f8f8;
            padding: 20px 0;
        }
        nav {
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        .logo {
            font-size: 1.5em;
            font-weight: bold;
        }
        nav ul {
            display: flex;
            list-style: none;
        }
        nav ul li {
            margin-left: 20px;
        }
        nav ul li a {
            text-decoration: none;
            color: #333;
        }
        
        /* 히어로 섹션 */
        #hero {
            background-color: #e9ecef;
            padding: 60px 0;
            text-align: center;
        }
        .hero-image {
            margin-top: 30px;
        }
        .hero-image img {
            max-width: 100%;
            height: auto;
        }
        
        /* 기능 섹션 */
        #features {
            padding: 60px 0;
        }
        .feature-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 30px;
        }
        .feature-item {
            background-color: #f8f9fa;
            padding: 20px;
            border-radius: 5px;
        }
        
        /* 사용 방법 섹션 */
        #how-it-works {
            background-color: #e9ecef;
            padding: 60px 0;
        }
        #how-it-works ol {
            margin-left: 20px;
            margin-bottom: 30px;
        }
        
        /* 고객 후기 섹션 */
        #testimonials {
            padding: 60px 0;
        }
        .testimonial-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 30px;
        }
        .testimonial-item {
            background-color: #f8f9fa;
            padding: 20px;
            border-radius: 5px;
        }
        
        /* 가격 정책 섹션 */
        #pricing {
            background-color: #e9ecef;
            padding: 60px 0;
        }
        .pricing-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 30px;
        }
        .pricing-item {
            background-color: #fff;
            padding: 30px;
            border-radius: 5px;
            text-align: center;
        }
        .price {
            font-size: 1.5em;
            font-weight: bold;
            margin: 15px 0;
        }
        .pricing-item ul {
            list-style: none;
            margin-bottom: 20px;
        }
        
        /* FAQ 섹션 */
        #faq {
            padding: 60px 0;
        }
        .faq-item {
            margin-bottom: 30px;
        }
        
        /* 문의하기 폼 */
        #contact {
            background-color: #e9ecef;
            padding: 60px 0;
        }
        form {
            display: grid;
            gap: 20px;
        }
        input, textarea {
            width: 100%;
            padding: 10px;
            border: 1px solid #ddd;
            border-radius: 5px;
        }
        textarea {
            height: 150px;
        }
        
        /* 푸터 */
        footer {
            background-color: #333;
            color: #fff;
            text-align: center;
            padding: 20px 0;
        }
        
        /* 버튼 및 CTA */
        .cta-button {
            display: inline-block;
            background-color: #007bff;
            color: #fff;
            padding: 10px 20px;
            border-radius: 5px;
            text-decoration: none;
            transition: background-color 0.3s;
        }
        .cta-button:hover {
            background-color: #0056b3;
        }
        
        /* 반응형 디자인 */
        @media (max-width: 768px) {
            nav {
                flex-direction: column;
            }
            nav ul {
                margin-top: 20px;
            }
            nav ul li {
                margin-left: 0;
                margin-right: 20px;
            }
        }
    </style>
</head>
<body>
    <header>
        <div class="container">
            <nav>
                <div class="logo">AI Writer</div>
                <ul>
                    <li><a href="#features">기능</a></li>
                    <li><a href="#how-it-works">사용 방법</a></li>
                    <li><a href="#pricing">가격</a></li>
                    <li><a href="#contact">문의하기</a></li>
                </ul>
            </nav>
        </div>
    </header>

    <main>
        <section id="hero">
            <div class="container">
                <h1>AI로 더 스마트하게 글쓰기</h1>
                <p>인공지능이 당신의 글쓰기를 도와드���니다. 더 빠르고, 더 정확하게, 더 전문적으로.</p>
                <a href="#" class="cta-button">무료로 시작하기</a>
                <div class="hero-image">
                    <img src="hero-image.jpg" alt="AI 글쓰기 도우미 사용 예시" width="460" height="560">
                </div>
            </div>
        </section>

        <section id="features">
            <div class="container">
                <h2>주요 기능</h2>
                <div class="feature-grid">
                    <div class="feature-item">
                        <h3>자동 교정 및 문법 검사</h3>
                        <p>AI가 실시간으로 오타와 문법 오류를 잡아내고 수정 제안을 합니다.</p>
                    </div>
                    <div class="feature-item">
                        <h3>콘텐츠 제안</h3>
                        <p>주제에 맞는 키워드와 문장 구조를 제안하여 글의 품질을 높입니다.</p>
                    </div>
                    <div class="feature-item">
                        <h3>다국어 지원</h3>
                        <p>다양한 언어로 작성 및 번역을 지원합니다.</p>
                    </div>
                </div>
            </div>
        </section>

        <section id="how-it-works">
            <div class="container">
                <h2>사용 방법</h2>
                <ol>
                    <li>회원가 후 로그인</li>
                    <li>새 문서 만들기</li>
                    <li>AI 도우미 활성화</li>
                    <li>글쓰기 시작</li>
                </ol>
                <a href="#" class="cta-button">지금 시작하기</a>
            </div>
        </section>

        <section id="testimonials">
            <div class="container">
                <h2>고객 후기</h2>
                <div class="testimonial-grid">
                    <div class="testimonial-item">
                        <p>"AI Writer 덕분에 보고서 작성 시간이 절반으로 줄었어요!"</p>
                        김철수, 마케팅 매니저
                    </div>
                    <div class="testimonial-item">
                        <p>"영어로 이메일 쓰는 게 이제 두렵지 않아요."</p>
                        이영희, 해외영업 담당
                    </div>
                </div>
            </div>
        </section>

        <section id="pricing">
            <div class="container">
                <h2>가격 정책</h2>
                <div class="pricing-grid">
                    <div class="pricing-item">
                        <h3>Basic</h3>
                        <p class="price">월 9,900원</p>
                        <ul>
                            <li>기본 교정 기능</li>
                            <li>월 100페이지 제한</li>
                        </ul>
                        <a href="#" class="cta-button">선택하기</a>
                    </div>
                    <div class="pricing-item">
                        <h3>Pro</h3>
                        <p class="price">월 19,900원</p>
                        <ul>
                            <li>고급 AI 제안 기능</li>
                            <li>무제한 사용</li>
                        </ul>
                        <a href="#" class="cta-button">선택하기</a>
                    </div>
                </div>
            </div>
        </section>

        <section id="faq">
            <div class="container">
                <h2>자주 묻는 질문</h2>
                <div class="faq-item">
                    <h3>AI Writer는 어떤 언어를 지원하나요?</h3>
                    <p>현재 한국어, 영어, 일본어, 중국어를 지원하고 있으며, 지속적으로 새로운 언어를 추가하고 있습니다.</p>
                </div>
                <div class="faq-item">
                    <h3>무료 체험 기간이 있나요?</h3>
                    <p>네, 7일간의 무료 체험 기간을 제공하고 있습니다. 이 기간 동안 모든 기능을 제한 없이 사용해보실 수 있습니다.</p>
                </div>
            </div>
        </section>

        <section id="contact">
            <div class="container">
                <h2>문의하기</h2>
                <form>
                    <input type="text" placeholder="이름" required>
                    <input type="email" placeholder="이메일" required>
                    <textarea placeholder="문의 내용" required></textarea>
                    <button type="submit" class="cta-button">보내기</button>
</form>
</div>
</section>
</main>
<footer>
    <div class="container">
        <p>&copy; 2024 AI Writer. All rights reserved.</p>
    </div>
</footer>
</body>
</html>
  `;

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
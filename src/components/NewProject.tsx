import React, { useState, useEffect } from 'react';
import { ArrowRight, ArrowLeft, CheckCircle, RefreshCw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Assistant from './Assistant';
import { getAdviceForStep, summarizeAdvice } from '../utils/groqApi';
import ReactMarkdown from 'react-markdown';
import { getUser } from '../utils/auth';

// 스타일 추가
const markdownStyles = `
  .markdown-preview {
    font-size: 14px;
    line-height: 1.6;
  }
  .markdown-preview > * {
    margin-bottom: 1rem;
  }
  .markdown-preview h1, .markdown-preview h2, .markdown-preview h3 {
    margin-top: 1.5rem;
    margin-bottom: 1rem;
    font-weight: bold;
  }
  .markdown-preview h1 { font-size: 1.5em; }
  .markdown-preview h2 { font-size: 1.3em; }
  .markdown-preview h3 { font-size: 1.1em; }
  .markdown-preview ul, .markdown-preview ol {
    padding-left: 1.5rem;
  }
  .markdown-preview li {
    margin-bottom: 0.5rem;
  }
  .markdown-preview code {
    background-color: #f0f0f0;
    padding: 0.2rem 0.4rem;
    border-radius: 0.2rem;
    font-size: 0.9em;
  }
  .markdown-preview pre {
    background-color: #f0f0f0;
    padding: 1rem;
    border-radius: 0.4rem;
    overflow-x: auto;
  }
`;

const NewProject: React.FC<{ setCurrentStep: (step: number) => void }> = ({ setCurrentStep }) => {
  const [step, setStep] = useState(1);
  const [showPanel, setShowPanel] = useState(true);
  const [formData, setFormData] = useState({
    companyName: '', industry: '', mainProduct: '',
    targetAudience: '', customerInterests: '',
    productFeatures: '', uniqueSellingPoints: '', priceInfo: '',
    marketingGoal: '', callToAction: '',
    brandSlogan: '', brandColors: '', brandTone: '',
    customerReviews: '', faqItems: '',
    email: '', phone: '', socialMedia: '',
    privacyPolicyLink: '', termsOfServiceLink: ''
  });
  const [advice, setAdvice] = useState<string[]>(Array(6).fill(''));
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [editMode, setEditMode] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState<boolean[]>(Array(6).fill(false));
  const [error, setError] = useState<string | null>(null);
  const [summarizedAdvice, setSummarizedAdvice] = useState<string>('');

  const navigate = useNavigate();

  useEffect(() => {
    setCurrentStep(1); // NewProject 컴포넌트가 마운트될 때 currentStep을 1로 설정
  }, [setCurrentStep]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    setError(null); // 에러 상태 초기화
    try {
      console.log('AI 조언 요청 시작:', { step, formData });
      const response = await getAdviceForStep(step, formData);
      console.log('AI 조언 응답:', response);
      const newAdvice = [...advice];
      newAdvice[step - 1] = response;
      setAdvice(newAdvice);
      const newIsSubmitted = [...isSubmitted];
      newIsSubmitted[step - 1] = true;
      setIsSubmitted(newIsSubmitted);
    } catch (error) {
      console.error('조언을 가져오는 중 오류 발생:', error);
      setError('조언을 가져오는 중 오류가 발생했습니다. 다시 시도해 주세요.');
      const newAdvice = [...advice];
      newAdvice[step - 1] = '조언을 가져오는 중 오류가 발생했습니다.';
      setAdvice(newAdvice);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNextStep = async () => {
    if (step < 7) {
      const nextStep = step + 1;
      setStep(nextStep);
      setCurrentStep(nextStep);  // App.tsx에서 전달받은 setCurrentStep 함수 호출
      if (step === 6) {
        // 6단계에서 7단계로 넘어갈 때 모든 조언을 종합
        try {
          setIsLoading(true);
          const summary = await summarizeAdvice(advice);
          setSummarizedAdvice(summary);
        } catch (error) {
          console.error('조언 종합 중 오류 발생:', error);
          setError('조언을 종합하는 중 오류가 발생했습니다.');
        } finally {
          setIsLoading(false);
        }
      }
    } else {
      navigate('/final-result', { state: { formData, summarizedAdvice } });
    }
    if (!showPanel) {
      setShowPanel(true);
    }
  };

  const handlePrevStep = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleRegenerateAdvice = async () => {
    await handleSubmit();
  };

  const handleSaveProject = async () => {
    console.log('handleSaveProject 함수 호출됨');
    const user = getUser();
    if (!user || !user.id) {
      setError('로그인이 필요합니다.');
      return;
    }

    try {
      console.log('프로젝트 저장 시도:', { userId: user.id, name: formData.companyName, data: formData });
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/projects`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.id,
          name: formData.companyName || '새 프로젝트',
          data: formData,
          htmlContent: '', // HTML 콘텐츠가 아직 생성되지 않았으므로 빈 문자열 전송
        }),
      });

      const result = await response.json();
      console.log('서버 응답:', result);
      if (result.success) {
        navigate('/dashboard');
      } else {
        setError('프로젝트 저장에 실패했습니다: ' + result.message);
      }
    } catch (error) {
      console.error('프로젝트 저장 중 오류 발생:', error);
      setError('프로젝트 저장 중 오류가 발생했습니다.');
    }
  };

  const handleComplete = () => {
    console.log('handleComplete 함수 호출됨');
    // 프로젝트 데이터를 FinalResult 컴포넌트로 전달
    navigate('/final-result', { state: { formData, summarizedAdvice } });
  };

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <>
            <h2 className="text-2xl font-bold mb-6 text-gray-800">기본 비즈니스 정보</h2>
            <div className="space-y-4">
              <input type="text" name="companyName" value={formData.companyName} onChange={handleChange} placeholder="회사명" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
              <input type="text" name="industry" value={formData.industry} onChange={handleChange} placeholder="업종" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
              <input type="text" name="mainProduct" value={formData.mainProduct} onChange={handleChange} placeholder="주요 제품 또는 서비스명" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
          </>
        );
      case 2:
        return (
          <>
            <h2 className="text-2xl font-bold mb-6 text-gray-800">타겟 오언스 정보</h2>
            <div className="space-y-4">
              <input type="text" name="targetAudience" value={formData.targetAudience} onChange={handleChange} placeholder="주 타겟 고객층" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
              <input type="text" name="customerInterests" value={formData.customerInterests} onChange={handleChange} placeholder="타겟 고객의 주요 관심사 또는 니즈" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
          </>
        );
      case 3:
        return (
          <>
            <h2 className="text-2xl font-bold mb-6 text-gray-800">제품/서비스 상세 정보</h2>
            <div className="space-y-4">
              <textarea name="productFeatures" value={formData.productFeatures} onChange={handleChange} placeholder="주요 특징 또는 장점 (3-5개)" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" rows={4}></textarea>
              <input type="text" name="uniqueSellingPoints" value={formData.uniqueSellingPoints} onChange={handleChange} placeholder="경쟁사 대비 차별화 포인" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
              <input type="text" name="priceInfo" value={formData.priceInfo} onChange={handleChange} placeholder="가격 정보 (해당되는 경우)" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
          </>
        );
      case 4:
        return (
          <>
            <h2 className="text-2xl font-bold mb-6 text-gray-800">마케팅 목표 및 브랜드 아이덴티티</h2>
            <div className="space-y-4">
              <input type="text" name="marketingGoal" value={formData.marketingGoal} onChange={handleChange} placeholder="랜딩 페이지의 주요 목적" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
              <input type="text" name="callToAction" value={formData.callToAction} onChange={handleChange} placeholder="희망하는 주요 행동 유도 (CTA) 내용" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
              <input type="text" name="brandSlogan" value={formData.brandSlogan} onChange={handleChange} placeholder="브랜드 슬로건 또는 태그인" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
              <input type="text" name="brandColors" value={formData.brandColors} onChange={handleChange} placeholder="브랜드 색상 (주요 색상 2-3개)" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
              <input type="text" name="brandTone" value={formData.brandTone} onChange={handleChange} placeholder="브랜드 톤앤보이스" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
          </>
        );
      case 5:
        return (
          <>
            <h2 className="text-2xl font-bold mb-6 text-gray-800">추가 콘텐츠 요소</h2>
            <div className="space-y-4">
              <textarea name="customerReviews" value={formData.customerReviews} onChange={handleChange} placeholder="고객 후기 또는 추천사 (1-2개)" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" rows={4}></textarea>
              <textarea name="faqItems" value={formData.faqItems} onChange={handleChange} placeholder="FAQ 항목 (3-5개 질문과 답변)" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" rows={6}></textarea>
            </div>
          </>
        );
      case 6:
        return (
          <>
            <h2 className="text-2xl font-bold mb-6 text-gray-800">연락처 및 법적 정보</h2>
            <div className="space-y-4">
              <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="이메일 주소" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
              <input type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="전화번호 (선택사항)" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
              <input type="text" name="socialMedia" value={formData.socialMedia} onChange={handleChange} placeholder="소셜 디어 링크 (선택사항)" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
              <input type="url" name="privacyPolicyLink" value={formData.privacyPolicyLink} onChange={handleChange} placeholder="개인정보 처리방침" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
              <input type="url" name="termsOfServiceLink" value={formData.termsOfServiceLink} onChange={handleChange} placeholder="이용약관 링크 (필요한 경우)" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
          </>
        );
      case 7:
        return (
          <>
            <h2 className="text-2xl font-bold mb-6 text-gray-800">종합 조언 및 최종 확인</h2>
            <div className="space-y-4">
              <div className="bg-gray-100 p-4 rounded-lg">
                <h3 className="text-lg font-semibold mb-2">종합된 조언:</h3>
                <div className="prose max-w-full">
                  <ReactMarkdown className="whitespace-pre-wrap break-words">
                    {summarizedAdvice}
                  </ReactMarkdown>
                </div>
              </div>
              <p className="text-gray-600">위의 종합된 조언을 바탕으로 HTML이 생성됩니다. 최종 결과를 확인하시겠습니까?</p>
            </div>
          </>
        );
      default:
        return null;
    }
  };

  const renderPreview = () => {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md w-full">
        <h3 className="text-xl font-semibold mb-4">
          {step === 1 ? '회사 소개' :
           step === 2 ? '타겟 고객' :
           step === 3 ? '제품/서비스 특징' :
           step === 4 ? '브랜드 아이덴티티' :
           step === 5 ? '고객 후기 및 FAQ' :
           step === 6 ? '연락처 정보' :
           '종합 조언 및 최종 확인'}
        </h3>
        <div className="mt-6 bg-blue-50 p-4 rounded-lg">
          <div className="flex justify-between items-center mb-2">
            <h4 className="text-lg font-semibold">AI 조언</h4>
            {isSubmitted[step - 1] && (
              <button
                onClick={handleRegenerateAdvice}
                className="bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600 transition duration-300 flex items-center"
                disabled={isLoading}
              >
                <RefreshCw size={16} className="mr-1" />
                {isLoading ? '생성 중...' : '다시 생성'}
              </button>
            )}
          </div>
          {isLoading ? (
            <p>조언을 생성하는 중입니다...</p>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : (
            <div className="markdown-preview prose max-w-none">
              <ReactMarkdown>{advice[step - 1]}</ReactMarkdown>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <style>{markdownStyles}</style>
      <div className="max-w-7xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="p-8 flex flex-col lg:flex-row">
          <motion.div 
            className={`flex-1 ${showPanel ? 'lg:mr-8 mb-8 lg:mb-0' : ''}`}
            animate={{ width: showPanel ? '100%' : '100%' }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-3xl font-bold mb-8 text-gray-800">새 프로젝트 생성</h1>
            <div className="mb-8">
              <div className="flex items-center justify-between">
                {[1, 2, 3, 4, 5, 6, 7].map((i) => (
                  <div key={i} className="flex flex-col items-center">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        step >= i ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-500'
                      }`}
                    >
                      {step > i ? <CheckCircle className="w-6 h-6" /> : i}
                    </div>
                    {i < 7 && (
                      <div
                        className={`h-1 w-full mt-2 ${
                          step > i ? 'bg-blue-500' : 'bg-gray-200'
                        }`}
                      ></div>
                    )}
                  </div>
                ))}
              </div>
            </div>
            {renderStepContent()}
            <div className="flex justify-between mt-8">
              {step > 1 && (
                <button
                  onClick={handlePrevStep}
                  className="bg-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-400 transition duration-300 ease-in-out flex items-center font-medium"
                >
                  <ArrowLeft className="mr-2" /> 이전
                </button>
              )}
              {!isSubmitted[step - 1] ? (
                <button
                  onClick={handleSubmit}
                  className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition duration-300 ease-in-out flex items-center font-medium ml-auto"
                  disabled={isLoading}
                >
                  {isLoading ? '전송 중...' : '제출'}
                </button>
              ) : (
                <button
                  onClick={step === 7 ? handleComplete : handleNextStep}
                  className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition duration-300 ease-in-out flex items-center font-medium ml-auto"
                >
                  {step < 7 ? '다음' : 'HTML 생성'} <ArrowRight className="ml-2" />
                </button>
              )}
            </div>
          </motion.div>
          {showPanel && (
            <motion.div 
              className="flex-1 w-full"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              {renderPreview()}
            </motion.div>
          )}
        </div>
      </div>
      <Assistant currentStep={step} setEditMode={setEditMode} />
    </div>
  );
};

export default NewProject;

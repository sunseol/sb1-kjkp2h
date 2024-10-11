import React, { useState } from 'react';
import { ArrowRight, ArrowLeft, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Assistant from './Assistant';

const NewProject: React.FC = () => {
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

  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleNextStep = () => {
    if (step < 6) {
      setStep(step + 1);
    } else {
      navigate('/final-result', { state: { formData } });
    }
    if (!showPanel) {
      setShowPanel(true);
    }
  };

  const handlePrevStep = () => {
    if (step > 1) setStep(step - 1);
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
            <h2 className="text-2xl font-bold mb-6 text-gray-800">타겟 오디언스 정보</h2>
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
              <input type="text" name="uniqueSellingPoints" value={formData.uniqueSellingPoints} onChange={handleChange} placeholder="경쟁사 대비 차별화 인트" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
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
              <input type="text" name="brandColors" value={formData.brandColors} onChange={handleChange} placeholder="브드 색상 (주요 색상 2-3개)" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
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
      default:
        return null;
    }
  };

  const renderPreview = () => {
    switch (step) {
      case 1:
        return (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-4">회사 소개</h3>
            <p><strong>{formData.companyName || '회사명'}</strong>은(는) {formData.industry || '업종'} 업계에 종사하고 있으며,
            {formData.mainProduct || '주요 제품/서비스'}을(를) 주력 상품으로 제공하고 있습니다.</p>
            <div className="mt-6 bg-blue-50 p-4 rounded-lg">
              <h4 className="text-lg font-semibold mb-2">AI 조언</h4>
              <p>{formData.companyName || '귀하의 회사'}는 AI 기술을 활용하여 문서 작성을 지원하는 소프트웨어 솔루션입니다. 이는 생산성 향상 도구이자 AI 기반 문서 작성 보조 서비스로 분류 수 있습니다.</p>
              <h5 className="text-md font-semibold mt-4 mb-2">랜딩 페이지 전략을 위한 핵심 인사이트 및 추천사항:</h5>
              <ul className="list-disc pl-5 space-y-2">
                <li>AI 기술의 강조: 실시간 데모나 비디오를 통해 AI의 작동 방식을 시각화하세요.</li>
                <li>다양한 사용자 그룹 타겟팅: 직장인, 학생, 프리랜서 등 다양한 그룹별 가치 제안을 설명하세요.</li>
                <li>강력한 CTA 설계: "지금 무료로 시작하기"와 같은 명확한 CTA 버튼을 상단과 하단에 배치하세요.</li>
                <li>할인 혜택 강조: 신규 회원 5% 할인과 첫 구매 20% 할인을 눈에 띄게 표시하되, 시간 제한을 두어 긴급성을 부여하세요.</li>
                <li>신뢰 구축: 고객 후기, 사용 통계, 보안 인증 등을 통해 전문성을 보여주세요.</li>
                <li>간결한 정보 제공: 효율성 향상, 시간 절약 등 핵심 이점을 명확하게 전달하세요.</li>
                <li>모바일 최적화: 반응형 디자인을 적용하여 다양한 기기에서 원활하게 작동하도록 하세요.</li>
                <li>A/B 테스트 실시: 다양한 메시지와 디자인 요소에 대한 테스트를 통해 최적의 전환율을 찾으세요.</li>
              </ul>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-4">타겟 고객</h3>
            <p>주요 고객층: <strong>{formData.targetAudience}</strong></p>
            <p>고객 니즈: {formData.customerInterests}</p>
            <div className="mt-6 bg-blue-50 p-4 rounded-lg">
              <h4 className="text-lg font-semibold mb-2">AI 조언</h4>
              <p>버키드의 대상 고객은 "문서 작업을 하는 모든 사람"을 포함하여 광범위합니다. 다음과 같은 그룹을 고려해보세요:</p>
              <ul className="list-disc pl-5 space-y-2 mt-2">
                <li>다양한 산업의 사무직 근로자</li>
                <li>모든 교육 수준의 학생</li>
                <li>프리랜서 작가 및 콘텐츠 제작자</li>
                <li>연구자 및 학자</li>
                <li>비즈니스 전문가(관리자, 임원, 기업가)</li>
                <li>관리 직원</li>
              </ul>
              <p className="mt-4">이 대상의 주요 특징:</p>
              <ul className="list-disc pl-5 space-y-2 mt-2">
                <li>정기적으로 글쓰기와 문서 작성에 참여</li>
                <li>업무에서 효율성과 생산성을 중시할 가능성이 높음</li>
                <li>다양한 수준의 글쓰기 기술을 가질 수 있음</li>
                <li>시간 관리 또는 작가의 블록에 대한 어려움에 직면할 수 있음</li>
                <li>업무 프로세스를 개선하기 위한 기술 솔루션에 개방적일 수 있음</li>
              </ul>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-4">제품/서비스 특징</h3>
            <ul className="list-disc pl-5">
              {formData.productFeatures.split(',').map((feature, index) => (
                <li key={index}>{feature.trim()}</li>
              ))}
            </ul>
            <p className="mt-4"><strong>차별화 포인트:</strong> {formData.uniqueSellingPoints}</p>
            <div className="mt-6 bg-blue-50 p-4 rounded-lg">
              <h4 className="text-lg font-semibold mb-2">AI 조언: 랜딩 페이지 제안</h4>
              <ul className="list-disc pl-5 space-y-2">
                <li><strong>헤드라인:</strong> AI 기반 문서 작성과 효율성 향상을 강조하세요.</li>
                <li><strong>설명자 비디오:</strong> AI가 글쓰기를 돕고 생산성을 향상시키는 방법을 보여주는 짧은 애니메이션을 추가하세요.</li>
                <li><strong>특징 하이라이트:</strong> 자동 텍스트 생성, AI 쓰기 지원, 효율성 향상 도구를 소개하세요.</li>
                <li><strong>혜택 섹션:</strong> 시간 절약, 품질 개선, 비즈니스 효율성 향상에 중점을 두세요.</li>
                <li><strong>비교 표:</strong> AI 솔루션을 기존 문서 작성 방법과 비교하세요.</li>
                <li><strong>추천:</strong> 효율성을 개선한 기업의 특징적인 인용문을 포함하세요.</li>
                <li><strong>신뢰 지표:</strong> 잘 알려진 고객의 로고와 관련 AI 또는 보안 인증을 표시하세요.</li>
                <li><strong>CTA:</strong> 눈에 띄는 "무료 체험 시작" 버튼을 배치하세요.</li>
              </ul>
              <h4 className="text-lg font-semibold mt-4 mb-2">추가 인사이트</h4>
              <ul className="list-disc pl-5 space-y-2">
                <li>데이터 보안과 개인정보 보호에 집중하세요.</li>
                <li>학습 곡선을 강조하고 포괄적인 온보딩을 제공하여 채택을 용이하게 하세요.</li>
                <li>다양한 비즈니스 섹터에 맞는 산업별 템플릿 또는 기능을 제공하는 것을 고려해보세요.</li>
              </ul>
              <h4 className="text-lg font-semibold mt-4 mb-2">혁신적인 마케팅 접근 방식</h4>
              <p>'AI 글쓰기 챌린지' 캠페인을 시행하여 잠재 고객이 전통적인 글쓰기 과정을 AI 도구와 실시간으로 비교할 수 있게 하세요.</p>
              <p className="mt-4 font-semibold">요약:</p>
              <p>AI 기반 SaaS 산업에서 성공의 열쇠는 AI 기술의 가시적인 이점을 입증하는 것입니다. 마케팅 노력은 교육, 실습 경험 제공, 고객 성공 사례를 통한 신뢰 구축에 집중해야 합니다.</p>
            </div>
          </div>
        );
      case 4:
        return (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-4">브랜드 아이덴티티</h3>
            <p><strong>슬로건:</strong> "{formData.brandSlogan}"</p>
            <p><strong>브랜드 톤:</strong> {formData.brandTone}</p>
            <p className="mt-4"><strong>주요 목표:</strong> {formData.marketingGoal}</p>
            <button className="mt-4 bg-blue-500 text-white px-4 py-2 rounded">
              {formData.callToAction}
            </button>
          </div>
        );
      case 5:
        return (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-4">고객 후기</h3>
            <blockquote className="italic border-l-4 border-gray-300 pl-4 py-2 mb-4">
              "{formData.customerReviews}"
            </blockquote>
            <h4 className="font-semibold mt-4 mb-2">자주 묻는 질문</h4>
            <ul className="list-disc pl-5">
              {formData.faqItems.split(',').map((faq, index) => (
                <li key={index}>{faq.trim()}</li>
              ))}
            </ul>
          </div>
        );
      case 6:
        return (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-4">연락처 정보</h3>
            <p><strong>이메일:</strong> {formData.email}</p>
            <p><strong>전화번호:</strong> {formData.phone}</p>
            <p><strong>소셜 미디어:</strong> {formData.socialMedia}</p>
            <div className="mt-4">
              <a href={formData.privacyPolicyLink} className="text-blue-500 hover:underline mr-4">개인정보 처리방침</a>
              <a href={formData.termsOfServiceLink} className="text-blue-500 hover:underline">이용약관</a>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="p-8 flex">
          <motion.div 
            className={`flex-1 ${showPanel ? 'mr-8' : ''}`}
            animate={{ width: showPanel ? '50%' : '100%' }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-3xl font-bold mb-8 text-gray-800">새 프로젝트 생성</h1>
            <div className="mb-8">
              <div className="flex items-center justify-between">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="flex flex-col items-center">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        step >= i ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-500'
                      }`}
                    >
                      {step > i ? <CheckCircle className="w-6 h-6" /> : i}
                    </div>
                    {i < 6 && (
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
              <button
                onClick={handleNextStep}
                className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition duration-300 ease-in-out flex items-center font-medium ml-auto"
              >
                {step < 6 ? '다음' : '완료'} <ArrowRight className="ml-2" />
              </button>
            </div>
          </motion.div>
          {showPanel && (
            <motion.div 
              className="flex-1"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              {renderPreview()}
            </motion.div>
          )}
        </div>
      </div>
      <Assistant currentStep={step} />
    </div>
  );
};

export default NewProject;
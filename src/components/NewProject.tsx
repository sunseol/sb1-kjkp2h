import React, { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const NewProject: React.FC = () => {
  const [step, setStep] = useState(1);
  const [projectData, setProjectData] = useState({
    name: '',
    industry: '',
    targetAudience: '',
    goals: '',
    productDescription: '',
  });
  const navigate = useNavigate();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProjectData({ ...projectData, [name]: value });
  };

  const handleNextStep = () => {
    if (step < 8) {
      setStep(step + 1);
    } else {
      // 프로젝트 생성 완료 후 대시보드로 이동
      navigate('/dashboard');
    }
  };

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <>
            <h2 className="text-xl font-semibold mb-4">1단계: 프로젝트 기본 정보</h2>
            <div className="mb-4">
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                프로젝트 이름
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={projectData.name}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="industry" className="block text-sm font-medium text-gray-700 mb-1">
                산업 분야
              </label>
              <input
                type="text"
                id="industry"
                name="industry"
                value={projectData.industry}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </>
        );
      case 2:
        return (
          <>
            <h2 className="text-xl font-semibold mb-4">2단계: 타겟 오디언스 및 목표</h2>
            <div className="mb-4">
              <label htmlFor="targetAudience" className="block text-sm font-medium text-gray-700 mb-1">
                타겟 오디언스
              </label>
              <input
                type="text"
                id="targetAudience"
                name="targetAudience"
                value={projectData.targetAudience}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="goals" className="block text-sm font-medium text-gray-700 mb-1">
                프로젝트 목표
              </label>
              <textarea
                id="goals"
                name="goals"
                value={projectData.goals}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={3}
                required
              ></textarea>
            </div>
          </>
        );
      case 3:
        return (
          <>
            <h2 className="text-xl font-semibold mb-4">3단계: 제품/서비스 설명</h2>
            <div className="mb-4">
              <label htmlFor="productDescription" className="block text-sm font-medium text-gray-700 mb-1">
                제품/서비스 설명
              </label>
              <textarea
                id="productDescription"
                name="productDescription"
                value={projectData.productDescription}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={5}
                required
              ></textarea>
            </div>
          </>
        );
      case 4:
        return <InitialAnalysis projectData={projectData} />;
      case 5:
        return <IndustryAdvice industry={projectData.industry} />;
      case 6:
        return <LLMInference projectData={projectData} />;
      case 7:
        return <ContentGeneration projectData={projectData} />;
      case 8:
        return <WebPageRendering projectData={projectData} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold mb-8">새 프로젝트 생성</h1>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="mb-6">
          <div className="flex items-center">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <React.Fragment key={i}>
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    step >= i ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-600'
                  }`}
                >
                  {i}
                </div>
                {i < 8 && (
                  <div
                    className={`flex-1 h-1 mx-2 ${
                      step > i ? 'bg-blue-500' : 'bg-gray-300'
                    }`}
                  ></div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
        {renderStepContent()}
        <div className="flex justify-end mt-6">
          <button
            onClick={handleNextStep}
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-300 flex items-center"
          >
            {step < 8 ? '다음' : '완료'} <ArrowRight className="ml-2" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default NewProject;
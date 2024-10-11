import React from 'react';

interface InitialAnalysisProps {
  projectData: {
    name: string;
    industry: string;
    targetAudience: string;
    goals: string;
    productDescription: string;
  };
}

const InitialAnalysis: React.FC<InitialAnalysisProps> = ({ projectData }) => {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">4단계: 초기 분석</h2>
      <div className="bg-gray-100 p-4 rounded-md">
        <p className="mb-2"><strong>프로젝트명:</strong> {projectData.name}</p>
        <p className="mb-2"><strong>산업:</strong> {projectData.industry}</p>
        <p className="mb-2"><strong>타겟 오디언스:</strong> {projectData.targetAudience}</p>
        <p className="mb-2"><strong>목표:</strong> {projectData.goals}</p>
        <p className="mb-4"><strong>제품/서비스 설명:</strong> {projectData.productDescription}</p>
        <p className="text-sm text-gray-600">
          초기 분석 결과: 입력된 정보를 바탕으로 AI가 프로젝트의 초기 분석을 수행합니다. 
          이 단계에서는 사용자의 입력을 검토하고, 잠재적인 개선 사항이나 추가 정보가 필요한 부분을 식별합니다.
        </p>
      </div>
    </div>
  );
};

export default InitialAnalysis;
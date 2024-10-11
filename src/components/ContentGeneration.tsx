import React from 'react';

interface ContentGenerationProps {
  projectData: {
    name: string;
    industry: string;
    targetAudience: string;
    goals: string;
    productDescription: string;
  };
}

const ContentGeneration: React.FC<ContentGenerationProps> = ({ projectData }) => {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">7단계: 콘텐츠 생성</h2>
      <div className="bg-gray-100 p-4 rounded-md">
        <p className="mb-4">LLM이 랜딩 페이지의 각 섹션에 대한 상세 콘텐츠를 생성합니다.</p>
        <div className="mb-4">
          <h3 className="font-semibold">생성된 콘텐츠 예시:</h3>
          <div className="mt-2">
            <p className="font-medium">헤드라인:</p>
            <p className="text-sm">{`"${projectData.industry} 혁신의 새로운 지평을 열다"`}</p>
          </div>
          <div className="mt-2">
            <p className="font-medium">서브헤더:</p>
            <p className="text-sm">{`${projectData.targetAudience}를 위한 맞춤형 솔루션`}</p>
          </div>
          <div className="mt-2">
            <p className="font-medium">CTA:</p>
            <p className="text-sm">"지금 바로 체험하세요"</p>
          </div>
        </div>
        <p className="text-sm text-gray-600">
          이 단계에서는 LLM이 프로젝트의 목표, 타겟 오디언스, 제품/서비스 특성을 고려하여 
          각 섹션에 대한 구체적인 콘텐츠를 생성합니다. 생성된 콘텐츠는 마케팅 모범 사례와 
          SEO 최적화를 고려하여 조정됩니다.
        </p>
      </div>
    </div>
  );
};

export default ContentGeneration;
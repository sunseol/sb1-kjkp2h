import React from 'react';

interface LLMInferenceProps {
  projectData: {
    name: string;
    industry: string;
    targetAudience: string;
    goals: string;
    productDescription: string;
  };
}

const LLMInference: React.FC<LLMInferenceProps> = ({ projectData }) => {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">6단계: LLM 추론</h2>
      <div className="bg-gray-100 p-4 rounded-md">
        <p className="mb-4">프로젝트 데이터를 기반으로 LLM이 랜딩 페이지 구조와 콘텐츠 개요를 생성합니다.</p>
        <div className="mb-4">
          <h3 className="font-semibold">페이지 구조 제안:</h3>
          <ul className="list-disc list-inside">
            <li>헤더 섹션</li>
            <li>주요 가치 제안</li>
            <li>제품/서비스 특징</li>
            <li>고객 증언</li>
            <li>행동 유도(CTA) 섹션</li>
          </ul>
        </div>
        <p className="text-sm text-gray-600">
          LLM은 프로젝트 데이터, 초기 분석, 업종별 조언을 종합하여 최적화된 랜딩 페이지 구조와 
          주요 콘텐츠 포인트를 제안합니다. 이 단계에서는 전환율을 높이기 위한 전략적 요소 배치와 
          효과적인 메시징 전략이 포함됩니다.
        </p>
      </div>
    </div>
  );
};

export default LLMInference;
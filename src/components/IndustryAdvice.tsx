import React from 'react';

interface IndustryAdviceProps {
  industry: string;
}

const IndustryAdvice: React.FC<IndustryAdviceProps> = ({ industry }) => {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">5단계: 업종별 조언</h2>
      <div className="bg-gray-100 p-4 rounded-md">
        <p className="mb-4"><strong>선택된 산업:</strong> {industry}</p>
        <p className="text-sm text-gray-600">
          업종 특성에 맞는 조언: AI가 선택된 산업에 특화된 랜딩 페이지 전략과 모범 사례를 제공합니다. 
          이는 해당 업종의 특성, 고객 행동 패턴, 효과적인 마케팅 접근 방식 등을 포함합니다.
        </p>
      </div>
    </div>
  );
};

export default IndustryAdvice;
import React from 'react';

interface WebPageRenderingProps {
  projectData: {
    name: string;
    industry: string;
    targetAudience: string;
    goals: string;
    productDescription: string;
  };
}

const WebPageRendering: React.FC<WebPageRenderingProps> = ({ projectData }) => {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">8단계: 웹 페이지 렌더링</h2>
      <div className="bg-gray-100 p-4 rounded-md">
        <p className="mb-4">생성된 콘텐츠를 기반으로 랜딩 페이지의 시각적 미리보기를 제공합니다.</p>
        <div className="border border-gray-300 p-4 rounded-md bg-white">
          <h1 className="text-2xl font-bold mb-2">{`${projectData.industry} 혁신의 새로운 지평을 열다`}</h1>
          <h2 className="text-xl mb-4">{`${projectData.targetAudience}를 위한 맞춤형 솔루션`}</h2>
          <p className="mb-4">{projectData.productDescription}</p>
          <button className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-300">
            지금 바로 체험하세요
          </button>
        </div>
        <p className="mt-4 text-sm text-gray-600">
          이 단계에서는 생성된 콘텐츠와 구조를 바탕으로 실제 웹 페이지의 레이아웃과 디자인이 
          구현됩니다. 사용자는 이 미리보기를 통해 최종 랜딩 페이지의 모습을 확인하고, 
          필요한 경우 수정 사항을 요청할 수 있습니다.
        </p>
      </div>
    </div>
  );
};

export default WebPageRendering;
import React from 'react';
import { useParams } from 'react-router-dom';

const Analytics: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold mb-8">성과 분석</h1>
      <p>프로젝트 ID: {id}</p>
      {/* 성과 분석 대시보드를 여기에 구현 */}
    </div>
  );
};

export default Analytics;
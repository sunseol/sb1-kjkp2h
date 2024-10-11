import React from 'react';
import { useParams } from 'react-router-dom';

const Analysis: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold mb-8">프로젝트 분석</h1>
      <p>프로젝트 ID: {id}</p>
      {/* 프로젝트 분석 내용을 여기에 표시 */}
    </div>
  );
};

export default Analysis;
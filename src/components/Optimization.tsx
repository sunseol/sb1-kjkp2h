import React from 'react';
import { useParams } from 'react-router-dom';

const Optimization: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold mb-8">최적화 제안</h1>
      <p>프로젝트 ID: {id}</p>
      {/* 최적화 제안 내용을 여기에 표시 */}
    </div>
  );
};

export default Optimization;
import React from 'react';
import { useParams } from 'react-router-dom';

const Review: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold mb-8">프로젝트 검토</h1>
      <p>프로젝트 ID: {id}</p>
      {/* 프로젝트 검토 및 피드백 인터페이스를 여기에 구현 */}
    </div>
  );
};

export default Review;
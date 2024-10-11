import React from 'react';
import { useParams } from 'react-router-dom';

const ContentEditor: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold mb-8">콘텐츠 편집기</h1>
      <p>프로젝트 ID: {id}</p>
      {/* 콘텐츠 편집 인터페이스를 여기에 구현 */}
    </div>
  );
};

export default ContentEditor;
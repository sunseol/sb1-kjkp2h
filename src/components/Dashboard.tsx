import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { PlusCircle, Folder, BarChart2, Calendar, Users, Tag } from 'lucide-react';
import { getUser } from '../utils/auth';
import LoadingSpinner from './LoadingSpinner';
import { ComponentProps } from '../App'; // App.tsx에서 ComponentProps를 import
import { fetchProjects } from '../utils/api'; // API_URL import 추가

interface Project {
  id: number;
  name: string;
  created_at: string;
  data: {
    industry?: string;
    targetAudience?: string;
    mainProduct?: string;
  };
}

const Dashboard: React.FC<ComponentProps> = ({ setCurrentStep }) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setCurrentStep(1); // Dashboard는 1단계로 설정
    const loadProjects = async () => {
      try {
        const user = getUser();
        if (!user) {
          throw new Error('User not found');
        }
        const data = await fetchProjects(user.id);
        setProjects(data);
        setIsLoading(false);
      } catch (error) {
        console.error('프로젝트 불러오기 중 오류 발생:', error);
        setError('프로젝트를 불러오는 데 실패했습니다.');
        setIsLoading(false);
      }
    };

    loadProjects();
  }, [setCurrentStep]);

  return (
    <div className="min-h-screen bg-gray-100 p-8 relative">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">대시보드</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Link
          to="/new-project"
          className="bg-white p-6 rounded-lg shadow-md flex items-center justify-center hover:shadow-lg transition duration-300"
        >
          <PlusCircle className="mr-2 text-blue-500" />
          <span className="text-lg font-semibold text-gray-700">새 프로젝트 시작</span>
        </Link>
        {projects.map((project) => (
          <Link
            key={project.id}
            to={`/project/${project.id}`}
            className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition duration-300 flex flex-col"
          >
            <div className="flex items-center mb-4">
              <Folder className="mr-2 text-blue-500" />
              <h2 className="text-xl font-semibold text-gray-800">{project.name}</h2>
            </div>
            <div className="flex items-center text-sm text-gray-600 mb-2">
              <Calendar className="mr-2 w-4 h-4" />
              <span>생성일: {new Date(project.created_at).toLocaleDateString()}</span>
            </div>
            {project.data && (
              <>
                {project.data.industry && (
                  <div className="flex items-center text-sm text-gray-600 mb-2">
                    <Tag className="mr-2 w-4 h-4" />
                    <span>업종: {project.data.industry}</span>
                  </div>
                )}
                {project.data.targetAudience && (
                  <div className="flex items-center text-sm text-gray-600 mb-2">
                    <Users className="mr-2 w-4 h-4" />
                    <span>타겟: {project.data.targetAudience}</span>
                  </div>
                )}
                {project.data.mainProduct && (
                  <div className="flex items-center text-sm text-gray-600 mb-2">
                    <Tag className="mr-2 w-4 h-4" />
                    <span>주요 제품: {project.data.mainProduct}</span>
                  </div>
                )}
              </>
            )}
            <div className="mt-auto flex items-center text-sm text-blue-500">
              <BarChart2 className="mr-1 w-4 h-4" />
              <span>자세히 보기</span>
            </div>
          </Link>
        ))}
      </div>
      {(isLoading || error) && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
          {isLoading ? (
            <LoadingSpinner />
          ) : (
            <div className="bg-white p-8 rounded-xl shadow-lg">
              <h2 className="text-2xl font-bold text-red-600 mb-4">오류 발생</h2>
              <p className="text-gray-700">{error}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Dashboard;

import React from 'react';
import { Link } from 'react-router-dom';
import { PlusCircle, Folder, BarChart2 } from 'lucide-react';

const Dashboard: React.FC = () => {
  const projects = [
    { id: 1, name: '프로젝트 A', status: '진행 중' },
    { id: 2, name: '프로젝트 B', status: '완료' },
    { id: 3, name: '프로젝트 C', status: '분석 중' },
  ];

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold mb-8">대시보드</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Link
          to="/new-project"
          className="bg-white p-6 rounded-lg shadow-md flex items-center justify-center hover:shadow-lg transition duration-300"
        >
          <PlusCircle className="mr-2 text-blue-500" />
          <span className="text-lg font-semibold">새 프로젝트 시작</span>
        </Link>
        {projects.map((project) => (
          <Link
            key={project.id}
            to={`/project/${project.id}`}
            className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition duration-300"
          >
            <div className="flex items-center mb-4">
              <Folder className="mr-2 text-blue-500" />
              <h2 className="text-xl font-semibold">{project.name}</h2>
            </div>
            <p className="text-gray-600 mb-4">상태: {project.status}</p>
            <div className="flex items-center text-sm text-blue-500">
              <BarChart2 className="mr-1" />
              <span>분석 보기</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
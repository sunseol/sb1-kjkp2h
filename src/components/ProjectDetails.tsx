import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Edit, Download, Trash2, Calendar, Users, Tag, Target, Star, DollarSign, MessageCircle, HelpCircle, Mail, Phone, Globe, X } from 'lucide-react';
import { getUser } from '../utils/auth';

interface Project {
  id: number;
  name: string;
  data: {
    companyName: string;
    industry: string;
    mainProduct: string;
    targetAudience: string;
    customerInterests: string;
    productFeatures: string;
    uniqueSellingPoints: string;
    priceInfo: string;
    callToAction: string;
    marketingGoal: string;
    brandSlogan: string;
    customerReviews: string;
    faqItems: string;
    email: string;
    phone: string;
    socialMedia: string;
  };
  html_content: string;
  created_at: string;
}

const ProjectDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [project, setProject] = useState<Project | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProject = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/projects/${id}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log('Fetched project data:', data);
        if (data.success && data.project) {
          setProject(data.project);
        } else {
          setError(data.message || '프로젝트를 불러오는데 실패했습니다.');
        }
      } catch (error) {
        console.error('프로젝트 불러오기 중 오류 발생:', error);
        setError('프로젝트를 불러오는 중 오류가 발생했습니다.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProject();
  }, [id]);

  const handleDeleteProject = async () => {
    if (!project) return;

    const confirmDelete = window.confirm('정말로 이 프로젝트를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.');
    if (!confirmDelete) return;

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/projects/${project.id}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (data.success) {
        alert('프로젝트가 성공적으로 삭제되었습니다.');
        navigate('/dashboard');
      } else {
        setError(data.message || '프로젝트 삭제에 실패했습니다.');
      }
    } catch (error) {
      console.error('프로젝트 삭제 중 오류 발생:', error);
      setError('프로젝트 삭제 중 오류가 발생했습니다.');
    }
  };

  const handleDeleteClick = () => {
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!project) return;

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/projects/${project.id}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (data.success) {
        setShowDeleteModal(false);
        navigate('/dashboard');
      } else {
        setError(data.message || '프로젝트 삭제에 실패했습니다.');
      }
    } catch (error) {
      console.error('프로젝트 삭제 중 오류 발생:', error);
      setError('프로젝트 삭제 중 오류가 발생했습니다.');
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteModal(false);
  };

  if (isLoading) {
    return <div className="text-center mt-8">로딩 중...</div>;
  }

  if (error) {
    return (
      <div className="text-red-500 text-center mt-8">
        {error}
        <br />
        <button
          onClick={() => navigate('/dashboard')}
          className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          대시보드로 돌아가기
        </button>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="text-center mt-8">
        프로젝트를 찾을 수 없습니다.
        <br />
        <button
          onClick={() => navigate('/dashboard')}
          className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          대시보드로 돌아가기
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
        <div className="p-8">
          <div className="flex items-center justify-between mb-6">
            <Link to="/dashboard" className="text-blue-500 hover:text-blue-700 flex items-center">
              <ArrowLeft className="mr-2" /> 대시보드로 돌아가기
            </Link>
            <div className="flex space-x-2">
              <button className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
                <Edit size={20} />
              </button>
              <button className="bg-green-500 text-white p-2 rounded hover:bg-green-600">
                <Download size={20} />
              </button>
              <button 
                className="bg-red-500 text-white p-2 rounded hover:bg-red-600"
                onClick={handleDeleteClick}
              >
                <Trash2 size={20} />
              </button>
            </div>
          </div>
          <h1 className="text-3xl font-bold mb-4">{project.name}</h1>
          <p className="text-gray-600 mb-6 flex items-center">
            <Calendar className="mr-2" size={18} />
            생성일: {new Date(project.created_at).toLocaleString()}
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <InfoCard icon={<Tag />} title="업종" content={project.data.industry} />
            <InfoCard icon={<Star />} title="주요 제품/서비스" content={project.data.mainProduct} />
            <InfoCard icon={<Users />} title="타겟 고객" content={project.data.targetAudience} />
            <InfoCard icon={<Target />} title="고객 관심사" content={project.data.customerInterests} />
            <InfoCard icon={<Star />} title="제품 특징" content={project.data.productFeatures} />
            <InfoCard icon={<DollarSign />} title="가격 정보" content={project.data.priceInfo} />
            <InfoCard icon={<MessageCircle />} title="브랜드 슬로건" content={project.data.brandSlogan} />
            <InfoCard icon={<HelpCircle />} title="FAQ" content={project.data.faqItems} />
          </div>

          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">연락처 정보</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <InfoCard icon={<Mail />} title="이메일" content={project.data.email} />
              <InfoCard icon={<Phone />} title="전화번호" content={project.data.phone} />
              <InfoCard icon={<Globe />} title="소셜 미디어" content={project.data.socialMedia} />
            </div>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-4">생성된 HTML</h2>
            <div className="border border-gray-300 rounded-lg overflow-hidden">
              <iframe
                srcDoc={project.html_content}
                title="Generated Webpage"
                className="w-full h-96"
                style={{ border: 'none' }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* 삭제 확인 모달 */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full">
            <h3 className="text-2xl font-bold mb-4">프로젝트 삭제</h3>
            <p className="mb-6">정말로 이 프로젝트를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.</p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={handleDeleteCancel}
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 transition duration-200"
              >
                취소
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition duration-200"
              >
                삭제
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const InfoCard: React.FC<{ icon: React.ReactNode; title: string; content: string }> = ({ icon, title, content }) => (
  <div className="bg-gray-50 p-4 rounded-lg">
    <div className="flex items-center mb-2">
      {icon}
      <h3 className="ml-2 font-semibold">{title}</h3>
    </div>
    <p className="text-gray-700">{content}</p>
  </div>
);

export default ProjectDetails;

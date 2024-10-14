import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Zap } from 'lucide-react';

const Home: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex flex-col justify-center items-center text-white p-4">
      <h1 className="text-5xl font-bold mb-6">LLM 랜딩페이지 생성기</h1>
      <p className="text-xl mb-8 text-center max-w-2xl">
        AI 기반 마케팅 컨설팅과 결합된 랜딩페이지 제작 서비스로 당신의 비즈니스를 한 단계 업그레이드하세요.
      </p>
      <div className="flex space-x-4">
        <Link
          to="/auth"
          className="bg-white text-blue-600 px-6 py-3 rounded-full font-semibold flex items-center hover:bg-blue-100 transition duration-300"
        >
          시작하기 <ArrowRight className="ml-2" />
        </Link>
        <Link
          to="/details"
          className="bg-transparent border-2 border-white px-6 py-3 rounded-full font-semibold flex items-center hover:bg-white hover:text-blue-600 transition duration-300"
        >
          더 알아보기 <Zap className="ml-2" />
        </Link>
      </div>
    </div>
  );
};

export default Home;

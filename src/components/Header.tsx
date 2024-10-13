import React from 'react';
import { Link } from 'react-router-dom';

const Header: React.FC = () => {
  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-6 py-3 flex justify-between items-center">
        <Link to="/" className="text-gray-800 text-xl font-bold">
          <svg width="80" height="40" viewBox="0 0 80 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M10 30L20 10H30L40 30M40 30L50 10H60L70 30" stroke="#4A5568" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M35 20H45" stroke="#4A5568" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </Link>
        <nav>
          <ul className="flex items-center space-x-6">
            <li><Link to="/dashboard" className="text-gray-600 hover:text-gray-900">대시보드</Link></li>
            <li><Link to="/new-project" className="text-gray-600 hover:text-gray-900">새 프로젝트</Link></li>
            <li><Link to="/settings" className="text-gray-600 hover:text-gray-900">설정</Link></li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;

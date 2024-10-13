import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Auth: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // 컴포넌트가 마운트되면 바로 대시보드로 리다이렉트
    navigate('/dashboard');
  }, [navigate]);

  return null; // 아무것도 렌더링하지 않음
};

export default Auth;

import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { isAuthenticated } from './utils/auth';
import Header from './components/Header';
import Home from './components/Home';
import Auth from './components/Auth';
import Dashboard from './components/Dashboard';
import NewProject from './components/NewProject';
import ProjectDetails from './components/ProjectDetails';
import Analysis from './components/Analysis';
import Recommendations from './components/Recommendations';
import Preview from './components/Preview';
import ContentEditor from './components/ContentEditor';
import Review from './components/Review';
import Analytics from './components/Analytics';
import Optimization from './components/Optimization';
import Settings from './components/Settings';
import Help from './components/Help';
import UserInfoForm from './components/UserInfoForm';
import FinalResult from './components/FinalResult';
import Signup from './components/Signup';

const PrivateRoute: React.FC<{ element: React.ReactElement }> = ({ element }) => {
  return isAuthenticated() ? element : <Navigate to="/auth" replace />;
};

const API_URL = import.meta.env.VITE_API_URL || '';

async function testLogin(username: string, password: string) {
  try {
    const response = await fetch('/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });

    const data = await response.json();
    console.log('로그인 응답:', data);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}, message: ${data.message}`);
    }

    return data;
  } catch (error) {
    console.error('로그인 오류:', error);
    throw error;
  }
}

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow bg-gray-100">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/dashboard" element={<PrivateRoute element={<Dashboard />} />} />
            <Route path="/new-project" element={<PrivateRoute element={<NewProject />} />} />
            <Route path="/project/:id" element={<PrivateRoute element={<ProjectDetails />} />} />
            <Route path="/project/:id/analysis" element={<PrivateRoute element={<Analysis />} />} />
            <Route path="/project/:id/recommendations" element={<PrivateRoute element={<Recommendations />} />} />
            <Route path="/project/:id/preview" element={<PrivateRoute element={<Preview />} />} />
            <Route path="/project/:id/editor" element={<PrivateRoute element={<ContentEditor />} />} />
            <Route path="/project/:id/review" element={<PrivateRoute element={<Review />} />} />
            <Route path="/project/:id/analytics" element={<PrivateRoute element={<Analytics />} />} />
            <Route path="/project/:id/optimization" element={<PrivateRoute element={<Optimization />} />} />
            <Route path="/settings" element={<PrivateRoute element={<Settings />} />} />
            <Route path="/help" element={<PrivateRoute element={<Help />} />} />
            <Route path="/user-info" element={<UserInfoForm />} />
            <Route path="/final-result" element={<PrivateRoute element={<FinalResult />} />} />
            <Route path="/signup" element={<Signup />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;

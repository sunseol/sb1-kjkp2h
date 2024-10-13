import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import Home from './components/Home';
import Dashboard from './components/Dashboard';
import NewProject from './components/NewProject';
import ProjectDetails from './components/ProjectDetails';
import Settings from './components/Settings';
import FinalResult from './components/FinalResult';

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow bg-gray-100">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/new-project" element={<NewProject />} />
            <Route path="/project/:id" element={<ProjectDetails />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/final-result" element={<FinalResult />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;

import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import Home from './components/Home';
import Dashboard from './components/Dashboard';
import NewProject from './components/NewProject';
import ProjectDetails from './components/ProjectDetails';
import Settings from './components/Settings';
import FinalResult from './components/FinalResult';
import Details from './components/Details';
import Auth from './components/Auth';
import Assistant from './components/Assistant';

function App() {
  const [currentStep, setCurrentStep] = useState(0);

  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow bg-gray-100">
          <Routes>
            <Route path="/" element={<Home setCurrentStep={setCurrentStep} />} />
            <Route path="/dashboard" element={<Dashboard setCurrentStep={setCurrentStep} />} />
            <Route path="/new-project" element={<NewProject setCurrentStep={setCurrentStep} />} />
            <Route path="/project/:id" element={<ProjectDetails setCurrentStep={setCurrentStep} />} />
            <Route path="/settings" element={<Settings setCurrentStep={setCurrentStep} />} />
            <Route path="/final-result" element={<FinalResult setCurrentStep={setCurrentStep} />} />
            <Route path="/details" element={<Details setCurrentStep={setCurrentStep} />} />
            <Route path="/auth" element={<Auth setCurrentStep={setCurrentStep} />} />
          </Routes>
        </main>
        <Assistant currentStep={currentStep} setEditMode={() => {}} />
      </div>
    </Router>
  );
}

export default App;

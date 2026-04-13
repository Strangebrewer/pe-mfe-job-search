import React from 'react';
import { Routes, Route } from 'react-router-dom';
import './index.css';
import JobsList from './components/jobs/JobsList';
import RecruitersList from './components/recruiters/RecruitersList';

function NotFound() {
  return <div>Not found</div>;
}

const App: React.FC = () => {
  return (
    <Routes>
      <Route path="jobs" element={<JobsList />} />
      <Route path="recruiters" element={<RecruitersList />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
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
      <Route
        index
        element={
          <div className="tw:flex tw:flex-wrap">
            <JobsList />
            <RecruitersList />
          </div>
        }
      />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default App;

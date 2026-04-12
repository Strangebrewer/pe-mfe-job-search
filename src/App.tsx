import React from 'react';
import { Routes, Route } from 'react-router-dom';
import './index.css';

function ItsWorking() {
  return <div><h1>Job Serch basic page</h1></div>;
}

function Jobs() {
  return <div><h1>Jobs</h1></div>;
}

function Recruiters() {
  return <div><h1>Recruiters</h1></div>;
}

function NotFound() {
  return <div>Not found</div>;
}

const App: React.FC = () => {
  return (
    <Routes>
      <Route index element={<ItsWorking />} />
      <Route path="jobs" element={<Jobs />} />
      <Route path="recruiters" element={<Recruiters />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;

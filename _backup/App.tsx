import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css'; // Your renamed and moved stylesheet

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import GalleryPage from './pages/GalleryPage';
import MusicPage from './pages/MusicPage';
import NebusisPage from './pages/case-studies/NebusisPage';
// Import other case study pages here

function App() {
  return (
    <Router basename="/roseanfrankale.github.io">
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/gallery" element={<GalleryPage />} />
          <Route path="/music" element={<MusicPage />} />
          <Route path="/nebusis" element={<NebusisPage />} />
          {/* Add routes for other case studies here */}
          {/* e.g., <Route path="/qurado" element={<QuradoPage />} /> */}
        </Routes>
      </main>
      <Footer />
    </Router>
  );
}

export default App;
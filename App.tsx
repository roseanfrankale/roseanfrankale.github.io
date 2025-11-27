
import React, { Suspense, lazy } from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import { ThemeProvider } from './context/ThemeContext';
import { LightboxProvider } from './context/LightboxContext';
import Lightbox from './components/Lightbox';

// Lazy load pages
const Home = lazy(() => import('./pages/Home'));
const About = lazy(() => import('./pages/About'));
const Gallery = lazy(() => import('./pages/Gallery'));
const Music = lazy(() => import('./pages/Music'));
const ProjectDetail = lazy(() => import('./pages/ProjectDetail'));
const NebusisPage = lazy(() => import('./pages/case-studies/NebusisPage.tsx'));

const LoadingFallback = () => (
  <div className="h-screen w-full flex items-center justify-center bg-bg">
    <div className="w-16 h-16 border-4 border-gray-200 border-t-accent rounded-full animate-spin"></div>
  </div>
);

function App() {
  return (
    <ThemeProvider>
      <LightboxProvider>
        <HashRouter>
          <Layout>
            <Suspense fallback={<LoadingFallback />}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/gallery" element={<Gallery />} />
                <Route path="/music" element={<Music />} />
                <Route path="/project/:projectId" element={<ProjectDetail />} />
                <Route path="/project/nebusis" element={<NebusisPage />} />
              </Routes>
            </Suspense>
            <Lightbox />
          </Layout>
        </HashRouter>
      </LightboxProvider>
    </ThemeProvider>
  );
}

export default App;


import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import GeminiChat from './GeminiChat';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen font-sans bg-bg text-text transition-colors duration-300">
      <Navbar />
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
      <GeminiChat />
    </div>
  );
};

export default Layout;

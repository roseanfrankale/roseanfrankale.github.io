
import React from 'react';
import { Linkedin, Github, Dribbble, Mail } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-footer-bg text-text py-12 border-t border-gray-200 dark:border-gray-800">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div className="flex flex-col items-start">
            <img src="https://roseanfrankale.github.io/assets/img/rjfa_logo_grey_svg.svg" alt="RJFA" className="h-10 w-auto mb-4 grayscale opacity-80" />
            <p className="text-text-muted text-sm">
              &copy; {new Date().getFullYear()} Rosean Frank-Alexander.<br/>All rights reserved.
            </p>
          </div>

          {/* Navigation */}
          <div>
             <h3 className="text-lg font-serif font-bold mb-4 text-text">Navigation</h3>
             <ul className="space-y-2 text-text-muted text-sm">
               <li><a href="/" className="hover:text-accent transition-colors">Home</a></li>
               <li><a href="/#/about" className="hover:text-accent transition-colors">About Me</a></li>
               <li><a href="/#/gallery" className="hover:text-accent transition-colors">Gallery</a></li>
               <li><a href="mailto:rosean.frankalexander@gmail.com" className="hover:text-accent transition-colors flex items-center gap-2"><Mail size={14}/> Contact</a></li>
             </ul>
          </div>

          {/* Socials */}
          <div>
            <h3 className="text-lg font-serif font-bold mb-4 text-text">Connect</h3>
            <div className="flex space-x-4">
              <a href="https://www.linkedin.com/in/rfrankale/" target="_blank" rel="noreferrer" className="text-text-muted hover:text-accent transition-colors"><Linkedin size={24} /></a>
              <a href="https://github.com/roseanfrankale" target="_blank" rel="noreferrer" className="text-text-muted hover:text-accent transition-colors"><Github size={24} /></a>
              <a href="https://dribbble.com/rjfa" target="_blank" rel="noreferrer" className="text-text-muted hover:text-accent transition-colors"><Dribbble size={24} /></a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

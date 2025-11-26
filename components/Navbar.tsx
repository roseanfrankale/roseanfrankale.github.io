
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Linkedin, Github, Dribbble, Moon, Sun } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About Me', path: '/about' },
    { name: 'Gallery', path: '/gallery' },
    { name: 'Music', path: '/music' },
  ];

  return (
    <nav 
      className={`fixed w-full z-50 transition-all duration-500 ${
        isScrolled 
          ? 'bg-[var(--navbar-bg-scrolled)] backdrop-blur-lg shadow-sm py-3' 
          : 'bg-transparent py-6'
      }`}
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex justify-between items-center">
          <Link to="/" className="flex items-center group">
             <img src="https://roseanfrankale.github.io/assets/img/rjfa_logo_grey_svg.svg" alt="RJFA" className={`h-8 w-auto transition-all duration-300 ${theme === 'dark' ? 'brightness-150' : 'brightness-50'} group-hover:opacity-80`} />
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-10">
            <div className="flex space-x-8">
                {navLinks.map((link) => (
                <Link
                    key={link.name}
                    to={link.path}
                    className={`text-xs uppercase tracking-widest font-bold transition-all hover:text-accent relative group ${location.pathname === link.path ? 'text-accent' : 'text-text'}`}
                >
                    {link.name}
                    <span className={`absolute -bottom-2 left-0 w-full h-0.5 bg-accent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ${location.pathname === link.path ? 'scale-x-100' : ''}`}></span>
                </Link>
                ))}
            </div>
            
            <div className="flex items-center space-x-5 border-l pl-8 border-gray-300 dark:border-gray-700">
                {/* Socials */}
                <a href="https://www.linkedin.com/in/rfrankale/" target="_blank" rel="noreferrer" className="text-text hover:text-accent transition-colors transform hover:-translate-y-1"><Linkedin size={16} /></a>
                <a href="https://github.com/roseanfrankale" target="_blank" rel="noreferrer" className="text-text hover:text-accent transition-colors transform hover:-translate-y-1"><Github size={16} /></a>
                <a href="https://dribbble.com/rjfa" target="_blank" rel="noreferrer" className="text-text hover:text-accent transition-colors transform hover:-translate-y-1"><Dribbble size={16} /></a>
                
                {/* Theme Toggle */}
                <button 
                  onClick={toggleTheme} 
                  className="ml-4 p-2 rounded-full bg-bg text-text hover:text-accent transition-all hover:rotate-90"
                  aria-label="Toggle theme"
                >
                  {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
                </button>
            </div>
          </div>

          {/* Mobile Toggle */}
          <div className="flex items-center gap-4 md:hidden">
             <button 
                onClick={toggleTheme} 
                className="p-2 rounded-full bg-bg text-text hover:text-accent transition-colors"
                aria-label="Toggle theme"
              >
                {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
              </button>
            <button className="text-text focus:outline-none" onClick={() => setIsOpen(!isOpen)}>
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden absolute top-full left-0 w-full bg-bg shadow-2xl py-6 px-6 flex flex-col space-y-6 border-t border-gray-100 dark:border-gray-800">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`text-sm uppercase tracking-wider font-bold block ${location.pathname === link.path ? 'text-accent' : 'text-text'}`}
              >
                {link.name}
              </Link>
            ))}
             <div className="flex items-center space-x-8 pt-6 border-t border-gray-100 dark:border-gray-800">
                <a href="https://www.linkedin.com/in/rfrankale/" target="_blank" rel="noreferrer" className="text-text hover:text-accent"><Linkedin size={20} /></a>
                <a href="https://github.com/roseanfrankale" target="_blank" rel="noreferrer" className="text-text hover:text-accent"><Github size={20} /></a>
                <a href="https://dribbble.com/rjfa" target="_blank" rel="noreferrer" className="text-text hover:text-accent"><Dribbble size={20} /></a>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;

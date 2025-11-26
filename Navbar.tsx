import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Home, User, Briefcase, Image, Mail, Moon } from 'lucide-react';

const Navbar = () => {
  const [theme, setTheme] = useState('dark');

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  return (
    <nav className="navbar navbar-expand-lg fixed-top">
      <div className="container">
        <Link className="navbar-brand fw-bold" to="/">
          <img src={`${process.env.PUBLIC_URL}/assets/img/rjfa_logo_grey_svg.svg`} width="34" height="34" alt="Rosean Frank-Alexander Logo" />
        </Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse justify-content-end" id="navbarNav">
          <ul className="navbar-nav">
            <li className="nav-item">
              <a className="nav-link" href="/#hero"><Home /> Home</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="/#about"><User /> About</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="/#work"><Briefcase /> Work</a>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/gallery"><Image /> Gallery</NavLink>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="mailto:rosean.frankalexander@gmail.com"><Mail /> Contact</a>
            </li>
          </ul>
          <button id="theme-toggle" className="ms-3" onClick={toggleTheme}>
            <Moon />
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
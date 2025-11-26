import React from 'react';
import { Link } from 'react-router-dom';
import { Home, User, Briefcase, Image, Mail, Linkedin, Github, Dribbble, Youtube, Music } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="footer p-3 pt-4">
      <div className="container">
        <div className="row align-items-center pb-4">
          <div className="col-md-4 d-flex mb-3">
            <Link to="/"><img src={`${process.env.PUBLIC_URL}/assets/img/rjfa_logo_grey_svg.svg`} width="34" height="34" alt="Rosean Frank-Alexander Logo" /></Link>
            <span className="ms-2">&copy; 2024</span>
          </div>

          <div className="col-md-4 col-sm-6">
            <h3 className="mb-2 fs-base">Navigation</h3>
            <ul className="list-unstyled">
              <li><a className="nav-link" href="/#hero"><Home /> Home</a></li>
              <li><a className="nav-link" href="/#about"><User /> About Me</a></li>
              <li><a className="nav-link" href="/#work"><Briefcase /> Featured Work</a></li>
              <li><Link className="nav-link" to="/gallery"><Image /> Gallery</Link></li>
              <li><a className="nav-link" href="mailto:rosean.frankalexander@gmail.com"><Mail /> Contact</a></li>
            </ul>
          </div>

          <div className="col-md-4 col-sm-6">
            <h3 className="mb-2 fs-base">Socials</h3>
            <ul className="list-unstyled d-flex gap-3">
              <li><a href="https://www.linkedin.com/in/rfrankale/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"><Linkedin /></a></li>
              <li><a href="https://github.com/roseanfrankale/" target="_blank" rel="noopener noreferrer" aria-label="GitHub"><Github /></a></li>
              <li><a href="https://dribbble.com/rjfa/" target="_blank" rel="noopener noreferrer" aria-label="Dribbble"><Dribbble /></a></li>
              <li><a href="https://www.youtube.com/playlist?list=PLq8eop32VW4_lzzDk9UZI9XWkdyXlaMcV" target="_blank" rel="noopener noreferrer" aria-label="YouTube"><Youtube /></a></li>
              <li><Link to="/music" aria-label="Music"><Music /></Link></li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Eye, MousePointerClick } from 'lucide-react';
import { projects } from '../data/portfolioData';
import { motion } from 'framer-motion';

const Home: React.FC = () => {
  const featuredProjects = projects.slice(0, 4);

  return (
    <div className="w-full overflow-hidden bg-bg text-text transition-colors duration-300">
      {/* Hero Section */}
      <section className="relative h-screen min-h-[600px] flex items-center justify-center overflow-hidden">
        {/* Animated Gradient Background */}
        <div className="animated-bg"></div>
        
        <div className="container mx-auto px-4 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            <h1 className="hero-title text-text mb-6">
              Hello, I'm <span className="text-accent inline-block">Ro</span><span className="relative inline-block">Sean
                <span className="absolute -bottom-2 left-0 w-full h-3 bg-accent opacity-80 -rotate-1"></span>
              </span>
            </h1>
            
            <p className="hero-subtext mb-10 max-w-2xl mx-auto font-sans">
              Front-End Engineer • Designer • Musician
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center gap-6 mt-8">
                <a href="#work" className="px-8 py-3 rounded-full text-xs md:text-sm font-bold uppercase tracking-widest transition-all duration-300 border bg-accent text-white border-accent shadow-lg hover:shadow-accent/25 hover:scale-105">
                    View My Work
                </a>
                 <Link to="/about" className="px-8 py-3 rounded-full text-xs md:text-sm font-bold uppercase tracking-widest transition-all duration-300 border bg-transparent text-text-muted border-gray-200 dark:border-gray-800 hover:border-accent hover:text-accent hover:shadow-lg">
                    About Me
                </Link>
            </div>
          </motion.div>
        </div>
        
        {/* Scroll Indicator */}
        <motion.div 
            className="absolute bottom-12 left-1/2 transform -translate-x-1/2"
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
        >
            <a href="#work" className="flex flex-col items-center text-text-muted hover:text-accent transition-colors group">
                <span className="text-[10px] uppercase tracking-[0.3em] mb-3 group-hover:tracking-[0.4em] transition-all">Scroll</span>
                <div className="w-[1px] h-12 bg-gradient-to-b from-text-muted to-transparent"></div>
            </a>
        </motion.div>
      </section>

      {/* Featured Work */}
      <section id="work" className="py-32 bg-section-bg relative">
        <div className="container mx-auto px-4 md:px-6">
          <div className="mb-24 text-center md:text-left">
             <h2 className="section-title text-text leading-none">Featured</h2>
             <h2 className="section-title text-accent ml-0 md:ml-20">Work</h2>
          </div>

          <div className="space-y-40">
            {featuredProjects.map((project, index) => (
              <motion.div 
                key={project.id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-10%" }}
                transition={{ duration: 0.7 }}
                className={`flex flex-col ${index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} gap-16 items-center`}
              >
                {/* Image Content */}
                <div className="flex-1 w-full group perspective-1000">
                    <Link to={`/project/${project.id}`} className="block relative rounded-2xl overflow-hidden shadow-2xl hover:shadow-accent/20 transition-all duration-500 transform group-hover:rotate-y-2">
                        <div className="aspect-[16/10] bg-gray-200 dark:bg-gray-800 relative overflow-hidden">
                           <img 
                              src={project.heroImage} 
                              alt={project.title} 
                              className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-105" 
                          />
                          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-sm">
                              <span className="text-white font-bold text-lg uppercase tracking-widest border-2 border-white px-6 py-3 rounded-full hover:bg-white hover:text-black transition-colors">
                                View Case Study
                              </span>
                          </div>
                        </div>
                    </Link>
                </div>

                {/* Text Content */}
                <div className="flex-1 space-y-8">
                  <div>
                    <div className="flex items-center gap-3 mb-4">
                        <span className="text-accent font-mono text-sm">0{index + 1}</span>
                        <div className="h-[1px] w-12 bg-accent/50"></div>
                    </div>
                    <h3 className="text-5xl font-bold text-text mb-2">{project.title}</h3>
                    <p className="text-xl text-text-muted font-light italic">{project.subtitle}</p>
                  </div>
                  
                  <p className="text-text-muted text-lg leading-relaxed max-w-xl">{project.description}</p>
                  
                  <div className="flex flex-wrap gap-2">
                    {project.roles.slice(0, 3).map(role => (
                        <span key={role} className="text-xs font-bold uppercase tracking-wider text-text/60 border border-text/10 px-4 py-2 rounded-full hover:border-accent/50 hover:text-accent transition-colors cursor-default">{role}</span>
                    ))}
                  </div>

                  <div className="pt-6">
                    <Link to={`/project/${project.id}`} className="group inline-flex items-center text-text font-bold uppercase tracking-widest text-sm border-b-2 border-accent pb-1 hover:text-accent transition-colors">
                      View Project 
                      <ArrowRight size={16} className="ml-2 transform group-hover:translate-x-2 transition-transform" />
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;

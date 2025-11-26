
import React, { useState } from 'react';
import { bioText, experience } from '../data/portfolioData';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUpRight, Download, ZoomIn } from 'lucide-react';
import { useLightbox } from '../context/LightboxContext';

const About: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'story' | 'skills' | 'experience'>('story');
  const { openLightbox } = useLightbox();

  const tabs = [
    { id: 'story', label: 'My Story' },
    { id: 'skills', label: 'Skills' },
    { id: 'experience', label: 'Experience' },
  ];

  const profileImage = "https://roseanfrankale.github.io/assets/img/sean_pro_foto_dl_1%20.jpeg";

  return (
    <div className="pt-32 pb-20 min-h-screen bg-bg text-text transition-colors duration-300 overflow-hidden">
      <div className="container mx-auto px-4 md:px-6">
        
        {/* Header Section - Updated to Big Title Style */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center mb-20"
        >
          <h1 className="text-6xl md:text-9xl font-black mb-6 text-text uppercase tracking-tighter leading-none">
            About <span className="text-transparent bg-clip-text bg-gradient-to-r from-text to-text-muted">Me</span>
          </h1>
        </motion.div>

        {/* Tabs Navigation - Preserved Structure, Updated Styling */}
        <div className="flex justify-center mb-24">
          <div className="flex flex-wrap justify-center gap-4">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-8 py-3 rounded-full text-xs md:text-sm font-bold uppercase tracking-widest transition-all duration-300 border ${
                  activeTab === tab.id
                    ? 'bg-accent text-white border-accent shadow-lg shadow-accent/25 scale-105'
                    : 'bg-transparent text-text-muted border-gray-200 dark:border-gray-800 hover:border-accent hover:text-accent'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="max-w-7xl mx-auto">
          <AnimatePresence mode='wait'>
            
            {/* STORY TAB */}
            {activeTab === 'story' && (
              <motion.div
                key="story"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
                className="grid md:grid-cols-12 gap-16 items-start"
              >
                {/* Profile Image Column */}
                <div className="md:col-span-4 order-1 flex justify-center">
                    <div 
                        className="relative group cursor-zoom-in w-64 h-64 md:w-80 md:h-80"
                        onClick={() => openLightbox([profileImage])}
                    >
                        {/* Blurred Gradient Circle Backdrop */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-gradient-to-br from-accent/40 to-purple-500/40 rounded-full blur-3xl opacity-70 animate-pulse"></div>
                        
                        <div className="relative overflow-hidden rounded-full w-full h-full border-4 border-bg shadow-2xl">
                             <img 
                                src={profileImage} 
                                alt="Rosean Frank-Alexander" 
                                className="w-full h-full object-cover filter grayscale group-hover:grayscale-0 transition-all duration-700"
                            />
                             <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                <ZoomIn className="text-white" size={32} />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Content Column */}
                <div className="md:col-span-8 order-2">
                    <h2 className="text-3xl font-bold mb-8 text-accent uppercase tracking-wide">The Journey</h2>
                    <div className="prose max-w-none text-text-muted leading-relaxed text-lg space-y-6 font-light">
                        {bioText.split('\n\n').map((paragraph, i) => (
                            <p key={i} className="whitespace-pre-line">{paragraph}</p>
                        ))}
                    </div>
                    <div className="mt-12 flex flex-wrap gap-6">
                        <a href="https://roseanfrankale.github.io/music.html" target="_blank" rel="noreferrer" className="group inline-flex items-center px-8 py-4 bg-text text-bg rounded-full uppercase tracking-widest text-xs font-bold hover:scale-105 transition-transform duration-300">
                            Musical Portfolio <ArrowUpRight size={16} className="ml-2" />
                        </a>
                        {/* Placeholder for Resume link if needed */}
                        <button className="group inline-flex items-center px-8 py-4 border border-text/20 text-text rounded-full uppercase tracking-widest text-xs font-bold hover:border-accent hover:text-accent transition-colors duration-300">
                            Download CV <Download size={16} className="ml-2 group-hover:translate-y-1 transition-transform" />
                        </button>
                    </div>
                </div>
              </motion.div>
            )}

            {/* SKILLS TAB */}
            {activeTab === 'skills' && (
              <motion.div
                key="skills"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
              >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Web Dev */}
                    <div className="bg-card-bg p-10 rounded-3xl border border-gray-200 dark:border-gray-800 hover:border-accent/50 transition-colors duration-300 group">
                        <h3 className="text-xl font-black uppercase tracking-widest mb-8 text-text border-b border-gray-200 dark:border-gray-800 pb-4 group-hover:border-accent transition-colors">Development</h3>
                        <div className="flex flex-wrap gap-3">
                            {['HTML5', 'CSS3', 'JavaScript', 'jQuery', 'MySQL', 'Node.js', 'React', 'GitHub', 'Vue', 'Tailwind'].map(skill => (
                                <span key={skill} className="px-4 py-2 border border-text/10 text-text-muted text-xs font-bold uppercase tracking-wide rounded-full hover:bg-accent hover:text-white hover:border-accent transition-all cursor-default">{skill}</span>
                            ))}
                        </div>
                    </div>

                    {/* Design */}
                    <div className="bg-card-bg p-10 rounded-3xl border border-gray-200 dark:border-gray-800 hover:border-accent/50 transition-colors duration-300 group">
                        <h3 className="text-xl font-black uppercase tracking-widest mb-8 text-text border-b border-gray-200 dark:border-gray-800 pb-4 group-hover:border-accent transition-colors">Design</h3>
                        <div className="flex flex-wrap gap-3">
                            {['Figma', 'Sketch', 'Miro', 'Framer', 'Photoshop', 'InDesign', 'Adobe XD', 'Illustrator', 'Canva'].map(skill => (
                                <span key={skill} className="px-4 py-2 border border-text/10 text-text-muted text-xs font-bold uppercase tracking-wide rounded-full hover:bg-accent hover:text-white hover:border-accent transition-all cursor-default">{skill}</span>
                            ))}
                        </div>
                    </div>

                     {/* Tools */}
                     <div className="bg-card-bg p-10 rounded-3xl border border-gray-200 dark:border-gray-800 hover:border-accent/50 transition-colors duration-300 group">
                        <h3 className="text-xl font-black uppercase tracking-widest mb-8 text-text border-b border-gray-200 dark:border-gray-800 pb-4 group-hover:border-accent transition-colors">Productivity</h3>
                        <div className="flex flex-wrap gap-3">
                            {['GSuite', 'HubSpot', 'Salesforce', 'Slack', 'Trello', 'Mailchimp', 'Jira', 'Asana', 'Teams', 'Confluence', 'Notion'].map(skill => (
                                <span key={skill} className="px-4 py-2 border border-text/10 text-text-muted text-xs font-bold uppercase tracking-wide rounded-full hover:bg-accent hover:text-white hover:border-accent transition-all cursor-default">{skill}</span>
                            ))}
                        </div>
                    </div>
                </div>
              </motion.div>
            )}

            {/* EXPERIENCE TAB */}
            {activeTab === 'experience' && (
              <motion.div
                key="experience"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
              >
                <div className="space-y-6">
                    {experience.map((job, idx) => (
                        <div key={idx} className="group relative bg-card-bg p-8 md:p-10 rounded-3xl border border-gray-200 dark:border-gray-800 hover:border-accent/30 transition-all duration-300">
                            <div className="grid md:grid-cols-12 gap-6 md:gap-12 items-start">
                                <div className="md:col-span-4">
                                    <h3 className="font-black text-2xl text-text mb-2 group-hover:text-accent transition-colors">{job.company}</h3>
                                    <p className="text-text-muted text-sm font-mono uppercase tracking-wider mb-1">{job.date}</p>
                                    <p className="text-text-muted/60 text-xs font-mono uppercase tracking-wider">{job.location}</p>
                                </div>
                                <div className="md:col-span-8">
                                    <div className="flex flex-col h-full justify-center">
                                        <p className="text-accent text-sm font-bold uppercase tracking-widest mb-4">{job.role}</p>
                                        <p className="text-text-muted text-lg font-light leading-relaxed">{job.description}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default About;

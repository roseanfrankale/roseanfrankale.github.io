
import React, { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { projects } from '../data/portfolioData';
import { ArrowLeft, ExternalLink, ZoomIn, AlertTriangle, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { useLightbox } from '../context/LightboxContext';

const ProjectDetail: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const project = projects.find(p => p.id === projectId);
  const { openLightbox } = useLightbox();
  const imgRef = useRef<HTMLImageElement>(null);

  // Initialize with default theme colors to prevent flicker
  const [gradientColors, setGradientColors] = useState({
    color1: 'var(--text)',
    color2: 'var(--text-muted)'
  });

  // Dynamic style object applied ONLY to the specific labels requested
  const labelGradientStyle: React.CSSProperties = {
    backgroundImage: `linear-gradient(135deg, ${gradientColors.color1}, ${gradientColors.color2})`,
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    color: 'transparent',
    display: 'inline-block',
    transition: 'background-image 1s ease-in-out'
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [projectId]);

  const handleImageLoad = () => {
    if (!imgRef.current || !window.ColorThief) return;

    const colorThief = new window.ColorThief();
    if (imgRef.current.complete) {
       extractColors(colorThief, imgRef.current);
    } else {
       imgRef.current.addEventListener('load', () => extractColors(colorThief, imgRef.current!));
    }
  };

  const extractColors = (colorThief: any, img: HTMLImageElement) => {
      try {
        const palette = colorThief.getPalette(img, 2);
        if (palette && palette.length >= 2) {
            const color1 = `rgb(${palette[0].join(',')})`;
            const color2 = `rgb(${palette[1].join(',')})`;
            setGradientColors({ color1, color2 });
        }
      } catch (e) {
          console.warn('Color Thief failed to extract colors', e);
      }
  };

  if (!project) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-bg text-text">
        <h2 className="text-2xl font-bold mb-4">Project Not Found</h2>
        <button onClick={() => navigate('/')} className="text-accent hover:underline">Go Home</button>
      </div>
    );
  }

  const handleGalleryClick = (index: number) => {
    openLightbox(project.images, index);
  };

  return (
    <div className="pt-32 pb-20 min-h-screen bg-bg text-text transition-colors duration-300">
      {/* Navigation Back */}
      <div className="container mx-auto px-4 mb-12">
        <button 
            onClick={() => navigate(-1)} 
            className="flex items-center text-text-muted hover:text-accent transition-colors font-bold uppercase text-xs tracking-widest"
        >
            <ArrowLeft size={16} className="mr-2" /> Back to Portfolio
        </button>
      </div>

      {/* 1. Hero Section */}
      <div className="container mx-auto px-4 mb-24">
         <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-5xl mx-auto"
         >
            <h1 className="text-6xl md:text-8xl font-black mb-6 tracking-tighter uppercase leading-none text-text">
                {project.title}
            </h1>
            
            <p className="text-xl md:text-2xl text-text-muted font-light mb-12 max-w-3xl mx-auto">{project.subtitle}</p>
            
            {/* Hero Image - Color extraction target */}
            <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-gray-200 dark:border-gray-800 mb-12 group">
                <div className="absolute inset-0 bg-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <img 
                    ref={imgRef}
                    src={project.heroImage} 
                    alt={project.title} 
                    className="w-full max-h-[700px] object-cover object-top transform transition-transform duration-1000 group-hover:scale-105"
                    crossOrigin="anonymous"
                    onLoad={handleImageLoad}
                />
            </div>

            {/* Key Meta Data Grid - Gradients applied here */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-left border-t border-gray-200 dark:border-gray-800 pt-8">
                <div>
                    <h3 className="text-xs font-black uppercase tracking-widest mb-2" style={labelGradientStyle}>Role</h3>
                    <p className="text-sm font-medium">{project.roles[0]}</p>
                </div>
                <div>
                    <h3 className="text-xs font-black uppercase tracking-widest mb-2" style={labelGradientStyle}>Timeline</h3>
                    <p className="text-sm font-medium">{project.date}</p>
                </div>
                <div>
                    <h3 className="text-xs font-black uppercase tracking-widest mb-2" style={labelGradientStyle}>Tools</h3>
                    <p className="text-sm font-medium truncate">{project.tools.slice(0,2).join(', ')}</p>
                </div>
                 <div>
                     <h3 className="text-xs font-black uppercase tracking-widest mb-2" style={labelGradientStyle}>Link</h3>
                    {project.link ? (
                        <a href={project.link} target="_blank" rel="noreferrer" className="text-sm font-bold hover:text-accent inline-flex items-center">
                            Live Site <ExternalLink size={12} className="ml-1" />
                        </a>
                    ) : <span className="text-sm text-text-muted">N/A</span>}
                </div>
            </div>
         </motion.div>
      </div>

      {/* 2. Overview & Context */}
      <section className="container mx-auto px-4 mb-32">
        <div className="grid md:grid-cols-12 gap-12">
            <div className="md:col-span-4">
                <div className="sticky top-32">
                    <h2 className="text-4xl font-bold mb-6 text-text">Overview</h2>
                    <div className="h-1 w-20 bg-accent mb-6"></div>
                </div>
            </div>
            <div className="md:col-span-8">
                <p className="text-lg md:text-xl text-text-muted font-light leading-relaxed whitespace-pre-line mb-8">
                    {project.overview || project.description}
                </p>
                
                {/* Problem / Solution Grid */}
                {(project.problem || project.solution) && (
                    <div className="grid md:grid-cols-2 gap-8 mt-12">
                        <div className="bg-card-bg p-8 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm">
                             <div className="w-12 h-12 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mb-6">
                                <AlertTriangle className="text-accent" size={24} />
                             </div>
                             <h3 className="text-xl font-bold mb-4 text-text">The Problem</h3>
                             <p className="text-text-muted leading-relaxed">{project.problem}</p>
                        </div>
                        <div className="bg-card-bg p-8 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm">
                             <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mb-6">
                                <CheckCircle className="text-green-600 dark:text-green-400" size={24} />
                             </div>
                             <h3 className="text-xl font-bold mb-4 text-text">The Solution</h3>
                             <p className="text-text-muted leading-relaxed">{project.solution}</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
      </section>

      {/* 3. Process Section */}
      {project.process && (
        <section className="bg-section-bg py-32 mb-32">
            <div className="container mx-auto px-4">
                <div className="text-center mb-20">
                    <h2 className="text-4xl md:text-5xl font-black mb-4 uppercase tracking-tight text-text">The Process</h2>
                    <p className="text-text-muted">From concept to execution</p>
                </div>

                <div className="space-y-32">
                    {project.process.map((step, idx) => (
                        <motion.div 
                            key={idx}
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-10%" }}
                            transition={{ duration: 0.6 }}
                            className={`flex flex-col ${idx % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} gap-16 items-center`}
                        >
                            {/* Image */}
                            <div className="flex-1 w-full">
                                {step.image && (
                                    <div className="relative rounded-2xl overflow-hidden shadow-xl border border-gray-200 dark:border-gray-700 group">
                                        <img src={step.image} alt={step.title} className="w-full h-auto transform transition-transform duration-700 group-hover:scale-105" />
                                    </div>
                                )}
                            </div>
                            
                            {/* Text */}
                            <div className="flex-1">
                                <div className="flex items-center gap-4 mb-6">
                                    <span className="text-6xl font-black text-gray-200 dark:text-gray-800">{String(idx + 1).padStart(2, '0')}</span>
                                    <h3 className="text-2xl font-bold text-text">{step.title}</h3>
                                </div>
                                <p className="text-lg text-text-muted leading-relaxed">{step.description}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
      )}

      {/* 4. Results & Impact */}
      {project.results && (
          <section className="container mx-auto px-4 mb-32">
             <div className="bg-accent text-white rounded-3xl p-12 md:p-20 relative overflow-hidden">
                <div className="absolute -top-24 -right-24 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
                <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-black/10 rounded-full blur-3xl"></div>

                <div className="relative z-10">
                    <h2 className="text-3xl md:text-4xl font-black mb-12 text-center uppercase tracking-tight text-white">Results & Impact</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                        {project.results.map((res, idx) => (
                            <div key={idx} className="p-4">
                                <div className="text-4xl md:text-6xl font-black mb-2">{res.metric}</div>
                                <div className="text-sm md:text-base font-medium opacity-80 uppercase tracking-wide">{res.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
             </div>
          </section>
      )}

      {/* 5. Key Learnings */}
      {project.keyLearnings && (
        <section className="container mx-auto px-4 mb-32 max-w-4xl">
             <h3 className="text-2xl font-bold mb-8 border-b border-gray-200 dark:border-gray-800 pb-4 text-text">Key Learnings</h3>
             <div className="grid md:grid-cols-3 gap-6">
                {project.keyLearnings.map((learning, idx) => (
                    <div key={idx} className="bg-card-bg p-6 rounded-xl border border-gray-200 dark:border-gray-800">
                        <p className="text-text-muted text-sm leading-relaxed">"{learning}"</p>
                    </div>
                ))}
             </div>
        </section>
      )}

      {/* 6. Visual Gallery */}
      <section className="container mx-auto px-4 mb-20">
        <h3 className="text-2xl font-bold mb-8 text-text">Project Gallery</h3>
        <div className="grid md:grid-cols-2 gap-8">
            {project.images.map((img, idx) => (
                <div 
                    key={idx}
                    className="relative group rounded-xl overflow-hidden cursor-zoom-in shadow-md"
                    onClick={() => handleGalleryClick(idx)}
                >
                    <img src={img} alt="Project screenshot" className="w-full h-auto" />
                    <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                        <ZoomIn className="text-white" size={32} />
                    </div>
                </div>
            ))}
        </div>
      </section>

      {/* Next Project Link */}
      <div className="container mx-auto px-4 text-center">
         <Link 
            to="/" 
            className="inline-block text-text-muted hover:text-accent transition-colors uppercase tracking-widest font-bold text-sm"
         >
            Back to All Projects
         </Link>
      </div>

    </div>
  );
};

export default ProjectDetail;

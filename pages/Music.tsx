
import React from 'react';
import { motion } from 'framer-motion';
import { musicProjects } from '../data/portfolioData';
import { useLightbox } from '../context/LightboxContext';
import { ZoomIn } from 'lucide-react';

const Music: React.FC = () => {
  const { openLightbox } = useLightbox();
  
  // Create a list of all band images for potential slideshow navigation
  const allBandImages = musicProjects.map(b => b.image);

  const handleImageClick = (img: string) => {
    // We can just open the single image, or open the full gallery starting at this index
    // Let's open all band images as a gallery for better exploration
    const index = allBandImages.indexOf(img);
    openLightbox(allBandImages, index);
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <div className="relative h-[70vh] min-h-[600px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
            <img 
                src="https://roseanfrankale.github.io/assets/img/headers/studio-music.jpg" 
                alt="Studio Background" 
                className="w-full h-full object-cover opacity-50 grayscale hover:grayscale-0 transition-all duration-[2s]"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10 text-center">
            <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1 }}
            >
                <h1 className="text-6xl md:text-9xl font-black mb-4 uppercase tracking-tighter mix-blend-overlay">
                    Music
                </h1>
                <h1 className="text-6xl md:text-9xl font-black mb-8 uppercase tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-500">
                    & Sound
                </h1>
                <div className="w-20 h-1 bg-accent mx-auto mb-8"></div>
                <p className="text-gray-300 max-w-xl mx-auto text-xl font-light tracking-wide uppercase">
                    A decade behind the bass
                </p>
            </motion.div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 md:px-6 pb-32">
        {/* Intro Text */}
        <div className="max-w-4xl mx-auto text-center mb-32">
             <p className="text-2xl md:text-3xl text-gray-400 font-thin leading-relaxed">
                From touring with bands to session recordings. My journey in music taught me <span className="text-white font-normal">collaboration</span>, <span className="text-white font-normal">rhythm</span>, and the art of <span className="text-white font-normal">listening</span>.
             </p>
        </div>

        <div className="space-y-40">
          {musicProjects.map((band, index) => (
            <motion.section 
              key={band.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10%" }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              {/* Decorative Number */}
              <div className="hidden md:block absolute -top-20 -left-10 text-[12rem] font-black text-white/5 select-none z-0 pointer-events-none leading-none">
                {String(index + 1).padStart(2, '0')}
              </div>

              <div className={`grid md:grid-cols-2 gap-16 items-center relative z-10 ${index % 2 !== 0 ? 'md:grid-flow-dense' : ''}`}>
                  <div className={index % 2 !== 0 ? 'md:col-start-2' : ''}>
                      <div 
                        className="relative rounded-sm overflow-hidden group cursor-zoom-in"
                        onClick={() => handleImageClick(band.image)}
                      >
                         <div className="absolute inset-0 bg-accent/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10 mix-blend-multiply"></div>
                         <img 
                            src={band.image} 
                            alt={band.name} 
                            className="w-full aspect-square object-cover filter grayscale group-hover:grayscale-0 transition-all duration-700" 
                         />
                         <div className="absolute bottom-4 right-4 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <div className="bg-black/50 p-2 rounded-full backdrop-blur-sm">
                                <ZoomIn size={20} className="text-white" />
                            </div>
                         </div>
                      </div>
                  </div>
                  
                  <div className={`space-y-8 ${index % 2 !== 0 ? 'md:col-start-1' : ''}`}>
                      <div>
                        <h3 className="text-4xl md:text-5xl font-bold text-white mb-2">{band.name}</h3>
                        <p className={`text-sm font-bold uppercase tracking-[0.2em] ${band.color}`}>{band.years} • {band.role}</p>
                      </div>
                      
                      <p className="text-gray-400 text-lg leading-relaxed font-light border-l-2 border-white/10 pl-6">
                          {band.description}
                      </p>
                      
                      {band.notablePerformances && (
                        <div>
                            <h4 className="text-xs font-bold uppercase tracking-widest text-white/50 mb-2">Notable Performances</h4>
                            <p className="text-white text-sm">{band.notablePerformances}</p>
                        </div>
                      )}

                      {band.spotifyEmbedUrl && (
                          <div className="mt-8">
                               <iframe 
                                src={band.spotifyEmbedUrl} 
                                width="100%" 
                                height="80" 
                                allowFullScreen 
                                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" 
                                loading="lazy"
                                className="rounded-lg bg-zinc-900"
                              ></iframe>
                          </div>
                      )}
                  </div>
              </div>
            </motion.section>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Music;

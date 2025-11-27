
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { projects } from '../data/portfolioData';
import { useLightbox } from '../context/LightboxContext';

// Flatten all images from projects to create a gallery
const galleryItems = projects.flatMap(p => 
    [p.heroImage, ...p.images].map((img, idx) => {
        let category = 'Mockups';
        if (idx === 0) category = 'Landing';
        if (img.includes('dashboard')) category = 'Dashboards';
        if (img.includes('vector')) category = 'Vectors';
        if (img.includes('wireframe')) category = 'Wireframes';
        if (img.toLowerCase().includes('logo')) category = 'Logos';
        
        return {
            id: `${p.id}-${idx}`,
            projectId: p.id,
            title: p.title,
            category: category,
            image: img
        };
    })
);

const categories = ['All', 'Dashboards', 'Landing', 'Logos', 'Marketing', 'Mockups', 'Vectors', 'Wireframes'];

const Gallery: React.FC = () => {
  const [filter, setFilter] = useState('All');
  const { openLightbox } = useLightbox();

  const filteredItems = filter === 'All' 
    ? galleryItems 
    : galleryItems.filter(item => item.category === filter);

  const handleImageClick = (clickedItemIndex: number) => {
    // Create an array of just the image URLs from the current filtered view
    const images = filteredItems.map(item => item.image);
    openLightbox(images, clickedItemIndex);
  };

  return (
    <div className="pt-32 pb-20 min-h-screen bg-bg text-text transition-colors duration-300">
        <div className="container mx-auto px-4 md:px-6">
            <div className="text-center mb-16">
                <h1 className="text-5xl md:text-6xl font-black mb-6 text-text uppercase tracking-tighter">GALLERY</h1>
                <div className="w-24 h-1.5 bg-accent mx-auto mb-12"></div>
                
                {/* Filters */}
                <div className="flex justify-center flex-wrap gap-3">
                    {categories.map(cat => (
                        <button
                            key={cat}
                            onClick={() => setFilter(cat)}
                            className={`px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest transition-all duration-300 border ${
                                filter === cat 
                                ? 'bg-accent text-white border-accent shadow-lg shadow-accent/20 scale-105' 
                                : 'bg-card-bg text-text-muted border-gray-200 dark:border-gray-800 hover:border-accent/50 hover:text-accent'
                            }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </div>

            <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <AnimatePresence mode='popLayout'>
                    {filteredItems.map((item, index) => (
                        <motion.div
                            layout
                            key={item.id}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            transition={{ duration: 0.3 }}
                            className="relative group rounded-xl overflow-hidden shadow-lg bg-card-bg cursor-pointer aspect-[4/3]"
                            onClick={() => handleImageClick(index)}
                        >
                            <img 
                                src={item.image} 
                                alt={item.title} 
                                className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-110" 
                            />
                            <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center p-6 backdrop-blur-sm">
                                <div className="text-center transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                                    <h3 className="text-white font-bold text-xl mb-2">{item.title}</h3>
                                    <span className="text-accent text-xs font-bold uppercase tracking-widest border border-accent/50 px-3 py-1 rounded-full bg-black/50">{item.category}</span>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </motion.div>
            
            {filteredItems.length === 0 && (
                <div className="text-center py-20 text-text-muted">
                    <p className="text-xl font-light">No images found for this category.</p>
                </div>
            )}
        </div>
    </div>
  );
};

export default Gallery;

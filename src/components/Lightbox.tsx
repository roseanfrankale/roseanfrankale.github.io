
import React, { useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { useLightbox } from '../context/LightboxContext';

const Lightbox: React.FC = () => {
  const { isOpen, images, currentIndex, closeLightbox, nextImage, prevImage } = useLightbox();

  // Handle keyboard navigation
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (!isOpen) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowRight') nextImage();
    if (e.key === 'ArrowLeft') prevImage();
  }, [isOpen, closeLightbox, nextImage, prevImage]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  // Lock body scroll when lightbox is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-sm"
          onClick={closeLightbox}
        >
          {/* Close Button */}
          <button
            className="absolute top-6 right-6 text-white/70 hover:text-white transition-colors z-[110] p-2 rounded-full hover:bg-white/10"
            onClick={closeLightbox}
            aria-label="Close lightbox"
          >
            <X size={32} />
          </button>

          {/* Navigation Buttons */}
          {images.length > 1 && (
            <>
              <button
                className="absolute left-4 md:left-8 text-white/70 hover:text-white transition-colors z-[110] p-4 rounded-full bg-black/20 hover:bg-white/10 backdrop-blur-md"
                onClick={(e) => { e.stopPropagation(); prevImage(); }}
                aria-label="Previous image"
              >
                <ChevronLeft size={32} />
              </button>
              <button
                className="absolute right-4 md:right-8 text-white/70 hover:text-white transition-colors z-[110] p-4 rounded-full bg-black/20 hover:bg-white/10 backdrop-blur-md"
                onClick={(e) => { e.stopPropagation(); nextImage(); }}
                aria-label="Next image"
              >
                <ChevronRight size={32} />
              </button>
            </>
          )}

          {/* Image Container */}
          <div 
            className="relative w-full h-full flex items-center justify-center p-4 md:p-12 lg:p-20"
            onClick={(e) => e.stopPropagation()}
          >
             <motion.img
              key={images[currentIndex]}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              src={images[currentIndex]}
              alt={`Lightbox view ${currentIndex + 1}`}
              className="max-w-full max-h-full object-contain rounded-sm shadow-2xl select-none"
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.2}
              onDragEnd={(e, { offset, velocity }) => {
                const swipe = Math.abs(offset.x) * velocity.x;
                if (swipe < -500) {
                  nextImage();
                } else if (swipe > 500) {
                  prevImage();
                }
              }}
            />
            
            {/* Counter */}
            {images.length > 1 && (
                <div className="absolute bottom-8 left-0 right-0 text-center text-white/60 font-mono text-sm tracking-widest pointer-events-none">
                    {currentIndex + 1} / {images.length}
                </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Lightbox;

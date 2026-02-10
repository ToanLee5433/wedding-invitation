import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { uploadMedia } from '../lib/storage';
import { Loader2, X, ZoomIn, Heart } from 'lucide-react';

// Skeleton loader component for better UX
const ImageSkeleton = () => (
  <div className="absolute inset-0 bg-gradient-to-br from-gray-100 via-gray-50 to-gray-100 animate-pulse">
    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer"></div>
  </div>
);

interface AlbumProps {
  photos: string[];
  onUpload: (newPhotos: string[]) => void;
  editMode: boolean;
  weddingSlug: string;
}

const Album: React.FC<AlbumProps> = ({ photos, onUpload, editMode, weddingSlug }) => {
  const [uploadingIndex, setUploadingIndex] = useState<number | null>(null);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [loadedImages, setLoadedImages] = useState<Set<number>>(new Set());

  const handleFile = async (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadingIndex(index);
      const publicUrl = await uploadMedia(file, weddingSlug, 'images', `album-${index}-${Date.now()}`);
      
      const newPhotos = [...photos];
      // Ensure array has enough slots if it was sparse
      while (newPhotos.length <= index) {
        newPhotos.push(""); 
      }
      newPhotos[index] = publicUrl;
      onUpload(newPhotos);
    } catch (err) {
      console.error('Upload failed:', err);
      alert('Không thể tải ảnh lên. Vui lòng thử lại.');
    } finally {
      setUploadingIndex(null);
    }
  };

  const placeholders = [
    "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=75&w=800",
    "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=75&w=800",
    "https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&q=75&w=800",
    "https://images.unsplash.com/photo-1465495910483-345749a2ce2b?auto=format&fit=crop&q=75&w=800",
    "https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&q=75&w=800",
    "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&q=75&w=800",
  ];

  const captions = [
    "Ngày hạnh phúc",
    "Ánh mắt nồng nàn",
    "Khoảnh khắc ngọt ngào",
    "Bên nhau mãi mãi",
    "Tình yêu vĩnh cửu",
    "Lời hứa trọn đời",
  ];

  // Modified layouts for a perfect 3x3 grid (3 columns, 3 rows)
  // Grid mapping for 6 photos:
  // [1][1][2] -> Photo 0 takes 2x2. Photo 1 takes 1x1 row 1, col 3. Photo 2 takes 1x1 row 2, col 3.
  // [1][1][2]
  // [3][4][5] -> Photos 3, 4, 5 take 1x1 each in the 3rd row.
  const layouts = [
    "md:col-span-2 md:row-span-2", // Big 2x2
    "md:col-span-1 md:row-span-1", // 1x1 top-right
    "md:col-span-1 md:row-span-1", // 1x1 middle-right
    "md:col-span-1 md:row-span-1", // 1x1 bottom-left
    "md:col-span-1 md:row-span-1", // 1x1 bottom-middle
    "md:col-span-1 md:row-span-1", // 1x1 bottom-right
  ];

  const openLightbox = (index: number) => {
    if (!editMode) setLightboxIndex(index);
  };

  return (
    <>
      <section className="py-24 bg-[#FDFCF0]">
        <div className="container mx-auto px-4 max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16 px-4"
          >
            <span className="text-gold uppercase tracking-[0.4em] text-[10px] font-bold block mb-4">The Gallery</span>
            <h2 className="font-serif text-5xl md:text-7xl text-gray-800 leading-[1.2] pb-2 tracking-normal">
              <span className="inline-block px-1">Khoảnh</span>
              <span className="inline-block px-1">Khắc</span>
              <span className="inline-block px-1">Hạnh</span>
              <span className="inline-block px-1">Phúc</span>
            </h2>
            <div className="w-12 h-[1px] bg-gold/30 mx-auto mt-6"></div>
          </motion.div>

          {/* Refined Bento Grid - Closer spacing, no bulky borders */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 auto-rows-[150px] md:auto-rows-[180px] lg:auto-rows-[220px]">
            {placeholders.map((placeholder, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  delay: index * 0.05,
                  duration: 0.8,
                  ease: [0.21, 0.47, 0.32, 0.98]
                }}
                onClick={() => openLightbox(index)}
                className={`${layouts[index]} relative overflow-hidden rounded-lg shadow-sm group cursor-pointer`}
              >
                {/* Skeleton loader while image is loading */}
                {!loadedImages.has(index) && <ImageSkeleton />}
                
                {/* Image with subtle zoom effect and lazy loading + optimization */}
                <motion.img
                  src={photos[index] || placeholder}
                  alt={captions[index]}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover"
                  style={{ contentVisibility: 'auto' }}
                  onLoad={() => setLoadedImages(prev => new Set(prev).add(index))}
                  whileHover={editMode ? { scale: 1 } : { scale: 1.05 }}
                  transition={{ duration: 0.8 }}
                />

                {/* Edit Mode Overlay - ALWAYS VISIBLE if photo missing, or on hover */}
                {editMode && (
                  <label className={`absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/40 backdrop-blur-[2px] cursor-pointer transition-all duration-300 ${!photos[index] ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                     <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center mb-2 border border-white/40 shadow-xl">
                        {uploadingIndex === index ? (
                          <Loader2 className="animate-spin text-white" size={20} />
                        ) : (
                          <ZoomIn className="text-white" size={20} />
                        )}
                     </div>
                     <span className="text-[10px] font-bold uppercase tracking-widest text-white drop-shadow-md">
                        {uploadingIndex === index ? 'Đang tải...' : 'Thay ảnh'}
                     </span>
                     <input 
                       type="file" 
                       accept="image/*" 
                       onChange={(e) => handleFile(index, e)} 
                       disabled={uploadingIndex !== null}
                       className="hidden" 
                     />
                  </label>
                )}

                {/* Glassmorphism Hover Overlay (View Mode Only) */}
                {!editMode && (
                  <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-all duration-700 flex flex-col justify-end p-4 md:p-8">
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    whileHover={{ y: 0, opacity: 1 }}
                    className="backdrop-blur-md bg-white/20 border border-white/30 rounded-2xl p-4 md:p-6 flex items-center justify-between shadow-[0_8px_32px_0_rgba(31,38,135,0.37)]"
                  >
                    <div>
                      <p className="text-white font-serif text-lg italic">{captions[index]}</p>
                      <span className="text-white/60 text-[8px] uppercase tracking-widest block mt-1">Wedding Collection</span>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                      <ZoomIn className="text-white" size={18} />
                    </div>
                  </motion.div>
                </div>
                )}
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mt-24 text-center"
          >
            <div className="flex items-center justify-center gap-4 mb-6">
              <div className="w-12 h-[1px] bg-gold/20"></div>
              <Heart className="w-5 h-5 text-gold/40 animate-pulse" />
              <div className="w-12 h-[1px] bg-gold/20"></div>
            </div>
            <p className="font-serif italic text-gray-400 text-sm max-w-md mx-auto leading-relaxed">
              "Tình yêu không chỉ là nhìn nhau, mà là cùng nhau nhìn về một hướng."
            </p>
          </motion.div>
        </div>
      </section>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {lightboxIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLightboxIndex(null)}
            className="fixed inset-0 z-[100000] bg-black/95 flex items-center justify-center p-4 md:p-8 cursor-zoom-out"
          >
            <button
              onClick={() => setLightboxIndex(null)}
              className="absolute top-6 right-6 text-white/70 hover:text-white transition-colors z-10"
            >
              <X size={32} />
            </button>

            <motion.img
              key={lightboxIndex}
              src={photos[lightboxIndex] || placeholders[lightboxIndex]}
              alt={captions[lightboxIndex]}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: "spring", stiffness: 200, damping: 25 }}
              className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            />

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="absolute bottom-12 left-1/2 -translate-x-1/2 text-center"
            >
              <p className="text-white font-serif text-2xl italic mb-2">{captions[lightboxIndex]}</p>
              <p className="text-white/40 text-[10px] uppercase tracking-widest">Our Wedding Moments • 2026</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Album;

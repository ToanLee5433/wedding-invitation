
import React, { useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { uploadMedia } from '../lib/storage';
import { Loader2, ChevronDown } from 'lucide-react';

interface HeroProps {
  bgImage: string;
  onUpload: (val: string) => void;
  editMode: boolean;
  groomName: string;
  brideName: string;
  eventDate: string;
  weddingSlug: string;
  onUpdate: (field: 'groom_name' | 'bride_name' | 'event_date', value: string) => void;
}

const Hero: React.FC<HeroProps> = ({ bgImage, onUpload, editMode, groomName, brideName, eventDate, weddingSlug, onUpdate }) => {
  const [uploading, setUploading] = useState(false);
  const { scrollY } = useScroll();

  const yBg = useTransform(scrollY, [0, 500], [0, 150]);
  const opacityText = useTransform(scrollY, [0, 300], [1, 0]);
  const scaleText = useTransform(scrollY, [0, 300], [1, 0.98]);

  const fallbackImage = 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=1200';
  const actualImage = bgImage || fallbackImage;

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      const publicUrl = await uploadMedia(file, weddingSlug, 'images', 'hero');
      onUpload(publicUrl);
    } catch (err) {
      console.error('Upload failed:', err);
    } finally {
      setUploading(false);
    }
  };

  return (
    <section className="relative h-screen w-full flex items-center justify-center overflow-hidden bg-[#0c0c0c]">
      {/* Background */}
      <motion.div
        className="absolute inset-0 z-0 bg-center bg-cover"
        style={{
          backgroundImage: `url('${actualImage}')`,
          y: yBg,
          willChange: 'transform'
        }}
      >
        <div className="absolute inset-0 bg-black/45 shadow-inner"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/70"></div>
      </motion.div>

      {editMode && (
        <div className="absolute top-10 right-10 z-[50]">
          <label className={`bg-white/90 px-4 py-2 rounded-full border border-gold text-[10px] uppercase tracking-widest cursor-pointer hover:bg-gold hover:text-white transition-all shadow-xl flex items-center gap-2 ${uploading ? 'opacity-50 pointer-events-none' : ''}`}>
            {uploading ? <Loader2 size={14} className="animate-spin" /> : 'Thay ảnh bìa'}
            <input type="file" className="hidden" accept="image/*" onChange={handleFile} disabled={uploading} />
          </label>
        </div>
      )}

      <motion.div
        className="relative z-10 text-center text-white px-6 w-full max-w-7xl flex flex-col items-center"
        style={{ opacity: opacityText, scale: scaleText }}
      >
        <div className="flex flex-col items-center w-full">
          {/* Subtitle */}
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.9 }}
            transition={{ duration: 1.5 }}
            className="block uppercase text-lg md:text-3xl mb-12 md:mb-20 font-light tracking-[0.8em] text-white/90 drop-shadow-lg"
          >
            The Wedding Celebration
          </motion.span>

          {/* Names - ROBUST RENDERING */}
          <div className="flex flex-col md:flex-row items-center justify-center gap-2 md:gap-16 w-full mb-10 md:mb-16">
            {editMode ? (
              <div className="flex flex-col md:flex-row items-center justify-center gap-6 font-script-great w-full max-w-5xl">
                <div className="relative group w-full max-w-sm">
                   <input
                    value={brideName}
                    onChange={(e) => onUpdate('bride_name', e.target.value)}
                    className="bg-white/10 border-b border-white/30 text-center focus:outline-none focus:border-[#D4AF37] w-full text-4xl md:text-7xl py-2 md:py-4 px-4 text-white placeholder-white/50 rounded-t-lg transition-all"
                    placeholder="Tên Cô Dâu"
                  />
                  <label className="absolute -top-3 left-0 w-full text-center text-[10px] text-[#D4AF37] uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                    Cô dâu
                  </label>
                </div>

                <span className="text-[#D4AF37] font-serif-cinzel font-black text-4xl md:text-6xl drop-shadow-lg">&</span>
                
                <div className="relative group w-full max-w-sm">
                  <input
                    value={groomName}
                    onChange={(e) => onUpdate('groom_name', e.target.value)}
                    className="bg-white/10 border-b border-white/30 text-center focus:outline-none focus:border-[#D4AF37] w-full text-4xl md:text-7xl py-2 md:py-4 px-4 text-white placeholder-white/50 rounded-t-lg transition-all"
                    placeholder="Tên Chú Rể"
                  />
                  <label className="absolute -top-3 left-0 w-full text-center text-[10px] text-[#D4AF37] uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                    Chú rể
                  </label>
                </div>
              </div>
            ) : (
              <h1 className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-10 w-full font-script-great text-white drop-shadow-[0_15px_30px_rgba(0,0,0,1)]">
                <span className="text-6xl md:text-8xl lg:text-9xl leading-tight pb-2 md:pb-4 shimmer-gold">
                  {brideName || 'Cô dâu'}
                </span>

                <span className="text-gold font-serif-cinzel font-black text-6xl md:text-8xl lg:text-9xl mx-2">
                  &
                </span>

                <span className="text-6xl md:text-8xl lg:text-9xl leading-tight pb-2 md:pb-4 shimmer-gold">
                  {groomName || 'Chú rể'}
                </span>
              </h1>
            )}

          </div>

          {/* Divider */}
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: "20rem" }}
            transition={{ duration: 1.5 }}
            className="h-[1.5px] bg-gradient-to-r from-transparent via-gold to-transparent my-8 md:my-14 opacity-60"
          ></motion.div>

          {/* Date */}
          <div className="font-serif-playfair text-3xl md:text-5xl italic tracking-[0.3em] font-light text-[#D4AF37]/90 drop-shadow-xl mt-4">
            {editMode ? (
              <div className="relative group w-full max-w-md mx-auto">
                 <input
                  value={eventDate}
                  onChange={(e) => onUpdate('event_date', e.target.value)}
                  className="bg-white/10 border-b border-white/30 text-center focus:outline-none focus:border-[#D4AF37] w-full py-2 text-white placeholder-white/50 transition-all font-serif italic text-2xl md:text-4xl"
                  placeholder="Ngày cưới (VD: 15 . 01 . 2026)"
                />
                 <label className="absolute -top-4 left-0 w-full text-center text-[10px] text-white/60 uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity font-sans">
                    Thời gian tổ chức
                  </label>
              </div>
            ) : (
              <p>{eventDate || '15 . 01 . 2026'}</p>
            )}
          </div>
        </div>
      </motion.div>

      {/* Scroll Indicator - WITH ANIMATED CHEVRONS */}
      <div className="absolute bottom-6 inset-x-0 flex flex-col items-center gap-1 z-20">
        {/* Animated Down Arrows */}
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          className="flex flex-col items-center -mb-1"
        >
          <ChevronDown size={20} className="text-white/40" />
          <ChevronDown size={20} className="text-white/30 -mt-3" />
        </motion.div>

        <span className="text-[9px] md:text-[11px] uppercase tracking-[0.6em] text-white/50 font-black mt-1">Scroll</span>

        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-[22px] h-[34px] md:w-[24px] md:h-[40px] rounded-full border border-white/30 flex justify-center p-1.5"
        >
          <motion.div
            animate={{ y: [0, 12, 0], opacity: [1, 0, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-1 md:w-1.5 h-1.5 md:h-2 bg-gold/80 rounded-full"
          />
        </motion.div>
      </div>

    </section>
  );
};

export default Hero;

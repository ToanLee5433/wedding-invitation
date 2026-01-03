
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart } from 'lucide-react';

interface EnvelopeProps {
  groomName: string;
  brideName: string;
  onStart: () => void;
  onComplete: () => void;
}

const Envelope: React.FC<EnvelopeProps> = ({ groomName, brideName, onStart, onComplete }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDone, setIsDone] = useState(false);

  const handleOpen = () => {
    if (isOpen) return;

    if (window.navigator && window.navigator.vibrate) {
      window.navigator.vibrate([40, 20, 40]);
    }

    setIsOpen(true);
    onStart();

    setTimeout(() => {
      setIsDone(true);
      setTimeout(onComplete, 1200);
    }, 4500);
  };

  const ENVELOPE_COLOR = '#FDFCF0';
  const FLAP_COLOR = '#EBE8D8';

  return (
    <AnimatePresence>
      {!isDone && (
        <motion.div
          className="fixed inset-0 z-[100000] flex items-center justify-center overflow-hidden"
          style={{ backgroundColor: '#1a1a1a' }}
          exit={{ opacity: 0, scale: 1.1, filter: 'blur(40px)' }}
          transition={{ duration: 1.8, ease: [0.7, 0, 0.3, 1] }}
        >
          {/* Dark textured backdrop */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundColor: '#1a1a1a',
              backgroundImage: "url('https://www.transparenttextures.com/patterns/dark-matter.png')"
            }}
          />

          <motion.div
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="relative cursor-pointer"
            style={{ width: '500px', height: '340px' }}
            onClick={handleOpen}
          >
            {/* ENVELOPE BODY - Solid rectangle, NO bottom triangle */}
            <div
              className="absolute inset-0 rounded-sm"
              style={{
                backgroundColor: ENVELOPE_COLOR,
                boxShadow: '0 40px 80px rgba(0,0,0,0.7)'
              }}
            />

            {/* TOP FLAP ONLY - Triangle pointing DOWN */}
            <motion.div
              initial={{ rotateX: 0 }}
              animate={isOpen ? { rotateX: -180 } : { rotateX: 0 }}
              transition={{ duration: 1.4, ease: [0.65, 0, 0.35, 1] }}
              style={{
                transformOrigin: 'top center',
                position: 'absolute',
                inset: 0,
                zIndex: isOpen ? 10 : 30
              }}
              className="pointer-events-none"
            >
              <div
                style={{
                  width: '100%',
                  height: '100%',
                  backgroundColor: FLAP_COLOR,
                  clipPath: 'polygon(0 0, 100% 0, 50% 55%)'
                }}
              />
            </motion.div>

            {/* THE LETTER - Slides DOWN when opened to be level with envelope */}
            <motion.div
              initial={{ y: -50, opacity: 0 }}
              animate={isOpen ? { y: 50, opacity: 1 } : { y: -50, opacity: 0 }}
              transition={{ delay: 1.0, duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
              style={{
                zIndex: isOpen ? 100 : 5,
                position: 'absolute',
                left: '40px',
                right: '40px',
                top: '30px',
                height: '280px'
              }}
              className="bg-white shadow-2xl flex flex-col items-center justify-center border-double border-[4px] border-gold/15 p-6"
            >
              <div className="text-gold font-sans uppercase tracking-[0.5em] text-[9px] mb-3 font-black opacity-60">Wedding Invitation</div>
              <h2 className="font-script-great text-4xl text-[#1a1a1a] mb-1 text-center leading-tight">
                {brideName}
              </h2>
              <span className="text-gold text-3xl font-script-great my-2">&</span>
              <h2 className="font-script-great text-4xl text-[#1a1a1a] mb-4 text-center leading-tight">
                {groomName}
              </h2>

              <div className="w-24 h-[1px] bg-gradient-to-r from-transparent via-gold/40 to-transparent my-4" />

              <p className="font-serif italic text-gray-400 text-[11px] tracking-[0.12em] uppercase text-center leading-relaxed font-medium">
                Chúng mình trân trọng kính mời bạn<br />
                đến dự lễ thành hôn
              </p>
            </motion.div>

            {/* WAX SEAL */}
            <AnimatePresence>
              {!isOpen && (
                <motion.div
                  exit={{ opacity: 0, scale: 0.8, filter: 'blur(20px)', y: -20 }}
                  transition={{ duration: 0.8, ease: "easeInOut" }}
                  style={{
                    position: 'absolute',
                    top: '55%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    zIndex: 40
                  }}
                  className="flex flex-col items-center"
                >
                  <div className="relative group/seal hover:scale-105 active:scale-95 transition-all duration-500">
                    <div className="absolute inset-0 bg-gold/30 rounded-full blur-2xl scale-150"></div>
                    <div
                      className="w-20 h-20 rounded-full flex items-center justify-center border-4 border-[#b8952d] relative overflow-hidden"
                      style={{
                        backgroundColor: '#D4AF37',
                        boxShadow: '0 15px 40px rgba(0,0,0,0.5)'
                      }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/30 to-transparent -translate-x-full group-hover/seal:translate-x-full transition-transform duration-1000"></div>
                      <span className="text-white font-serif-cinzel text-2xl font-black tracking-tight drop-shadow-md">TC</span>
                    </div>
                  </div>

                  {/* Hint text - GOLD COLOR */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mt-12 flex flex-col items-center gap-2"
                  >
                    <motion.span
                      animate={{ opacity: [0.5, 1, 0.5] }}
                      transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
                      className="text-gold font-sans text-[10px] tracking-[0.5em] uppercase font-black drop-shadow-md"
                    >
                      Bấm để mở thiệp
                    </motion.span>
                    <Heart size={12} className="text-gold/50 fill-gold/10" />
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Envelope;

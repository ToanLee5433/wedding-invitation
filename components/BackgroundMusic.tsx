
import React, { useMemo, useRef, useEffect, useState, useCallback } from 'react';
import { Volume2, VolumeX, Music } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface BackgroundMusicProps {
  url: string;
  isPlaying: boolean;
  setIsPlaying: (val: boolean) => void;
  visible?: boolean;
}

const BackgroundMusic: React.FC<BackgroundMusicProps> = ({ url, isPlaying, setIsPlaying, visible = true }) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [audioReady, setAudioReady] = useState(false);
  const hasInteracted = useRef(false);

  // Resolve the streaming URL
  const streamUrl = useMemo(() => {
    if (!url) return '';
    // Handle Google Drive links
    if (url.includes('drive.google.com') || url.includes('docs.google.com')) {
      const match = url.match(/[-\w]{25,}/);
      const id = match ? match[0] : '';
      if (id) return `https://drive.google.com/uc?export=download&id=${id}`;
    }
    return url;
  }, [url]);

  // Setup audio element once
  useEffect(() => {
    if (!streamUrl) {
      setAudioReady(false);
      return;
    }

    const audio = audioRef.current;
    if (!audio) return;

    audio.src = streamUrl;
    audio.loop = true;
    audio.volume = 0.4;
    audio.preload = 'auto';

    const onCanPlay = () => {
      setAudioReady(true);
      console.log('✅ Audio ready to play');
    };
    const onError = () => {
      console.warn('⚠️ Audio source could not be loaded:', streamUrl);
      setAudioReady(false);
    };

    audio.addEventListener('canplaythrough', onCanPlay);
    audio.addEventListener('error', onError);

    return () => {
      audio.removeEventListener('canplaythrough', onCanPlay);
      audio.removeEventListener('error', onError);
    };
  }, [streamUrl]);

  // Play/pause control
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.play().catch(() => {
        // Browser blocked autoplay, will retry on next user click
        if (!hasInteracted.current) {
          setIsPlaying(false);
        }
      });
    } else {
      audio.pause();
    }
  }, [isPlaying, setIsPlaying]);

  // Handle user click - this always works because it's a user gesture
  const handleToggle = useCallback(() => {
    hasInteracted.current = true;
    const audio = audioRef.current;

    if (!isPlaying && audio) {
      // User clicked play - try to play immediately from user gesture
      audio.play().then(() => {
        setIsPlaying(true);
      }).catch(err => {
        console.warn('Play failed:', err.message);
      });
    } else {
      setIsPlaying(false);
    }
  }, [isPlaying, setIsPlaying]);

  // Don't show the button if there's no music URL at all
  if (!streamUrl) return null;

  return (
    <>
      <audio ref={audioRef} style={{ display: 'none' }} />

      <AnimatePresence>
        {visible && (
          <motion.button
            initial={{ opacity: 0, scale: 0.5, rotate: -180 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            exit={{ opacity: 0, scale: 0.5, rotate: 180 }}
            onClick={handleToggle}
            className={`fixed top-24 right-5 md:top-28 md:right-8 z-[1000005] w-12 h-12 rounded-full shadow-2xl flex items-center justify-center transition-all duration-500 overflow-hidden
              ${isPlaying ? 'bg-gold text-white ring-4 ring-gold/20' : 'bg-white text-gray-400 border border-gray-100'}`}
            title={isPlaying ? 'Tắt nhạc' : 'Bật nhạc'}
          >
            {isPlaying && (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 bg-gradient-to-tr from-gold via-white/20 to-gold opacity-30"
              />
            )}

            <div className="relative z-10">
              {isPlaying ? (
                <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 2, repeat: Infinity }}>
                  <Volume2 size={20} />
                </motion.div>
              ) : (
                <VolumeX size={20} />
              )}
            </div>

            {isPlaying && (
              <div className="absolute inset-0 pointer-events-none">
                <motion.div animate={{ y: [-10, -30, -10], opacity: [0, 1, 0], x: [0, 10, 0] }} transition={{ duration: 2, repeat: Infinity, delay: 0.5 }} className="absolute top-2 right-2">
                  <Music size={8} />
                </motion.div>
                <motion.div animate={{ y: [-10, -25, -10], opacity: [0, 1, 0], x: [0, -10, 0] }} transition={{ duration: 1.5, repeat: Infinity }} className="absolute bottom-2 left-2">
                  <Music size={8} />
                </motion.div>
              </div>
            )}
          </motion.button>
        )}
      </AnimatePresence>
    </>
  );
};

export default BackgroundMusic;

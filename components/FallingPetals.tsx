
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

// Explicitly type Petal as a React.FC to allow React's reserved 'key' prop when rendered in a list
const Petal: React.FC<{ delay: number }> = ({ delay }) => {
  const randomX = Math.random() * 100;
  const duration = 10 + Math.random() * 6; // Slightly slower for smoother animation
  const size = 10 + Math.random() * 10;
  const rotation = Math.random() * 360;

  return (
    <motion.div
      initial={{ y: -50, x: `${randomX}vw`, rotate: rotation, opacity: 0 }}
      animate={{
        y: '110vh',
        x: `${randomX + (Math.random() * 20 - 10)}vw`,
        rotate: rotation + 720,
        opacity: [0, 0.8, 0.8, 0]
      }}
      transition={{
        duration,
        repeat: Infinity,
        delay,
        ease: "linear"
      }}
      className="fixed z-[45] pointer-events-none"
    >
      <svg width={size} height={size} viewBox="0 0 20 20" fill="none">
        <path
          d="M10 0C10 0 16 5 16 10C16 15 10 20 10 20C10 20 4 15 4 10C4 5 10 0 10 0Z"
          fill={Math.random() > 0.5 ? "#FFC0CB" : "#FFE4E1"}
          fillOpacity="0.5"
        />
      </svg>
    </motion.div>
  );
};

const FallingPetals: React.FC = () => {
  // Check for reduced motion preference
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mediaQuery.matches);

    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  // Don't render petals if user prefers reduced motion
  if (reducedMotion) return null;

  // Reduced from 25 to 12 petals for better performance on weak devices
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-[45]">
      {[...Array(12)].map((_, i) => (
        <Petal key={i} delay={i * 1.2} />
      ))}
    </div>
  );
};

export default FallingPetals;


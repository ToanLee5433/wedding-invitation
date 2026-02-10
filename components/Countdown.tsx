
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const Countdown: React.FC<{ targetDate: string }> = ({ targetDate }) => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0, hours: 0, minutes: 0, seconds: 0
  });

  useEffect(() => {
    const calculate = () => {
      // Parse định dạng "30 . 01 . 2026"
      try {
        const parts = targetDate.split(' . ');
        if (parts.length === 3) {
          const day = parseInt(parts[0]);
          const month = parseInt(parts[1]) - 1; // JS month 0-indexed
          const year = parseInt(parts[2]);

          const weddingDate = new Date(year, month, day, 0, 0, 0).getTime();
          const now = new Date().getTime();
          const difference = weddingDate - now;

          if (difference > 0) {
            setTimeLeft({
              days: Math.floor(difference / (1000 * 60 * 60 * 24)),
              hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
              minutes: Math.floor((difference / 1000 / 60) % 60),
              seconds: Math.floor((difference / 1000) % 60),
            });
          } else {
            setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
          }
        }
      } catch (e) {
        console.error("Countdown parsing error", e);
      }
    };

    calculate();
    const timer = setInterval(calculate, 1000);
    return () => clearInterval(timer);
  }, [targetDate]);

  return (
    <section className="py-28 md:py-36 border-y border-gold/10 bg-gradient-to-b from-transparent via-gold/[0.02] to-transparent">
      <div className="container mx-auto max-w-5xl px-6">
        {/* Title - LARGER & MORE PROMINENT */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center text-slate-400 uppercase tracking-[0.8em] text-xs md:text-sm font-bold mb-16 md:mb-20"
        >
          Time until our big day
        </motion.h2>

        {/* Countdown Grid - LARGER NUMBERS */}
        <div className="flex justify-center gap-8 md:gap-16 lg:gap-24">
          <TimeUnit value={timeLeft.days} label="Ngày" delay={0} />
          <TimeUnit value={timeLeft.hours} label="Giờ" delay={0.1} />
          <TimeUnit value={timeLeft.minutes} label="Phút" delay={0.2} />
          <TimeUnit value={timeLeft.seconds} label="Giây" delay={0.3} />
        </div>

        {/* Decorative line */}
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: "100%" }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.5 }}
          className="h-[1px] bg-gradient-to-r from-transparent via-gold/20 to-transparent mt-16 md:mt-20 max-w-2xl mx-auto"
        />
      </div>
    </section>
  );
};

const TimeUnit = ({ value, label, delay }: { value: number; label: string; delay: number }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.8, y: 20 }}
    whileInView={{ opacity: 1, scale: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ delay, duration: 0.5 }}
    className="text-center group"
  >
    <div className="text-5xl md:text-7xl lg:text-8xl font-serif text-gold font-bold mb-3 group-hover:scale-110 transition-transform duration-500 drop-shadow-sm bg-clip-text text-transparent bg-gradient-to-br from-gold via-[#F8E79C] to-[#B38F2D] animate-shimmer bg-[length:200%_auto]">
      {String(value).padStart(2, '0')}
    </div>
    <div className="text-[10px] md:text-xs uppercase tracking-[0.5em] text-slate-400 font-bold">{label}</div>
  </motion.div>
);

export default Countdown;

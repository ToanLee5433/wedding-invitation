
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
          className="text-center text-gold uppercase tracking-[0.8em] text-sm md:text-lg font-black mb-16 md:mb-20"
        >
          Time until our big day
        </motion.h2>

        {/* Countdown Grid - LARGER NUMBERS */}
        <div className="flex justify-center gap-8 md:gap-16 lg:gap-24">
          <TimeUnit value={timeLeft.days} label="Ngày" />
          <TimeUnit value={timeLeft.hours} label="Giờ" />
          <TimeUnit value={timeLeft.minutes} label="Phút" />
          <TimeUnit value={timeLeft.seconds} label="Giây" />
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

const TimeUnit = ({ value, label }: { value: number; label: string }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.8 }}
    whileInView={{ opacity: 1, scale: 1 }}
    viewport={{ once: true }}
    className="text-center group"
  >
    <div className="text-5xl md:text-7xl lg:text-8xl font-serif text-gold font-bold mb-3 group-hover:scale-110 transition-transform duration-300 drop-shadow-sm">
      {String(value).padStart(2, '0')}
    </div>
    <div className="text-xs md:text-sm uppercase tracking-[0.5em] text-gray-500 font-bold">{label}</div>
  </motion.div>
);

export default Countdown;

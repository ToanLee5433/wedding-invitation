
import React from 'react';
import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';

interface InvitationProps {
  guestName: string;
  invitationText: string;
  initials: string;
  quote: string;
  editMode: boolean;
  onUpdate: (field: string, value: string) => void;
}

const Invitation: React.FC<InvitationProps> = ({
  guestName,
  invitationText,
  initials,
  quote,
  editMode,
  onUpdate
}) => {
  // Animation variants
  const wordVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.05,
        duration: 0.8,
        ease: [0.22, 1, 0.36, 1]
      }
    })
  };

  return (
    <section className="text-center max-w-2xl mx-auto relative px-6">
      {/* Decorative Ornaments */}
      <motion.div
        animate={{ y: [0, -15, 0], rotate: [0, 5, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -top-10 -left-20 opacity-10 pointer-events-none hidden md:block"
      >
        <Heart size={120} className="text-gold" fill="currentColor" />
      </motion.div>
      <motion.div
        animate={{ y: [0, 15, 0], rotate: [0, -5, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -bottom-10 -right-20 opacity-10 pointer-events-none hidden md:block"
      >
        <Heart size={100} className="text-gold" fill="currentColor" />
      </motion.div>

      <motion.p
        initial={{ opacity: 0, letterSpacing: "0.1em" }}
        whileInView={{ opacity: 0.6, letterSpacing: "0.5em" }}
        viewport={{ once: true }}
        className="text-[#D4AF37] uppercase text-[9px] mb-10 font-bold"
      >
        Official Invitation
      </motion.p>

      <div className="flex flex-col items-center justify-center mb-10 group relative">
        {editMode ? (
          <div className="relative w-full max-w-[300px]">
            <input
              value={initials}
              onChange={(e) => onUpdate('initials', e.target.value)}
              className="font-script-alex text-5xl md:text-6xl text-[#D4AF37] bg-transparent border-b border-[#D4AF37]/30 focus:border-[#D4AF37] text-center w-full outline-none p-2 transition-all placeholder:text-[#D4AF37]/30"
              placeholder="T&C"
            />
            <span className="absolute -top-4 left-1/2 -translate-x-1/2 text-[9px] uppercase tracking-widest text-[#D4AF37]/50 font-bold opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap bg-[#FDFCF0] px-2 z-10">
              Sửa Chữ Cái
            </span>
          </div>
        ) : (
          <div className="w-20 h-20 md:w-24 md:h-24 rounded-full border border-[#D4AF37]/30 flex items-center justify-center text-[#D4AF37] font-script-alex text-2xl md:text-3xl shimmer-gold">
            {initials}
          </div>
        )}
      </div>

      <div className="mb-10 flex flex-col items-center">
        <h2 className="font-serif-cinzel font-bold text-2xl md:text-3xl overflow-hidden uppercase tracking-widest text-[#4a4a4a]">
          <motion.span
            initial={{ y: "100%" }}
            whileInView={{ y: 0 }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className="block"
          >
            Thân mời
          </motion.span>
        </h2>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, duration: 1.2, ease: "easeOut" }}
          className="font-script-alex text-5xl md:text-6xl text-[#D4AF37] mt-10 block shimmer-gold leading-none"
        >
          {guestName}
        </motion.div>
      </div>


      <div className="space-y-6 text-gray-500 font-sans-montserrat font-light text-[15px] leading-loose max-w-lg mx-auto">

        {/* Editable Invitation Text */}
        {editMode ? (
          <div className="space-y-8 animate-in fade-in duration-500">
            <div className="relative group">
              <label className="text-[10px] uppercase font-bold text-[#D4AF37] absolute -top-2.5 left-4 bg-[#FDFCF0] px-2 z-10">Nội dung lời mời</label>
              <textarea
                value={invitationText}
                onChange={(e) => onUpdate('invitation_text', e.target.value)}
                className="w-full p-6 border border-[#D4AF37]/20 rounded-2xl bg-white/40 text-center text-gray-700 focus:ring-1 focus:ring-[#D4AF37] focus:border-[#D4AF37] focus:bg-white min-h-[160px] resize-none font-sans transition-all shadow-sm focus:shadow-md"
                placeholder="Nhập nội dung lời mời..."
              />
            </div>
            
            <div className="relative group">
              <label className="text-[10px] uppercase font-bold text-[#D4AF37] absolute -top-2.5 left-1/2 -translate-x-1/2 bg-[#FDFCF0] px-2 z-10 transition-colors">Câu Trích Dẫn</label>
              <textarea
                value={quote}
                onChange={(e) => onUpdate('invitation_quote', e.target.value)}
                className="w-full p-6 border border-[#D4AF37]/20 rounded-2xl bg-white/40 text-center text-gray-600 italic focus:ring-1 focus:ring-[#D4AF37] focus:border-[#D4AF37] focus:bg-white min-h-[100px] resize-none transition-all shadow-sm focus:shadow-md"
                placeholder="Nhập câu trích dẫn..."
              />
            </div>
          </div>
        ) : (
          <>
            <p className="text-center leading-loose">
              {invitationText.split(" ").map((word, i) => (
                <motion.span
                key={i}
                variants={wordVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.5 }}
                custom={i}
                className="inline"
              >
                {word}{" "}
              </motion.span>
            ))}
            </p>
            {quote && (
              <div className="pt-6 border-t border-gold/20 w-1/2 mx-auto">
                <p className="text-center italic text-sm text-gold/80 font-serif">
                  "{quote}"
                </p>
              </div>
            )}
          </>
        )}


        {/* Decorative Divider */}
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1, duration: 1, type: "spring" }}
          className="py-8 flex justify-center items-center"
        >
          <div className="w-12 h-[0.5px] bg-gold/30"></div>
          <span className="mx-6 font-script text-2xl text-gold/60">{initials}</span>
          <div className="w-12 h-[0.5px] bg-gold/30"></div>
        </motion.div>
      </div>
    </section>
  );
};

export default Invitation;

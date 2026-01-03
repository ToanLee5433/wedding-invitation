
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
        initial={{ opacity: 0, tracking: "0.1em" }}
        whileInView={{ opacity: 0.6, tracking: "0.5em" }}
        viewport={{ once: true }}
        className="text-gold uppercase tracking-[0.5em] text-[9px] mb-10"
      >
        Official Invitation
      </motion.p>

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
          className="font-script-alex text-5xl md:text-6xl text-gold mt-10 block shimmer-gold leading-none"
        >
          {guestName}
        </motion.div>
      </div>


      <div className="space-y-6 text-gray-500 font-sans-montserrat font-light text-[15px] leading-loose max-w-lg mx-auto">

        {/* Editable Invitation Text */}
        {editMode ? (
          <textarea
            value={invitationText}
            onChange={(e) => onUpdate('invitation_text', e.target.value)}
            className="w-full p-4 border border-gold/30 rounded-lg bg-white/50 text-center text-gray-700 focus:ring-2 focus:ring-gold/50 min-h-[100px] resize-none"
            placeholder="Nhập nội dung lời mời..."
          />
        ) : (
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
        )}


        {/* Editable Initials */}
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1, duration: 1, type: "spring" }}
          className="py-8 flex justify-center items-center"
        >
          <div className="w-12 h-[0.5px] bg-gold/30"></div>
          {editMode ? (
            <input
              type="text"
              value={initials}
              onChange={(e) => onUpdate('initials', e.target.value)}
              className="mx-4 w-20 text-center font-script text-2xl text-gold/80 bg-transparent border-b border-gold/30 focus:outline-none focus:border-gold"
              placeholder="T&C"
            />
          ) : (
            <span className="mx-6 font-script text-2xl text-gold/60">{initials}</span>
          )}
          <div className="w-12 h-[0.5px] bg-gold/30"></div>
        </motion.div>

        {/* Editable Quote */}
        {editMode ? (
          <textarea
            value={quote}
            onChange={(e) => onUpdate('invitation_quote', e.target.value)}
            className="w-full p-4 border border-gold/30 rounded-lg bg-white/50 text-center italic font-serif text-gray-600 focus:ring-2 focus:ring-gold/50 min-h-[80px] resize-none"
            placeholder="Nhập câu trích dẫn..."
          />
        ) : (
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 1.5, duration: 1 }}
            className="italic font-script-dancing text-gold/80 text-xl md:text-2xl mt-4"
          >
            "{quote}"
          </motion.p>
        )}
      </div>
    </section>
  );
};

export default Invitation;

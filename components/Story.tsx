
import React, { useState, useRef } from 'react';
import { motion, useScroll, useSpring, useTransform } from 'framer-motion';
import { Heart, Calendar, Star, Camera, Loader2, Plus, Trash2, Gift, MapPin, Music, Sparkles } from 'lucide-react';
import { uploadMedia } from '../lib/storage';

interface Milestone {
  date: string;
  title: string;
  desc: string;
  img: string;
  icon?: string;
}

interface StoryProps {
  milestones: Milestone[];
  editMode: boolean;
  weddingSlug: string;
  onUpdate: (idx: number, field: keyof Milestone, val: string) => void;
  onAdd?: () => void;
  onRemove?: (idx: number) => void;
}

const MILESTONE_ICONS: { [key: string]: React.ReactNode } = {
  calendar: <Calendar size={18} />,
  heart: <Heart size={18} />,
  star: <Star size={18} />,
  gift: <Gift size={18} />,
  mappin: <MapPin size={18} />,
  music: <Music size={18} />,
  sparkles: <Sparkles size={18} />,
};

const DEFAULT_ICONS = ['calendar', 'heart', 'star', 'gift', 'mappin', 'music', 'sparkles'];

const Story: React.FC<StoryProps> = ({ milestones = [], editMode, weddingSlug, onUpdate, onAdd, onRemove }) => {
  const [uploadingIndex, setUploadingIndex] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Scroll logic for the timeline path drawing
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end center"]
  });

  const pathLength = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  const handleImage = async (idx: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadingIndex(idx);
      const publicUrl = await uploadMedia(file, weddingSlug, 'images', `milestone-${idx}-${Date.now()}`);
      onUpdate(idx, 'img', publicUrl);
    } catch (err) {
      console.error('Upload failed:', err);
      alert('Không thể tải ảnh lên. Vui lòng thử lại.');
    } finally {
      setUploadingIndex(null);
    }
  };

  const getIcon = (idx: number, iconType?: string) => {
    if (iconType && MILESTONE_ICONS[iconType]) return MILESTONE_ICONS[iconType];
    const defaultIconKeys = ['calendar', 'heart', 'star'];
    return MILESTONE_ICONS[defaultIconKeys[idx % defaultIconKeys.length]];
  };

  return (
    <section className="py-24 overflow-hidden" ref={containerRef}>
      <div className="container mx-auto max-w-5xl px-6">
        <div className="text-center mb-20">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-gold uppercase tracking-[0.5em] text-[10px] font-bold block mb-4"
          >
            Our Journey
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            className="font-serif text-5xl md:text-6xl text-gray-800 italic tracking-tighter"
          >
            Câu Chuyện Tình Yêu
          </motion.h2>
          <motion.div
            initial={{ width: 0 }}
            whileInView={{ width: "4rem" }}
            className="h-[1px] bg-gold/30 mx-auto mt-8"
          ></motion.div>
        </div>

        <div className="relative">
          {/* SVG Animated Path for Timeline Line */}
          <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-[2px] hidden md:block">
            <svg className="w-full h-full" preserveAspectRatio="none">
              <line x1="1" y1="0" x2="1" y2="100%" stroke="rgba(212, 175, 55, 0.1)" strokeWidth="2" />
              <motion.line
                x1="1" y1="0" x2="1" y2="100%"
                stroke="#D4AF37" strokeWidth="2"
                style={{ pathLength: pathLength }}
              />
            </svg>
          </div>

          <div className="space-y-32">
            {milestones?.map((m, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className={`flex flex-col md:flex-row items-center gap-12 ${idx % 2 !== 0 ? 'md:flex-row-reverse' : ''} relative group/milestone`}
              >


                <div className="flex-1 w-full relative">
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="rounded-2xl overflow-hidden shadow-2xl border-8 border-white group relative aspect-video md:aspect-square lg:aspect-video"
                  >
                    {m.img ? (
                      <img src={m.img} alt={m.title} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
                    ) : (
                      <div className="w-full h-full bg-slate-50 flex items-center justify-center">
                        <Camera size={48} className="text-slate-200" />
                      </div>
                    )}
                    {editMode && (
                      <label className={`absolute inset-0 bg-black/60 flex flex-col items-center justify-center transition-opacity cursor-pointer ${uploadingIndex === idx ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                        {uploadingIndex === idx ? (
                          <Loader2 className="text-white animate-spin" size={32} />
                        ) : (
                          <>
                            <Camera className="text-white mb-2" size={32} />
                            <span className="text-[10px] uppercase font-bold text-white tracking-widest">Thay ảnh</span>
                          </>
                        )}
                        <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImage(idx, e)} disabled={uploadingIndex !== null} />
                      </label>
                    )}
                  </motion.div>
                </div>

                <div className="relative z-10 flex flex-col items-center">
                  <motion.div
                    whileInView={{ scale: [0, 1.2, 1] }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                    className="w-12 h-12 rounded-full bg-gold text-white flex items-center justify-center shadow-lg shadow-gold/30 border-4 border-white"
                  >
                    {getIcon(idx, m.icon)}
                  </motion.div>
                  {editMode && (
                    <div className="absolute top-14 mt-2 flex flex-wrap gap-1 justify-center w-32 bg-white/90 p-2 rounded-lg shadow-xl opacity-0 group-hover/milestone:opacity-100 transition-opacity">
                      {DEFAULT_ICONS.map((iconKey) => (
                        <button key={iconKey} onClick={() => onUpdate(idx, 'icon' as keyof Milestone, iconKey)} className={`w-6 h-6 rounded flex items-center justify-center text-[10px] transition-all ${m.icon === iconKey ? 'bg-gold text-white' : 'bg-slate-100 text-slate-500 hover:bg-gold/20'}`}>
                          {MILESTONE_ICONS[iconKey]}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex-1 w-full text-center md:text-left">
                  <div className={`space-y-4 ${idx % 2 !== 0 ? 'md:text-right' : ''}`}>
                    {editMode ? (
                      <div className="space-y-4 bg-white/50 p-4 rounded-xl border border-dashed border-gold/20 relative">
                        <input value={m.date} onChange={(e) => onUpdate(idx, 'date', e.target.value)} className="bg-transparent border-b border-gold/30 font-serif italic text-gold text-lg w-full" placeholder="Ngày tháng..." />
                        <input value={m.title} onChange={(e) => onUpdate(idx, 'title', e.target.value)} className="bg-transparent border-b border-gold/30 font-serif text-2xl font-bold text-gray-800 w-full" placeholder="Tiêu đề mốc..." />
                        <textarea value={m.desc} onChange={(e) => onUpdate(idx, 'desc', e.target.value)} className="bg-transparent border border-gold/20 rounded-lg p-3 text-gray-500 text-sm w-full h-32" placeholder="Mô tả kỷ niệm..." />

                        {/* DELETE BUTTON - INSIDE FORM, ALWAYS VISIBLE */}
                        {onRemove && milestones.length > 1 && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              if (window.confirm('Bạn có chắc muốn xoá mốc thời gian này?')) {
                                onRemove(idx);
                              }
                            }}
                            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-rose-500 hover:bg-rose-600 text-white rounded-lg transition-all mt-4 font-bold text-sm uppercase tracking-wider shadow-lg"
                          >
                            <Trash2 size={16} />
                            <span>Xoá mốc thời gian này</span>
                          </button>
                        )}
                      </div>

                    ) : (
                      <>
                        <motion.span
                          initial={{ x: idx % 2 === 0 ? 20 : -20, opacity: 0 }}
                          whileInView={{ x: 0, opacity: 1 }}
                          transition={{ delay: 0.4 }}
                          className="font-serif italic text-gold text-lg block"
                        >
                          {m.date}
                        </motion.span>
                        <motion.h3
                          initial={{ x: idx % 2 === 0 ? 30 : -30, opacity: 0 }}
                          whileInView={{ x: 0, opacity: 1 }}
                          transition={{ delay: 0.5 }}
                          className="font-serif text-3xl text-gray-800 font-bold"
                        >
                          {m.title}
                        </motion.h3>
                        <motion.p
                          initial={{ opacity: 0 }}
                          whileInView={{ opacity: 1 }}
                          transition={{ delay: 0.6 }}
                          className="text-gray-500 font-light leading-relaxed max-w-lg mx-auto md:mx-0"
                        >
                          {m.desc}
                        </motion.p>
                      </>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {editMode && onAdd && (
            <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} className="mt-24 flex justify-center">
              <button onClick={onAdd} className="flex items-center gap-3 px-10 py-5 bg-gold/5 hover:bg-gold text-gold hover:text-white rounded-full transition-all duration-500 group border-2 border-dashed border-gold/30 hover:border-solid">
                <Plus size={24} className="group-hover:rotate-180 transition-transform duration-500" />
                <span className="text-xs uppercase font-black tracking-widest">Thêm mốc thời gian quý giá</span>
              </button>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Story;


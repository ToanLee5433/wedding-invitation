
import React, { useEffect, useState, useRef, Suspense, lazy } from 'react';
import { AnimatePresence, motion, useScroll, useSpring, useInView } from 'framer-motion';
// Added Sparkles to the lucide-react import
import { LayoutDashboard, Cog, Eye, Loader2, Volume2, VolumeX, AlertTriangle, Save, Sparkles } from 'lucide-react';
import { supabase } from './lib/supabaseClient';

// Eager load critical components (above the fold)
import Envelope from './components/Envelope';
import BackgroundMusic from './components/BackgroundMusic';
import FallingPetals from './components/FallingPetals';
import BottomNav from './components/BottomNav';
import Countdown from './components/Countdown';
import Hero from './components/Hero';
import Invitation from './components/Invitation';
import Info from './components/Info';
import RSVP from './components/RSVP';

// Lazy load heavy components (below the fold or conditional)
const AdminDashboard = lazy(() => import('./components/AdminDashboard'));
const Story = lazy(() => import('./components/Story'));
const Album = lazy(() => import('./components/Album'));
const AIFaceBooth = lazy(() => import('./components/AIFaceBooth'));

// Loading fallback component
const LoadingFallback = () => (
  <div className="flex items-center justify-center py-24">
    <Loader2 className="w-8 h-8 text-gold animate-spin" />
  </div>
);


// Define and export WeddingEvent interface
export interface WeddingEvent {
  title: string;
  date: string;
  time: string;
  location: string;
  address: string;
  mapLink: string;
}

const WEDDING_SLUG = import.meta.env.VITE_WEDDING_SLUG || 'trang-chien-2026';

const DEFAULT_WEDDING_DATA = {
  hero_image: 'https://iv1cdn.vnecdn.net/giaitri/images/web/2025/10/23/toan-canh-dam-cuoi-cua-vo-chong-do-thi-ha-1761191294.jpg?w=1200&h=0&q=100&dpr=2&fit=crop&s=moA8LWQ9dLsT6d16c1Vmpg',
  music_url: 'https://docs.google.com/uc?id=1l6GJuaTmotc3lQ2Wead6-2MC2oQ65mc-',
  album_urls: [],
  qr_groom: '',
  qr_bride: '',
  details: {
    groom_name: 'Chiến',
    bride_name: 'Trang',
    event_date: '30 . 01 . 2026',
    invitation_text: 'Trong sự dịu dàng của những ngày cuối năm, chúng mình hạnh phúc chia sẻ khoảnh khắc khởi đầu hành trình mới. Sự hiện diện của bạn không chỉ là niềm vui mà còn là nhân chứng cho tình yêu bền chặt của chúng mình.',
    initials: 'T&C',
    invitation_quote: 'Hạnh phúc là khi được cùng người mình thương, đi qua những ngày bình yên nhất của cuộc đời.',
    milestones: [
      { date: "10 / 05 / 2021", title: "Lần đầu gặp gỡ", desc: "Vào một chiều mưa tại quán cafe nhỏ, định mệnh đã cho chúng mình gặp nhau.", img: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80&w=600" },
      { date: "14 / 02 / 2022", title: "Lời tỏ tình ngọt ngào", desc: "Dưới ánh đèn lung linh của thành phố, chúng mình chính thức gọi nhau là 'Người yêu'.", img: "https://images.unsplash.com/photo-1518196775741-201b817f5024?auto=format&fit=crop&q=80&w=600" },
      { date: "20 / 10 / 2023", title: "Màn cầu hôn bất ngờ", desc: "Tại bãi biển thơ mộng, một chiếc nhẫn và một câu 'Đồng ý' đã thay đổi cuộc đời chúng mình mãi mãi.", img: "https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?auto=format&fit=crop&q=80&w=600" }
    ],
    vuQuy: { title: 'Lễ Vu Quy', date: '30 . 01 . 2026', time: '08:00 AM', location: 'Tư gia Nhà Gái', address: 'Số 123, Đường Hoa Hồng, TP. Hà Nội', mapLink: 'https://maps.google.com' },
    thanhHon: { title: 'Lễ Thành Hôn', date: '30 . 01 . 2026', time: '11:00 AM', location: 'Trung tâm Hội nghị Diamond', address: 'Số 456, Đường Kim Cương, TP. Hà Nội', mapLink: 'https://maps.google.com' }
  }
};

// Section Reveal Wrapper Component - Optimized for smooth UX
// Content stays visible after appearing (once: true for animation)
// Navigation tracking uses a separate observer (once: false for continuous tracking)
const SectionReveal: React.FC<{ children: React.ReactNode; id?: string; onVisible?: (id: string) => void }> = ({ children, id, onVisible }) => {
  const ref = useRef(null);
  // Separate observer for navigation tracking - needs to fire repeatedly
  const isInViewForNav = useInView(ref, { once: false, amount: 0.4 });

  useEffect(() => {
    if (isInViewForNav && id && onVisible) {
      onVisible(id);
    }
  }, [isInViewForNav, id, onVisible]);

  return (
    <motion.div
      ref={ref}
      id={id}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
};

const App: React.FC = () => {
  const ADMIN_SECRET_PATH = import.meta.env.VITE_ADMIN_SECRET_PATH || '/admin@5433';
  const isAdmin = window.location.pathname === ADMIN_SECRET_PATH;
  const isAdminDashboard = isAdmin && window.location.search.includes('dashboard=true');

  const getGuestNameFromURL = (): string => {
    const params = new URLSearchParams(window.location.search);
    const guestName = params.get('to') || params.get('Ten') || params.get('name');
    if (guestName) {
      return decodeURIComponent(guestName).replace(/_/g, ' ');
    }
    return 'Bạn';
  };

  const [guestName] = useState<string>(getGuestNameFromURL());
  const [isOpened, setIsOpened] = useState(isAdminDashboard);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [showAdmin, setShowAdmin] = useState(isAdminDashboard);
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const [saving, setSaving] = useState(false);
  const [weddingData, setWeddingData] = useState<any>(null);
  const [activeSection, setActiveSection] = useState('top');

  // Scroll Progress Logic
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      let data = null;
      try {
        const result = await supabase.from('weddings').select('*').eq('slug', WEDDING_SLUG).single();
        if (!result.error) data = result.data;
      } catch (supabaseErr) {
        console.warn("❌ [App] Supabase connection failed:", supabaseErr);
      }

      if (data) {
        const mergedDetails = {
          ...DEFAULT_WEDDING_DATA.details,
          ...(data.details || {}),
          milestones: (data.details?.milestones && data.details.milestones.length > 0)
            ? data.details.milestones
            : DEFAULT_WEDDING_DATA.details.milestones,
          vuQuy: { ...DEFAULT_WEDDING_DATA.details.vuQuy, ...(data.details?.vuQuy || {}) },
          thanhHon: { ...DEFAULT_WEDDING_DATA.details.thanhHon, ...(data.details?.thanhHon || {}) }
        };

        const mergedData = {
          ...DEFAULT_WEDDING_DATA,
          id: data.id,
          slug: data.slug,
          hero_image: data.hero_image || DEFAULT_WEDDING_DATA.hero_image,
          music_url: data.music_url || DEFAULT_WEDDING_DATA.music_url,
          album_urls: (data.album_urls && data.album_urls.length > 0) ? data.album_urls : DEFAULT_WEDDING_DATA.album_urls,
          qr_groom: data.qr_groom || DEFAULT_WEDDING_DATA.qr_groom,
          qr_bride: data.qr_bride || DEFAULT_WEDDING_DATA.qr_bride,
          details: mergedDetails
        };
        setWeddingData(mergedData);
      } else {
        setWeddingData(DEFAULT_WEDDING_DATA);
      }
    } catch (err) {
      setWeddingData(DEFAULT_WEDDING_DATA);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const updateData = async (newData: any) => {
    setSaving(true);
    const updated = { ...weddingData, ...newData };
    setWeddingData(updated);
    try {
      await supabase.from('weddings').update({
        details: updated.details,
        hero_image: updated.hero_image,
        album_urls: updated.album_urls,
        music_url: updated.music_url,
        qr_groom: updated.qr_groom,
        qr_bride: updated.qr_bride
      }).eq('slug', WEDDING_SLUG);
    } catch (err) { console.error("Update error:", err); }
    finally { setSaving(false); }
  };

  if (loading || !weddingData) return (
    <div className="h-screen w-full flex items-center justify-center bg-[#FDFCF0]">
      <div className="text-center">
        <Loader2 className="w-10 h-10 text-gold animate-spin mx-auto mb-4" />
        <p className="font-serif italic text-gold">Đang chuẩn bị thiệp mời...</p>
      </div>
    </div>
  );

  return (
    <div id="top" className="min-h-screen relative bg-[#FDFCF0] bg-grain scroll-smooth">
      {/* Scroll Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-gold origin-left z-progress"
        style={{ scaleX }}
      />

      <BackgroundMusic url={weddingData.music_url} isPlaying={isMusicPlaying} setIsPlaying={setIsMusicPlaying} visible={isOpened && !showAdmin} />

      {!isOpened && (
        <Envelope
          groomName={weddingData.details.groom_name}
          brideName={weddingData.details.bride_name}
          onStart={() => setIsMusicPlaying(true)}
          onComplete={() => {
            setIsOpened(true);
            document.body.classList.remove('intro-active');
          }}
        />
      )}

      {isOpened && (
        <>
          {showAdmin && isAdmin ? (
            <Suspense fallback={<LoadingFallback />}>
              <AdminDashboard
                weddingId={weddingData.id}
                slug={WEDDING_SLUG}
                onClose={() => {
                  window.location.href = ADMIN_SECRET_PATH;
                }}
              />
            </Suspense>
          ) : (
            <>
              <FallingPetals />
              <BottomNav activeSection={activeSection} />

              {isAdmin && (
                <div className="fixed bottom-44 right-6 md:bottom-28 md:right-8 z-dashboard flex flex-col gap-4">
                  <button
                    onClick={() => setEditMode(!editMode)}
                    className={`w-12 h-12 rounded-full flex items-center justify-center shadow-2xl transition-all ${editMode ? 'bg-rose-500 text-white' : 'bg-gold text-white hover:scale-110'}`}
                    title={editMode ? "Xem chế độ khách" : "Chỉnh sửa thiệp"}
                  >
                    {editMode ? <Eye size={20} /> : <Cog size={20} />}
                  </button>
                  <button
                    onClick={() => {
                      window.location.href = ADMIN_SECRET_PATH + '?dashboard=true';
                    }}
                    className="bg-slate-900 text-white w-12 h-12 rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition-all"
                    title="Quản lý khách mời"
                  >
                    <LayoutDashboard size={20} />
                  </button>
                </div>
              )}

              <div className={`${editMode ? 'pt-20 border-t-4 border-gold shadow-inner' : ''} transition-all duration-500`}>
                {editMode && (
                  <div className="fixed top-0 left-0 w-full bg-gold text-white py-2 px-6 flex justify-between items-center z-overlay shadow-lg animate-in slide-in-from-top duration-300">
                    <span className="text-[10px] uppercase font-black tracking-widest flex items-center gap-2">
                      <Sparkles size={12} className="animate-pulse" /> Chế độ chỉnh sửa đang bật
                    </span>
                    <button onClick={() => setEditMode(false)} className="text-[10px] uppercase font-bold border border-white/30 px-3 py-1 rounded hover:bg-white hover:text-gold transition-all">Đóng</button>
                  </div>
                )}

                <SectionReveal id="top" onVisible={setActiveSection}>
                  <Hero
                    bgImage={weddingData.hero_image}
                    groomName={weddingData.details.groom_name}
                    brideName={weddingData.details.bride_name}
                    eventDate={weddingData.details.event_date}
                    editMode={editMode}
                    weddingSlug={WEDDING_SLUG}
                    onUpload={(val) => updateData({ hero_image: val })}
                    onUpdate={(field, val) => updateData({ details: { ...weddingData.details, [field]: val } })}
                  />
                </SectionReveal>

                <div className="luxury-container space-y-32 mb-32">
                  <SectionReveal>
                    <Countdown targetDate={weddingData.details.event_date} />
                  </SectionReveal>

                  <SectionReveal>
                    <Invitation
                      guestName={guestName}
                      invitationText={weddingData.details.invitation_text}
                      initials={weddingData.details.initials}
                      quote={weddingData.details.invitation_quote}
                      editMode={editMode}
                      onUpdate={(field, val) => updateData({ details: { ...weddingData.details, [field]: val } })}
                    />
                  </SectionReveal>

                  <SectionReveal id="story" onVisible={setActiveSection}>
                    <Suspense fallback={<LoadingFallback />}>
                      <Story
                        milestones={weddingData.details.milestones || []}
                        editMode={editMode}
                        weddingSlug={WEDDING_SLUG}
                        onUpdate={(idx, field, val) => {
                          const newMilestones = [...weddingData.details.milestones];
                          newMilestones[idx] = { ...newMilestones[idx], [field]: val };
                          updateData({ details: { ...weddingData.details, milestones: newMilestones } });
                        }}
                        onAdd={() => {
                          const newMilestones = [...(weddingData.details.milestones || []), {
                            date: '',
                            title: 'Kỷ niệm mới',
                            desc: 'Mô tả kỷ niệm của bạn...',
                            img: '',
                            icon: 'heart'
                          }];
                          updateData({ details: { ...weddingData.details, milestones: newMilestones } });
                        }}
                        onRemove={(idx) => {
                          const newMilestones = weddingData.details.milestones.filter((_: any, i: number) => i !== idx);
                          updateData({ details: { ...weddingData.details, milestones: newMilestones } });
                        }}
                      />
                    </Suspense>
                  </SectionReveal>

                  <SectionReveal id="album" onVisible={setActiveSection}>
                    <Suspense fallback={<LoadingFallback />}>
                      <Album photos={weddingData.album_urls || []} editMode={editMode} weddingSlug={WEDDING_SLUG} onUpload={(idx, val) => {
                        const newAlbum = [...(weddingData.album_urls || Array(6).fill(''))];
                        newAlbum[idx] = val;
                        updateData({ album_urls: newAlbum });
                      }} />
                    </Suspense>
                  </SectionReveal>
                </div>

                <SectionReveal>
                  <div className="w-full mb-32">
                    <Suspense fallback={<LoadingFallback />}>
                      <AIFaceBooth />
                    </Suspense>
                  </div>
                </SectionReveal>

                <div className="luxury-container space-y-32">
                  <SectionReveal id="info" onVisible={setActiveSection}>
                    <Info
                      details={{ vuQuy: weddingData.details.vuQuy, thanhHon: weddingData.details.thanhHon }}
                      editMode={editMode}
                      onUpdate={(type, field, val) => {
                        const newDetails = { ...weddingData.details };
                        newDetails[type] = { ...newDetails[type], [field]: val };
                        updateData({ details: newDetails });
                      }}
                    />
                  </SectionReveal>

                  <SectionReveal id="rsvp" onVisible={setActiveSection}>
                    <RSVP
                      qrGroom={weddingData.qr_groom} qrBride={weddingData.qr_bride}
                      weddingSlug={WEDDING_SLUG} editMode={editMode}
                      onUploadGroom={(val) => updateData({ qr_groom: val })}
                      onUploadBride={(val) => updateData({ qr_bride: val })}
                    />
                  </SectionReveal>
                </div>
              </div>

              <footer className="py-24 text-center border-t border-gold/10 bg-white mt-32 pb-48 md:pb-24">
                <p className="font-script text-4xl text-gold mb-4 tracking-tighter">
                  {weddingData.details.bride_name} & {weddingData.details.groom_name}
                </p>
                <p className="font-serif italic text-gray-400 text-[12px] uppercase tracking-widest">Happily Ever After • 2026</p>
              </footer>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default App;


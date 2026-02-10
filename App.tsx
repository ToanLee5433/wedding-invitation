
import React, { useEffect, useState, useRef, Suspense, lazy } from 'react';
import { motion, useScroll, useSpring, useInView } from 'framer-motion';
import { Loader2, Settings as SettingsIcon, Save, Heart, X } from 'lucide-react';
import { supabase } from './lib/supabaseClient';

// Eager load critical components
import Envelope from './components/Envelope';
import BackgroundMusic from './components/BackgroundMusic';
import FallingPetals from './components/FallingPetals';
import BottomNav from './components/BottomNav';
import Countdown from './components/Countdown';
import Hero from './components/Hero';
import Invitation from './components/Invitation';
import Info from './components/Info';
import RSVP from './components/RSVP';

// Admin components (direct import - fixes dynamic import errors)
import AdminDashboard from './components/AdminDashboard';
import AdminLogin from './components/AdminLogin';

// Lazy load heavy guest-facing components
const Story = lazy(() => import('./components/Story'));
const Album = lazy(() => import('./components/Album'));
const AIFaceBooth = lazy(() => import('./components/AIFaceBooth'));

const LoadingFallback = () => (
  <div className="fixed inset-0 z-[50] flex flex-col items-center justify-center bg-[#FDFCF0]">
    <div className="relative">
      <div className="absolute inset-0 border-4 border-rose-100 rounded-full animate-ping opacity-20"></div>
      <div className="w-20 h-20 bg-white border border-rose-100 rounded-full flex items-center justify-center shadow-xl relative z-10">
        <Heart className="text-rose-400 fill-rose-100 animate-pulse" size={32} />
      </div>
    </div>
    <span className="mt-8 font-serif italic text-slate-500 tracking-widest text-xs animate-pulse">Loading Love Story...</span>
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
  id: '75761bf5-ea34-4d70-a15e-a5bc97c40de9',
  slug: 'trang-chien-2026',
  hero_image: 'https://dhnarfrkgnotuifqnvzo.supabase.co/storage/v1/object/public/wedding-media/trang-chien-2026/images/hero.jpg',
  music_url: 'https://dhnarfrkgnotuifqnvzo.supabase.co/storage/v1/object/public/wedding-media/trang-chien-2026/audio/background-music.mp3',
  album_urls: [],
  qr_groom: '',
  qr_bride: '',
  details: {
    groom_name: 'Trịnh Mạnh Chiến',
    bride_name: 'Cù Quỳnh Trang',
    event_date: '15 . 01 . 2026',
    invitation_text: 'Trong sự dịu dàng của những ngày đầu năm, chúng mình hạnh phúc chia sẻ khoảnh khắc khởi đầu hành trình mới. Sự hiện diện của bạn không chỉ là niềm vui mà còn là nhân chứng cho tình yêu bền chặt của chúng mình.',
    initials: 'T&C',
    invitation_quote: 'Hạnh phúc là khi được cùng người mình thương, đi qua những ngày bình yên nhất của cuộc đời.',
    milestones: [
      { date: "10 / 05 / 2021", title: "Lần đầu gặp gỡ", desc: "Vào một chiều mưa tại quán cafe nhỏ, định mệnh đã cho chúng mình gặp nhau.", img: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80&w=600", icon: "calendar" },
      { date: "14 / 02 / 2022", title: "Lời tỏ tình ngọt ngào", desc: "Dưới ánh đèn lung linh của thành phố, chúng mình chính thức gọi nhau là 'Người yêu'.", img: "https://images.unsplash.com/photo-1518196775741-201b817f5024?auto=format&fit=crop&q=80&w=600" },
      { date: "20 / 10 / 2023", title: "Màn cầu hôn bất ngờ", desc: "Tại bãi biển thơ mộng, một chiếc nhẫn và một câu 'Đồng ý' đã thay đổi cuộc đời chúng mình mãi mãi.", img: "https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?auto=format&fit=crop&q=80&w=600" }
    ],
    vuQuy: { title: 'Lễ Vu Quy', date: '15 . 01 . 2026', time: '08:00 AM', location: 'Tư gia Nhà Gái', address: 'Số 123, Đường Hoa Hồng, TP. Hà Nội', mapLink: 'https://maps.google.com' },
    thanhHon: { title: 'Lễ Thành Hôn', date: '15 . 01 . 2026', time: '11:00 AM', location: 'Trung tâm Hội nghị Diamond', address: 'Km10 Đ. Nguyễn Trãi, P. Mộ Lao, Hà Đông, Hà Nội, Việt Nam', mapLink: 'https://maps.app.goo.gl/BhqTC2NTD86knWXz9' },
    bank_groom: 'VCB - 0123456789',
    bank_bride: 'TPB - 9876543210'
  }
};

// Section Reveal Wrapper Component - Optimized for smooth UX
// Content stays visible after appearing (once: true for animation)
// Navigation tracking uses a separate observer (once: false for continuous tracking)
const SectionReveal: React.FC<{ children: React.ReactNode; id?: string; onVisible?: (id: string) => void }> = ({ children, id, onVisible }) => {
  const ref = useRef(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
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
      initial={{ opacity: 0, y: isMobile ? 20 : 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: isMobile ? 0.5 : 0.8, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
};

const App: React.FC = () => {
  const ADMIN_SECRET_PATH = import.meta.env.VITE_ADMIN_SECRET_PATH || '/admin@5433';
  const isAdminPath = window.location.pathname === ADMIN_SECRET_PATH;
  
  // Check for specialized Edit Mode (accessed via dashboard)
  const isEditParam = new URLSearchParams(window.location.search).get('mode') === 'edit';
  const isSessionAuth = sessionStorage.getItem('admin_authenticated') === 'true';
  const canEdit = isEditParam && isSessionAuth;

  // Admin authentication (for admin route)
  const [adminAuthenticated, setAdminAuthenticated] = useState(() => {
    return isAdminPath && isSessionAuth;
  });

  const getGuestNameFromURL = (): string => {
    const params = new URLSearchParams(window.location.search);
    const guestName = params.get('to') || params.get('Ten') || params.get('name');
    if (guestName) {
      return decodeURIComponent(guestName).replace(/_/g, ' ');
    }
    return 'Bạn';
  };

  const [guestName] = useState<string>(getGuestNameFromURL());
  const [isOpened, setIsOpened] = useState(false);
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const [weddingData, setWeddingData] = useState<any>(null);
  const [activeSection, setActiveSection] = useState('top');

  // Scroll Progress Logic
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  // Handle Updates from Inline Editing
  const handleUpdate = (field: string, value: any, section?: string) => {
    if (!canEdit) return;
    
    setWeddingData((prev: any) => {
      const newData = { ...prev };
      if (section === 'details') {
        newData.details = { ...newData.details, [field]: value };
      } else if (section === 'root') {
        newData[field] = value;
      }
      return newData;
    });
  };

  const handleStoryUpdate = (idx: number, field: string, value: any) => {
    setWeddingData((prev: any) => {
      const newMilestones = [...(prev.details.milestones || [])];
      newMilestones[idx] = { ...newMilestones[idx], [field]: value };
      return {
        ...prev,
        details: { ...prev.details, milestones: newMilestones }
      };
    });
  };

  const handleStoryAdd = () => {
    setWeddingData((prev: any) => {
      const newMilestones = [...(prev.details.milestones || []), { title: 'Mốc mới', date: '01/01/2026', desc: 'Mô tả kỷ niệm...', img: '' }];
      return {
        ...prev,
        details: { ...prev.details, milestones: newMilestones }
      };
    });
  };

  const handleStoryRemove = (idx: number) => {
    setWeddingData((prev: any) => {
      const newMilestones = [...(prev.details.milestones || [])];
      newMilestones.splice(idx, 1);
      return {
        ...prev,
        details: { ...prev.details, milestones: newMilestones }
      };
    });
  };

  const [saving, setSaving] = useState(false);
  const saveChanges = async () => {
    if(!weddingData?.id) return;
    setSaving(true);
    try {
      const { error } = await supabase.from('weddings').update({
        hero_image: weddingData.hero_image,
        music_url: weddingData.music_url,
        album_urls: weddingData.album_urls,
        qr_groom: weddingData.qr_groom,
        qr_bride: weddingData.qr_bride,
        details: weddingData.details
      }).eq('id', weddingData.id);
      
      if (error) throw error;
      alert('Đã lưu thay đổi thành công!');
    } catch (e: any) {
      alert('Lỗi lưu: ' + e.message);
    } finally {
      setSaving(false);
    }
  };

  const fetchData = async () => {
    try {
      let data = null;
      try {
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Timeout')), 5000)
        );
        const queryPromise = supabase.from('weddings').select('*').eq('slug', WEDDING_SLUG).single();
        const result = await Promise.race([queryPromise, timeoutPromise]) as any;
        if (!result.error) data = result.data;
      } catch (supabaseErr) {
        console.warn("❌ [App] Supabase connection failed or timeout:", supabaseErr);
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

        setWeddingData({
          ...DEFAULT_WEDDING_DATA,
          id: data.id,
          slug: data.slug,
          hero_image: data.hero_image || DEFAULT_WEDDING_DATA.hero_image,
          music_url: data.music_url || DEFAULT_WEDDING_DATA.music_url,
          album_urls: (data.album_urls && data.album_urls.length > 0) ? data.album_urls : DEFAULT_WEDDING_DATA.album_urls,
          qr_groom: data.qr_groom || DEFAULT_WEDDING_DATA.qr_groom,
          qr_bride: data.qr_bride || DEFAULT_WEDDING_DATA.qr_bride,
          details: mergedDetails
        });
      }
    } catch (err) {
      console.warn("❌ [App] Fetch error:", err);
    }
  };

  useEffect(() => {
    setWeddingData(DEFAULT_WEDDING_DATA);
    fetchData();
  },[]);

  // ==========================================
  // ADMIN ROUTE: Login → Dashboard
  // ==========================================
  if (isAdminPath) {
    if (!adminAuthenticated) {
      return <AdminLogin onLogin={() => setAdminAuthenticated(true)} />;
    }
    return (
      <AdminDashboard
        weddingId={DEFAULT_WEDDING_DATA.id}
        slug={WEDDING_SLUG}
        onClose={() => {
          sessionStorage.removeItem('admin_authenticated');
          window.location.href = '/';
        }}
      />
    );
  }

  // ==========================================
  // GUEST ROUTE: Wedding Invitation
  // ==========================================
  if (!weddingData) return null;

  const AdminToolbar = () => {
    const [expanded, setExpanded] = useState(false);
    
    return (
      <div className={`fixed top-4 left-4 z-[99999] bg-white/90 backdrop-blur-md shadow-2xl rounded-2xl border border-rose-100 transition-all duration-300 overflow-hidden ${expanded ? 'w-auto p-4' : 'w-12 h-12 p-0 flex items-center justify-center cursor-pointer hover:scale-110'}`} onClick={() => !expanded && setExpanded(true)}>
        
        {!expanded ? (
          <SettingsIcon size={20} className="text-rose-600 animate-spin-slow" />
        ) : (
          <div className="flex flex-col gap-3 min-w-[200px]">
            <div className="flex items-center justify-between border-b border-gray-100 pb-2 mb-1">
               <div className="flex items-center gap-2">
                 <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                 <span className="text-[10px] uppercase font-bold tracking-widest text-slate-500">Chế độ chỉnh sửa</span>
               </div>
               <button onClick={(e) => { e.stopPropagation(); setExpanded(false); }} className="text-slate-400 hover:text-rose-500"><X size={16} /></button>
            </div>
            
            <button 
              onClick={(e) => { e.stopPropagation(); saveChanges(); }}
              disabled={saving}
              className="w-full bg-slate-900 text-white px-4 py-3 rounded-xl font-bold text-xs hover:bg-black transition-all flex items-center justify-center gap-2 shadow-lg shadow-slate-200"
            >
               {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />} 
               {saving ? 'Đang lưu...' : 'Lưu Thay Đổi'}
            </button>

            <button 
              onClick={(e) => { e.stopPropagation(); window.location.href = ADMIN_SECRET_PATH; }}
              className="w-full bg-rose-50 text-rose-600 px-4 py-3 rounded-xl font-bold text-xs hover:bg-rose-100 hover:text-rose-700 transition-colors flex items-center justify-center gap-2"
            >
               ⬅ Quay lại Admin
            </button>
            <div className="text-[9px] text-center text-slate-400 italic mt-1">
               Click vào văn bản/ảnh để sửa
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div id="top" className="min-h-screen relative bg-[#FDFCF0] bg-grain scroll-smooth">
      {/* Edit Mode Floating Controls - COLLAPSIBLE */}
      {canEdit && <AdminToolbar />}

      {/* Scroll Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-gold origin-left z-progress"
        style={{ scaleX }}
      />

      <BackgroundMusic url={weddingData.music_url} isPlaying={isMusicPlaying} setIsPlaying={setIsMusicPlaying} visible={isOpened} />

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
          <FallingPetals />
          <BottomNav activeSection={activeSection} />

          <SectionReveal id="top" onVisible={setActiveSection}>
            <Hero
              bgImage={weddingData.hero_image}
              groomName={weddingData.details.groom_name}
              brideName={weddingData.details.bride_name}
              eventDate={weddingData.details.event_date}
              editMode={canEdit}
              weddingSlug={WEDDING_SLUG}
              onUpload={(url) => handleUpdate('hero_image', url, 'root')}
              onUpdate={(f, v) => handleUpdate(f, v, 'details')}
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
                editMode={canEdit}
                onUpdate={(f, v) => handleUpdate(f, v, 'details')}
              />
            </SectionReveal>

            <SectionReveal id="story" onVisible={setActiveSection}>
              <Suspense fallback={<LoadingFallback />}>
                <Story
                  milestones={weddingData.details.milestones || []}
                  editMode={canEdit}
                  weddingSlug={WEDDING_SLUG}
                  onUpdate={handleStoryUpdate}
                  onAdd={handleStoryAdd}
                  onRemove={handleStoryRemove}
                />
              </Suspense>
            </SectionReveal>

            <SectionReveal id="album" onVisible={setActiveSection}>
              <Suspense fallback={<LoadingFallback />}>
                <Album
                  photos={weddingData.album_urls || []}
                  editMode={canEdit}
                  weddingSlug={WEDDING_SLUG}
                  onUpload={(newPhotos) => handleUpdate('album_urls', newPhotos, 'root')}
                />
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
                editMode={canEdit}
                onUpdate={(type, field, value) => {
                  const currentEvent = weddingData.details[type as 'vuQuy' | 'thanhHon'] || {};
                  handleUpdate(type, { ...currentEvent, [field]: value }, 'details');
                }}
              />
            </SectionReveal>

            <SectionReveal id="rsvp" onVisible={setActiveSection}>
              <RSVP
                qrGroom={weddingData.qr_groom}
                qrBride={weddingData.qr_bride}
                groomName={weddingData.details.groom_name}
                brideName={weddingData.details.bride_name}
                bankGroom={weddingData.details.bank_groom || 'VCB - 0123456789'}
                bankBride={weddingData.details.bank_bride || 'TPB - 9876543210'}
                weddingSlug={WEDDING_SLUG}
                editMode={canEdit}
                onUploadGroom={(url) => handleUpdate('qr_groom', url, 'root')}
                onUploadBride={(url) => handleUpdate('qr_bride', url, 'root')}
                onUpdateBankGroom={(val) => handleUpdate('bank_groom', val, 'details')}
                onUpdateBankBride={(val) => handleUpdate('bank_bride', val, 'details')}
              />
            </SectionReveal>
          </div>

          <footer className="py-24 text-center border-t border-gold/10 bg-white mt-32 pb-48 md:pb-24">
            <p className="font-script text-4xl text-gold mb-4 tracking-tighter">
              {weddingData.details.bride_name} & {weddingData.details.groom_name}
            </p>
            <p className="font-serif italic text-gray-400 text-[12px] uppercase tracking-widest">Happily Ever After • 2026</p>
          </footer>
        </>
      )}
    </div>
  );
};

export default App;


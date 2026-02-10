
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users, Settings, X, LogOut, Link as LinkIcon, Menu, Eye,
  Heart, PenTool, BarChart3, Calendar, UserCheck, MessageSquare, ExternalLink,
  Sparkles, TrendingUp, ChevronRight
} from 'lucide-react';
import { supabase } from '../lib/supabaseClient';
import AdminGuestList from './AdminGuestList';
import AdminSettings from './AdminSettings';
import LinkGenerator from './LinkGenerator';

interface AdminDashboardProps {
  weddingId: string;
  slug: string;
  onClose: () => void;
}

const WEDDING_SLUG = import.meta.env.VITE_WEDDING_SLUG || 'trang-chien-2026';

const AdminDashboard: React.FC<AdminDashboardProps> = ({ weddingId, slug, onClose }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'guests' | 'links' | 'settings'>('overview');
  const [mobileOpen, setMobileOpen] = useState(false);
  const [stats, setStats] = useState({ guests: 0, confirmed: 0, declined: 0, wishes: 0, totalPeople: 0 });
  const [wedding, setWedding] = useState({ bride: '', groom: '', date: '' });

  useEffect(() => {
    (async () => {
      try {
        const { data: w } = await supabase.from('weddings').select('id, details').eq('slug', WEDDING_SLUG).single();
        if (w) {
          setWedding({ bride: w.details?.bride_name || 'Cô dâu', groom: w.details?.groom_name || 'Chú rể', date: w.details?.event_date || '' });
          const { data: g } = await supabase.from('guests').select('*').eq('wedding_id', w.id);
          if (g) {
            const confirmed = g.filter(x => x.attendance_status === true);
            setStats({
              guests: g.length,
              confirmed: confirmed.length,
              declined: g.filter(x => x.attendance_status === false).length,
              wishes: g.filter(x => x.wish_message).length,
              totalPeople: confirmed.reduce((s, x) => s + (x.guest_count || 1), 0)
            });
          }
        }
      } catch (err) { console.error('Stats fetch:', err); }
    })();
  }, [activeTab]);

  const handleViewEdit = () => { sessionStorage.setItem('admin_edit_mode', 'true'); window.location.href = '/?mode=edit'; };
  const handlePreview = () => { window.open('/', '_blank'); };
  const go = (tab: typeof activeTab) => { setActiveTab(tab); setMobileOpen(false); };

  const tabs = [
    { id: 'overview' as const, icon: BarChart3, label: 'Tổng quan' },
    { id: 'guests' as const, icon: Users, label: 'Khách mời' },
    { id: 'links' as const, icon: LinkIcon, label: 'Tạo link mời' },
    { id: 'settings' as const, icon: Settings, label: 'Cấu hình' },
  ];

  const tabTitle: Record<string, string> = { overview: 'Tổng quan', guests: 'Quản lý khách mời', links: 'Tạo link mời', settings: 'Cấu hình thiệp' };

  /* ────────────── Sidebar content (shared mobile/desktop) ────────────── */
  const sidebarContent = (
    <>
      {/* Brand */}
      <div className="px-5 pt-6 pb-4 flex items-center gap-3">
        <div className="w-9 h-9 rounded-lg flex items-center justify-center shadow-md" style={{ background: 'linear-gradient(to bottom right, #D4AF37, #b8952d)' }}>
          <Heart className="w-4 h-4 text-white fill-white/40" />
        </div>
        <div className="flex-1 min-w-0">
          <h1 className="text-xs-plus font-bold text-brown leading-tight truncate">Wedding Admin</h1>
          <p className="text-xxs text-gold-darker font-semibold truncate">{WEDDING_SLUG}</p>
        </div>
        <button onClick={() => setMobileOpen(false)} className="lg:hidden p-1 text-muted-alt hover:text-brown-med">
          <X size={18} />
        </button>
      </div>

      {/* Nav Tabs */}
      <nav className="flex-1 px-3 py-2 space-y-0.5 overflow-y-auto">
        {tabs.map(t => {
          const Icon = t.icon;
          const isActive = activeTab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => go(t.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-all text-xs-plus font-semibold ${
                isActive
                  ? 'bg-gold/10 text-gold-deep'
                  : 'text-muted hover:bg-ivory-hover hover:text-brown-light'
              }`}
            >
              <Icon className={`shrink-0 ${isActive ? 'text-gold' : ''}`} style={{ width: 18, height: 18 }} />
              {t.label}
            </button>
          );
        })}
      </nav>

      {/* Divider */}
      <div className="mx-4 border-t border-warm" />

      {/* Actions */}
      <div className="p-3 space-y-1.5">
        <button
          onClick={handleViewEdit}
          className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-gold text-white text-xs font-bold tracking-wide hover:bg-gold-dark transition-colors shadow-sm"
        >
          <PenTool size={14} />
          Sửa nội dung thiệp
        </button>
        <button
          onClick={handlePreview}
          className="w-full flex items-center justify-center gap-2 py-2 rounded-lg text-muted-light text-xs font-semibold hover:bg-ivory-hover transition-colors"
        >
          <ExternalLink size={13} />
          Xem thiệp
        </button>
        <button
          onClick={onClose}
          className="w-full flex items-center justify-center gap-2 py-2 rounded-lg text-muted-lightest text-xs font-medium hover:text-gold hover:bg-ivory-warm transition-colors"
        >
          <LogOut size={13} />
          Đăng xuất
        </button>
      </div>
    </>
  );

  return (
    <div className="fixed inset-0 flex bg-page" style={{ zIndex: 100001, fontFamily: "'Montserrat', Arial, sans-serif" }}>
      {/* ── Desktop Sidebar ── */}
      <aside className="hidden lg:flex flex-col shrink-0 bg-ivory border-r border-warm" style={{ width: 240 }}>
        {sidebarContent}
      </aside>

      {/* ── Mobile overlay + drawer ── */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              key="overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 z-50 lg:hidden"
              onClick={() => setMobileOpen(false)}
            />
            <motion.aside
              key="drawer"
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', stiffness: 400, damping: 36 }}
              className="fixed inset-y-0 left-0 z-50 bg-ivory border-r border-warm flex flex-col lg:hidden shadow-2xl"
              style={{ width: 260 }}
            >
              {sidebarContent}
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* ── Main Area ── */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        {/* Top bar */}
        <header className="h-14 shrink-0 bg-white-70 backdrop-blur border-b border-warm px-4 md:px-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => setMobileOpen(true)} className="lg:hidden p-1.5 text-muted-alt hover:text-brown-med rounded-md hover:bg-ivory-hover transition-colors">
              <Menu size={20} />
            </button>
            <span className="text-sm font-bold text-brown-deep">{tabTitle[activeTab]}</span>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={handleViewEdit} className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-gold-deep bg-gold/10 rounded-md hover:bg-gold-20 transition-colors">
              <PenTool size={12} /> Sửa thiệp
            </button>
            <button onClick={handlePreview} className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-muted-light hover:bg-ivory-hover rounded-md transition-colors">
              <Eye size={12} /> Xem trước
            </button>
            <button onClick={onClose} className="p-1.5 text-muted-alt hover:text-brown-med rounded-md hover:bg-ivory-hover transition-colors">
              <X size={18} />
            </button>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto">
          <AnimatePresence mode="wait">
            {/* ────── OVERVIEW TAB ────── */}
            {activeTab === 'overview' && (
              <motion.div key="ov" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="p-4 md:p-8 max-w-6xl mx-auto space-y-6">
                {/* Hero Card */}
                <div className="relative rounded-2xl overflow-hidden bg-brown text-white p-8 md:p-10">
                  <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1519741497674-611481863552?q=60&w=1200&auto=format')", backgroundSize: 'cover', backgroundPosition: 'center' }} />
                  <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom right, rgb(44 36 24 / 0.9), rgb(44 36 24 / 0.8), rgb(61 46 21 / 0.9))' }} />
                  <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <Sparkles size={12} className="text-gold" />
                        <span className="text-xxs uppercase tracking-extra-wide text-gold-60 font-bold">Wedding Dashboard</span>
                      </div>
                      <h2 className="font-serif text-3xl md:text-4xl font-bold" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
                        {wedding.bride} <span className="text-gold mx-1">&</span> {wedding.groom}
                      </h2>
                      {wedding.date && (
                        <div className="flex items-center gap-2 text-white-40 text-sm mt-2">
                          <Calendar size={14} /> {wedding.date}
                        </div>
                      )}
                    </div>
                    <div className="flex gap-3">
                      <button onClick={handleViewEdit} className="flex items-center gap-2 px-5 py-3 bg-gold text-brown rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-gold-light transition-colors shadow-lg">
                        <PenTool size={13} /> Sửa thiệp
                      </button>
                      <button onClick={handlePreview} className="flex items-center gap-2 px-5 py-3 border border-white-15 text-white-70 rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-white-10 transition-colors">
                        <ExternalLink size={13} /> Xem thiệp
                      </button>
                    </div>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                  {[
                    { icon: Users, label: 'Đã mời', value: stats.guests, accent: '#6366f1' },
                    { icon: UserCheck, label: 'Xác nhận', value: stats.confirmed, accent: '#10b981' },
                    { icon: TrendingUp, label: 'Tổng khách', value: stats.totalPeople, accent: '#D4AF37' },
                    { icon: X, label: 'Từ chối', value: stats.declined, accent: '#94a3b8' },
                    { icon: MessageSquare, label: 'Lời chúc', value: stats.wishes, accent: '#f59e0b' },
                  ].map((s, i) => {
                    const Icon = s.icon;
                    return (
                      <div key={i} className="bg-white rounded-xl p-4 border border-warm shadow-sm hover:shadow-md transition-shadow">
                        <div className="w-9 h-9 rounded-lg flex items-center justify-center mb-2" style={{ backgroundColor: s.accent + '12', color: s.accent }}>
                          <Icon size={17} />
                        </div>
                        <div className="text-2xl font-bold text-brown">{s.value}</div>
                        <div className="text-xxs uppercase tracking-wider font-bold text-muted-alt">{s.label}</div>
                      </div>
                    );
                  })}
                </div>

                {/* Quick Actions */}
                <div>
                  <h3 className="text-xs-sm uppercase tracking-wider font-bold text-muted-alt mb-3">Thao tác nhanh</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    {[
                      { icon: PenTool, title: 'Sửa nội dung thiệp', desc: 'Chỉnh sửa lời mời, ảnh, nhạc...', color: '#D4AF37', action: handleViewEdit },
                      { icon: Users, title: 'Quản lý khách mời', desc: 'Thêm/sửa/xóa, xem phản hồi', color: '#6366f1', action: () => go('guests') },
                      { icon: LinkIcon, title: 'Tạo link cá nhân', desc: 'Link thiệp riêng cho từng khách', color: '#8b5cf6', action: () => go('links') },
                      { icon: Settings, title: 'Cấu hình nâng cao', desc: 'Ảnh bìa, nhạc, địa điểm...', color: '#f59e0b', action: () => go('settings') },
                    ].map((a, i) => {
                      const Icon = a.icon;
                      return (
                        <button
                          key={i}
                          onClick={a.action}
                          className="bg-white border border-warm rounded-xl p-4 text-left hover:shadow-lg hover:-translate-y-0.5 transition-all group"
                        >
                          <div className="w-9 h-9 rounded-lg flex items-center justify-center mb-3 transition-transform group-hover:scale-110" style={{ backgroundColor: a.color + '14', color: a.color }}>
                            <Icon size={17} />
                          </div>
                          <h4 className="text-sm font-bold text-brown mb-0.5">{a.title}</h4>
                          <p className="text-xs-sm text-muted-alt leading-relaxed">{a.desc}</p>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Help */}
                <div className="bg-ivory-warm border border-warm rounded-xl p-5">
                  <div className="flex items-start gap-3">
                    <Sparkles size={16} className="text-gold mt-0.5 shrink-0" />
                    <div>
                      <h4 className="font-bold text-brown-deep text-sm mb-1.5">Hướng dẫn</h4>
                      <ul className="text-xs text-muted space-y-1 leading-relaxed">
                        <li>• Nhấn <strong className="text-gold-deep">"Sửa nội dung thiệp"</strong> để chỉnh sửa trực tiếp trên giao diện thiệp cưới.</li>
                        <li>• Vào <strong>"Khách mời"</strong> để tạo danh sách, gửi link qua Zalo/Messenger.</li>
                        <li>• Mục <strong>"Cấu hình"</strong> cho phép thay đổi ảnh bìa, nhạc nền, địa điểm nâng cao.</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* ────── GUESTS TAB ────── */}
            {activeTab === 'guests' && (
              <motion.div key="g" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="p-4 md:p-6 h-full">
                <AdminGuestList />
              </motion.div>
            )}

            {/* ────── LINKS TAB ────── */}
            {activeTab === 'links' && (
              <motion.div key="l" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="p-4 md:p-6">
                <LinkGenerator />
              </motion.div>
            )}

            {/* ────── SETTINGS TAB ────── */}
            {activeTab === 'settings' && (
              <motion.div key="s" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="p-4 md:p-6">
                <AdminSettings weddingId={weddingId} slug={slug} onClose={() => go('overview')} onSaved={() => {}} />
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;

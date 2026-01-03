
import React, { useState } from 'react';
import { Users, Settings, X, ChevronRight, LogOut, Layout, Link as LinkIcon, Menu } from 'lucide-react';
import AdminGuestList from './AdminGuestList';
import AdminSettings from './AdminSettings';

interface AdminDashboardProps {
  weddingId: string;
  slug: string;
  onClose: () => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ weddingId, slug, onClose }) => {
  const [activeTab, setActiveTab] = useState<'guests' | 'settings'>('guests');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="fixed inset-0 z-[100001] bg-slate-50 flex overflow-hidden">
      {/* Sidebar - Thu gọn & Responsive */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 flex flex-col h-full border-r border-slate-800 transition-transform duration-300 lg:relative lg:translate-x-0 lg:w-56
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="p-5">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gold rounded-lg flex items-center justify-center text-slate-900 shadow-lg shadow-gold/20">
                <Layout className="w-4 h-4" />
              </div>
              <div>
                <h1 className="text-white font-serif text-sm font-bold leading-tight">Admin</h1>
                <p className="text-[8px] uppercase tracking-widest text-slate-500 font-bold">Wedding</p>
              </div>
            </div>
            <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden text-slate-400 hover:text-white">
              <X size={20} />
            </button>
          </div>

          <nav className="space-y-1">
            <NavItem
              active={activeTab === 'guests'}
              onClick={() => { setActiveTab('guests'); setIsSidebarOpen(false); }}
              icon={<Users className="w-4 h-4" />}
              label="Khách mời"
            />
            <NavItem
              active={activeTab === 'settings'}
              onClick={() => { setActiveTab('settings'); setIsSidebarOpen(false); }}
              icon={<Settings className="w-4 h-4" />}
              label="Cấu hình"
            />
          </nav>
        </div>

        <div className="mt-auto p-5 border-t border-slate-800">
          <button
            onClick={onClose}
            className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-xs font-medium w-full group"
          >
            <LogOut className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Thoát
          </button>
        </div>
      </div>

      {/* Overlay for mobile sidebar */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="flex-grow flex flex-col h-full overflow-hidden w-full">
        {/* Header Bar */}
        <header className="bg-white h-16 md:h-20 border-b border-slate-200 px-4 md:px-10 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="p-2 lg:hidden text-slate-500 hover:bg-slate-50 rounded-lg transition-colors"
            >
              <Menu size={20} />
            </button>
            <div className="flex items-center gap-2 text-xs md:text-sm">
              <span className="text-slate-400 hidden sm:inline">Wedding</span>
              <ChevronRight className="w-4 h-4 text-slate-300 hidden sm:inline" />
              <span className="text-slate-800 font-bold capitalize">
                {activeTab === 'guests' ? 'Quản lý khách mời' : 'Cấu hình thiệp'}
              </span>
            </div>
          </div>
          <button onClick={onClose} className="p-2.5 hover:bg-slate-50 rounded-full transition-colors text-slate-400">
            <X className="w-6 h-6" />
          </button>
        </header>

        {/* Dynamic Content Body */}
        <main className="flex-grow p-4 md:p-10 overflow-y-auto bg-slate-50">
          <div className="max-w-7xl mx-auto h-full">
            {activeTab === 'guests' && <AdminGuestList />}
            {activeTab === 'settings' && (
              <AdminSettings
                weddingId={weddingId}
                slug={slug}
                onClose={() => setActiveTab('guests')}
                onSaved={() => { }}
              />
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

function NavItem({ active, onClick, icon, label }: any) {
  return (
    <button
      onClick={onClick}
      className={`
        w-full flex items-center justify-between p-4 rounded-xl transition-all group
        ${active ? 'bg-gold text-slate-900 shadow-lg shadow-gold/20' : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'}
      `}
    >
      <div className="flex items-center gap-3">
        {icon}
        <span className="text-sm font-bold tracking-tight">{label}</span>
      </div>
      <ChevronRight className={`w-4 h-4 transition-transform ${active ? 'opacity-100' : 'opacity-0 group-hover:opacity-40 group-hover:translate-x-1'}`} />
    </button>
  );
}

export default AdminDashboard;

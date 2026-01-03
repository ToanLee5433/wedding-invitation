
import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { Save, X, Music, Calendar, User, MapPin, Loader2, RefreshCw, CheckCircle2, AlertCircle } from 'lucide-react';
import Hero from './Hero';
import BackgroundMusic from './BackgroundMusic';

import { uploadMedia } from '../lib/storage';

interface AdminSettingsProps {
  weddingId: string;
  slug: string;
  onClose: () => void;
  onSaved: () => void;
}

export default function AdminSettings({ weddingId, slug, onClose, onSaved }: AdminSettingsProps) {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingMusic, setUploadingMusic] = useState(false);

  const [settings, setSettings] = useState({
    groom_name: '',
    bride_name: '',
    event_date: '',
    music_url: '',
    map_link_th: '',
    map_link_vq: ''
  });

  useEffect(() => {
    async function fetchSettings() {
      setLoading(true);
      const { data } = await supabase.from('weddings').select('*').eq('slug', slug).single();
      if (data) {
        setSettings({
          groom_name: data.details?.groom_name || 'Chiến',
          bride_name: data.details?.bride_name || 'Trang',
          event_date: data.details?.event_date || '30 . 01 . 2026',
          music_url: data.music_url || '',
          map_link_th: data.details?.thanhHon?.mapLink || '',
          map_link_vq: data.details?.vuQuy?.mapLink || ''
        });
      }
      setLoading(false);
    }
    fetchSettings();
  }, [slug]);

  const handleMusicUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadingMusic(true);
      const publicUrl = await uploadMedia(file, slug, 'audio', 'background-music');
      setSettings({ ...settings, music_url: publicUrl });
      alert("Đã tải nhạc lên thành công!");
    } catch (err) {
      console.error('Music upload failed:', err);
      alert('Không thể tải nhạc lên. Vui lòng thử lại.');
    } finally {
      setUploadingMusic(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const { data: current } = await supabase.from('weddings').select('details').eq('id', weddingId).single();
      const updatedDetails = {
        ...current?.details,
        groom_name: settings.groom_name,
        bride_name: settings.bride_name,
        event_date: settings.event_date,
        thanhHon: { ...current?.details?.thanhHon, mapLink: settings.map_link_th },
        vuQuy: { ...current?.details?.vuQuy, mapLink: settings.map_link_vq }
      };

      await supabase.from('weddings').update({
        music_url: settings.music_url,
        details: updatedDetails
      }).eq('id', weddingId);

      alert("Đã lưu cài đặt thành công!");
      onSaved();
      onClose();
      window.location.reload(); // Tải lại để áp dụng nhạc mới
    } catch (err) { alert("Lỗi: " + err); }
    finally { setSaving(false); }
  };

  if (loading) return <div className="p-20 text-center"><Loader2 className="animate-spin mx-auto text-gold" /></div>;

  return (
    <div className="bg-white rounded-3xl p-4 md:p-8 shadow-sm border border-slate-200">
      <h2 className="text-xl md:text-2xl font-serif font-bold mb-6 md:mb-8 text-slate-800">Cấu hình chung</h2>

      <div className="grid lg:grid-cols-2 gap-6 md:gap-8">
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] uppercase font-black text-slate-400">Cô dâu</label>
              <input value={settings.bride_name} onChange={e => setSettings({ ...settings, bride_name: e.target.value })} className="w-full bg-slate-50 border-none rounded-xl px-4 py-3 text-sm" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] uppercase font-black text-slate-400">Chú rể</label>
              <input value={settings.groom_name} onChange={e => setSettings({ ...settings, groom_name: e.target.value })} className="w-full bg-slate-50 border-none rounded-xl px-4 py-3 text-sm" />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] uppercase font-black text-slate-400">Ngày cưới (Định dạng: DD . MM . YYYY)</label>
            <input value={settings.event_date} onChange={e => setSettings({ ...settings, event_date: e.target.value })} className="w-full bg-slate-50 border-none rounded-xl px-4 py-3 text-sm" />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] uppercase font-black text-slate-400">Nhạc nền (Youtube/Drive/MP3 hoặc tải file)</label>
            <div className="space-y-3">
              <input value={settings.music_url} onChange={e => setSettings({ ...settings, music_url: e.target.value })} placeholder="Dán link nhạc vào đây..." className="w-full bg-slate-50 border-none rounded-xl px-4 py-3 font-mono text-xs" />

              <div className="flex items-center gap-3">
                <label className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-blue-50 text-blue-600 rounded-xl text-xs font-bold cursor-pointer hover:bg-blue-100 transition-all ${uploadingMusic ? 'opacity-50 cursor-not-allowed' : ''}`}>
                  {uploadingMusic ? <Loader2 className="animate-spin" size={14} /> : <Music size={14} />}
                  {uploadingMusic ? 'Đang tải lên...' : 'Tải file nhạc lên'}
                  <input type="file" accept="audio/*" onChange={handleMusicUpload} disabled={uploadingMusic} className="hidden" />
                </label>
                {settings.music_url && (
                  <div className="text-[10px] text-emerald-600 font-bold flex items-center gap-1">
                    <CheckCircle2 size={12} /> Đã có nhạc
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] uppercase font-black text-slate-400">Google Map (Lễ Thành Hôn)</label>
            <input value={settings.map_link_th} onChange={e => setSettings({ ...settings, map_link_th: e.target.value })} className="w-full bg-slate-50 border-none rounded-xl px-4 py-3 text-xs" />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] uppercase font-black text-slate-400">Google Map (Lễ Vu Quy)</label>
            <input value={settings.map_link_vq} onChange={e => setSettings({ ...settings, map_link_vq: e.target.value })} className="w-full bg-slate-50 border-none rounded-xl px-4 py-3 text-xs" />
          </div>

          <button onClick={handleSave} disabled={saving} className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold uppercase tracking-widest hover:bg-black transition-all flex items-center justify-center gap-2">
            {saving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
            Lưu tất cả thay đổi
          </button>
        </div>
      </div>
    </div>
  );
}

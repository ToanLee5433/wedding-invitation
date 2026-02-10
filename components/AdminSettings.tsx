
import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { Save, Music, MapPin, Loader2, CheckCircle2, Image, Type, User } from 'lucide-react';
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
  const [uploadingHero, setUploadingHero] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const [settings, setSettings] = useState({
    groom_name: '',
    bride_name: '',
    event_date: '',
    music_url: '',
    hero_image: '',
    invitation_text: '',
    invitation_quote: '',
    initials: '',
    // Lễ Thành Hôn
    th_title: '',
    th_time: '',
    th_location: '',
    th_address: '',
    map_link_th: '',
    // Lễ Vu Quy
    vq_title: '',
    vq_time: '',
    vq_location: '',
    vq_address: '',
    map_link_vq: ''
  });

  useEffect(() => {
    async function fetchSettings() {
      setLoading(true);
      const { data } = await supabase.from('weddings').select('*').eq('slug', slug).single();
      if (data) {
        setSettings({
          groom_name: data.details?.groom_name || '',
          bride_name: data.details?.bride_name || '',
          event_date: data.details?.event_date || '',
          music_url: data.music_url || '',
          hero_image: data.hero_image || '',
          invitation_text: data.details?.invitation_text || '',
          invitation_quote: data.details?.invitation_quote || '',
          initials: data.details?.initials || '',
          th_title: data.details?.thanhHon?.title || 'Lễ Thành Hôn',
          th_time: data.details?.thanhHon?.time || '',
          th_location: data.details?.thanhHon?.location || '',
          th_address: data.details?.thanhHon?.address || '',
          map_link_th: data.details?.thanhHon?.mapLink || '',
          vq_title: data.details?.vuQuy?.title || 'Lễ Vu Quy',
          vq_time: data.details?.vuQuy?.time || '',
          vq_location: data.details?.vuQuy?.location || '',
          vq_address: data.details?.vuQuy?.address || '',
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
    } catch (err) {
      console.error('Music upload failed:', err);
      alert('Không thể tải nhạc lên. Vui lòng thử lại.');
    } finally {
      setUploadingMusic(false);
    }
  };

  const handleHeroUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setUploadingHero(true);
      const publicUrl = await uploadMedia(file, slug, 'images', 'hero');
      setSettings({ ...settings, hero_image: publicUrl });
    } catch (err) {
      console.error('Hero upload failed:', err);
      alert('Không thể tải ảnh lên. Vui lòng thử lại.');
    } finally {
      setUploadingHero(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setSaveSuccess(false);
    try {
      const { data: current } = await supabase.from('weddings').select('details').eq('id', weddingId).single();
      const updatedDetails = {
        ...current?.details,
        groom_name: settings.groom_name,
        bride_name: settings.bride_name,
        event_date: settings.event_date,
        invitation_text: settings.invitation_text,
        invitation_quote: settings.invitation_quote,
        initials: settings.initials,
        thanhHon: {
          ...current?.details?.thanhHon,
          title: settings.th_title,
          date: settings.event_date,
          time: settings.th_time,
          location: settings.th_location,
          address: settings.th_address,
          mapLink: settings.map_link_th
        },
        vuQuy: {
          ...current?.details?.vuQuy,
          title: settings.vq_title,
          date: settings.event_date,
          time: settings.vq_time,
          location: settings.vq_location,
          address: settings.vq_address,
          mapLink: settings.map_link_vq
        }
      };

      const { error } = await supabase.from('weddings').update({
        music_url: settings.music_url,
        hero_image: settings.hero_image,
        details: updatedDetails
      }).eq('id', weddingId);

      if (error) throw error;

      setSaveSuccess(true);
      onSaved();
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      alert("Lỗi khi lưu: " + err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-20 text-center"><Loader2 className="animate-spin mx-auto text-gold" /></div>;

  return (
    <div className="space-y-6">
      {/* Save Success Banner */}
      {saveSuccess && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex items-center gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
          <CheckCircle2 className="text-emerald-600 shrink-0" size={20} />
          <span className="text-sm font-bold text-emerald-700">Đã lưu cài đặt thành công!</span>
        </div>
      )}

      {/* Section 1: Thông tin cơ bản */}
      <div className="bg-white rounded-2xl p-4 md:p-8 shadow-sm border border-warm">
        <h2 className="text-lg font-serif font-bold mb-6 text-brown flex items-center gap-2">
          <User size={18} className="text-gold" /> Thông tin cơ bản
        </h2>
        <div className="grid lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <SettingField label="Cô dâu" value={settings.bride_name} onChange={v => setSettings({ ...settings, bride_name: v })} />
            <SettingField label="Chú rể" value={settings.groom_name} onChange={v => setSettings({ ...settings, groom_name: v })} />
          </div>
          <div className="space-y-4">
            <SettingField label="Ngày cưới (DD . MM . YYYY)" value={settings.event_date} onChange={v => setSettings({ ...settings, event_date: v })} />
            <SettingField label="Ký hiệu viết tắt (VD: T&C)" value={settings.initials} onChange={v => setSettings({ ...settings, initials: v })} />
          </div>
        </div>
      </div>

      {/* Section 2: Nội dung thiệp */}
      <div className="bg-white rounded-2xl p-4 md:p-8 shadow-sm border border-warm">
        <h2 className="text-lg font-serif font-bold mb-6 text-brown flex items-center gap-2">
          <Type size={18} className="text-gold" /> Nội dung thiệp
        </h2>
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-xxs uppercase font-black text-muted-alt">Lời mời chính</label>
            <textarea
              value={settings.invitation_text}
              onChange={e => setSettings({ ...settings, invitation_text: e.target.value })}
              rows={3}
              className="w-full bg-ivory border border-warm rounded-xl px-4 py-3 text-sm resize-none focus-gold"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xxs uppercase font-black text-muted-alt">Câu trích dẫn (Quote)</label>
            <textarea
              value={settings.invitation_quote}
              onChange={e => setSettings({ ...settings, invitation_quote: e.target.value })}
              rows={2}
              className="w-full bg-ivory border border-warm rounded-xl px-4 py-3 text-sm italic resize-none focus-gold"
            />
          </div>
        </div>
      </div>

      {/* Section 3: Media */}
      <div className="bg-white rounded-2xl p-4 md:p-8 shadow-sm border border-warm">
        <h2 className="text-lg font-serif font-bold mb-6 text-brown flex items-center gap-2">
          <Image size={18} className="text-gold" /> Hình ảnh & Nhạc
        </h2>
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Hero Image */}
          <div className="space-y-3">
            <label className="text-xxs uppercase font-black text-muted-alt">Ảnh bìa (Hero)</label>
            {settings.hero_image && (
              <div className="w-full h-40 rounded-xl overflow-hidden bg-ivory">
                <img src={settings.hero_image} alt="Hero preview" className="w-full h-full object-cover" />
              </div>
            )}
            <input
              value={settings.hero_image}
              onChange={e => setSettings({ ...settings, hero_image: e.target.value })}
              placeholder="URL ảnh bìa..."
              className="w-full bg-ivory border border-warm rounded-xl px-4 py-3 font-mono text-xs focus-gold"
            />
            <label className={`flex items-center justify-center gap-2 px-4 py-3 bg-gold/10 text-gold-deep rounded-xl text-xs font-bold cursor-pointer hover:bg-gold-20 transition-all ${uploadingHero ? 'opacity-50 cursor-not-allowed' : ''}`}>
              {uploadingHero ? <Loader2 className="animate-spin" size={14} /> : <Image size={14} />}
              {uploadingHero ? 'Đang tải lên...' : 'Tải ảnh bìa lên'}
              <input type="file" accept="image/*" onChange={handleHeroUpload} disabled={uploadingHero} className="hidden" />
            </label>
          </div>

          {/* Music */}
          <div className="space-y-3">
            <label className="text-xxs uppercase font-black text-muted-alt">Nhạc nền</label>
            <input
              value={settings.music_url}
              onChange={e => setSettings({ ...settings, music_url: e.target.value })}
              placeholder="URL nhạc hoặc tải file..."
              className="w-full bg-ivory border border-warm rounded-xl px-4 py-3 font-mono text-xs focus-gold"
            />
            <label className={`flex items-center justify-center gap-2 px-4 py-3 bg-gold/10 text-gold-deep rounded-xl text-xs font-bold cursor-pointer hover:bg-gold-20 transition-all ${uploadingMusic ? 'opacity-50 cursor-not-allowed' : ''}`}>
              {uploadingMusic ? <Loader2 className="animate-spin" size={14} /> : <Music size={14} />}
              {uploadingMusic ? 'Đang tải lên...' : 'Tải file nhạc lên'}
              <input type="file" accept="audio/*" onChange={handleMusicUpload} disabled={uploadingMusic} className="hidden" />
            </label>
            {settings.music_url && (
              <div className="text-xxs text-emerald-600 font-bold flex items-center gap-1">
                <CheckCircle2 size={12} /> Đã có nhạc nền
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Section 4: Lễ Thành Hôn */}
      <div className="bg-white rounded-2xl p-4 md:p-8 shadow-sm border border-warm">
        <h2 className="text-lg font-serif font-bold mb-6 text-brown flex items-center gap-2">
          <MapPin size={18} className="text-gold" /> Lễ Thành Hôn
        </h2>
        <div className="grid lg:grid-cols-2 gap-4">
          <SettingField label="Tên sự kiện" value={settings.th_title} onChange={v => setSettings({ ...settings, th_title: v })} />
          <SettingField label="Giờ (VD: 11:00 AM)" value={settings.th_time} onChange={v => setSettings({ ...settings, th_time: v })} />
          <SettingField label="Tên địa điểm" value={settings.th_location} onChange={v => setSettings({ ...settings, th_location: v })} />
          <SettingField label="Địa chỉ" value={settings.th_address} onChange={v => setSettings({ ...settings, th_address: v })} />
          <div className="lg:col-span-2">
            <SettingField label="Google Maps URL" value={settings.map_link_th} onChange={v => setSettings({ ...settings, map_link_th: v })} mono />
          </div>
        </div>
      </div>

      {/* Section 5: Lễ Vu Quy */}
      <div className="bg-white rounded-2xl p-4 md:p-8 shadow-sm border border-warm">
        <h2 className="text-lg font-serif font-bold mb-6 text-brown flex items-center gap-2">
          <MapPin size={18} className="text-gold-darker" /> Lễ Vu Quy
        </h2>
        <div className="grid lg:grid-cols-2 gap-4">
          <SettingField label="Tên sự kiện" value={settings.vq_title} onChange={v => setSettings({ ...settings, vq_title: v })} />
          <SettingField label="Giờ (VD: 08:00 AM)" value={settings.vq_time} onChange={v => setSettings({ ...settings, vq_time: v })} />
          <SettingField label="Tên địa điểm" value={settings.vq_location} onChange={v => setSettings({ ...settings, vq_location: v })} />
          <SettingField label="Địa chỉ" value={settings.vq_address} onChange={v => setSettings({ ...settings, vq_address: v })} />
          <div className="lg:col-span-2">
            <SettingField label="Google Maps URL" value={settings.map_link_vq} onChange={v => setSettings({ ...settings, map_link_vq: v })} mono />
          </div>
        </div>
      </div>

      {/* Save Button - Sticky */}
      <div className="sticky bottom-0 bg-page-80 backdrop-blur-sm py-4 -mx-4 md:-mx-6 px-4 md:px-6 border-t border-warm">
        <button
          onClick={handleSave}
          disabled={saving}
          className="w-full py-4 bg-gold text-white rounded-xl font-bold uppercase tracking-widest hover:bg-gold-dark transition-all flex items-center justify-center gap-2 shadow-lg"
        >
          {saving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
          {saving ? 'Đang lưu...' : 'Lưu tất cả thay đổi'}
        </button>
      </div>
    </div>
  );
}

function SettingField({ label, value, onChange, mono }: { label: string; value: string; onChange: (v: string) => void; mono?: boolean }) {
  return (
    <div className="space-y-2">
      <label className="text-xxs uppercase font-black text-muted-alt">{label}</label>
      <input
        value={value}
        onChange={e => onChange(e.target.value)}
        className={`w-full bg-ivory border border-warm rounded-xl px-4 py-3 text-sm focus-gold ${mono ? 'font-mono text-xs' : ''}`}
      />
    </div>
  );
}

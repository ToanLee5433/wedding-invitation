
import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { uploadMedia } from '../lib/storage';
import { Heart, Send, Sparkles, Loader2, Users, Gift, X, QrCode, Download } from 'lucide-react';
import { suggestWeddingWish } from '../services/gemini';

interface RSVPProps {
  qrGroom: string;
  qrBride: string;
  onUploadGroom: (val: string) => void;
  onUploadBride: (val: string) => void;
  editMode: boolean;
  weddingSlug: string;
  initialWish?: string;
}

const RSVP: React.FC<RSVPProps> = ({ qrGroom, qrBride, onUploadGroom, onUploadBride, editMode, weddingSlug, initialWish }) => {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [guestbook, setGuestbook] = useState<any[]>([]);
  const [showGiftModal, setShowGiftModal] = useState(false);
  const [formData, setFormData] = useState({ name: '', status: 'Sẽ tham dự', count: 1, wish: '' });

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const to = params.get('to') || params.get('Ten');
    if (to) setFormData(prev => ({ ...prev, name: decodeURIComponent(to).replace(/_/g, ' ') }));
  }, []);

  const fetchGuestbook = async () => {
    try {
      const { data: wedding } = await supabase.from('weddings').select('id').eq('slug', weddingSlug).single();
      if (wedding) {
        const { data } = await supabase.from('guests').select('*').eq('wedding_id', wedding.id).not('wish_message', 'is', null).order('created_at', { ascending: false }).limit(6);
        if (data) setGuestbook(data);
      }
    } catch (err) { console.error(err); }
  };

  useEffect(() => { fetchGuestbook(); }, [weddingSlug]);

  const downloadQR = (imageData: string, name: string) => {
    if (!imageData) return;
    const link = document.createElement('a');
    link.href = imageData;
    link.download = `QR-Mung-Cuoi-${name}.png`;
    link.click();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data: wedding } = await supabase.from('weddings').select('id').eq('slug', weddingSlug).single();
      if (!wedding) return;
      await supabase.from('guests').insert([{ wedding_id: wedding.id, guest_name: formData.name, attendance_status: formData.status === 'Sẽ tham dự', guest_count: formData.count, wish_message: formData.wish }]);
      setSubmitted(true);
    } catch (err) { alert(err); } finally { setLoading(false); }
  };

  return (
    <section id="rsvp" className="space-y-32">
      <div className="grid md:grid-cols-2 gap-16 items-start">
        <div className="bg-white p-10 rounded-[2rem] shadow-xl border border-gold/5">
          <h2 className="font-serif text-4xl mb-8 italic text-gray-800">Xác nhận tham dự</h2>
          {!submitted ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <input type="text" placeholder="Tên của bạn" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full bg-slate-50 rounded-xl px-6 py-4 border-none outline-none focus:ring-1 focus:ring-gold/20" required />
              <div className="grid grid-cols-2 gap-4">
                <select value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })} className="bg-slate-50 rounded-xl px-4 py-4 border-none outline-none">
                  <option>Sẽ tham dự</option>
                  <option>Tiếc quá, không thể</option>
                </select>
                <input type="number" min="1" value={formData.count} onChange={(e) => setFormData({ ...formData, count: parseInt(e.target.value) })} className="bg-slate-50 rounded-xl px-4 py-4 border-none outline-none" />
              </div>
              <textarea placeholder="Lời chúc gửi tới đôi trẻ..." value={formData.wish} onChange={(e) => setFormData({ ...formData, wish: e.target.value })} className="w-full bg-slate-50 rounded-xl px-6 py-4 min-h-[120px] border-none outline-none" />
              <button type="submit" disabled={loading} className="w-full py-4 bg-gold text-white rounded-xl uppercase font-black tracking-widest hover:bg-[#B38F2D] transition-all disabled:opacity-50">
                {loading ? <Loader2 className="animate-spin mx-auto" /> : "Gửi phản hồi"}
              </button>
            </form>
          ) : (
            <div className="text-center py-12 animate-in zoom-in-95">
              <Heart className="mx-auto text-gold mb-4 fill-gold" />
              <p className="font-serif italic text-2xl">Cảm ơn bạn rất nhiều!</p>
            </div>
          )}
        </div>

        <div className="space-y-8">
          <div className="bg-slate-900 rounded-[2rem] p-10 text-white text-center shadow-2xl">
            <Gift className="mx-auto text-gold mb-6" size={40} />
            <h3 className="font-serif text-3xl mb-4 italic">Mừng cưới tinh tế</h3>
            <p className="text-white/40 text-xs mb-8">Sự hiện diện của bạn là món quà lớn nhất đối với chúng mình.</p>
            <button onClick={() => setShowGiftModal(true)} className="px-8 py-3 bg-white text-slate-900 rounded-full text-[10px] uppercase font-black tracking-widest hover:bg-gold hover:text-white transition-all">Mở mã QR mừng cưới</button>
          </div>
        </div>
      </div>

      {/* Gift Modal - Tối ưu layout & z-index */}
      {showGiftModal && (
        <div className="fixed inset-0 z-[10000000] flex items-end sm:items-center justify-center animate-in fade-in duration-300">
          <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-sm" onClick={() => setShowGiftModal(false)}></div>
          <div className="bg-white w-full sm:max-w-2xl rounded-t-[2.5rem] sm:rounded-[2.5rem] relative z-10 shadow-2xl flex flex-col max-h-[92vh] overflow-hidden animate-in slide-in-from-bottom-10 duration-500">
            <div className="p-8 md:p-12 overflow-y-auto custom-scrollbar pb-32"> {/* pb-32 để không bị BottomNav đè */}
              <button onClick={() => setShowGiftModal(false)} className="absolute top-6 right-6 text-slate-400 p-2 hover:bg-slate-100 rounded-full transition-colors z-20">
                <X size={24} />
              </button>

              <div className="text-center mb-10">
                <h3 className="font-serif text-4xl mb-2 italic">Mừng cưới tinh tế</h3>
                <p className="text-[9px] uppercase tracking-[0.3em] text-slate-400 font-black">Món quà từ trái tim</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
                <QRCard name="Chú rể Chiến" bank="VCB - 0123456789" image={qrGroom} editMode={editMode} onUpload={onUploadGroom} onDownload={() => downloadQR(qrGroom, "Chu-Re-Chien")} qrType="groom" />
                <QRCard name="Cô dâu Trang" bank="TPB - 9876543210" image={qrBride} editMode={editMode} onUpload={onUploadBride} onDownload={() => downloadQR(qrBride, "Co-Dau-Trang")} qrType="bride" />
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );

  function QRCard({ name, bank, image, editMode, onUpload, onDownload, qrType }: any) {
    const [uploading, setUploading] = useState(false);

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      try {
        setUploading(true);
        const publicUrl = await uploadMedia(file, weddingSlug, 'qr', qrType);
        onUpload(publicUrl);
      } catch (err) {
        console.error('Upload failed:', err);
        alert('Không thể tải mã QR lên. Vui lòng thử lại.');
      } finally {
        setUploading(false);
      }
    };

    return (
      <div className="text-center space-y-4">
        <p className="text-[11px] uppercase tracking-widest font-black text-slate-900">{name}</p>
        <div className="w-full aspect-square bg-slate-50 rounded-3xl p-4 border border-slate-100 relative group flex items-center justify-center overflow-hidden shadow-inner">
          {image ? (
            <img src={image} className="w-full h-full object-contain" alt={name} />
          ) : (
            <div className="text-slate-300 flex flex-col items-center gap-2">
              <QrCode size={40} />
              <span className="text-[9px] uppercase font-bold">Chưa có mã QR</span>
            </div>
          )}
          {editMode && (
            <label className={`absolute inset-0 bg-gold/90 text-white flex items-center justify-center cursor-pointer transition-all ${uploading ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
              <span className="text-[9px] font-black uppercase tracking-widest border border-white px-4 py-2 rounded-full flex items-center gap-2">
                {uploading ? (
                  <>
                    <Loader2 size={12} className="animate-spin" />
                    Đang tải...
                  </>
                ) : (
                  'Thay mã'
                )}
              </span>
              <input type="file" className="hidden" accept="image/*" onChange={handleUpload} disabled={uploading} />
            </label>
          )}
        </div>
        <p className="text-sm font-bold text-slate-800">{bank}</p>
        {image && (
          <button onClick={onDownload} className="inline-flex items-center gap-2 px-4 py-2 bg-gold/10 text-gold rounded-lg text-[9px] font-black uppercase tracking-widest hover:bg-gold hover:text-white transition-all">
            <Download size={12} /> Tải mã QR
          </button>
        )}
      </div>
    );
  }
};

export default RSVP;

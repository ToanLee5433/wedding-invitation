
import React, { useState } from 'react';
import { Copy, Check, Link as LinkIcon, UserPlus, Share2 } from 'lucide-react';

const LinkGenerator: React.FC = () => {
  const [name, setName] = useState('');
  const [generatedLink, setGeneratedLink] = useState('');
  const [copied, setCopied] = useState(false);

  const generateLink = () => {
    if (!name.trim()) return;
    
    const formattedName = name.trim().replace(/\s+/g, '_');
    const baseUrl = window.location.origin + '/';
    const finalUrl = `${baseUrl}?to=${encodeURIComponent(formattedName)}`;
    
    setGeneratedLink(finalUrl);
    setCopied(false);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-10 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-4 mb-2">
            <div className="w-10 h-10 bg-gold/10 rounded-full flex items-center justify-center text-gold">
              <LinkIcon size={20} />
            </div>
            <h2 className="text-2xl font-serif font-bold text-slate-800">Công cụ tạo Link mời cá nhân</h2>
          </div>
          <p className="text-sm text-slate-500 max-w-2xl leading-relaxed">
            Nhập tên khách mời để tạo đường dẫn cá nhân hóa. Khi khách nhấn vào link, thiệp sẽ hiển thị lời mời đích danh cho người đó.
          </p>
        </div>

        <div className="p-10 space-y-10">
          <div className="grid md:grid-cols-1 gap-8">
            <div className="space-y-3">
              <label className="text-xxs uppercase tracking-widest text-slate-400 font-bold flex items-center gap-2">
                <UserPlus size={12} /> Tên khách mời (Hiển thị trên thiệp)
              </label>
              <div className="flex gap-4">
                <input 
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ví dụ: Anh Tùng, Chị Lan & Gia đình..." 
                  className="flex-grow bg-slate-50 border-none rounded-2xl px-6 py-4 focus:ring-2 focus:ring-gold/20 outline-none text-slate-700 font-medium placeholder:text-slate-300" 
                />
                <button 
                  onClick={generateLink}
                  className="bg-slate-900 text-white px-8 py-4 rounded-2xl font-bold text-xs uppercase tracking-widest hover:bg-black transition-all shadow-lg shadow-slate-200 active:scale-95 shrink-0"
                >
                  Tạo Link
                </button>
              </div>
            </div>
          </div>

          {generatedLink && (
            <div className="bg-slate-900 rounded-3xl p-8 text-white relative overflow-hidden animate-in fade-in slide-in-from-top-4 duration-500">
              <div className="absolute top-0 right-0 w-64 h-64 bg-gold/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
              
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2 text-gold">
                    <Share2 size={16} />
                    <span className="text-xxs uppercase tracking-extra-wide font-bold">Link đã sẵn sàng</span>
                  </div>
                </div>

                <div className="flex flex-col md:flex-row items-center gap-4">
                  <div className="flex-grow bg-white/5 border border-white/10 p-5 rounded-2xl text-sm break-all font-mono text-slate-300">
                    {generatedLink}
                  </div>
                  <button 
                    onClick={copyToClipboard}
                    className={`
                      shrink-0 flex items-center gap-3 px-8 py-5 rounded-2xl text-xxs uppercase font-bold tracking-widest transition-all
                      ${copied ? 'bg-emerald-500 text-white' : 'bg-gold text-slate-900 hover:bg-white'}
                    `}
                  >
                    {copied ? <Check size={14} /> : <Copy size={14} />}
                    {copied ? 'Đã copy!' : 'Sao chép Link'}
                  </button>
                </div>
                
                <div className="mt-8 flex items-start gap-3 text-xs-sm text-slate-400 italic">
                  <div className="w-1.5 h-1.5 rounded-full bg-gold mt-1.5"></div>
                  <p>Mẹo: Bạn có thể gửi link này qua Zalo, Messenger hoặc iMessage để tạo bất ngờ cho khách mời.</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LinkGenerator;

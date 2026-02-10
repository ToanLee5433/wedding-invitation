
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Eye, EyeOff, LogIn, User, Loader2, AlertTriangle, Heart, Sparkles } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';

interface AdminLoginProps {
  onLogin: () => void;
}

const FALLBACK_USERNAME = import.meta.env.VITE_ADMIN_USERNAME || '';
const FALLBACK_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD || '';

const AdminLogin: React.FC<AdminLoginProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [bgLoaded, setBgLoaded] = useState(false);

  useEffect(() => {
    const img = new Image();
    img.onload = () => setBgLoaded(true);
    img.src = 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=2070&auto=format&fit=crop';
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) return;
    setError('');
    setIsLoading(true);

    try {
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Timeout')), 5000)
      );
      const queryPromise = supabase
        .from('weddings')
        .select('details')
        .eq('slug', import.meta.env.VITE_WEDDING_SLUG || 'trang-chien-2026')
        .single();

      const result = await Promise.race([queryPromise, timeoutPromise]) as any;

      if (!result.error && result.data?.details?.admin) {
        const admin = result.data.details.admin;
        if (username.trim() === admin.username && password === admin.password) {
          sessionStorage.setItem('admin_authenticated', 'true');
          setIsLoading(false);
          onLogin();
          return;
        } else {
          setError('Tên đăng nhập hoặc mật khẩu không đúng.');
          setIsLoading(false);
          return;
        }
      }
    } catch {
      console.warn('⚠️ Supabase unavailable, using fallback auth');
    }

    if (username.trim() === FALLBACK_USERNAME && password === FALLBACK_PASSWORD) {
      sessionStorage.setItem('admin_authenticated', 'true');
      setIsLoading(false);
      onLogin();
    } else {
      setError('Tên đăng nhập hoặc mật khẩu không đúng.');
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center overflow-hidden" style={{ background: '#1a1408', zIndex: 100000 }}>
      {/* Background Image */}
      <motion.div
        className="absolute inset-0 z-0"
        initial={{ scale: 1.05 }}
        animate={{ scale: 1 }}
        transition={{ duration: 20, repeat: Infinity, repeatType: 'reverse', ease: 'linear' }}
      >
        <img
          src="https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=2070&auto=format&fit=crop"
          alt=""
          className={`w-full h-full object-cover transition-opacity duration-1000 ${bgLoaded ? 'opacity-100' : 'opacity-0'}`}
        />
      </motion.div>

      {/* Overlays */}
      <div className="absolute inset-0" style={{ zIndex: 1, background: 'linear-gradient(135deg, rgba(26,20,8,0.85), rgba(44,36,24,0.7), rgba(26,20,8,0.85))' }} />
      <div className="absolute inset-0" style={{ zIndex: 1, background: 'linear-gradient(to top, rgba(26,20,8,0.95), transparent 60%)' }} />

      {/* Center card wrapper */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
        className="relative z-10 w-full px-5"
        style={{ maxWidth: 420 }}
      >
        {/* Badge */}
        <motion.div
          className="text-center mb-6"
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.5 }}
        >
          <span
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold uppercase"
            style={{ background: 'rgba(212,175,55,0.08)', border: '1px solid rgba(212,175,55,0.15)', color: 'rgba(212,175,55,0.6)', letterSpacing: '0.2em', fontSize: 10 }}
          >
            <Sparkles size={11} style={{ color: '#D4AF37' }} />
            Wedding Admin Panel
          </span>
        </motion.div>

        {/* Card */}
        <div
          className="relative overflow-hidden"
          style={{
            background: 'rgba(255,255,255,0.06)',
            backdropFilter: 'blur(40px)',
            WebkitBackdropFilter: 'blur(40px)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: 24,
            padding: '40px 36px 32px',
            boxShadow: '0 24px 48px -12px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.08)',
          }}
        >
          {/* Decorative top line */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2" style={{ width: '60%', height: 1, background: 'linear-gradient(90deg, transparent, rgba(212,175,55,0.3), transparent)' }} />

          {/* Logo */}
          <div className="text-center mb-7">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.25, type: 'spring', stiffness: 200, damping: 16 }}
              className="mx-auto mb-4"
              style={{ width: 56, height: 56 }}
            >
              <div
                className="w-full h-full flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg, #D4AF37, #b8952d)', borderRadius: 16, boxShadow: '0 8px 24px rgba(212,175,55,0.25)' }}
              >
                <Heart className="text-white" style={{ width: 24, height: 24, fill: 'rgba(255,255,255,0.25)' }} />
              </div>
            </motion.div>
            <h1 className="text-white text-xl font-bold mb-1" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
              Chào mừng trở lại
            </h1>
            <p className="text-xs" style={{ color: 'rgba(255,255,255,0.35)' }}>
              Đăng nhập để quản lý thiệp cưới
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Username */}
            <div>
              <label className="block text-xs font-bold uppercase mb-2" style={{ color: 'rgba(255,255,255,0.35)', letterSpacing: '0.12em', fontSize: 10 }}>
                Tên đăng nhập
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" style={{ width: 16, height: 16, color: 'rgba(255,255,255,0.2)' }} />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => { setUsername(e.target.value); setError(''); }}
                  placeholder="Nhập tên đăng nhập..."
                  autoComplete="username"
                  autoFocus
                  className="w-full text-white text-sm font-medium outline-none transition-all"
                  style={{
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    borderRadius: 12,
                    padding: '12px 16px 12px 40px',
                  }}
                  onFocus={(e) => { e.target.style.borderColor = 'rgba(212,175,55,0.4)'; e.target.style.background = 'rgba(255,255,255,0.08)'; }}
                  onBlur={(e) => { e.target.style.borderColor = 'rgba(255,255,255,0.08)'; e.target.style.background = 'rgba(255,255,255,0.05)'; }}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-bold uppercase mb-2" style={{ color: 'rgba(255,255,255,0.35)', letterSpacing: '0.12em', fontSize: 10 }}>
                Mật khẩu
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" style={{ width: 16, height: 16, color: 'rgba(255,255,255,0.2)' }} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setError(''); }}
                  placeholder="Nhập mật khẩu..."
                  autoComplete="current-password"
                  className="w-full text-white text-sm font-medium outline-none transition-all"
                  style={{
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    borderRadius: 12,
                    padding: '12px 44px 12px 40px',
                  }}
                  onFocus={(e) => { e.target.style.borderColor = 'rgba(212,175,55,0.4)'; e.target.style.background = 'rgba(255,255,255,0.08)'; }}
                  onBlur={(e) => { e.target.style.borderColor = 'rgba(255,255,255,0.08)'; e.target.style.background = 'rgba(255,255,255,0.05)'; }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 transition-colors"
                  style={{ color: 'rgba(255,255,255,0.2)' }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = 'rgba(255,255,255,0.5)')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(255,255,255,0.2)')}
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            {/* Error */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -4, height: 0 }}
                  animate={{ opacity: 1, y: 0, height: 'auto' }}
                  exit={{ opacity: 0, y: -4, height: 0 }}
                  className="flex items-center gap-2 text-xs font-medium"
                  style={{ background: 'rgba(244,63,94,0.1)', border: '1px solid rgba(244,63,94,0.2)', color: '#fca5a5', borderRadius: 12, padding: '10px 14px' }}
                >
                  <AlertTriangle size={13} />
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading || !username.trim() || !password.trim()}
              className="w-full text-white font-bold uppercase flex items-center justify-center gap-2 transition-all disabled:opacity-40 disabled:cursor-not-allowed relative overflow-hidden group"
              style={{
                background: 'linear-gradient(135deg, #D4AF37, #b8952d)',
                borderRadius: 12,
                padding: '13px 0',
                fontSize: 11,
                letterSpacing: '0.15em',
                boxShadow: '0 4px 16px rgba(212,175,55,0.25)',
                marginTop: 8,
              }}
            >
              <div
                className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700"
                style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.12), transparent)' }}
              />
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <LogIn size={14} />
                  <span className="relative">Đăng nhập</span>
                </>
              )}
            </button>
          </form>

          {/* Footer link */}
          <div className="text-center mt-6 pt-5" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
            <button
              onClick={() => window.location.href = '/'}
              className="text-xs font-medium transition-colors inline-flex items-center gap-1.5"
              style={{ color: 'rgba(255,255,255,0.25)' }}
              onMouseEnter={(e) => (e.currentTarget.style.color = 'rgba(255,255,255,0.5)')}
              onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(255,255,255,0.25)')}
            >
              ← Quay về trang thiệp cưới
            </button>
          </div>
        </div>

        <p className="text-center mt-5 uppercase font-medium" style={{ color: 'rgba(255,255,255,0.15)', fontSize: 10, letterSpacing: '0.2em' }}>
          © 2026 Wedding Invitation
        </p>
      </motion.div>
    </div>
  );
};

export default AdminLogin;

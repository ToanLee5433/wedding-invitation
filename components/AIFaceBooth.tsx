
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, Download, RefreshCw, Sparkles, Loader2, Image as ImageIcon, Video, Wand2, X, Check, Info } from 'lucide-react';

const WEDDING_BASE_IMAGE_URL = 'https://iv1cdn.vnecdn.net/giaitri/images/web/2025/10/23/toan-canh-dam-cuoi-cua-vo-chong-do-thi-ha-1761191294.jpg?w=1200&q=100';

const AIFaceBooth: React.FC = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [guestImage, setGuestImage] = useState<string | null>(null);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showCamera, setShowCamera] = useState(false);
  const [step, setStep] = useState(1); // 1: Select, 2: Preview, 3: Generation/Result

  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Cleanup camera stream on unmount
  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [stream]);

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: { ideal: 1024 }, height: { ideal: 1024 } }
      });
      setStream(mediaStream);
      if (videoRef.current) videoRef.current.srcObject = mediaStream;
      setShowCamera(true);
      setError(null);
    } catch (err) {
      setError("Không thể truy cập Camera. Vui lòng kiểm tra quyền trình duyệt.");
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setShowCamera(false);
  };

  const capturePhoto = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        // Mirror effect for front camera
        ctx.translate(canvas.width, 0);
        ctx.scale(-1, 1);
        ctx.drawImage(videoRef.current, 0, 0);
      }
      setGuestImage(canvas.toDataURL('image/jpeg', 0.9));
      stopCamera();
      setStep(2);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setGuestImage(reader.result as string);
        setResultImage(null);
        setError(null);
        setStep(2);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAiGeneration = async () => {
    if (!guestImage) return;
    setIsProcessing(true);
    setStep(3);
    setError(null);

    try {
      const guestImageBase64 = guestImage.split(',')[1];

      // Call the Edge Function instead of calling Gemini directly
      // This bypasses CORS and keeps the API key secure on the server
      const response = await fetch('/api/generate-photo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ guestImageBase64 }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `API error: ${response.status}`);
      }

      const data = await response.json();

      if (data.resultImage) {
        setResultImage(data.resultImage);
      } else {
        throw new Error("AI không trả về dữ liệu hình ảnh.");
      }

    } catch (err: any) {
      console.error("AI Booth Error:", err);
      setError(err.message || "Có lỗi xảy ra khi tạo ảnh. Vui lòng thử lại.");
      setStep(2);
    } finally {
      setIsProcessing(false);
    }
  };

  const downloadImage = () => {
    if (!resultImage) return;
    const link = document.createElement('a');
    link.href = resultImage;
    link.download = `trang-chien-wedding-ai-${Date.now()}.png`;
    link.click();
  };

  const reset = () => {
    setGuestImage(null);
    setResultImage(null);
    setStep(1);
    setError(null);
  };

  return (
    <section className="py-20 md:py-32 px-4 relative overflow-hidden bg-[#FDFCF0]/50">
      {/* Decorative Ornaments */}
      <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-white to-transparent opacity-60"></div>
      <div className="absolute top-10 right-10 w-64 h-64 bg-gold/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-10 left-10 w-64 h-64 bg-gold/5 rounded-full blur-3xl"></div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header Block */}
        <div className="text-center mb-16 md:mb-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-gold/10 border border-gold/20 text-gold text-[10px] uppercase font-black tracking-[0.25em] mb-8"
          >
            <Sparkles size={14} className="shimmer-gold" /> AI Photo Booth
          </motion.div>

          <h2 className="font-serif-cinzel font-bold text-4xl md:text-6xl lg:text-7xl mb-6 text-gray-900 uppercase tracking-tight leading-none">
            Gặp Gỡ <span className="text-gold italic">Trang & Chiến</span>
          </h2>

          <p className="text-gray-500 font-sans-montserrat font-light max-w-2xl mx-auto text-base md:text-lg leading-relaxed px-4">
            Công nghệ AI tiên tiến giúp bạn lưu giữ khoảnh khắc cùng cô dâu & chú rể <br className="hidden md:block" /> trong không gian lễ cưới đầy hoa lệ.
          </p>
        </div>

        {/* Studio Container */}
        <div className="bg-white rounded-[2.5rem] p-4 md:p-8 shadow-[0_20px_80px_-20px_rgba(212,175,55,0.15)] border border-gold/10 relative">

          {/* Step Indicator (Desktop) */}
          <div className="hidden md:flex justify-center items-center gap-12 mb-12">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${step >= s ? 'bg-gold text-white shadow-lg shadow-gold/30' : 'bg-gray-100 text-gray-400'}`}>
                  {step > s ? <Check size={14} /> : s}
                </div>
                <span className={`text-[10px] uppercase tracking-widest font-bold ${step >= s ? 'text-gray-900' : 'text-gray-400'}`}>
                  {s === 1 ? 'Chọn Ảnh' : s === 2 ? 'Xem Trước' : 'Kết Quả'}
                </span>
                {s < 3 && <div className={`w-12 h-[1px] ${step > s ? 'bg-gold' : 'bg-gray-100'}`} />}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-20 items-stretch min-h-[500px]">

            {/* Left Column: Input / Preview */}
            <div className="flex flex-col h-full">
              <div className="relative flex-1 rounded-[2rem] overflow-hidden bg-[#FBFBFB] border border-dashed border-gold/30 group transition-all duration-500 hover:border-gold/60">
                <AnimatePresence mode="wait">
                  {showCamera ? (
                    <motion.div
                      key="camera"
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                      className="absolute inset-0 z-20"
                    >
                      <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
                      <div className="absolute inset-0 flex flex-col justify-end p-8 gap-4 bg-gradient-to-t from-black/60 to-transparent">
                        <div className="flex justify-center gap-4">
                          <button onClick={capturePhoto} className="w-20 h-20 bg-white rounded-full flex items-center justify-center text-black border-[5px] border-gold shadow-2xl active:scale-95 transition-all hover:scale-105">
                            <Camera size={32} />
                          </button>
                          <button onClick={stopCamera} className="w-20 h-20 bg-white/20 backdrop-blur-xl rounded-full flex items-center justify-center text-white border border-white/30 active:scale-95 transition-all hover:bg-white/30">
                            <X size={28} />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ) : guestImage && step >= 2 ? (
                    <motion.div
                      key="preview"
                      initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
                      className="absolute inset-0 z-10"
                    >
                      <img src={guestImage} className="w-full h-full object-cover" alt="Portrait Preview" />
                      {!isProcessing && step === 2 && (
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                          <button onClick={() => setGuestImage(null)} className="p-4 bg-white/20 backdrop-blur-xl rounded-full text-white hover:bg-white hover:text-black transition-all">
                            <RefreshCw size={24} />
                          </button>
                        </div>
                      )}
                    </motion.div>
                  ) : (
                    <motion.div
                      key="placeholder"
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                      className="absolute inset-0 flex flex-col items-center justify-center p-12 text-center"
                    >
                      <div className="w-24 h-24 bg-gold/5 rounded-full flex items-center justify-center mb-8 border border-gold/10">
                        <ImageIcon size={40} className="text-gold/40" />
                      </div>
                      <h4 className="font-serif-cinzel font-bold text-xl mb-3 text-gray-800 tracking-wide">Studio Chân Dung</h4>
                      <p className="text-[10px] uppercase tracking-[0.3em] text-gray-400 leading-loose max-w-[200px] mb-8">
                        Hãy chuẩn bị <br /> một tấm hình thật đẹp
                      </p>

                      <div className="flex flex-col sm:flex-row gap-4 w-full max-w-xs">
                        <button onClick={startCamera} className="flex-1 py-4 bg-gray-900 text-white rounded-xl flex items-center justify-center gap-3 transition-all hover:bg-gold active:scale-95 text-[10px] uppercase font-black tracking-widest">
                          <Video size={16} /> Chụp Ảnh
                        </button>
                        <button
                          onClick={() => fileInputRef.current?.click()}
                          className="flex-1 py-4 bg-white text-gray-900 border border-gold/20 rounded-xl flex items-center justify-center gap-3 transition-all hover:bg-gold/5 active:scale-95 text-[10px] uppercase font-black tracking-widest shadow-sm"
                        >
                          <ImageIcon size={16} /> Tải Lên
                        </button>
                      </div>
                      <input ref={fileInputRef} type="file" className="hidden" accept="image/*" onChange={handleFileUpload} />
                    </motion.div>
                  )}
                </AnimatePresence>
                {isProcessing && <div className="ai-loading-bar" />}
              </div>

              {guestImage && !showCamera && step === 2 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                  className="mt-6 flex flex-col gap-4"
                >
                  <button
                    onClick={handleAiGeneration}
                    disabled={isProcessing}
                    className="w-full py-6 bg-gold text-white rounded-2xl flex items-center justify-center gap-4 shadow-xl shadow-gold/20 disabled:opacity-50 transition-all hover:scale-[1.02] active:scale-95 group font-black uppercase tracking-[0.2em] text-[12px]"
                  >
                    <Wand2 size={20} className="group-hover:rotate-12 transition-transform" />
                    Bắt Đầu Ghép Với AI
                  </button>
                  <button
                    onClick={reset}
                    className="py-3 text-[10px] uppercase font-bold tracking-[0.2em] text-gray-400 hover:text-gold transition-colors"
                  >
                    Hủy và Làm lại
                  </button>
                </motion.div>
              )}
            </div>

            {/* Right Column: Result / Loading */}
            <div className="flex flex-col h-full">
              <div className="relative flex-1 rounded-[2rem] overflow-hidden bg-[#FBFBFB] border border-gold/10 shadow-inner flex items-center justify-center">
                <AnimatePresence mode="wait">
                  {isProcessing ? (
                    <motion.div
                      key="loading"
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                      className="absolute inset-0 z-30 bg-white/95 backdrop-blur-xl flex flex-col items-center justify-center text-center p-8"
                    >
                      <div className="relative mb-10">
                        <div className="w-24 h-24 border-2 border-gold/20 rounded-full"></div>
                        <div className="absolute inset-0 w-24 h-24 border-t-2 border-gold rounded-full animate-spin"></div>
                        <Sparkles size={32} className="absolute inset-0 m-auto text-gold animate-pulse" />
                      </div>
                      <h4 className="font-serif italic text-3xl mb-4 tracking-tighter text-gray-900">Nghệ thuật đang thành hình...</h4>
                      <p className="text-[10px] uppercase tracking-widest text-gray-500 leading-relaxed font-bold max-w-[280px]">
                        AI đang phân tích ánh sáng, phối cảnh <br /> và duy trì trọn vẹn nét mặt của bạn
                      </p>
                    </motion.div>
                  ) : resultImage ? (
                    <motion.div
                      key="result"
                      initial={{ opacity: 0, scale: 1.1 }} animate={{ opacity: 1, scale: 1 }}
                      className="absolute inset-0 z-10"
                    >
                      <img src={resultImage} className="w-full h-full object-contain" alt="AI Celebration Moment" />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="placeholder-result"
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                      className="text-center p-12"
                    >
                      <div className="w-24 h-24 bg-gold/5 rounded-full flex items-center justify-center mb-8 mx-auto border border-gold/10">
                        <Sparkles size={40} className="text-gold/20" />
                      </div>
                      <h4 className="font-serif-cinzel font-bold text-xl mb-3 text-gray-300 tracking-wide uppercase">Khoảnh Khắc Kỷ Niệm</h4>
                      <p className="text-[10px] uppercase tracking-[0.3em] text-gray-300 leading-loose max-w-[200px] mx-auto">
                        Thành quả sẽ xuất hiện <br /> sau vài giây kỳ diệu
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>

                {error && (
                  <div className="absolute top-4 left-4 right-4 z-40 bg-rose-500 text-white p-4 rounded-xl text-center text-[10px] uppercase font-black tracking-widest shadow-lg flex items-center justify-center gap-3">
                    <Info size={16} /> {error}
                  </div>
                )}
              </div>

              {resultImage && !isProcessing && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                  className="mt-6 flex flex-col gap-4"
                >
                  <button
                    onClick={downloadImage}
                    className="w-full py-6 bg-gray-900 text-gold rounded-2xl flex items-center justify-center gap-4 shadow-xl hover:bg-gold hover:text-white transition-all hover:scale-[1.02] active:scale-95 group font-black uppercase tracking-[0.2em] text-[12px]"
                  >
                    <Download size={20} className="animate-bounce" />
                    Tải Ảnh Kỷ Niệm
                  </button>
                  <button
                    onClick={reset}
                    className="py-3 text-[10px] uppercase font-bold tracking-[0.2em] text-gray-400 hover:text-gold transition-colors"
                  >
                    Chụp một ảnh khác
                  </button>
                </motion.div>
              )}

              {/* Tips Section - Integrated */}
              <div className="mt-8 p-6 bg-gold/5 rounded-[2rem] border border-gold/10 text-left relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:rotate-12 transition-transform">
                  <Wand2 size={40} className="text-gold" />
                </div>
                <h4 className="text-gold text-[10px] uppercase font-black tracking-widest mb-4 flex items-center gap-2">
                  <Info size={12} /> Bí Quyết Để Có Ảnh Đẹp
                </h4>
                <ul className="text-[11px] text-gray-400 space-y-3 leading-relaxed font-medium">
                  <li className="flex items-start gap-2">• <span>Hãy chọn nơi có <span className="text-gray-600 font-bold">ánh sáng tốt</span> và phông nền đơn giản.</span></li>
                  <li className="flex items-start gap-2">• <span>Cách đứng <span className="text-gray-600 font-bold">chính diện</span> sẽ giúp AI nhận diện tốt nhất.</span></li>
                  <li className="flex items-start gap-2">• <span>Bạn có thể <span className="text-gray-600 font-bold">tải lên</span> ảnh có sẵn chất lượng cao.</span></li>
                </ul>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};

export default AIFaceBooth;

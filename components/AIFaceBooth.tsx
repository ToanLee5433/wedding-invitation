
import React, { useState, useRef } from 'react';
import { GoogleGenAI } from "@google/genai";
import { Camera, Download, RefreshCw, Sparkles, Loader2, Image as ImageIcon, Video, Wand2 } from 'lucide-react';

const WEDDING_BASE_IMAGE_URL = 'https://iv1cdn.vnecdn.net/giaitri/images/web/2025/10/23/toan-canh-dam-cuoi-cua-vo-chong-do-thi-ha-1761191294.jpg?w=680&h=0&q=100&dpr=2&fit=crop&s=moA8LWQ9dLsT6d16c1Vmpg';

const AIFaceBooth: React.FC = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [guestImage, setGuestImage] = useState<string | null>(null);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showCamera, setShowCamera] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } });
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
      ctx?.drawImage(videoRef.current, 0, 0);
      setGuestImage(canvas.toDataURL('image/jpeg'));
      stopCamera();
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
      };
      reader.readAsDataURL(file);
    }
  };

  const fetchAsBase64 = async (url: string): Promise<string> => {
    const response = await fetch(url);
    const blob = await response.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = (reader.result as string).split(',')[1];
        resolve(base64);
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };

  const handleAiGeneration = async () => {
    if (!guestImage) return;
    setIsProcessing(true);
    setError(null);

    try {
      const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY });

      const baseImageBase64 = await fetchAsBase64(WEDDING_BASE_IMAGE_URL);
      const guestImageBase64 = guestImage.split(',')[1];

      const prompt = `You are an expert AI photo editor for luxury wedding photography. Your task is to perform high-fidelity image composition.

INPUTS: 
- Image 1: The original wedding background with the couple. 
- Image 2: The guest's portrait.

STRICT REQUIREMENTS: 
1. IDENTITY PRESERVATION: You MUST maintain 100% of the guest's facial features, bone structure, and hairstyle from Image 2. Do not "re-draw" or "beautify" the face to the point of losing likeness. 
2. SEAMLESS INTEGRATION: Place the guest from Image 2 standing naturally next to the groom in Image 1. Scale the guest proportionally to match the height of the couple. 
3. LIGHTING & COLOR: Match the warm ambient lighting, shadows, and professional color grading of Image 1 perfectly. The guest should appear as if they were captured by the same camera lens (match depth-of-field and grain). 
4. OCCLUSION & LAYERING: Ensure the guest's feet and body are correctly placed within the 3D space of the scene (e.g., standing on the same floor).

OUTPUT: Return ONLY the final high-resolution merged image.`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
          parts: [
            {
              inlineData: {
                data: baseImageBase64,
                mimeType: 'image/jpeg',
              },
            },
            {
              inlineData: {
                data: guestImageBase64,
                mimeType: 'image/jpeg',
              },
            },
            { text: prompt },
          ],
        },
      });

      let finalImageUrl = null;
      if (response.candidates?.[0]?.content?.parts) {
        const imagePart = response.candidates[0].content.parts.find(part => part.inlineData);
        if (imagePart) {
          finalImageUrl = `data:image/png;base64,${imagePart.inlineData.data}`;
        }
      }

      if (finalImageUrl) {
        setResultImage(finalImageUrl);
      } else {
        throw new Error("AI không trả về dữ liệu hình ảnh.");
      }

    } catch (err: any) {
      console.error("AI Booth Error:", err);
      setError("Không thể tạo ảnh. Hãy thử lại sau.");
    } finally {
      setIsProcessing(false);
    }
  };

  const downloadImage = () => {
    if (!resultImage) return;
    const link = document.createElement('a');
    link.href = resultImage;
    link.download = `wedding-ai-memory-${Date.now()}.png`;
    link.click();
  };

  return (
    <section className="py-12 md:py-24 px-4 md:px-8 bg-white text-gray-800 relative overflow-hidden rounded-[1.5rem] md:rounded-[3rem] mx-1 md:mx-2 my-10 md:my-20 border border-gold/10 shadow-2xl transition-all duration-700 hover:shadow-gold/10">
      <div className="absolute top-0 right-0 w-96 h-96 bg-gold/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2"></div>

      <div className="mx-auto max-w-[1400px] relative z-10 text-center">
        <div className="mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gold/10 border border-gold/20 text-gold text-[10px] uppercase font-black tracking-[0.2em] mb-6">
            <Sparkles size={12} className="animate-pulse" /> AI Photo Booth
          </div>
          <h2 className="font-serif-cinzel font-bold text-3xl md:text-5xl lg:text-7xl mb-4 md:mb-8 text-gray-900 uppercase leading-[1.1] tracking-normal">
            <span className="inline-block">Gặp</span>{' '}
            <span className="inline-block">Gỡ</span>{' '}
            <span className="inline-block">Trang</span>{' '}
            <span className="inline-block">&</span>{' '}
            <span className="inline-block">Chiến</span>
          </h2>
          <p className="text-gray-500 font-sans-montserrat font-light max-w-xl mx-auto text-sm leading-relaxed">
            Sử dụng trí tuệ nhân tạo để ghi lại khoảnh khắc bạn hiện diện trong không gian lễ cưới đầy sang trọng.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-16 items-start">
          <div className="space-y-8">
            <div className="relative min-h-[320px] md:min-h-0 md:aspect-[3/4] bg-slate-50 rounded-[1.5rem] md:rounded-[2rem] border border-gold/10 overflow-hidden group shadow-lg transition-all hover:border-gold/30">
              {showCamera ? (
                <div className="relative w-full h-full">
                  <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
                  <div className="absolute bottom-8 left-0 w-full flex justify-center gap-4">
                    <button onClick={capturePhoto} className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-black border-4 border-gold shadow-2xl active:scale-90 transition-all">
                      <Camera size={28} />
                    </button>
                    <button onClick={stopCamera} className="w-16 h-16 bg-white/80 backdrop-blur-md rounded-full flex items-center justify-center text-gray-800 active:scale-90 transition-all shadow-lg border border-gold/20">
                      <RefreshCw size={24} />
                    </button>
                  </div>
                </div>
              ) : guestImage ? (
                <div className="relative w-full h-full">
                  <img src={guestImage} className="w-full h-full object-cover" alt="Portrait" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button onClick={() => setGuestImage(null)} className="p-4 bg-white/20 backdrop-blur-xl rounded-full text-white hover:bg-white hover:text-black transition-all">
                      <RefreshCw size={24} />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center p-12 text-center">
                  <div className="w-24 h-24 bg-gold/5 rounded-full flex items-center justify-center mb-8 border border-gold/10">
                    <ImageIcon size={40} className="text-gold/20" />
                  </div>
                  <p className="text-[10px] uppercase tracking-[0.3em] text-gray-400 leading-loose">
                    Hãy chụp hoặc tải <br /> ảnh chân dung của bạn
                  </p>
                </div>
              )}
              {isProcessing && <div className="ai-loading-bar" />}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button onClick={startCamera} className="py-4 bg-slate-50 hover:bg-slate-100 text-gray-800 rounded-2xl flex items-center justify-center gap-3 transition-all text-[10px] uppercase font-black tracking-widest border border-gold/10 shadow-sm">
                <Video size={16} /> Chụp Ảnh
              </button>
              <label className="py-4 bg-slate-50 hover:bg-slate-100 text-gray-800 rounded-2xl flex items-center justify-center gap-3 transition-all text-[10px] uppercase font-black tracking-widest border border-gold/10 cursor-pointer shadow-sm">
                <ImageIcon size={16} /> Tải Ảnh Lên
                <input type="file" className="hidden" accept="image/*" onChange={handleFileUpload} />
              </label>
            </div>

            <button onClick={handleAiGeneration} disabled={!guestImage || isProcessing} className="w-full py-6 bg-gold text-white rounded-2xl flex items-center justify-center gap-4 shadow-2xl shadow-gold/20 disabled:opacity-30 transition-all active:scale-95 group hover:bg-[#B38F2D]">
              {isProcessing ? (
                <>
                  <Loader2 size={20} className="animate-spin" />
                  <span className="text-[12px] uppercase font-black tracking-[0.2em]">Đang Xử Lý Hình Ảnh...</span>
                </>
              ) : (
                <>
                  <Wand2 size={20} className="group-hover:rotate-12 transition-transform" />
                  <span className="text-[12px] uppercase font-black tracking-[0.2em]">Bắt Đầu Ghép Với AI</span>
                </>
              )}
            </button>

            {error && <p className="text-rose-500 text-[10px] uppercase font-bold tracking-widest bg-rose-500/5 py-4 rounded-xl border border-rose-500/10 animate-pulse">{error}</p>}
          </div>

          <div className="space-y-8">
            <div className="relative min-h-[320px] md:min-h-0 md:aspect-[3/4] bg-slate-50 rounded-[1.5rem] md:rounded-[2rem] overflow-hidden shadow-[0_0_80px_rgba(212,175,55,0.1)] border border-gold/20 flex items-center justify-center">
              {resultImage ? (
                <img src={resultImage} className="w-full h-full object-contain animate-in zoom-in-95 duration-1000" alt="Result" />
              ) : (
                <div className="text-center opacity-10 flex flex-col items-center">
                  <Sparkles size={80} className="mb-4 text-gold/20" />
                  <p className="font-serif italic text-2xl tracking-tighter text-gray-300">Kết Quả Kỷ Niệm</p>
                </div>
              )}
              {isProcessing && (
                <div className="absolute inset-0 bg-white/90 backdrop-blur-md flex flex-col items-center justify-center text-center p-8">
                  <div className="w-16 h-16 border-t-2 border-gold rounded-full animate-spin mb-6"></div>
                  <h4 className="text-gold font-serif text-2xl italic mb-2 tracking-tighter">Đang tạo khoảnh khắc...</h4>
                  <p className="text-[10px] uppercase tracking-widest text-gray-400 leading-relaxed font-bold">
                    AI đang phân tích ánh sáng, phối cảnh <br /> và duy trì 100% diện mạo của bạn
                  </p>
                </div>
              )}
            </div>

            {resultImage && (
              <button onClick={downloadImage} className="w-full py-6 bg-slate-900 text-white rounded-2xl flex items-center justify-center gap-4 shadow-2xl hover:bg-gold transition-all active:scale-95 group">
                <Download size={20} />
                <span className="text-[12px] uppercase font-black tracking-[0.2em]">Tải Ảnh Kỷ Niệm</span>
              </button>
            )}

            <div className="p-8 bg-gold/5 rounded-3xl border border-gold/10 text-left relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:rotate-12 transition-transform">
                <Sparkles size={40} />
              </div>
              <h4 className="text-gold text-[10px] uppercase font-black tracking-widest mb-4">Lưu ý:</h4>
              <ul className="text-xs text-gray-500 space-y-3 leading-relaxed">
                <li>• Sử dụng ảnh chân dung rõ nét, nhìn thẳng để đạt kết quả tốt nhất.</li>
                <li>• AI sẽ tự động đồng bộ ánh sáng và màu sắc với ảnh tiệc cưới.</li>
                <li>• Hệ thống bảo toàn 100% nét mặt của khách mời.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section >
  );
};

export default AIFaceBooth;

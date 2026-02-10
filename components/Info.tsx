
import React from 'react';
import { WeddingEvent } from '../App';
import { MapPin, Navigation, ExternalLink } from 'lucide-react';

interface EventCardProps {
  type: 'vuQuy' | 'thanhHon';
  data: WeddingEvent;
  editMode: boolean;
  onUpdate: (type: 'vuQuy' | 'thanhHon', field: keyof WeddingEvent, value: string) => void;
}

const EventCard: React.FC<EventCardProps> = ({
  type,
  data,
  editMode,
  onUpdate
}) => {
  const mapEmbedUrl = `https://maps.google.com/maps?q=${encodeURIComponent(data.address || data.location)}&t=&z=15&ie=UTF8&iwloc=&output=embed`;

  return (
    <div className="flex flex-col items-center w-full">
      {/* Title Label - Sitting clearly on top and centered */}
      <div className="bg-[#FDFCF0] text-[#D4AF37] font-script-great text-3xl md:text-5xl px-8 py-2 z-10 border-x border-[#D4AF37]/20 flex items-center justify-center shadow-sm shimmer-gold translate-y-6 min-w-[200px]">
        {editMode ? (
          <input
            value={data.title}
            onChange={(e) => onUpdate(type, 'title', e.target.value)}
            className="bg-transparent border-b border-[#D4AF37]/40 text-center focus:outline-none focus:border-[#D4AF37] w-full min-w-[150px] placeholder-[#D4AF37]/30"
            placeholder="Tên lễ..."
          />
        ) : (
          data.title
        )}
      </div>

      {/* Main Card */}
      <div className="w-full p-8 md:p-12 border border-[#D4AF37]/10 hover:border-[#D4AF37]/30 transition-all duration-700 bg-white shadow-sm rounded-2xl pt-16 md:pt-20">
        <div className="text-center space-y-8">
          {/* Date */}
          <div className="inline-block border-b border-[#D4AF37]/10 pb-4 mb-4 w-full">
            <div className="font-serif-playfair text-xl md:text-2xl uppercase tracking-[0.3em] text-[#4A4A4A] font-bold">
              {editMode ? (
                <div className="relative group/input">
                  <input
                    value={data.date}
                    onChange={(e) => onUpdate(type, 'date', e.target.value)}
                    className="bg-white/50 border-b border-[#D4AF37]/30 text-center focus:outline-none focus:border-[#D4AF37] w-full py-2 transition-all placeholder-gray-300"
                    placeholder="DD-MM-YYYY"
                  />
                  <label className="block text-[10px] text-[#D4AF37] mt-1 font-sans tracking-widest opacity-0 group-hover/input:opacity-100 transition-opacity">
                    NGÀY TỔ CHỨC
                  </label>
                </div>
              ) : (
                data.date
              )}
            </div>
          </div>

          <div className="space-y-6">
            {/* Time */}
            <div className="font-bold text-[#D4AF37] text-lg md:text-xl uppercase tracking-[0.2em] font-sans-montserrat">
              {editMode ? (
                 <div className="relative group/input max-w-xs mx-auto">
                  <input
                    value={data.time}
                    onChange={(e) => onUpdate(type, 'time', e.target.value)}
                    className="bg-white/50 border-b border-[#D4AF37]/30 text-center focus:outline-none focus:border-[#D4AF37] w-full py-2 transition-all"
                    placeholder="HH:MM"
                  />
                  <label className="block text-[8px] text-[#D4AF37]/70 mt-1 tracking-widest opacity-0 group-hover/input:opacity-100 transition-opacity absolute w-full -bottom-4">
                    GIỜ LÀM LỄ
                  </label>
                </div>
              ) : (
                data.time
              )}
            </div>

            {/* Location & Address */}
            <div className="space-y-4">
              <div className="text-[16px] md:text-lg text-[#333] font-bold font-sans-quicksand italic leading-snug">
                {editMode ? (
                  <div className="relative group/input">
                    <input
                      value={data.location}
                      onChange={(e) => onUpdate(type, 'location', e.target.value)}
                      className="bg-white/50 border-b border-[#D4AF37]/30 text-center focus:outline-none focus:border-[#D4AF37] w-full py-2 transition-all font-bold"
                      placeholder="Tên địa điểm (Nhà riêng/Khách sạn)..."
                    />
                  </div>
                ) : (
                  data.location
                )}
              </div>

              <div className="text-[12px] md:text-sm text-gray-500 leading-relaxed px-4 mx-auto">
                {editMode ? (
                  <div className="relative group/input">
                    <textarea
                      value={data.address}
                      onChange={(e) => onUpdate(type, 'address', e.target.value)}
                      className="bg-[#FDFCF0]/50 border border-[#D4AF37]/20 text-center focus:outline-none focus:border-[#D4AF37] w-full p-3 h-24 resize-none rounded-lg text-sm text-gray-600 shadow-inner"
                      placeholder="Địa chỉ chi tiết..."
                    />
                    <label className="block text-[9px] text-gray-400 mt-1 uppercase tracking-wider">
                      Địa chỉ cụ thể
                    </label>
                  </div>
                ) : (
                  data.address
                )}
              </div>
            </div>
          </div>

          {/* Map Embed */}
          <div className="w-full h-44 md:h-52 rounded-xl overflow-hidden border border-[#D4AF37]/10 shadow-inner relative group/map mt-6">
            <iframe
              width="100%"
              height="100%"
              frameBorder="0"
              scrolling="no"
              marginHeight={0}
              marginWidth={0}
              src={mapEmbedUrl}
              className="grayscale-[0.5] contrast-[1.1] hover:grayscale-0 transition-all duration-700"
              title="Map"
            />
            <a
              href={data.mapLink}
              target="_blank"
              rel="noopener noreferrer"
              className="absolute inset-0 bg-black/0 hover:bg-black/10 flex items-center justify-center transition-all group-hover/map:opacity-100 opacity-0"
            >
              <div className="bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full text-[#D4AF37] text-[10px] uppercase font-black tracking-widest shadow-xl flex items-center gap-2">
                <ExternalLink size={12} /> Xem bản đồ lớn
              </div>
            </a>
          </div>

          {/* Navigation Button */}
          <div className="pt-6">
            {editMode ? (
              <div className="space-y-2 max-w-xs mx-auto">
                <div className="relative">
                  <input
                    value={data.mapLink}
                    onChange={(e) => onUpdate(type, 'mapLink', e.target.value)}
                    className="peer w-full pl-8 pr-4 py-2 bg-white border border-[#D4AF37]/20 rounded text-[10px] text-gray-600 focus:outline-none focus:border-[#D4AF37] transition-all"
                    placeholder="https://goo.gl/maps/..."
                  />
                  <Navigation className="absolute left-2.5 top-2.5 text-[#D4AF37]/50" size={12} />
                  <label className="absolute -top-2 left-2 px-1 bg-white text-[8px] font-bold text-[#D4AF37] uppercase tracking-widest">
                    Google Maps Link
                  </label>
                </div>
              </div>
            ) : (
              <a
                href={data.mapLink}
                target="_blank"
                rel="noopener noreferrer"
                className="shimmer-btn inline-flex items-center gap-2 px-10 py-4 bg-[#D4AF37] text-white text-[10px] uppercase tracking-[0.4em] rounded-full hover:bg-[#333] hover:text-[#D4AF37] transition-all duration-500 font-black shadow-lg shadow-[#D4AF37]/20"
              >
                <Navigation className="w-3 h-3" /> Chỉ đường ngay
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

interface InfoProps {
  details: {
    vuQuy: WeddingEvent;
    thanhHon: WeddingEvent;
  };
  editMode: boolean;
  onUpdate: (type: 'vuQuy' | 'thanhHon', field: keyof WeddingEvent, value: string) => void;
}

const Info: React.FC<InfoProps> = ({ details, editMode, onUpdate }) => {
  return (
    <section id="info" className="space-y-20 md:space-y-32 scroll-mt-24 pt-16">
      <div className="text-center">
        <span className="text-gold uppercase tracking-[0.5em] text-[10px] font-black mb-4 block">
          Wedding Events
        </span>
        <h2 className="font-serif text-5xl md:text-6xl mb-6 text-[#333] tracking-tighter italic">
          Thời Gian & Địa Điểm
        </h2>
        <div className="h-[1px] w-24 bg-gold/30 mx-auto"></div>
      </div>

      <div className="grid md:grid-cols-2 gap-16 md:gap-32 max-w-7xl mx-auto px-4 pb-20">
        <EventCard
          type="vuQuy"
          data={details.vuQuy}
          editMode={editMode}
          onUpdate={onUpdate}
        />
        <EventCard
          type="thanhHon"
          data={details.thanhHon}
          editMode={editMode}
          onUpdate={onUpdate}
        />
      </div>
    </section>
  );
};

export default Info;

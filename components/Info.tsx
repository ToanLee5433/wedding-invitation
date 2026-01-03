
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
      <div className="bg-[#FDFCF0] text-gold font-script-great text-3xl md:text-5xl px-8 py-2 z-10 border-x border-gold/20 flex items-center justify-center shadow-sm shimmer-gold translate-y-6">
        {editMode ? (
          <input
            value={data.title}
            onChange={(e) => onUpdate(type, 'title', e.target.value)}
            className="bg-transparent border-none text-center focus:outline-none w-48"
          />
        ) : (
          data.title
        )}
      </div>

      {/* Main Card */}
      <div className="w-full p-8 md:p-12 border border-gold/10 hover:border-gold/30 transition-all duration-700 bg-white shadow-sm rounded-2xl pt-16 md:pt-20">
        <div className="text-center space-y-8">
          {/* Date */}
          <div className="inline-block border-b border-gold/10 pb-4 mb-4">
            <div className="font-serif-playfair text-xl md:text-2xl uppercase tracking-[0.3em] text-[#4A4A4A] font-bold">
              {editMode ? (
                <input
                  value={data.date}
                  onChange={(e) => onUpdate(type, 'date', e.target.value)}
                  className="bg-transparent border-none text-center focus:outline-none w-full py-1"
                />
              ) : (
                data.date
              )}
            </div>
          </div>

          <div className="space-y-6">
            {/* Time */}
            <div className="font-bold text-gold text-lg md:text-xl uppercase tracking-[0.2em] font-sans-montserrat">
              {editMode ? (
                <input
                  value={data.time}
                  onChange={(e) => onUpdate(type, 'time', e.target.value)}
                  className="bg-transparent border-b border-gold/20 text-center focus:outline-none w-48 py-1"
                />
              ) : (
                data.time
              )}
            </div>

            {/* Location & Address */}
            <div className="space-y-2">
              <div className="text-[16px] md:text-lg text-[#333] font-bold font-sans-quicksand italic leading-snug">
                {editMode ? (
                  <input
                    value={data.location}
                    onChange={(e) => onUpdate(type, 'location', e.target.value)}
                    className="bg-transparent border-b border-gold/20 text-center focus:outline-none w-full py-1"
                  />
                ) : (
                  data.location
                )}
              </div>

              <div className="text-[12px] md:text-sm text-gray-500 leading-relaxed px-4 max-w-sm mx-auto">
                {editMode ? (
                  <textarea
                    value={data.address}
                    onChange={(e) => onUpdate(type, 'address', e.target.value)}
                    className="bg-transparent border border-gold/10 text-center focus:outline-none w-full p-2 h-20 resize-none rounded"
                  />
                ) : (
                  data.address
                )}
              </div>
            </div>
          </div>

          {/* Map Embed */}
          <div className="w-full h-44 md:h-52 rounded-xl overflow-hidden border border-gold/10 shadow-inner relative group/map mt-4">
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
              <div className="bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full text-gold text-[10px] uppercase font-black tracking-widest shadow-xl flex items-center gap-2">
                <ExternalLink size={12} /> Xem bản đồ lớn
              </div>
            </a>
          </div>

          {/* Navigation Button */}
          <div className="pt-6">
            {editMode ? (
              <div className="space-y-2">
                <label className="text-[8px] uppercase tracking-widest text-gold block font-bold">
                  Google Maps URL:
                </label>
                <input
                  value={data.mapLink}
                  onChange={(e) => onUpdate(type, 'mapLink', e.target.value)}
                  className="bg-white border border-gold/20 text-[10px] text-center focus:outline-none w-full py-3 rounded"
                />
              </div>
            ) : (
              <a
                href={data.mapLink}
                target="_blank"
                rel="noopener noreferrer"
                className="shimmer-btn inline-flex items-center gap-2 px-10 py-4 bg-gold text-white text-[10px] uppercase tracking-[0.4em] rounded-full hover:bg-black transition-all duration-500 font-black shadow-lg shadow-gold/20"
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

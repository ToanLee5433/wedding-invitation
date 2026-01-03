
import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Heart, ClipboardCheck, ImageIcon, Home } from 'lucide-react';

interface BottomNavProps {
  activeSection?: string;
}

const BottomNav: React.FC<BottomNavProps> = ({ activeSection = 'top' }) => {
  const scrollTo = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 80;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: id === 'top' ? 0 : offsetPosition,
        behavior: 'smooth'
      });
    } else if (id === 'top') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const navItems = [
    { id: 'top', icon: Home, label: 'Đầu' },
    { id: 'story', icon: Heart, label: 'Truyện' },
    { id: 'album', icon: ImageIcon, label: 'Ảnh' },
    { id: 'info', icon: MapPin, label: 'Địa điểm' },
    { id: 'rsvp', icon: ClipboardCheck, label: 'Mời' },
  ];

  return (
    <nav
      className="md:hidden"
      style={{
        position: 'fixed',
        bottom: '12px',
        left: '12px',
        right: '12px',
        zIndex: 9999999
      }}
    >
      {/* Luxury Cream/Gold glass container */}
      <div
        style={{
          backgroundColor: 'rgba(253, 252, 240, 0.9)', // Brand Cream
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderRadius: '9999px',
          padding: '4px',
          boxShadow: '0 8px 32px rgba(184, 158, 72, 0.2)', // Subtle Gold Shadow
          border: '1px solid rgba(212, 175, 55, 0.3)' // Gold Border
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center' }}>
          {navItems.map((item) => {
            const isActive = activeSection === item.id;
            const IconComponent = item.icon;

            return (
              <button
                key={item.id}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  scrollTo(item.id);
                }}
                style={{
                  position: 'relative',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '8px 14px',
                  transition: 'all 0.4s cubic-bezier(0.23, 1, 0.32, 1)',
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  borderRadius: '9999px'
                }}
              >
                {/* Active Pill Background */}
                {isActive && (
                  <motion.div
                    layoutId="navActivePillLuxury"
                    style={{
                      position: 'absolute',
                      inset: 0,
                      backgroundColor: '#D4AF37', // Brand Gold
                      borderRadius: '9999px',
                      boxShadow: '0 4px 12px rgba(212, 175, 55, 0.4)'
                    }}
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}

                {/* Icon */}
                <div style={{
                  position: 'relative',
                  zIndex: 10,
                  color: isActive ? '#FFFFFF' : '#9A8C73', // White vs Muted Gold-Grey
                  transition: 'color 0.3s'
                }}>
                  <IconComponent size={18} strokeWidth={isActive ? 2.5 : 2} />
                </div>

                {/* Label */}
                <span style={{
                  position: 'relative',
                  zIndex: 10,
                  fontSize: '8px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.15em',
                  marginTop: '2.5px',
                  fontWeight: isActive ? 800 : 600,
                  color: isActive ? '#FFFFFF' : '#9A8C73',
                  transition: 'color 0.3s'
                }}>
                  {item.label}
                </span>

                {/* Animated Dot for active state */}
                {isActive && (
                  <motion.div
                    layoutId="navDotLuxury"
                    style={{
                      position: 'absolute',
                      bottom: '-4px',
                      width: '3px',
                      height: '3px',
                      backgroundColor: '#D4AF37',
                      borderRadius: '50%'
                    }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

export default BottomNav;

import React from 'react';
import { MessageCircle } from 'lucide-react';
import { useContent, whatsappUrl } from '../content/ContentContext';

/** Floating instant WhatsApp button, bottom corner of every page */
export const FloatingWhatsApp: React.FC = () => {
  const { contact } = useContent();

  const openWhatsApp = () => {
    window.open(
      whatsappUrl(contact, 'السلام عليكم، أود حجز موعد استشارة ومعاينة لدى FSN | فضاء الشبكات'),
      '_blank'
    );
  };

  return (
    <div className="fixed bottom-4 left-4 sm:bottom-6 sm:left-6 z-40">
      <button
        onClick={openWhatsApp}
        title="محادثة واتساب سريعة مع فضاء الشبكات"
        aria-label="واتساب"
        className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-emerald-500 hover:bg-emerald-600 active:bg-emerald-700 text-white flex items-center justify-center shadow-xl shadow-emerald-500/40 hover:scale-110 transition-all duration-200 cursor-pointer"
      >
        <MessageCircle className="w-6 h-6 sm:w-7 sm:h-7" />
      </button>
    </div>
  );
};

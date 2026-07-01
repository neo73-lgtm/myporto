import { FaWhatsapp } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { getWhatsAppMessage } from '../../utils/helpers';

const PHONE = '62895410304428';

export default function WhatsAppButton() {
  const msg = getWhatsAppMessage();
  const href = `https://wa.me/${PHONE}?text=${encodeURIComponent(msg)}`;

  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 1, type: 'spring', stiffness: 200 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      className="fixed bottom-5 left-5 sm:bottom-8 sm:left-8 z-40 touch-target w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-emerald-500 text-white shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/50 transition-shadow duration-200 flex items-center justify-center"
      title="Hubungi via WhatsApp"
    >
      <FaWhatsapp size={20} />
    </motion.a>
  );
}

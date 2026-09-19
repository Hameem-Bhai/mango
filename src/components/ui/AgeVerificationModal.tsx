import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function AgeVerificationModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [underageWarning, setUnderageWarning] = useState(false);

  useEffect(() => {
    const verified = localStorage.getItem('mrmango_age_verified');
    if (!verified) {
      setIsOpen(true);
    }
  }, []);

  const handleConfirmAge = () => {
    localStorage.setItem('mrmango_age_verified', 'true');
    setIsOpen(false);
  };

  const handleUnderage = () => {
    setUnderageWarning(true);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="relative w-full max-w-md bg-[#141414] border border-[#FDA701]/30 rounded-3xl p-6 sm:p-8 text-center text-white shadow-2xl overflow-hidden"
        >
          {/* Neon Mango Glow */}
          <div className="absolute -top-24 -left-24 w-48 h-48 bg-[#FDA701]/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-[#076136]/30 rounded-full blur-3xl pointer-events-none" />

          {/* Icon / Badge */}
          <div className="relative z-10">
            <div className="w-16 h-16 mx-auto mb-5 rounded-2xl bg-gradient-to-br from-[#FDA701] to-[#e59600] flex items-center justify-center shadow-lg shadow-[#FDA701]/20">
              <span className="text-2xl font-black text-[#1A1A1A] tracking-tighter">18+</span>
            </div>

            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-semibold text-gray-300 mb-3">
              <ShieldCheck className="w-3.5 h-3.5 text-[#FDA701]" /> Age Verification Required
            </div>

            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#FAF5E7] mb-2">
              Welcome to Mr. Mango
            </h2>

            <p className="text-xs sm:text-sm text-gray-400 mb-6 leading-relaxed">
              This website contains age-restricted vape and e-liquid products. You must be at least <strong className="text-white">18 years of age</strong> (or legal smoking age in Bangladesh) to enter and purchase.
            </p>

            {underageWarning ? (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-500/10 border border-red-500/30 rounded-2xl p-4 text-xs text-red-400 mb-4 flex items-start gap-2.5 text-left"
              >
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-400" />
                <div>
                  <strong>Access Denied:</strong> You must be 18 or older to browse or order from Mr. Mango BD. Please return when you reach the legal age.
                </div>
              </motion.div>
            ) : (
              <div className="space-y-3">
                <Button
                  onClick={handleConfirmAge}
                  className="w-full h-12 text-sm font-bold bg-[#FDA701] hover:bg-[#e59600] text-[#1A1A1A] rounded-xl shadow-lg transition-transform active:scale-95"
                >
                  I am 18 or Older — Enter Site
                </Button>

                <button
                  onClick={handleUnderage}
                  className="w-full text-xs font-semibold text-gray-400 hover:text-white transition-colors py-2"
                >
                  I am under 18 (Exit)
                </button>
              </div>
            )}

            <p className="text-[10px] text-gray-500 mt-6">
              By entering, you confirm you are of legal age to view and purchase nicotine and vaping products in Bangladesh.
            </p>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';

export function AgeGate() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const isAgeVerified = localStorage.getItem('age-verified');
    if (!isAgeVerified) {
      setIsOpen(true);
      document.body.style.overflow = 'hidden';
    }
  }, []);

  const handleVerify = () => {
    localStorage.setItem('age-verified', 'true');
    setIsOpen(false);
    document.body.style.overflow = 'auto';
  };

  const handleDeny = () => {
    window.location.href = 'https://www.google.com';
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#1A1A1A]/90 backdrop-blur-sm p-4">
      <div className="w-full max-w-md bg-[#FAF5E7] p-8 rounded-xl shadow-2xl text-center">
        <img src="/brand/logo-primary.png" alt="Mr. Mango" className="h-16 mx-auto mb-6" />
        <h2 className="text-2xl font-bold text-[#1A1A1A] mb-4">Are you of legal vaping age?</h2>
        <p className="text-gray-600 mb-8">You must be of legal vaping age in your jurisdiction to enter this site.</p>
        <div className="flex gap-4">
          <Button onClick={handleDeny} variant="outline" className="flex-1 border-[#1A1A1A] text-[#1A1A1A]">No, I am not</Button>
          <Button onClick={handleVerify} className="flex-1 bg-[#FDA701] hover:bg-[#e59600] text-[#1A1A1A]">Yes, I am</Button>
        </div>
      </div>
    </div>
  );
}

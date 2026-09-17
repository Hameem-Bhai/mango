import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Sparkles, Code2, ExternalLink, Laptop } from 'lucide-react';

interface DeveloperModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function DeveloperModal({ isOpen, onClose }: DeveloperModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md bg-white dark:bg-[#181818] border border-gray-200 dark:border-gray-800 rounded-3xl p-6 sm:p-8 shadow-2xl text-center">
        <DialogHeader className="items-center">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#FDA701] to-[#e59600] flex items-center justify-center text-3xl shadow-lg shadow-[#FDA701]/25 mb-3">
            👨‍💻
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#076136]/10 text-[#076136] dark:text-green-400 font-bold text-xs uppercase tracking-wider mb-1">
            <Sparkles className="w-3.5 h-3.5" /> Developer Credit
          </div>
          <DialogTitle className="text-2xl font-bold text-[#1A1A1A] dark:text-white">
            Hameem Bhai
          </DialogTitle>
          <DialogDescription className="text-xs font-semibold text-[#FDA701] uppercase tracking-wider">
            hameembhaierdokan.studio
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 my-4 text-sm text-gray-600 dark:text-gray-300">
          <p className="leading-relaxed">
            You found the developer easter egg! This entire high-performance e-commerce platform was designed and engineered with modern web technologies.
          </p>

          <div className="flex flex-wrap justify-center gap-2 py-1">
            <span className="text-xs bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-semibold px-2.5 py-1 rounded-lg">React 18</span>
            <span className="text-xs bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-semibold px-2.5 py-1 rounded-lg">TypeScript</span>
            <span className="text-xs bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-semibold px-2.5 py-1 rounded-lg">Tailwind CSS</span>
            <span className="text-xs bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-semibold px-2.5 py-1 rounded-lg">Express / Node</span>
          </div>
        </div>

        <div className="pt-2 flex flex-col gap-2.5">
          <a
            href="https://hameembhaierdokan.studio"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full"
          >
            <Button className="w-full bg-[#FDA701] hover:bg-[#e59600] text-[#1A1A1A] font-bold h-12 rounded-xl flex items-center justify-center gap-2">
              <ExternalLink className="w-4 h-4" /> Visit hameembhaierdokan.studio
            </Button>
          </a>
          <Button
            variant="ghost"
            onClick={onClose}
            className="w-full text-xs text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
          >
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

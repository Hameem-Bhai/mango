import { useState } from 'react';
import { useLocation } from 'wouter';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { X, Lock, Mail, User as UserIcon, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';

export function AuthModal() {
  const { isAuthModalOpen, closeAuthModal, login, register } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const [tab, setTab] = useState<'register' | 'login'>('register');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  if (!isAuthModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setIsLoading(true);

    try {
      if (tab === 'register') {
        const res = await register(name, email, password);
        if (res.success) {
          if (res.role === 'admin' || email.trim().toLowerCase() === 'mango@gmail.com') {
            toast({
              title: 'Admin Recognized',
              description: 'Welcome back, Administrator! Redirecting to dashboard...'
            });
            closeAuthModal();
            setLocation('/admin');
          } else {
            toast({
              title: 'Account Created',
              description: 'Welcome to Mr. Mango! You are now registered.'
            });
            closeAuthModal();
          }
        } else {
          setErrorMessage(res.error || 'Registration failed');
        }
      } else {
        const res = await login(email, password);
        if (res.success) {
          if (res.role === 'admin' || email.trim().toLowerCase() === 'mango@gmail.com') {
            toast({
              title: 'Admin Access Granted',
              description: 'Redirecting to Store Management Dashboard...'
            });
            closeAuthModal();
            setLocation('/admin');
          } else {
            toast({
              title: 'Logged In Successfully',
              description: `Welcome back to Mr. Mango!`
            });
            closeAuthModal();
          }
        } else {
          setErrorMessage(res.error || 'Invalid email or password');
        }
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div 
        className="bg-white dark:bg-[#1a1a1a] rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-gray-100 dark:border-gray-800 relative transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button 
          onClick={closeAuthModal}
          className="absolute top-5 right-5 text-gray-400 hover:text-gray-700 dark:hover:text-white p-1 rounded-full transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Brand Header */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-[#FDA701]/15 text-[#FDA701] flex items-center justify-center mx-auto mb-3">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-bold text-[#1A1A1A] dark:text-white">
            {tab === 'register' ? 'Create an Account' : 'Welcome Back'}
          </h2>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            {tab === 'register' 
              ? 'Join Mr. Mango for fast orders, tracking, and rewards' 
              : 'Sign in to access your orders and account'}
          </p>
        </div>

        {/* Tabs */}
        <div className="flex bg-gray-100 dark:bg-[#222] p-1 rounded-xl mb-6">
          <button
            type="button"
            onClick={() => { setTab('register'); setErrorMessage(''); }}
            className={`flex-1 py-2 text-xs sm:text-sm font-bold rounded-lg transition-all ${
              tab === 'register' 
                ? 'bg-white dark:bg-[#333] text-[#1A1A1A] dark:text-white shadow-xs' 
                : 'text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white'
            }`}
          >
            Register
          </button>
          <button
            type="button"
            onClick={() => { setTab('login'); setErrorMessage(''); }}
            className={`flex-1 py-2 text-xs sm:text-sm font-bold rounded-lg transition-all ${
              tab === 'login' 
                ? 'bg-white dark:bg-[#333] text-[#1A1A1A] dark:text-white shadow-xs' 
                : 'text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white'
            }`}
          >
            Sign In
          </button>
        </div>

        {/* Error notice */}
        {errorMessage && (
          <div className="mb-4 p-3 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 text-xs text-red-600 dark:text-red-400 font-medium">
            {errorMessage}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {tab === 'register' && (
            <div>
              <label className="text-xs font-bold text-gray-600 dark:text-gray-300 block mb-1">
                Your Full Name
              </label>
              <div className="relative">
                <UserIcon className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <Input
                  type="text"
                  placeholder="e.g. Tanvir Ahmed"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="pl-10 h-11 bg-gray-50 dark:bg-[#222] dark:border-gray-700 text-sm"
                  required
                />
              </div>
            </div>
          )}

          <div>
            <label className="text-xs font-bold text-gray-600 dark:text-gray-300 block mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <Input
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10 h-11 bg-gray-50 dark:bg-[#222] dark:border-gray-700 text-sm"
                required
                autoFocus
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-gray-600 dark:text-gray-300 block mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <Input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10 h-11 bg-gray-50 dark:bg-[#222] dark:border-gray-700 text-sm"
                required
              />
            </div>
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full h-12 bg-[#FDA701] hover:bg-[#e59600] text-black font-bold text-sm rounded-xl mt-2 transition-all"
          >
            {isLoading 
              ? 'Processing...' 
              : tab === 'register' 
                ? 'Create Account' 
                : 'Sign In to Account'}
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </form>

        {/* Security badge */}
        <div className="mt-6 pt-4 border-t border-gray-100 dark:border-gray-800 flex items-center justify-center gap-2 text-[11px] text-gray-400">
          <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />
          <span>Encrypted connection & privacy protected</span>
        </div>
      </div>
    </div>
  );
}

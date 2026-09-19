import { useState, useEffect, useMemo } from 'react';
import { Link } from 'wouter';
import { SEO } from '@/components/SEO';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { 
  Package, ShoppingCart, Users, Plus, Edit2, Trash2, Check, X, 
  Search, Lock, Unlock, RefreshCw, ExternalLink, MessageCircle,
  Mail, Download, Phone, MapPin, Clock, Copy
} from 'lucide-react';
import { Product } from '@/types';

const PRODUCT_IMAGE_PRESETS = [
  { label: 'Bar Juice 30ml', path: '/products/bar-juice-30ml.webp' },
  { label: 'BLVK Juice 30ml', path: '/products/blvk-juice-30ml.webp' },
  { label: 'Elfbar Raya D1 13K', path: '/products/elfbar-raya-d1-13k.webp' },
  { label: 'Elfbar Raya S1 15K', path: '/products/elfbar-raya-s1-15k.webp' },
  { label: 'Flyto 6K Full Kit', path: '/products/flyto-6k-full-kit.webp' },
  { label: 'Flyto 6K Cartridge', path: '/products/flyto-6k-cartridge.webp' },
  { label: 'Flyto 10K Full Kit', path: '/products/flyto-10k-full-kit.webp' },
  { label: 'Flyto 10K Cartridge', path: '/products/flyto-10k-cartridge.webp' },
  { label: 'Flyto Juice 30ml', path: '/products/flyto-juice-30ml.webp' },
  { label: 'Flyto Juice 10ml', path: '/products/flyto-juice-10ml.webp' },
  { label: 'Juice Head 30ml', path: '/products/juice-head-30ml.webp' },
  { label: 'Juice Head 100ml', path: '/products/juice-head-100ml.webp' },
  { label: 'Juice Head 120ml', path: '/products/juice-head-120ml.webp' },
  { label: 'Just Juice 30ml', path: '/products/just-juice-30ml.webp' },
  { label: 'Kiligbar 6K Full Kit', path: '/products/kiligbar-6k-full-kit.webp' },
  { label: 'Kiligbar 6K Cartridge', path: '/products/kiligbar-6k-cartridge.webp' },
  { label: 'Kumiho Cartridge', path: '/products/kumiho-cartridge.webp' },
  { label: 'Kumiho Model V Kit', path: '/products/kumiho-model-v-pod-kit.webp' },
  { label: 'Prevase 30ml', path: '/products/prevase-30ml.webp' },
  { label: 'Caliburn G3 Cartridge', path: '/products/uwell-caliburn-g3-cartridge.webp' },
  { label: 'Caliburn G3 Pod Kit', path: '/products/uwell-caliburn-g3-pod-kit.webp' },
  { label: 'Vaporesso XROS Cartridge', path: '/products/vaporesso-xros-cartridge.webp' },
  { label: 'Vaporesso XROS 3 Kit', path: '/products/vaporesso-xros-3-pod-kit.webp' },
  { label: 'VCT Juice 30ml', path: '/products/vct-juice-30ml.webp' },
  { label: 'VGOD Juice 30ml', path: '/products/vgod-juice-30ml.webp' },
  { label: 'Argus Cartridge', path: '/products/voopoo-argus-cartridge.webp' },
  { label: 'Argus G Pod Kit', path: '/products/voopoo-argus-g-pod-kit.webp' },
  { label: 'Will Well Juice 10ml', path: '/products/will-well-juice-10ml.webp' },
  { label: 'Default Icon', path: '/brand/icon.png' }
];

function formatBdPhoneForWhatsApp(raw: string): string {
  if (!raw) return '';
  const digits = raw.replace(/[^0-9]/g, '');
  if (digits.startsWith('880')) return digits;
  if (digits.startsWith('01')) return '88' + digits;
  if (digits.length === 10 && digits.startsWith('1')) return '880' + digits;
  return digits;
}

export function Admin() {
  const { toast } = useToast();

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('mrmango_admin_auth') === 'true' || sessionStorage.getItem('mrmango_admin_auth') === 'true';
  });
  const [emailInput, setEmailInput] = useState('mango@gmail.com');
  const [passwordInput, setPasswordInput] = useState('');
  const [authError, setAuthError] = useState('');

  type AdminTab = 'products' | 'orders' | 'waitlist' | 'inquiries' | 'subscribers';
  const [activeTab, setActiveTab] = useState<AdminTab>('products');

  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [waitlist, setWaitlist] = useState<any[]>([]);
  const [inquiries, setInquiries] = useState<any[]>([]);
  const [subscribers, setSubscribers] = useState<any[]>([]);

  const [isLoading, setIsLoading] = useState(false);
  const [togglingStockId, setTogglingStockId] = useState<string | number | null>(null);

  // Filters
  const [productSearch, setProductSearch] = useState('');
  const [productCategory, setProductCategory] = useState('all');
  const [productStockFilter, setProductStockFilter] = useState<'all' | 'instock' | 'outofstock'>('all');
  const [productSort, setProductSort] = useState<'default' | 'price-asc' | 'price-desc' | 'name'>('default');

  const [orderStatusFilter, setOrderStatusFilter] = useState('all');

  // Product modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSavingProduct, setIsSavingProduct] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    brand: 'Mr. Mango',
    category: 'disposables',
    price: '',
    compareAtPrice: '',
    flavor: '',
    flavors: '',
    description: '',
    puffCount: '',
    nicotine: '50mg',
    volume: '',
    imageUrl: '/brand/icon.png',
    inStock: true,
    featured: false
  });

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = emailInput.trim().toLowerCase();
    const cleanPass = passwordInput.trim();

    if ((cleanEmail === 'mango@gmail.com' && cleanPass === 'mangokhabo') || cleanPass === 'mango2026') {
      setIsAuthenticated(true);
      localStorage.setItem('mrmango_admin_auth', 'true');
      localStorage.setItem('mrmango_user', JSON.stringify({
        email: 'mango@gmail.com',
        name: 'Store Administrator',
        role: 'admin'
      }));
      setAuthError('');
      toast({
        title: 'Logged In Successfully',
        description: 'Welcome to the Mr. Mango Store Management Portal.'
      });
    } else {
      setAuthError('Incorrect email or password. Use mango@gmail.com / mangokhabo');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('mrmango_admin_auth');
    sessionStorage.removeItem('mrmango_admin_auth');
    toast({
      title: 'Logged Out',
      description: 'You have been securely signed out.'
    });
  };

  const fetchAllData = async () => {
    setIsLoading(true);
    try {
      const [prodRes, orderRes, waitRes, inqRes, subRes] = await Promise.all([
        fetch('/api/products'),
        fetch('/api/orders'),
        fetch('/api/waitlist'),
        fetch('/api/contact'),
        fetch('/api/newsletter')
      ]);

      if (prodRes.ok) setProducts(await prodRes.json());
      if (orderRes.ok) setOrders(await orderRes.json());
      if (waitRes.ok) setWaitlist(await waitRes.json());
      if (inqRes.ok) setInquiries(await inqRes.json());
      if (subRes.ok) setSubscribers(await subRes.json());
    } catch (err) {
      console.error('Error fetching admin data:', err);
      toast({
        title: 'Network Warning',
        description: 'Unable to reach backend services. Please verify backend is running.',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchAllData();
    }
  }, [isAuthenticated]);

  // Product Actions
  const handleOpenAddModal = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      brand: 'Mr. Mango',
      category: 'disposables',
      price: '',
      compareAtPrice: '',
      flavor: '',
      flavors: '',
      description: '',
      puffCount: '',
      nicotine: '50mg',
      volume: '',
      imageUrl: '/brand/icon.png',
      inStock: true,
      featured: false
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (product: Product) => {
    setEditingProduct(product);
    const isInStock = product.inStock === true || product.inStock === 1 || product.inStock === undefined;
    setFormData({
      name: product.name,
      brand: product.brand || 'Mr. Mango',
      category: product.category || 'disposables',
      price: String(product.price),
      compareAtPrice: product.compareAtPrice ? String(product.compareAtPrice) : '',
      flavor: product.flavor || '',
      flavors: Array.isArray(product.flavors) ? product.flavors.join(', ') : (product.flavors || ''),
      description: product.description || '',
      puffCount: product.puffCount ? String(product.puffCount) : '',
      nicotine: product.nicotine || product.nicotine_strength || '',
      volume: product.volume || '',
      imageUrl: product.imageUrl || '/brand/icon.png',
      inStock: isInStock,
      featured: !!product.featured
    });
    setIsModalOpen(true);
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.price) {
      toast({ title: 'Validation Error', description: 'Product Name and Price are required.', variant: 'destructive' });
      return;
    }

    setIsSavingProduct(true);
    const payload = {
      name: formData.name.trim(),
      brand: formData.brand.trim(),
      category: formData.category,
      price: Number(formData.price),
      compareAtPrice: formData.compareAtPrice ? Number(formData.compareAtPrice) : null,
      flavor: formData.flavor.trim(),
      flavors: formData.flavors.trim(),
      description: formData.description.trim(),
      puffCount: formData.puffCount ? Number(formData.puffCount) : null,
      nicotine: formData.nicotine.trim(),
      volume: formData.volume.trim(),
      imageUrl: formData.imageUrl.trim() || '/brand/icon.png',
      inStock: formData.inStock ? 1 : 0,
      featured: formData.featured ? 1 : 0
    };

    try {
      const url = editingProduct ? `/api/products/${editingProduct.id}` : '/api/products';
      const method = editingProduct ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        throw new Error('Server returned ' + res.status);
      }

      setIsModalOpen(false);
      await fetchAllData();
      toast({
        title: editingProduct ? 'Product Updated' : 'Product Added',
        description: `"${payload.name}" has been saved to the store.`
      });
    } catch (err: any) {
      console.error('Error saving product:', err);
      toast({
        title: 'Save Failed',
        description: 'Could not save product. Please check input and retry.',
        variant: 'destructive'
      });
    } finally {
      setIsSavingProduct(false);
    }
  };

  const handleToggleStock = async (product: Product) => {
    const isCurrentlyInStock = product.inStock === true || product.inStock === 1 || product.inStock === undefined;
    const nextStock = isCurrentlyInStock ? 0 : 1;

    setTogglingStockId(product.id);
    try {
      const res = await fetch(`/api/products/${product.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ inStock: nextStock })
      });

      if (res.ok) {
        setProducts(prev => prev.map(p => p.id === product.id ? { ...p, inStock: nextStock } : p));
        toast({
          title: nextStock === 1 ? 'Marked In Stock' : 'Marked Out of Stock',
          description: `"${product.name}" is now ${nextStock === 1 ? 'available' : 'marked out of stock'}.`
        });
      } else {
        throw new Error('Toggle failed');
      }
    } catch (err) {
      console.error('Stock toggle error:', err);
      toast({ title: 'Error', description: 'Failed to update stock status.', variant: 'destructive' });
    } finally {
      setTogglingStockId(null);
    }
  };

  const handleDeleteProduct = async (id: string | number, name: string) => {
    if (!window.confirm(`Are you sure you want to permanently delete "${name}" from the store catalog?`)) return;
    try {
      const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setProducts(prev => prev.filter(p => p.id !== id));
        toast({ title: 'Product Deleted', description: `"${name}" removed from catalog.` });
      } else {
        throw new Error('Delete failed');
      }
    } catch (err) {
      console.error('Delete error:', err);
      toast({ title: 'Delete Error', description: 'Could not delete product.', variant: 'destructive' });
    }
  };

  // Order Actions
  const handleUpdateOrderStatus = async (orderId: number, status: string, orderNumber: string) => {
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      if (res.ok) {
        setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o));
        toast({
          title: 'Order Status Updated',
          description: `Order ${orderNumber} set to "${status.toUpperCase()}".`
        });
      }
    } catch (err) {
      console.error('Order update error:', err);
      toast({ title: 'Update Error', description: 'Could not update order status.', variant: 'destructive' });
    }
  };

  const handleVerifyPayment = async (orderId: number, orderNumber: string) => {
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paymentStatus: 'verified', status: 'confirmed' })
      });
      if (res.ok) {
        setOrders(prev => prev.map(o => o.id === orderId ? { ...o, paymentStatus: 'verified', status: 'confirmed' } : o));
        toast({
          title: 'bKash Payment Verified',
          description: `Order ${orderNumber} payment verified & set to CONFIRMED.`
        });
      }
    } catch (err) {
      console.error('Payment verify error:', err);
      toast({ title: 'Verify Error', description: 'Could not verify payment.', variant: 'destructive' });
    }
  };

  const handleDeleteOrder = async (orderId: number, orderNumber: string) => {
    if (!window.confirm(`Delete order ${orderNumber}? This cannot be undone.`)) return;
    try {
      const res = await fetch(`/api/orders/${orderId}`, { method: 'DELETE' });
      if (res.ok) {
        setOrders(prev => prev.filter(o => o.id !== orderId));
        toast({ title: 'Order Deleted', description: `Order ${orderNumber} removed.` });
      }
    } catch (err) {
      console.error('Order delete error:', err);
    }
  };

  // Waitlist Actions
  const handleDeleteWaitlist = async (id: number) => {
    try {
      const res = await fetch(`/api/waitlist/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setWaitlist(prev => prev.filter(w => w.id !== id));
        toast({ title: 'Inquiry Removed', description: 'Waitlist entry cleared.' });
      }
    } catch (err) {
      console.error('Waitlist delete error:', err);
    }
  };

  // Contact Inquiries Actions
  const handleDeleteInquiry = async (id: number) => {
    try {
      const res = await fetch(`/api/contact/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setInquiries(prev => prev.filter(i => i.id !== id));
        toast({ title: 'Message Deleted', description: 'Inquiry removed.' });
      }
    } catch (err) {
      console.error('Inquiry delete error:', err);
    }
  };

  // Newsletter Actions
  const handleDeleteSubscriber = async (id: number) => {
    try {
      const res = await fetch(`/api/newsletter/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setSubscribers(prev => prev.filter(s => s.id !== id));
        toast({ title: 'Subscriber Removed', description: 'Email unsubscribed.' });
      }
    } catch (err) {
      console.error('Subscriber delete error:', err);
    }
  };

  const handleCopyAllSubscribers = () => {
    const emails = subscribers.map(s => s.email).join(', ');
    navigator.clipboard.writeText(emails);
    toast({
      title: 'Copied to Clipboard',
      description: `${subscribers.length} subscriber emails copied.`
    });
  };

  // Filtered Products
  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const q = productSearch.toLowerCase();
      const matchesSearch = q === '' || 
        p.name.toLowerCase().includes(q) ||
        (p.brand && p.brand.toLowerCase().includes(q)) ||
        (p.flavor && p.flavor.toLowerCase().includes(q)) ||
        (p.category && p.category.toLowerCase().includes(q));

      const matchesCategory = productCategory === 'all' || p.category === productCategory;

      const isInStock = p.inStock === true || p.inStock === 1 || p.inStock === undefined;
      const matchesStock = 
        productStockFilter === 'all' ||
        (productStockFilter === 'instock' && isInStock) ||
        (productStockFilter === 'outofstock' && !isInStock);

      return matchesSearch && matchesCategory && matchesStock;
    }).sort((a, b) => {
      if (productSort === 'price-asc') return a.price - b.price;
      if (productSort === 'price-desc') return b.price - a.price;
      if (productSort === 'name') return a.name.localeCompare(b.name);
      return Number(b.id) - Number(a.id);
    });
  }, [products, productSearch, productCategory, productStockFilter, productSort]);

  // Filtered Orders
  const filteredOrders = useMemo(() => {
    return orders.filter(o => {
      if (orderStatusFilter === 'all') return true;
      return (o.status || 'placed').toLowerCase() === orderStatusFilter.toLowerCase();
    });
  }, [orders, orderStatusFilter]);

  // Computed metrics
  const totalRevenue = useMemo(() => {
    return orders.reduce((sum, o) => sum + Number(o.total || o.subtotal || 0), 0);
  }, [orders]);

  const inStockCount = useMemo(() => {
    return products.filter(p => p.inStock === true || p.inStock === 1 || p.inStock === undefined).length;
  }, [products]);

  if (!isAuthenticated) {
    return (
      <>
        <SEO title="Admin Login — Mr.Mango.com" />
        <div className="min-h-[80vh] flex items-center justify-center px-4 bg-gray-50 dark:bg-[#121212]">
          <div className="w-full max-w-md bg-white dark:bg-[#1a1a1a] p-8 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-800 text-center">
            <div className="w-16 h-16 bg-[#FDA701]/10 rounded-2xl flex items-center justify-center mx-auto mb-6 text-[#FDA701]">
              <Lock className="w-8 h-8" />
            </div>
            <h1 className="text-2xl font-bold text-[#1A1A1A] dark:text-white mb-2">Mr. Mango Staff Portal</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">Sign in with administrator credentials</p>
            <form onSubmit={handleLogin} className="space-y-4 text-left">
              <div>
                <label className="text-xs font-bold text-gray-600 dark:text-gray-300 block mb-1">Admin Email</label>
                <Input
                  type="email"
                  placeholder="mango@gmail.com"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  className="h-11 bg-gray-50 dark:bg-[#222]"
                  required
                />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-600 dark:text-gray-300 block mb-1">Password</label>
                <Input
                  type="password"
                  placeholder="Enter password"
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  className="h-11 bg-gray-50 dark:bg-[#222]"
                  required
                  autoFocus
                />
              </div>
              {authError && <p className="text-xs text-red-500 font-medium">{authError}</p>}
              <Button type="submit" className="w-full h-12 bg-[#FDA701] hover:bg-[#e59600] text-black font-bold text-base rounded-xl mt-2">
                Unlock Dashboard <Unlock className="w-4 h-4 ml-2" />
              </Button>
            </form>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <SEO title="Admin Dashboard — Mr.Mango.com" />
      <div className="min-h-screen bg-gray-50 dark:bg-[#121212] py-8">
        <div className="container mx-auto px-4 max-w-7xl">
          
          {/* Top Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 bg-white dark:bg-[#1a1a1a] p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm">
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl sm:text-3xl font-bold text-[#1A1A1A] dark:text-white">Mr. Mango Store Manager</h1>
                <span className="text-xs bg-green-100 text-green-800 dark:bg-green-950/50 dark:text-green-400 px-2.5 py-0.5 rounded-full font-bold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                  Online Database
                </span>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Persistent storage active • Real-time catalog & order operations
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Button variant="outline" size="sm" onClick={fetchAllData} disabled={isLoading} className="gap-1.5 text-xs">
                <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} /> Refresh
              </Button>
              <a href="/api/admin/backup" download>
                <Button variant="outline" size="sm" className="gap-1.5 text-xs">
                  <Download className="w-3.5 h-3.5" /> Backup DB
                </Button>
              </a>
              <Link href="/">
                <Button variant="outline" size="sm" className="gap-1.5 text-xs">
                  <ExternalLink className="w-3.5 h-3.5" /> View Store
                </Button>
              </Link>
              <Button variant="ghost" size="sm" onClick={handleLogout} className="text-red-500 hover:text-red-700 text-xs">
                Log Out
              </Button>
            </div>
          </div>

          {/* Metric Stats Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
            <div className="bg-white dark:bg-[#1a1a1a] p-5 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-[#FDA701] flex items-center justify-center shrink-0">
                <Package className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase">Products</p>
                <p className="text-xl sm:text-2xl font-bold text-[#1A1A1A] dark:text-white">{products.length}</p>
                <p className="text-[11px] text-green-600 dark:text-green-400">{inStockCount} in stock</p>
              </div>
            </div>

            <div className="bg-white dark:bg-[#1a1a1a] p-5 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center shrink-0">
                <ShoppingCart className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase">Total Orders</p>
                <p className="text-xl sm:text-2xl font-bold text-[#1A1A1A] dark:text-white">{orders.length}</p>
                <p className="text-[11px] text-gray-400">৳{Math.round(totalRevenue).toLocaleString()}</p>
              </div>
            </div>

            <div className="bg-white dark:bg-[#1a1a1a] p-5 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center shrink-0">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase">Waitlist</p>
                <p className="text-xl sm:text-2xl font-bold text-[#1A1A1A] dark:text-white">{waitlist.length}</p>
                <p className="text-[11px] text-gray-400">Restock requests</p>
              </div>
            </div>

            <div className="bg-white dark:bg-[#1a1a1a] p-5 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-purple-500/10 text-purple-600 flex items-center justify-center shrink-0">
                <Mail className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase">Subscribers</p>
                <p className="text-xl sm:text-2xl font-bold text-[#1A1A1A] dark:text-white">{subscribers.length}</p>
                <p className="text-[11px] text-gray-400">{inquiries.length} inquiries</p>
              </div>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex border-b border-gray-200 dark:border-gray-800 mb-6 gap-2 sm:gap-6 overflow-x-auto">
            <button
              onClick={() => setActiveTab('products')}
              className={`pb-3 font-bold text-sm border-b-2 transition-all shrink-0 ${
                activeTab === 'products'
                  ? 'border-[#FDA701] text-[#FDA701]'
                  : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              Catalog ({products.length})
            </button>
            <button
              onClick={() => setActiveTab('orders')}
              className={`pb-3 font-bold text-sm border-b-2 transition-all shrink-0 ${
                activeTab === 'orders'
                  ? 'border-[#FDA701] text-[#FDA701]'
                  : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              Orders ({orders.length})
            </button>
            <button
              onClick={() => setActiveTab('waitlist')}
              className={`pb-3 font-bold text-sm border-b-2 transition-all shrink-0 ${
                activeTab === 'waitlist'
                  ? 'border-[#FDA701] text-[#FDA701]'
                  : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              Waitlist ({waitlist.length})
            </button>
            <button
              onClick={() => setActiveTab('inquiries')}
              className={`pb-3 font-bold text-sm border-b-2 transition-all shrink-0 ${
                activeTab === 'inquiries'
                  ? 'border-[#FDA701] text-[#FDA701]'
                  : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              Contact Messages ({inquiries.length})
            </button>
            <button
              onClick={() => setActiveTab('subscribers')}
              className={`pb-3 font-bold text-sm border-b-2 transition-all shrink-0 ${
                activeTab === 'subscribers'
                  ? 'border-[#FDA701] text-[#FDA701]'
                  : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              Newsletter ({subscribers.length})
            </button>
          </div>

          {/* TAB 1: PRODUCTS */}
          {activeTab === 'products' && (
            <div className="bg-white dark:bg-[#1a1a1a] rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
              <div className="p-4 sm:p-6 border-b border-gray-100 dark:border-gray-800 flex flex-col sm:flex-row gap-4 justify-between items-stretch sm:items-center">
                <div className="flex flex-wrap flex-1 items-center gap-3">
                  <div className="relative flex-1 min-w-[200px] max-w-sm">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      placeholder="Search by name, brand, flavor..."
                      value={productSearch}
                      onChange={(e) => setProductSearch(e.target.value)}
                      className="pl-9 text-xs bg-gray-50 dark:bg-[#222]"
                    />
                  </div>
                  <select
                    value={productCategory}
                    onChange={(e) => setProductCategory(e.target.value)}
                    className="p-2 text-xs border rounded-lg bg-white dark:bg-[#222] dark:border-gray-700 dark:text-white"
                  >
                    <option value="all">All Categories</option>
                    <option value="disposables">Disposables</option>
                    <option value="e-liquids">E-Liquids</option>
                    <option value="coils-tanks">Coils & Cartridges</option>
                    <option value="pod-kits">Pod Kits</option>
                  </select>
                  <select
                    value={productStockFilter}
                    onChange={(e: any) => setProductStockFilter(e.target.value)}
                    className="p-2 text-xs border rounded-lg bg-white dark:bg-[#222] dark:border-gray-700 dark:text-white"
                  >
                    <option value="all">All Stock Status</option>
                    <option value="instock">In Stock Only</option>
                    <option value="outofstock">Out of Stock Only</option>
                  </select>
                  <select
                    value={productSort}
                    onChange={(e: any) => setProductSort(e.target.value)}
                    className="p-2 text-xs border rounded-lg bg-white dark:bg-[#222] dark:border-gray-700 dark:text-white"
                  >
                    <option value="default">Sort: Newest</option>
                    <option value="price-asc">Price: Low to High</option>
                    <option value="price-desc">Price: High to Low</option>
                    <option value="name">Name: A to Z</option>
                  </select>
                </div>
                <Button onClick={handleOpenAddModal} className="bg-[#FDA701] hover:bg-[#e59600] text-black font-bold text-xs gap-1.5 shrink-0">
                  <Plus className="w-4 h-4" /> Add New Product
                </Button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-gray-50 dark:bg-[#141414] text-gray-500 uppercase text-[11px] tracking-wider border-b border-gray-100 dark:border-gray-800">
                    <tr>
                      <th className="p-4">Product</th>
                      <th className="p-4">Category</th>
                      <th className="p-4">Price</th>
                      <th className="p-4">Flavors / Specs</th>
                      <th className="p-4">Stock Status</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                    {filteredProducts.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="p-8 text-center text-gray-500">
                          No products found matching filters.
                        </td>
                      </tr>
                    ) : (
                      filteredProducts.map((product) => {
                        const inStock = product.inStock === true || product.inStock === 1 || product.inStock === undefined;
                        const isToggling = togglingStockId === product.id;

                        return (
                          <tr key={product.id} className="hover:bg-gray-50/50 dark:hover:bg-[#222]/50 transition-colors">
                            <td className="p-4 flex items-center gap-3">
                              <img
                                src={product.imageUrl || '/brand/icon.png'}
                                alt={product.name}
                                className="w-12 h-12 object-contain rounded-lg bg-gray-50 dark:bg-[#252525] p-1 shrink-0 border border-gray-100 dark:border-gray-800"
                                onError={(e) => { (e.target as HTMLImageElement).src = '/brand/icon.png'; }}
                              />
                              <div>
                                <div className="flex items-center gap-1.5">
                                  <p className="font-bold text-[#1A1A1A] dark:text-white">{product.name}</p>
                                  {product.featured ? (
                                    <span className="text-[10px] bg-amber-100 text-amber-800 dark:bg-amber-950/40 dark:text-amber-400 px-1.5 py-0.2 rounded font-semibold">
                                      Featured
                                    </span>
                                  ) : null}
                                </div>
                                <p className="text-xs text-gray-400">{product.brand || 'Mr. Mango'} • {product.slug}</p>
                              </div>
                            </td>
                            <td className="p-4">
                              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
                                {product.category}
                              </span>
                            </td>
                            <td className="p-4 font-bold text-[#1A1A1A] dark:text-white">
                              ৳{Math.round(product.price).toLocaleString()}
                              {product.compareAtPrice ? (
                                <span className="text-xs text-gray-400 line-through ml-1.5">
                                  ৳{Math.round(product.compareAtPrice).toLocaleString()}
                                </span>
                              ) : null}
                            </td>
                            <td className="p-4 text-xs text-gray-500 dark:text-gray-400 max-w-xs truncate">
                              {product.flavors || product.flavor || `${product.puffCount ? `${product.puffCount} puffs` : ''} ${product.volume || ''}`}
                            </td>
                            <td className="p-4">
                              <button
                                onClick={() => handleToggleStock(product)}
                                disabled={isToggling}
                                className={`px-3 py-1 rounded-full text-xs font-bold transition-all inline-flex items-center gap-1 ${
                                  inStock
                                    ? 'bg-green-100 text-green-800 dark:bg-green-950/40 dark:text-green-400 hover:bg-green-200'
                                    : 'bg-red-100 text-red-800 dark:bg-red-950/40 dark:text-red-400 hover:bg-red-200'
                                }`}
                                title="Click to toggle stock"
                              >
                                {isToggling ? (
                                  <RefreshCw className="w-3 h-3 animate-spin" />
                                ) : inStock ? (
                                  '● In Stock'
                                ) : (
                                  '✕ Out of Stock'
                                )}
                              </button>
                            </td>
                            <td className="p-4 text-right space-x-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleOpenEditModal(product)}
                                className="text-gray-600 dark:text-gray-300 hover:text-[#FDA701]"
                                title="Edit Product"
                              >
                                <Edit2 className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDeleteProduct(product.id, product.name)}
                                className="text-red-500 hover:text-red-700"
                                title="Delete Product"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 2: ORDERS */}
          {activeTab === 'orders' && (
            <div className="bg-white dark:bg-[#1a1a1a] rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden p-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <div>
                  <h2 className="text-lg font-bold text-[#1A1A1A] dark:text-white">Customer Orders ({orders.length})</h2>
                  <p className="text-xs text-gray-400">Manage orders, update dispatch states, and contact customers</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-500">Filter by status:</span>
                  <select
                    value={orderStatusFilter}
                    onChange={(e) => setOrderStatusFilter(e.target.value)}
                    className="p-1.5 text-xs border rounded-lg bg-white dark:bg-[#222] dark:border-gray-700 dark:text-white"
                  >
                    <option value="all">All Orders</option>
                    <option value="placed">Placed / New</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="processing">Processing</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
              </div>

              {filteredOrders.length === 0 ? (
                <div className="text-center py-16 text-gray-500">
                  <ShoppingCart className="w-12 h-12 mx-auto mb-3 opacity-30" />
                  <p>No orders found matching the filter.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredOrders.map((ord) => {
                    const status = ord.status || 'placed';
                    const customerPhone = ord.customerPhone || ord.email || '';
                    const waPhone = formatBdPhoneForWhatsApp(customerPhone);
                    const totalAmt = Math.round(ord.total || ord.subtotal || 0);

                    const waMsg = `Assalamu Alaikum ${encodeURIComponent(ord.customerName || 'Customer')}, this is Mr. Mango BD regarding your order ${ord.orderNumber} for ৳${totalAmt.toLocaleString()}. Status: ${status.toUpperCase()}.`;

                    return (
                      <div key={ord.id} className="border border-gray-100 dark:border-gray-800 rounded-xl p-5 hover:border-gray-300 dark:hover:border-gray-700 transition-colors">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 dark:border-gray-800 pb-3 mb-4">
                          <div className="flex items-center gap-3">
                            <span className="font-bold text-[#FDA701] text-base">{ord.orderNumber}</span>
                            <span className="text-xs text-gray-400 flex items-center gap-1">
                              <Clock className="w-3 h-3" /> {ord.createdAt?.slice(0, 16).replace('T', ' ')}
                            </span>
                          </div>
                          <div className="flex flex-wrap items-center gap-3">
                            <div className="flex items-center gap-1.5">
                              <span className="text-xs text-gray-500">Status:</span>
                              <select
                                value={status}
                                onChange={(e) => handleUpdateOrderStatus(ord.id, e.target.value, ord.orderNumber)}
                                className={`text-xs font-bold rounded-lg p-1.5 border ${
                                  status === 'delivered' ? 'bg-green-100 text-green-800 border-green-300' :
                                  status === 'shipped' ? 'bg-blue-100 text-blue-800 border-blue-300' :
                                  status === 'confirmed' ? 'bg-amber-100 text-amber-800 border-amber-300' :
                                  status === 'cancelled' ? 'bg-red-100 text-red-800 border-red-300' :
                                  'bg-gray-100 text-gray-800 border-gray-300'
                                }`}
                              >
                                <option value="placed">Placed</option>
                                <option value="confirmed">Confirmed</option>
                                <option value="processing">Processing</option>
                                <option value="shipped">Shipped</option>
                                <option value="delivered">Delivered</option>
                                <option value="cancelled">Cancelled</option>
                              </select>
                            </div>
                            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
                              {ord.paymentMethod || 'COD'}
                            </span>
                            <span className="font-bold text-lg text-[#1A1A1A] dark:text-white">
                              ৳{totalAmt.toLocaleString()}
                            </span>
                          </div>
                        </div>

                        <div className="grid sm:grid-cols-2 gap-6 text-xs">
                          <div className="space-y-1.5">
                            <p className="font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider text-[10px]">Customer Information</p>
                            <p className="text-sm font-semibold text-[#1A1A1A] dark:text-white">{ord.customerName || 'Valued Customer'}</p>
                            <p className="text-gray-500 flex items-center gap-1.5">
                              <Phone className="w-3.5 h-3.5 text-[#076136]" /> {customerPhone || 'N/A'}
                            </p>
                            <p className="text-gray-500 flex items-start gap-1.5">
                              <MapPin className="w-3.5 h-3.5 text-[#FDA701] shrink-0 mt-0.5" /> {ord.customerAddress || 'Dhaka, Bangladesh'}
                            </p>
                          </div>

                          <div className="space-y-1.5">
                            <p className="font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider text-[10px]">Ordered Items</p>
                            {Array.isArray(ord.items) ? (
                              <div className="space-y-1">
                                {ord.items.map((it: any, idx: number) => (
                                  <div key={idx} className="flex justify-between items-center text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-[#222] p-1.5 rounded">
                                    <span>
                                      <strong>{it.quantity}x</strong> {it.name} {it.flavor ? `(${it.flavor})` : ''}
                                    </span>
                                    <span className="font-bold">৳{Math.round(it.price * it.quantity).toLocaleString()}</span>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <pre className="text-gray-500 font-sans whitespace-pre-wrap">{String(ord.items)}</pre>
                            )}
                          </div>
                        </div>

                        {/* bKash Payment / TrxID Verification Banner */}
                        {ord.trxId || ord.senderPhone ? (
                          <div className="mt-3 p-3 bg-pink-50 dark:bg-pink-950/20 border border-[#e2136e]/30 rounded-xl flex flex-wrap items-center justify-between gap-2">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="text-[11px] font-bold bg-[#e2136e] text-white px-2 py-0.5 rounded">bKash Payment</span>
                              {ord.trxId && (
                                <span className="text-xs font-mono font-bold text-gray-800 dark:text-gray-200 bg-white dark:bg-black px-2 py-0.5 rounded border border-gray-200 dark:border-gray-700">
                                  TrxID: {ord.trxId}
                                </span>
                              )}
                              {ord.senderPhone && (
                                <span className="text-xs text-gray-600 dark:text-gray-400">
                                  Sender: <strong className="text-gray-900 dark:text-white">{ord.senderPhone}</strong>
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-2">
                              <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                                ord.paymentStatus === 'verified'
                                  ? 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300'
                                  : 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300'
                              }`}>
                                {ord.paymentStatus === 'verified' ? '✓ Verified' : 'Pending Verification'}
                              </span>
                              {ord.paymentStatus !== 'verified' && (
                                <Button
                                  size="sm"
                                  onClick={() => handleVerifyPayment(ord.id, ord.orderNumber)}
                                  className="h-7 text-xs bg-[#076136] hover:bg-[#054d2b] text-white font-bold px-3"
                                >
                                  <Check className="w-3.5 h-3.5 mr-1" /> Mark Verified
                                </Button>
                              )}
                            </div>
                          </div>
                        ) : null}

                        <div className="mt-4 pt-3 border-t border-gray-100 dark:border-gray-800 flex justify-between items-center">
                          <div className="flex gap-2">
                            {waPhone ? (
                              <a
                                href={`https://wa.me/${waPhone}?text=${waMsg}`}
                                target="_blank"
                                rel="noreferrer"
                              >
                                <Button size="sm" className="bg-[#25D366] hover:bg-[#1ebd59] text-white text-xs gap-1.5">
                                  <MessageCircle className="w-3.5 h-3.5" /> WhatsApp Customer
                                </Button>
                              </a>
                            ) : null}
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteOrder(ord.id, ord.orderNumber)}
                            className="text-gray-400 hover:text-red-500 text-xs gap-1"
                          >
                            <Trash2 className="w-3.5 h-3.5" /> Delete Order
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: WAITLIST */}
          {activeTab === 'waitlist' && (
            <div className="bg-white dark:bg-[#1a1a1a] rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-gray-100 dark:border-gray-800">
                <h2 className="text-lg font-bold text-[#1A1A1A] dark:text-white">Customer Waitlist Inquiries ({waitlist.length})</h2>
                <p className="text-xs text-gray-400">Customers who registered for out-of-stock restock alerts</p>
              </div>

              {waitlist.length === 0 ? (
                <div className="text-center py-16 text-gray-500">
                  <Users className="w-12 h-12 mx-auto mb-3 opacity-30" />
                  <p>No customers currently on the waitlist.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-gray-50 dark:bg-[#141414] text-gray-500 uppercase text-[11px] tracking-wider border-b border-gray-100 dark:border-gray-800">
                      <tr>
                        <th className="p-4">Product Requested</th>
                        <th className="p-4">Customer Name</th>
                        <th className="p-4">WhatsApp Phone</th>
                        <th className="p-4">Date</th>
                        <th className="p-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                      {waitlist.map((item) => {
                        const waNumber = formatBdPhoneForWhatsApp(item.customerPhone);
                        const msg = `Assalamu Alaikum ${encodeURIComponent(item.customerName || 'Customer')}, good news! "${encodeURIComponent(item.productName)}" is back in stock at Mr. Mango! Order now at https://mrmango.com`;

                        return (
                          <tr key={item.id} className="hover:bg-gray-50/50 dark:hover:bg-[#222]/50">
                            <td className="p-4 font-bold text-[#1A1A1A] dark:text-white">{item.productName}</td>
                            <td className="p-4 text-gray-600 dark:text-gray-300">{item.customerName}</td>
                            <td className="p-4 font-mono font-medium text-[#076136] dark:text-green-400">
                              {item.customerPhone}
                            </td>
                            <td className="p-4 text-xs text-gray-400">{item.createdAt?.slice(0, 10)}</td>
                            <td className="p-4 text-right space-x-2">
                              {waNumber ? (
                                <a
                                  href={`https://wa.me/${waNumber}?text=${msg}`}
                                  target="_blank"
                                  rel="noreferrer"
                                >
                                  <Button size="sm" className="bg-[#25D366] hover:bg-[#1ebd59] text-white text-xs gap-1">
                                    <MessageCircle className="w-3.5 h-3.5" /> Notify via WhatsApp
                                  </Button>
                                </a>
                              ) : null}
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDeleteWaitlist(item.id)}
                                className="text-gray-400 hover:text-red-500"
                                title="Delete Inquiry"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* TAB 4: CONTACT INQUIRIES */}
          {activeTab === 'inquiries' && (
            <div className="bg-white dark:bg-[#1a1a1a] rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden p-6">
              <div className="mb-6">
                <h2 className="text-lg font-bold text-[#1A1A1A] dark:text-white">Contact Form Inquiries ({inquiries.length})</h2>
                <p className="text-xs text-gray-400">Messages sent via the website /contact form</p>
              </div>

              {inquiries.length === 0 ? (
                <div className="text-center py-16 text-gray-500">
                  <Mail className="w-12 h-12 mx-auto mb-3 opacity-30" />
                  <p>No contact messages received yet.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {inquiries.map((inq) => (
                    <div key={inq.id} className="border border-gray-100 dark:border-gray-800 rounded-xl p-5 hover:border-gray-300 dark:hover:border-gray-700 transition-colors">
                      <div className="flex justify-between items-start gap-4 mb-2">
                        <div>
                          <p className="font-bold text-base text-[#1A1A1A] dark:text-white">{inq.subject || 'General Inquiry'}</p>
                          <p className="text-xs text-gray-400">
                            From: <strong className="text-gray-700 dark:text-gray-300">{inq.name}</strong> ({inq.email}) • {inq.createdAt?.slice(0, 16).replace('T', ' ')}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <a href={`mailto:${inq.email}?subject=Re: ${encodeURIComponent(inq.subject || 'Mr. Mango Inquiry')}`}>
                            <Button size="sm" variant="outline" className="text-xs gap-1.5">
                              <Mail className="w-3.5 h-3.5" /> Reply Email
                            </Button>
                          </a>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteInquiry(inq.id)}
                            className="text-gray-400 hover:text-red-500"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                      <div className="bg-gray-50 dark:bg-[#222] p-3 rounded-lg text-sm text-gray-700 dark:text-gray-300 leading-relaxed mt-3">
                        {inq.message}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 5: NEWSLETTER SUBSCRIBERS */}
          {activeTab === 'subscribers' && (
            <div className="bg-white dark:bg-[#1a1a1a] rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden p-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <div>
                  <h2 className="text-lg font-bold text-[#1A1A1A] dark:text-white">Newsletter Subscribers ({subscribers.length})</h2>
                  <p className="text-xs text-gray-400">Customer emails subscribed for discounts and updates</p>
                </div>
                {subscribers.length > 0 && (
                  <Button onClick={handleCopyAllSubscribers} variant="outline" size="sm" className="gap-1.5 text-xs">
                    <Copy className="w-3.5 h-3.5" /> Copy All Emails
                  </Button>
                )}
              </div>

              {subscribers.length === 0 ? (
                <div className="text-center py-16 text-gray-500">
                  <Mail className="w-12 h-12 mx-auto mb-3 opacity-30" />
                  <p>No newsletter subscribers yet.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-gray-50 dark:bg-[#141414] text-gray-500 uppercase text-[11px] tracking-wider border-b border-gray-100 dark:border-gray-800">
                      <tr>
                        <th className="p-4">Email Address</th>
                        <th className="p-4">Subscribed Date</th>
                        <th className="p-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                      {subscribers.map((sub) => (
                        <tr key={sub.id} className="hover:bg-gray-50/50 dark:hover:bg-[#222]/50">
                          <td className="p-4 font-mono font-medium text-gray-800 dark:text-gray-200">{sub.email}</td>
                          <td className="p-4 text-xs text-gray-400">{sub.createdAt?.slice(0, 10)}</td>
                          <td className="p-4 text-right">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteSubscriber(sub.id)}
                              className="text-gray-400 hover:text-red-500"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

        </div>
      </div>

      {/* Product Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-[#1a1a1a] rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-gray-100 dark:border-gray-800 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-xl font-bold text-[#1A1A1A] dark:text-white">
                  {editingProduct ? `Edit "${editingProduct.name}"` : 'Add New Product'}
                </h2>
                <p className="text-xs text-gray-400">Changes update directly to the persistent store</p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-gray-500 dark:text-gray-400 block mb-1">Product Name *</label>
                  <Input
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Bar Juice 30ml"
                    className="bg-gray-50 dark:bg-[#222]"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-500 dark:text-gray-400 block mb-1">Brand</label>
                  <Input
                    value={formData.brand}
                    onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                    placeholder="e.g. Bar Juice, Elf Bar, Uwell"
                    className="bg-gray-50 dark:bg-[#222]"
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-bold text-gray-500 dark:text-gray-400 block mb-1">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full h-10 p-2 text-sm border rounded-md bg-white dark:bg-[#222] dark:border-gray-700 dark:text-white"
                  >
                    <option value="disposables">Disposables</option>
                    <option value="e-liquids">E-Liquids</option>
                    <option value="coils-tanks">Coils & Cartridges</option>
                    <option value="pod-kits">Pod Kits</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-500 dark:text-gray-400 block mb-1">Price (৳) *</label>
                  <Input
                    type="number"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    placeholder="1600"
                    className="bg-gray-50 dark:bg-[#222]"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-500 dark:text-gray-400 block mb-1">Compare Price (৳)</label>
                  <Input
                    type="number"
                    value={formData.compareAtPrice}
                    onChange={(e) => setFormData({ ...formData, compareAtPrice: e.target.value })}
                    placeholder="1800"
                    className="bg-gray-50 dark:bg-[#222]"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-500 dark:text-gray-400 block mb-1">
                  Flavors or Color Variants (Comma Separated)
                </label>
                <Input
                  value={formData.flavors}
                  onChange={(e) => setFormData({ ...formData, flavors: e.target.value })}
                  placeholder="Watermelon Ice, Cool Mint, Mango Freeze"
                  className="bg-gray-50 dark:bg-[#222]"
                />
              </div>

              <div className="grid sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-bold text-gray-500 dark:text-gray-400 block mb-1">Puff Count</label>
                  <Input
                    type="number"
                    value={formData.puffCount}
                    onChange={(e) => setFormData({ ...formData, puffCount: e.target.value })}
                    placeholder="13000"
                    className="bg-gray-50 dark:bg-[#222]"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-500 dark:text-gray-400 block mb-1">Nicotine Strength</label>
                  <Input
                    value={formData.nicotine}
                    onChange={(e) => setFormData({ ...formData, nicotine: e.target.value })}
                    placeholder="50mg or 3mg"
                    className="bg-gray-50 dark:bg-[#222]"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-500 dark:text-gray-400 block mb-1">Volume</label>
                  <Input
                    value={formData.volume}
                    onChange={(e) => setFormData({ ...formData, volume: e.target.value })}
                    placeholder="30ml or 2ml"
                    className="bg-gray-50 dark:bg-[#222]"
                  />
                </div>
              </div>

              {/* Image selector with Live Preview */}
              <div className="p-4 bg-gray-50 dark:bg-[#222] rounded-xl border border-gray-200 dark:border-gray-800 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-gray-700 dark:text-gray-300">Product Image</label>
                  <span className="text-[11px] text-gray-400">Select preset or paste URL</span>
                </div>
                <div className="flex gap-4 items-center">
                  <div className="w-16 h-16 rounded-lg bg-white dark:bg-[#1a1a1a] p-1 border border-gray-200 dark:border-gray-700 shrink-0 flex items-center justify-center overflow-hidden">
                    <img
                      src={formData.imageUrl || '/brand/icon.png'}
                      alt="Preview"
                      className="w-full h-full object-contain"
                      onError={(e) => { (e.target as HTMLImageElement).src = '/brand/icon.png'; }}
                    />
                  </div>
                  <div className="flex-1 space-y-2">
                    <Input
                      value={formData.imageUrl}
                      onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                      placeholder="/products/bar-juice-30ml.webp"
                      className="text-xs bg-white dark:bg-[#1a1a1a]"
                    />
                    <select
                      onChange={(e) => {
                        if (e.target.value) setFormData({ ...formData, imageUrl: e.target.value });
                      }}
                      className="w-full text-xs p-1.5 border rounded-lg bg-white dark:bg-[#1a1a1a] dark:border-gray-700 text-gray-700 dark:text-gray-300"
                    >
                      <option value="">-- Quick select from store image assets --</option>
                      {PRODUCT_IMAGE_PRESETS.map((item, idx) => (
                        <option key={idx} value={item.path}>{item.label}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-500 dark:text-gray-400 block mb-1">Description</label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full p-3 border rounded-lg text-sm bg-gray-50 dark:bg-[#222] dark:border-gray-700 dark:text-white"
                  placeholder="Product description and key specifications..."
                />
              </div>

              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-sm font-semibold text-gray-700 dark:text-gray-300">
                  <input
                    type="checkbox"
                    checked={formData.inStock}
                    onChange={(e) => setFormData({ ...formData, inStock: e.target.checked })}
                    className="w-4 h-4 rounded text-[#FDA701]"
                  />
                  In Stock (Available for Purchase)
                </label>
                <label className="flex items-center gap-2 cursor-pointer text-sm font-semibold text-gray-700 dark:text-gray-300">
                  <input
                    type="checkbox"
                    checked={formData.featured}
                    onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                    className="w-4 h-4 rounded text-[#FDA701]"
                  />
                  Featured on Homepage
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-6 border-t border-gray-100 dark:border-gray-800">
                <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isSavingProduct} className="bg-[#FDA701] hover:bg-[#e59600] text-black font-bold">
                  {isSavingProduct ? 'Saving...' : editingProduct ? 'Save Changes' : 'Create Product'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

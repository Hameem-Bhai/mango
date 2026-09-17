import { useState } from 'react';
import { SEO } from '@/components/SEO';
import { Button } from '@/components/ui/button';
import { MessageCircle, CheckCircle2 } from 'lucide-react';

export function Wholesale() {
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    businessName: '',
    contactPerson: '',
    phone: '',
    email: '',
    businessType: '',
    volume: '',
    message: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: `${formData.contactPerson} (${formData.businessName})`,
          email: formData.email,
          subject: `Wholesale Inquiry: ${formData.businessName} [${formData.volume} units/mo]`,
          message: `Business: ${formData.businessName}\nType: ${formData.businessType}\nMonthly Volume: ${formData.volume}\nWhatsApp: ${formData.phone}\n\nRequirements:\n${formData.message}`
        })
      });
      setSubmitted(true);
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 100);
    } catch (err) {
      console.error(err);
      setSubmitted(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <SEO title="Wholesale & Bulk Orders — Mr.Mango.com BD" description="Partner with Mr.Mango for premium vape products at wholesale prices in Bangladesh." />
      
      {/* Header */}
      <div className="bg-[#076136] text-white py-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '32px 32px' }}></div>
        <div className="container mx-auto px-4 relative z-10 text-center max-w-3xl">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Wholesale & Bulk Orders</h1>
          <p className="text-lg md:text-xl text-green-100">
            Stock your shelves with the best-selling disposables, premium e-liquids, and devices. Special pricing for businesses and bulk buyers across Bangladesh.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16 max-w-6xl">
        <div className="grid lg:grid-cols-5 gap-12">
          {/* Info Section */}
          <div className="lg:col-span-2 space-y-8">
            <div>
              <h2 className="text-2xl font-bold text-[#1A1A1A] dark:text-white mb-4">Why Partner With Us?</h2>
              <ul className="space-y-4 text-gray-600 dark:text-gray-300">
                <li className="flex gap-3">
                  <CheckCircle2 className="w-6 h-6 text-[#076136] shrink-0" />
                  <span><strong>100% Authentic Products:</strong> Direct from manufacturers.</span>
                </li>
                <li className="flex gap-3">
                  <CheckCircle2 className="w-6 h-6 text-[#076136] shrink-0" />
                  <span><strong>Fast Delivery:</strong> Express delivery across Bangladesh.</span>
                </li>
                <li className="flex gap-3">
                  <CheckCircle2 className="w-6 h-6 text-[#076136] shrink-0" />
                  <span><strong>Dedicated Support:</strong> Account manager for your orders.</span>
                </li>
              </ul>
            </div>

            <div className="bg-[#FAF5E7] dark:bg-[#1a1a1a] p-6 rounded-2xl border border-gray-200 dark:border-gray-800">
              <h3 className="text-xl font-bold text-[#1A1A1A] dark:text-white mb-4">Pricing Tiers</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center bg-white dark:bg-[#222] p-3 rounded-lg border border-gray-100 dark:border-gray-800 shadow-sm text-sm">
                  <span className="font-medium text-gray-800 dark:text-gray-200">10 - 50 Units</span>
                  <span className="text-[#076136] dark:text-green-400 font-bold">5% OFF</span>
                </div>
                <div className="flex justify-between items-center bg-white dark:bg-[#222] p-3 rounded-lg border border-gray-100 dark:border-gray-800 shadow-sm text-sm">
                  <span className="font-medium text-gray-800 dark:text-gray-200">50 - 100 Units</span>
                  <span className="text-[#076136] dark:text-green-400 font-bold">10% OFF</span>
                </div>
                <div className="flex justify-between items-center bg-white dark:bg-[#222] p-3 rounded-lg border border-gray-100 dark:border-gray-800 shadow-sm text-sm">
                  <span className="font-medium text-gray-800 dark:text-gray-200">100+ Units</span>
                  <span className="text-[#076136] dark:text-green-400 font-bold">15% OFF</span>
                </div>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-4 text-center">* Minimum order quantity is 10 units per SKU.</p>
            </div>

            <div className="bg-gray-50 dark:bg-[#1a1a1a] p-6 rounded-2xl border border-gray-200 dark:border-gray-800 text-center">
              <MessageCircle className="w-10 h-10 text-[#25D366] mx-auto mb-3" />
              <h3 className="font-bold text-[#1A1A1A] dark:text-white mb-2">Need Immediate Assistance?</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">Chat with our wholesale team directly on WhatsApp.</p>
              <a href="https://wa.me/8801700000000?text=Hi! I want to know about wholesale pricing." target="_blank" rel="noreferrer">
                <Button className="w-full bg-[#25D366] hover:bg-[#20b858] text-white font-bold">
                  WhatsApp Us
                </Button>
              </a>
            </div>
          </div>

          {/* Form Section */}
          <div className="lg:col-span-3">
            <div className="bg-white dark:bg-[#1a1a1a] rounded-3xl shadow-lg border border-gray-100 dark:border-gray-800 p-8 md:p-10">
              {submitted ? (
                <div className="text-center py-16">
                  <div className="w-20 h-20 bg-green-100 dark:bg-green-950/40 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle2 className="w-10 h-10 text-green-600 dark:text-green-400" />
                  </div>
                  <h2 className="text-3xl font-bold text-[#1A1A1A] dark:text-white mb-4">Application Received!</h2>
                  <p className="text-gray-600 dark:text-gray-300 mb-8 max-w-md mx-auto">
                    Thank you for your interest in partnering with Mr.Mango. Our wholesale team will review your application and contact you via WhatsApp within 24 hours.
                  </p>
                  <Button 
                    className="bg-[#076136] hover:bg-[#054d2b] text-white px-8"
                    onClick={() => {
                      setSubmitted(false);
                      setFormData({
                        businessName: '',
                        contactPerson: '',
                        phone: '',
                        email: '',
                        businessType: '',
                        volume: '',
                        message: ''
                      });
                    }}
                  >
                    Submit Another Inquiry
                  </Button>
                </div>
              ) : (
                <>
                  <h2 className="text-2xl font-bold text-[#1A1A1A] dark:text-white mb-2">Wholesale Application</h2>
                  <p className="text-gray-500 dark:text-gray-400 mb-8 text-sm">Fill out the form below and our team will get back to you with our product catalog and pricing sheet.</p>
                  
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Business Name *</label>
                        <input 
                          required 
                          type="text" 
                          value={formData.businessName}
                          onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                          className="w-full p-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#222] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#076136] transition-all text-sm" 
                          placeholder="e.g. Dhaka Vape Lounge" 
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Contact Person *</label>
                        <input 
                          required 
                          type="text" 
                          value={formData.contactPerson}
                          onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                          className="w-full p-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#222] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#076136] transition-all text-sm" 
                          placeholder="e.g. Tanvir Ahmed" 
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">WhatsApp Number *</label>
                        <input 
                          required 
                          type="tel" 
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          className="w-full p-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#222] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#076136] transition-all text-sm" 
                          placeholder="017XXXXXXXX" 
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Email Address *</label>
                        <input 
                          required 
                          type="email" 
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className="w-full p-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#222] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#076136] transition-all text-sm" 
                          placeholder="tanvir@example.com" 
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Business Type *</label>
                        <select 
                          required 
                          value={formData.businessType}
                          onChange={(e) => setFormData({ ...formData, businessType: e.target.value })}
                          className="w-full p-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#222] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#076136] transition-all text-sm"
                        >
                          <option value="">Select a type...</option>
                          <option value="Vape Shop">Vape Shop</option>
                          <option value="Convenience Store">Convenience Store</option>
                          <option value="Online Reseller">Online Reseller</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Estimated Monthly Volume *</label>
                        <select 
                          required 
                          value={formData.volume}
                          onChange={(e) => setFormData({ ...formData, volume: e.target.value })}
                          className="w-full p-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#222] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#076136] transition-all text-sm"
                        >
                          <option value="">Select volume...</option>
                          <option value="10-50">10 - 50 Units</option>
                          <option value="50-100">50 - 100 Units</option>
                          <option value="100+">100+ Units</option>
                        </select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Message / Specific Requirements</label>
                      <textarea 
                        rows={4} 
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        className="w-full p-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#222] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#076136] transition-all text-sm" 
                        placeholder="Any specific brands or products you are looking for?"
                      />
                    </div>

                    <Button 
                      type="submit" 
                      disabled={isSubmitting}
                      className="w-full h-14 text-lg font-bold bg-[#076136] hover:bg-[#054d2b] text-white rounded-xl"
                    >
                      {isSubmitting ? 'Submitting Application...' : 'Submit Application'}
                    </Button>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

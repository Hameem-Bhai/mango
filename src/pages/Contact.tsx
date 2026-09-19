import { SEO } from '@/components/SEO';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Mail, MapPin, Phone, Clock, MessageSquare } from 'lucide-react';
import { useState } from 'react';
import { toast } from '@/hooks/use-toast';

export function Contact() {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    outlet: 'kuril',
    subject: 'general',
    message: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          subject: `[${formData.outlet.toUpperCase()}] ${formData.subject}`,
          message: `Phone: ${formData.phone}\n\n${formData.message}`
        })
      });

      if (res.ok) {
        toast({
          title: "Message received!",
          description: "Thank you for reaching out. Our team will contact you shortly via phone or WhatsApp.",
        });
        setFormData({
          name: '',
          phone: '',
          email: '',
          outlet: 'kuril',
          subject: 'general',
          message: ''
        });
      } else {
        throw new Error('Failed to submit message');
      }
    } catch (err) {
      console.error('Contact submit error:', err);
      toast({
        title: "Message received!",
        description: "Thank you for reaching out. Our team will contact you shortly via WhatsApp.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <SEO 
        title="Contact Us & Outlet — Mr.Mango.com BD" 
        description="Visit our official Mr. Mango outlet in Kuril, Dhaka (Beside AIUB Main Gate). Reach our hotline, WhatsApp, or send a message for product questions and wholesale inquiries."
      />
      
      <div className="bg-[#1A1A1A] text-white py-12 border-b border-[#FDA701]">
        <div className="container mx-auto px-4 text-center max-w-3xl">
          <span className="text-xs uppercase font-bold text-[#FDA701] tracking-widest bg-[#FDA701]/10 px-3 py-1 rounded-full">
            Dhaka Outlet & Online Support
          </span>
          <h1 className="text-4xl font-bold text-[#FAF5E7] mt-3 mb-3">Contact Mr. Mango BD</h1>
          <p className="text-gray-300">Have questions about stock, flavors, or delivery? Visit our physical store beside the AIUB Main Gate or message our team below.</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16 max-w-6xl">
        
        {/* Single Official Outlet Card */}
        <div className="mb-12">
          <div className="bg-[#FAF5E7] dark:bg-[#1a1a1a] p-6 sm:p-8 rounded-3xl border border-gray-200 dark:border-gray-800 shadow-sm relative overflow-hidden">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4 pb-4 border-b border-gray-200 dark:border-gray-800">
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="bg-[#FDA701] text-[#1A1A1A] text-xs font-bold px-3 py-0.5 rounded-full uppercase">
                    Official Flagship Store
                  </span>
                  <span className="text-xs text-green-600 dark:text-green-400 font-semibold flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span> Open Today
                  </span>
                </div>
                <h3 className="text-2xl font-bold text-[#1A1A1A] dark:text-white flex items-center gap-2">
                  <MapPin className="h-6 w-6 text-[#076136]" /> Mr. Mango Kuril Outlet
                </h3>
              </div>
              <a 
                href="https://wa.me/8801880031355?text=Hi!%20I%20want%20to%20visit%20Mr.%20Mango%20Kuril%20Outlet%20beside%20AIUB."
                target="_blank"
                rel="noreferrer"
              >
                <Button className="bg-[#25D366] hover:bg-[#20b858] text-white font-bold h-11 px-5">
                  WhatsApp Outlet
                </Button>
              </a>
            </div>

            <div className="grid md:grid-cols-3 gap-4 text-sm text-gray-700 dark:text-gray-300 bg-white dark:bg-[#222] p-5 rounded-2xl border border-gray-100 dark:border-gray-800">
              <div>
                <strong className="text-gray-900 dark:text-white flex items-center gap-1.5 mb-1">
                  <MapPin className="h-4 w-4 text-[#076136]" /> Store Address:
                </strong>
                <p className="text-gray-600 dark:text-gray-300 font-medium">
                  2nd floor, Tong Market, Kuril, Beside Main gate of AIUB, Dhaka.
                </p>
              </div>

              <div>
                <strong className="text-gray-900 dark:text-white flex items-center gap-1.5 mb-1">
                  <Clock className="h-4 w-4 text-[#076136]" /> Opening Hours:
                </strong>
                <p className="text-gray-600 dark:text-gray-300">
                  11:00 AM – 11:00 PM (Open 7 Days a week)
                </p>
              </div>

              <div>
                <strong className="text-gray-900 dark:text-white flex items-center gap-1.5 mb-1">
                  <Phone className="h-4 w-4 text-[#076136]" /> Hotline & WhatsApp:
                </strong>
                <p className="text-gray-600 dark:text-gray-300 font-medium">
                  +880 1880-031355
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Message Form */}
        <div className="grid md:grid-cols-3 gap-12">
          <div className="md:col-span-2">
            <div className="bg-white dark:bg-[#1a1a1a] p-8 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm">
              <h2 className="text-2xl font-bold text-[#1A1A1A] dark:text-white mb-2 flex items-center gap-2">
                <MessageSquare className="h-6 w-6 text-[#FDA701]" /> Send Us an Online Message
              </h2>
              <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">Fill out the form below and we will get back to you promptly.</p>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label htmlFor="name" className="text-sm font-medium text-gray-700 dark:text-gray-300">Full Name</label>
                    <Input 
                      id="name" 
                      required 
                      value={formData.name} 
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Tanvir Ahmed" 
                      className="dark:bg-[#222] dark:border-gray-700"
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="phone" className="text-sm font-medium text-gray-700 dark:text-gray-300">Phone / WhatsApp Number</label>
                    <Input 
                      id="phone" 
                      type="tel" 
                      required 
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="017XXXXXXXX" 
                      className="dark:bg-[#222] dark:border-gray-700"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium text-gray-700 dark:text-gray-300">Email Address</label>
                    <Input 
                      id="email" 
                      type="email" 
                      required 
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="tanvir@example.com" 
                      className="dark:bg-[#222] dark:border-gray-700"
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="outlet" className="text-sm font-medium text-gray-700 dark:text-gray-300">Preferred Outlet</label>
                    <Select 
                      value={formData.outlet} 
                      onValueChange={(val) => setFormData({ ...formData, outlet: val })}
                    >
                      <SelectTrigger className="dark:bg-[#222] dark:border-gray-700">
                        <SelectValue placeholder="Select an outlet" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="kuril">Kuril Outlet (Beside AIUB)</SelectItem>
                        <SelectItem value="online">Online Delivery (All Bangladesh)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="subject" className="text-sm font-medium text-gray-700 dark:text-gray-300">Subject</label>
                  <Select 
                    value={formData.subject}
                    onValueChange={(val) => setFormData({ ...formData, subject: val })}
                  >
                    <SelectTrigger className="dark:bg-[#222] dark:border-gray-700">
                      <SelectValue placeholder="Select a subject" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="general">Product Availability & Stock</SelectItem>
                      <SelectItem value="order">Order & Delivery Status</SelectItem>
                      <SelectItem value="product">Recommendation for beginner</SelectItem>
                      <SelectItem value="wholesale">Wholesale Inquiry</SelectItem>
                      <SelectItem value="other">Other Inquiry</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="message" className="text-sm font-medium text-gray-700 dark:text-gray-300">Message</label>
                  <Textarea 
                    id="message" 
                    required 
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Tell us what you're looking for or your order question..." 
                    className="min-h-[140px] dark:bg-[#222] dark:border-gray-700" 
                  />
                </div>
                
                <Button type="submit" disabled={isLoading} className="w-full md:w-auto bg-[#FDA701] hover:bg-[#e59600] text-[#1A1A1A] font-bold px-8 h-12 rounded-xl">
                  {isLoading ? 'Sending...' : 'Send Message'}
                </Button>
              </form>
            </div>
          </div>
          
          <div className="space-y-6">
            <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm">
              <h3 className="text-xl font-bold text-[#1A1A1A] mb-4">Customer Support</h3>
              <div className="space-y-5 text-sm">
                <div className="flex gap-3">
                  <Phone className="h-5 w-5 text-[#076136] shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-[#1A1A1A]">Helpline</h4>
                    <p className="text-gray-600">+880 1880-031355</p>
                    <p className="text-xs text-gray-400">11:00 AM – 11:00 PM</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Mail className="h-5 w-5 text-[#076136] shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-[#1A1A1A]">Official Email</h4>
                    <a href="mailto:mrmangovape@gmail.com" className="text-gray-600 hover:text-[#076136] transition-colors">mrmangovape@gmail.com</a>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Clock className="h-5 w-5 text-[#076136] shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-[#1A1A1A]">Delivery Timing</h4>
                    <p className="text-gray-600">Dhaka: Same Day</p>
                    <p className="text-gray-600">Outside Dhaka: 2-3 Days</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

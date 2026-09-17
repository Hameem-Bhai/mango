import { SEO } from '@/components/SEO';

export function PrivacyPolicy() {
  return (
    <>
      <SEO title="Privacy Policy — Mr.Mango.com" />
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <h1 className="text-4xl font-bold text-[#1A1A1A] mb-8">Privacy Policy</h1>
        
        <div className="prose prose-lg text-gray-600">
          <p className="mb-6">Last Updated: {new Date().toLocaleDateString()}</p>
          
          <h2 className="text-2xl font-bold text-[#1A1A1A] mt-8 mb-4">1. Information Collection</h2>
          <p className="mb-4">We collect information that you provide directly to us, including when you create an account, make a purchase, or contact customer support. This may include your name, email address, shipping address, payment information, and date of birth for age verification purposes.</p>
          
          <h2 className="text-2xl font-bold text-[#1A1A1A] mt-8 mb-4">2. Age Verification</h2>
          <p className="mb-4">As a retailer of vaping products, we are legally required to verify the age of our customers. We use third-party age verification services that cross-reference the information you provide with public records. In some cases, you may be required to submit a photo ID.</p>
          
          <h2 className="text-2xl font-bold text-[#1A1A1A] mt-8 mb-4">3. Use of Information</h2>
          <p className="mb-4">We use the information we collect to process your orders, communicate with you, provide customer support, verify your age, and improve our services. We may also send you marketing communications if you have opted in to receive them.</p>
          
          <h2 className="text-2xl font-bold text-[#1A1A1A] mt-8 mb-4">4. Data Sharing</h2>
          <p className="mb-4">We do not sell your personal information. We may share your information with third-party service providers who assist us in operating our website, processing payments, verifying age, or fulfilling orders.</p>
          
          <h2 className="text-2xl font-bold text-[#1A1A1A] mt-8 mb-4">5. Cookies</h2>
          <p className="mb-4">Our website uses cookies to enhance your browsing experience, remember your preferences, and track the items in your shopping cart. You can configure your browser to reject cookies, but this may limit your ability to use certain features of our site.</p>
        </div>
      </div>
    </>
  );
}

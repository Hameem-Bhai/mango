import { SEO } from '@/components/SEO';

export function TermsOfService() {
  return (
    <>
      <SEO title="Terms of Service — Mr.Mango.com" />
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <h1 className="text-4xl font-bold text-[#1A1A1A] mb-8">Terms of Service</h1>
        
        <div className="prose prose-lg text-gray-600">
          <p className="mb-6">Last Updated: {new Date().toLocaleDateString()}</p>
          
          <h2 className="text-2xl font-bold text-[#1A1A1A] mt-8 mb-4">1. Acceptance of Terms</h2>
          <p className="mb-4">By accessing or using Mr.Mango.com, you agree to be bound by these Terms of Service. If you do not agree to all the terms and conditions, you must not access or use our website.</p>
          
          <h2 className="text-2xl font-bold text-[#1A1A1A] mt-8 mb-4">2. Age Requirement</h2>
          <p className="mb-4">You must be of legal vaping age in your jurisdiction (21+ in the United States) to purchase products from our site. Falsifying your age for the purpose of purchasing products is illegal and is strictly prohibited.</p>
          
          <h2 className="text-2xl font-bold text-[#1A1A1A] mt-8 mb-4">3. Products and Pricing</h2>
          <p className="mb-4">All prices are subject to change without notice. We reserve the right to modify or discontinue any product at any time. We make every effort to display as accurately as possible the colors and images of our products.</p>
          
          <h2 className="text-2xl font-bold text-[#1A1A1A] mt-8 mb-4">4. Orders and Payments</h2>
          <p className="mb-4">We reserve the right to refuse any order you place with us. We may, in our sole discretion, limit or cancel quantities purchased per person, per household, or per order. All payments are processed securely.</p>
          
          <h2 className="text-2xl font-bold text-[#1A1A1A] mt-8 mb-4">5. Limitation of Liability</h2>
          <p className="mb-4">Mr.Mango shall not be liable for any direct, indirect, incidental, special, or consequential damages resulting from the use or inability to use our products or website. Use our products at your own risk.</p>
        </div>
      </div>
    </>
  );
}

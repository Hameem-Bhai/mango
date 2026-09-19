import { SEO } from '@/components/SEO';

export function ShippingReturns() {
  return (
    <>
      <SEO title="Shipping & Returns — Mr.Mango.com" />
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <h1 className="text-4xl font-bold text-[#1A1A1A] mb-8">Shipping & Returns</h1>
        
        <div className="prose prose-lg text-gray-600">
          <h2 className="text-2xl font-bold text-[#1A1A1A] mt-8 mb-4">Shipping Policy</h2>
          
          <h3 className="text-xl font-bold text-[#1A1A1A] mt-6 mb-2">Processing Time</h3>
          <p className="mb-4">Orders placed before 2:00 PM EST Monday-Friday are processed and shipped the same day. Orders placed after 2:00 PM EST or on weekends will be processed the next business day.</p>
          
          <h3 className="text-xl font-bold text-[#1A1A1A] mt-6 mb-2">Adult Signature Requirement</h3>
          <p className="mb-4">In accordance with federal and state regulations, all shipments containing vaping products require an adult signature (21+) upon delivery. The delivery person will require a valid government-issued ID.</p>
          
          <h3 className="text-xl font-bold text-[#1A1A1A] mt-6 mb-2">Shipping Restrictions</h3>
          <p className="mb-4">Due to state laws, we cannot ship flavored e-liquids or certain devices to several states. If your address is in a restricted area, you will be notified at checkout.</p>
          
          <hr className="my-8 border-gray-200" />
          
          <h2 className="text-2xl font-bold text-[#1A1A1A] mt-8 mb-4">Returns Policy</h2>
          
          <h3 className="text-xl font-bold text-[#1A1A1A] mt-6 mb-2">30-Day Return Window</h3>
          <p className="mb-4">We accept returns on unopened, unused products in their original packaging within 30 days of delivery. For sanitary reasons, we cannot accept returns on e-liquids, opened devices, or used accessories unless there is a manufacturer defect.</p>
          
          <h3 className="text-xl font-bold text-[#1A1A1A] mt-6 mb-2">Defective Products</h3>
          <p className="mb-4">If you receive a defective product, please contact our support team within 48 hours of delivery. We may require photos or videos of the defect for verification. Defective items will be replaced or refunded.</p>
          
          <h3 className="text-xl font-bold text-[#1A1A1A] mt-6 mb-2">Return Process</h3>
          <p className="mb-4">To initiate a return, please contact mrmangovape@gmail.com or WhatsApp +880 1880-031355 with your order number and reason for return. Once approved, you will receive instructions and a return shipping label.</p>
        </div>
      </div>
    </>
  );
}

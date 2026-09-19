import { HelmetProvider } from 'react-helmet-async';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Switch, Route } from 'wouter';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import { CartProvider } from '@/hooks/useCart';
import { CompareProvider } from '@/hooks/useComparison';
import { AuthProvider } from '@/hooks/useAuth';
import { AuthModal } from '@/components/auth/AuthModal';
import { AgeVerificationModal } from '@/components/ui/AgeVerificationModal';
import { Layout } from '@/components/layout/Layout';

// Pages
import { Home } from '@/pages/Home';
import { Shop } from '@/pages/Shop';
import { ProductDetail } from '@/pages/ProductDetail';
import { Cart } from '@/pages/Cart';
import { OrderConfirmation } from '@/pages/OrderConfirmation';
import { About } from '@/pages/About';
import { FAQ } from '@/pages/FAQ';
import { Contact } from '@/pages/Contact';
import { TrackOrder } from '@/pages/TrackOrder';
import { Compare } from '@/pages/Compare';
import { Wholesale } from '@/pages/Wholesale';
import { PrivacyPolicy } from '@/pages/legal/PrivacyPolicy';
import { TermsOfService } from '@/pages/legal/TermsOfService';
import { ShippingReturns } from '@/pages/legal/ShippingReturns';

const queryClient = new QueryClient();

import { Blog } from '@/pages/Blog';
import { BlogPost } from '@/pages/BlogPost';
import { Admin } from '@/pages/Admin';

const NotFound = () => (
  <div className="container mx-auto px-4 py-32 text-center">
    <h1 className="text-4xl font-bold mb-4">404 - Page Not Found</h1>
    <p className="text-gray-500">The page you are looking for does not exist.</p>
  </div>
);

function App() {
  return (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <CompareProvider>
            <AuthProvider>
              <CartProvider>
                <Layout>
                  <Switch>
                    <Route path="/" component={Home} />
                    <Route path="/shop" component={Shop} />
                    <Route path="/shop/:category" component={Shop} />
                    <Route path="/product/:slug" component={ProductDetail} />
                    <Route path="/cart" component={Cart} />
                    <Route path="/order-confirmation" component={OrderConfirmation} />
                    <Route path="/about" component={About} />
                    <Route path="/blog" component={Blog} />
                    <Route path="/blog/:slug" component={BlogPost} />
                    <Route path="/faq" component={FAQ} />
                    <Route path="/contact" component={Contact} />
                    <Route path="/track-order" component={TrackOrder} />
                    <Route path="/compare" component={Compare} />
                    <Route path="/wholesale" component={Wholesale} />
                    <Route path="/admin" component={Admin} />
                    <Route path="/privacy-policy" component={PrivacyPolicy} />
                    <Route path="/terms-of-service" component={TermsOfService} />
                    <Route path="/shipping-returns" component={ShippingReturns} />
                    <Route component={NotFound} />
                  </Switch>
                </Layout>
                <AuthModal />
                <AgeVerificationModal />
                <Toaster />
              </CartProvider>
            </AuthProvider>
          </CompareProvider>
        </TooltipProvider>

      </QueryClientProvider>
    </HelmetProvider>
  );
}

export default App;

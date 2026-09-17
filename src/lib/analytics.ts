/**
 * Analytics Utility for Google Analytics 4 (GA4) and Meta Pixel (Facebook Pixel).
 * Ready for live Measurement ID & Pixel ID.
 */

declare global {
  interface Window {
    dataLayer?: any[];
    gtag?: (...args: any[]) => void;
    fbq?: (...args: any[]) => void;
    _fbq?: any;
  }
}

// Configurable IDs - Replace with client credentials when provided
export const GA_MEASUREMENT_ID = (import.meta as any).env?.VITE_GA_MEASUREMENT_ID || 'G-XXXXXXXXXX';
export const META_PIXEL_ID = (import.meta as any).env?.VITE_META_PIXEL_ID || '';

/**
 * Initializes Google Analytics and Meta Pixel scripts if configured
 */
export function initAnalytics() {
  if (typeof window === 'undefined') return;

  // Initialize GA4 if valid ID
  if (GA_MEASUREMENT_ID && GA_MEASUREMENT_ID !== 'G-XXXXXXXXXX' && !window.gtag) {
    const script = document.createElement('script');
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
    script.async = true;
    document.head.appendChild(script);

    window.dataLayer = window.dataLayer || [];
    window.gtag = function () {
      window.dataLayer?.push(arguments);
    };
    window.gtag('js', new Date());
    window.gtag('config', GA_MEASUREMENT_ID, {
      send_page_view: false
    });
  }

  // Initialize Meta Pixel if configured
  if (META_PIXEL_ID && !window.fbq) {
    /* eslint-disable */
    (function (f: any, b: any, e: any, v: any, n?: any, t?: any, s?: any) {
      if (f.fbq) return;
      n = f.fbq = function () {
        n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
      };
      if (!f._fbq) f._fbq = n;
      n.push = n;
      n.loaded = !0;
      n.version = '2.0';
      n.queue = [];
      t = b.createElement(e);
      t.async = !0;
      t.src = v;
      s = b.getElementsByTagName(e)[0];
      s.parentNode.insertBefore(t, s);
    })(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');
    window.fbq?.('init', META_PIXEL_ID);
    /* eslint-enable */
  }
}

/**
 * Tracks a page view event
 */
export function trackPageView(pagePath: string, pageTitle?: string) {
  if (typeof window === 'undefined') return;

  if (window.gtag) {
    window.gtag('event', 'page_view', {
      page_path: pagePath,
      page_title: pageTitle || document.title
    });
  }

  if (window.fbq) {
    window.fbq('track', 'PageView');
  }
}

/**
 * Tracks adding an item to the shopping cart
 */
export function trackAddToCart(product: { id: string | number; name: string; price: number }, quantity: number = 1, flavor?: string) {
  if (typeof window === 'undefined') return;

  if (window.gtag) {
    window.gtag('event', 'add_to_cart', {
      currency: 'BDT',
      value: product.price * quantity,
      items: [
        {
          item_id: String(product.id),
          item_name: product.name,
          item_variant: flavor,
          price: product.price,
          quantity
        }
      ]
    });
  }

  if (window.fbq) {
    window.fbq('track', 'AddToCart', {
      content_name: product.name,
      content_ids: [String(product.id)],
      content_type: 'product',
      value: product.price * quantity,
      currency: 'BDT'
    });
  }
}

/**
 * Tracks completed purchase or order placement
 */
export function trackPurchase(orderNumber: string, total: number, items: any[] = []) {
  if (typeof window === 'undefined') return;

  if (window.gtag) {
    window.gtag('event', 'purchase', {
      transaction_id: orderNumber,
      value: total,
      currency: 'BDT',
      items: items.map(item => ({
        item_id: String(item.id || item.productId),
        item_name: item.name,
        item_variant: item.flavor,
        price: item.price,
        quantity: item.quantity
      }))
    });
  }

  if (window.fbq) {
    window.fbq('track', 'Purchase', {
      value: total,
      currency: 'BDT',
      content_type: 'product'
    });
  }
}

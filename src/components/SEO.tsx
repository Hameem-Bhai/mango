import { Helmet } from 'react-helmet-async';

interface ProductSEO {
  name: string;
  price: number;
  description?: string;
  image?: string;
  sku?: string;
  inStock?: boolean;
  brand?: string;
}

interface SEOProps {
  title?: string;
  description?: string;
  canonical?: string;
  ogImage?: string;
  ogType?: string;
  product?: ProductSEO;
}

export function SEO({
  title = 'Mr. Mango BD — 100% Authentic Vape Shop',
  description = 'Bangladesh\'s trusted vape store. Disposables, pod kits, and premium e-liquids with official outlet beside AIUB Kuril, Dhaka.',
  canonical,
  ogImage = '/brand/icon-square.png',
  ogType = 'website',
  product,
}: SEOProps) {
  const schema = product ? {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": product.name,
    "description": product.description || description,
    "brand": { "@type": "Brand", "name": product.brand || "Mr. Mango" },
    ...(product.image ? { "image": product.image } : {}),
    ...(product.sku ? { "sku": product.sku } : {}),
    "offers": {
      "@type": "Offer",
      "priceCurrency": "BDT",
      "price": product.price.toString(),
      "availability": product.inStock !== false ? "https://schema.org/InStock" : "https://schema.org/OutOfStock"
    }
  } : null;

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      {canonical && <link rel="canonical" href={canonical} />}
      <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
      <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32.png" />
      <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16.png" />
      <link rel="shortcut icon" href="/favicon.ico" />
      <link rel="apple-touch-icon" href="/brand/icon-square.png" />
      <meta property="og:site_name" content="Mr. Mango BD" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:type" content={ogType} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:image" content={ogImage} />
      {schema && (
        <script type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      )}
    </Helmet>
  );
}

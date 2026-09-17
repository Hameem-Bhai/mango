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
  title = 'Mr.Mango.com — Your Vape Shop',
  description = 'Disposables, pod kits, e-liquids, and accessories from the brands you trust.',
  canonical,
  ogImage = '/brand/og-image.jpg',
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
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:type" content={ogType} />
      <meta name="twitter:card" content="summary_large_image" />
      {schema && (
        <script type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      )}
    </Helmet>
  );
}

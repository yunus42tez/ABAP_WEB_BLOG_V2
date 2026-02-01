import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title: string;
  description: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: string;
}

export function SEO({
  title,
  description,
  keywords,
  image,
  url = 'https://ytez-abap-blog.onrender.com',
  type = 'website'
}: SEOProps) {

  const siteTitle = "Yunus Tez | SAP ABAP Developer";
  const fullTitle = title === siteTitle ? title : `${title} | ${siteTitle}`;
  const defaultKeywords = "SAP, ABAP, SAP ABAP, Yunus Tez, Yunus Tez ABAP, CDS, BTP, Legacy ABAP, Modern ABAP, Fiori, UI5, OData, RAP, CAP";
  const allKeywords = keywords ? `${keywords}, ${defaultKeywords}` : defaultKeywords;

  // Use the provided image or fallback to the absolute URL of the dolphin icon
  const absoluteImageUrl = image
    ? (image.startsWith('http') ? image : `${url}${image}`)
    : 'https://ytez-abap-blog.onrender.com/assets/dolphin1.png';

  return (
    <Helmet>
      {/* Standard Metadata */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={allKeywords} />
      <meta name="author" content="Yunus Tez" />
      <link rel="canonical" href={url} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={absoluteImageUrl} />
      <meta property="og:site_name" content={siteTitle} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:creator" content="@yunus42tez" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={absoluteImageUrl} />
    </Helmet>
  );
}

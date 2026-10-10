export const SITE_URL = "https://redline-fintech.vercel.app";
export const SITE_DESCRIPTION = "Explore financial analytics, portfolio visualizations and market research with Redline. Market prices and performance are illustrative demo data, not live investment services.";
export const socialImage = { url: "/social/redline-og.png", width: 1200, height: 630, alt: "Redline — Financial Intelligence, In Focus. Illustrative market data." };
export function publicMetadata(title, description, path) {
  return { title, description, alternates: { canonical: path },
    openGraph: { type: "website", siteName: "Redline", title: `${title} | Redline`, description, url: path, images: [socialImage] },
    twitter: { card: "summary_large_image", title: `${title} | Redline`, description, images: [socialImage.url] },
  };
}
